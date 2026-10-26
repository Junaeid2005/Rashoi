import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType, PRIMARY_ADMIN_EMAILS } from '../lib/firebase';
import {
  SiteSettings,
  MenuCategory,
  MenuItem,
  Reservation,
  ReservationDate,
  ReservationSlot,
  Order,
  Feedback,
  Review,
  MediaItem,
} from '../types';
import {
  INITIAL_SITE_SETTINGS,
  INITIAL_CATEGORIES,
  INITIAL_MENU_ITEMS,
  INITIAL_REVIEWS,
} from '../data/seedData';
import { User } from 'firebase/auth';

/**
 * Check whether a user is an administrator
 */
export async function checkUserIsAdmin(user: User | null): Promise<boolean> {
  if (!user || !user.email) return false;
  
  // Check if primary admin email
  if (PRIMARY_ADMIN_EMAILS.includes(user.email.toLowerCase())) {
    return true;
  }

  try {
    const adminDoc = await getDoc(doc(db, 'admins', user.uid));
    return adminDoc.exists();
  } catch {
    return false;
  }
}

/**
 * Idempotently seed database on first run if user is an authorized admin
 */
export async function seedInitialDatabaseIfEmpty(): Promise<boolean> {
  const current = auth.currentUser;
  if (!current) {
    // Unauthenticated visitors must not write to Firestore; they read existing data or use fallback
    return false;
  }

  const isAdmin = await checkUserIsAdmin(current);
  if (!isAdmin) {
    return false;
  }

  try {
    const settingsDoc = await getDoc(doc(db, 'siteSettings', 'main'));
    if (!settingsDoc.exists()) {
      // Seed site settings
      await setDoc(doc(db, 'siteSettings', 'main'), {
        ...INITIAL_SITE_SETTINGS,
        updatedAt: new Date().toISOString(),
      });
    }

    const categoriesSnap = await getDocs(collection(db, 'menuCategories'));
    if (categoriesSnap.empty) {
      console.log('Admin detected: Seeding initial categories and menu items...');
      const batch = writeBatch(db);

      for (const cat of INITIAL_CATEGORIES) {
        const catRef = doc(db, 'menuCategories', cat.id);
        batch.set(catRef, {
          ...cat,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      for (const item of INITIAL_MENU_ITEMS) {
        const itemRef = doc(db, 'menuItems', item.id);
        batch.set(itemRef, {
          ...item,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      for (const rev of INITIAL_REVIEWS) {
        const revRef = doc(db, 'reviews', rev.reviewId);
        batch.set(revRef, {
          ...rev,
          createdAt: new Date().toISOString(),
        });
      }

      await batch.commit();
      console.log('Database seeded successfully by administrator.');
      return true;
    }

    return false;
  } catch (error) {
    console.warn('Initial seeding bypassed or failed:', error);
    return false;
  }
}

/**
 * SITE SETTINGS
 */
export function subscribeSiteSettings(callback: (settings: SiteSettings) => void) {
  const path = 'siteSettings/main';
  return onSnapshot(
    doc(db, 'siteSettings', 'main'),
    (snap) => {
      if (snap.exists()) {
        callback(snap.data() as SiteSettings);
      } else {
        callback(INITIAL_SITE_SETTINGS);
      }
    },
    (err) => {
      console.warn('Using local site settings fallback due to Firestore error:', err);
      callback(INITIAL_SITE_SETTINGS);
    }
  );
}

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<void> {
  try {
    await setDoc(
      doc(db, 'siteSettings', 'main'),
      {
        ...settings,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, 'siteSettings/main');
  }
}

/**
 * MENU CATEGORIES
 */
export function subscribeCategories(callback: (categories: MenuCategory[]) => void) {
  const q = query(collection(db, 'menuCategories'), orderBy('displayOrder', 'asc'));
  return onSnapshot(
    q,
    (snap) => {
      if (snap.empty) {
        callback(INITIAL_CATEGORIES);
      } else {
        const cats = snap.docs.map((d) => ({ ...d.data(), id: d.id } as MenuCategory));
        callback(cats);
      }
    },
    (err) => {
      console.warn('Using fallback categories due to error:', err);
      callback(INITIAL_CATEGORIES);
    }
  );
}

export async function saveCategory(category: MenuCategory): Promise<void> {
  try {
    await setDoc(
      doc(db, 'menuCategories', category.id),
      {
        ...category,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `menuCategories/${category.id}`);
  }
}

export async function deleteCategory(categoryId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'menuCategories', categoryId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `menuCategories/${categoryId}`);
  }
}

/**
 * MENU ITEMS
 */
export function subscribeMenuItems(callback: (items: MenuItem[]) => void) {
  const q = query(collection(db, 'menuItems'), orderBy('displayOrder', 'asc'));
  return onSnapshot(
    q,
    (snap) => {
      if (snap.empty) {
        callback(INITIAL_MENU_ITEMS);
      } else {
        const items = snap.docs.map((d) => ({ ...d.data(), id: d.id } as MenuItem));
        callback(items);
      }
    },
    (err) => {
      console.warn('Using fallback menu items due to error:', err);
      callback(INITIAL_MENU_ITEMS);
    }
  );
}

export async function saveMenuItem(item: MenuItem): Promise<void> {
  try {
    await setDoc(
      doc(db, 'menuItems', item.id),
      {
        ...item,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `menuItems/${item.id}`);
  }
}

export async function deleteMenuItem(itemId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'menuItems', itemId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `menuItems/${itemId}`);
  }
}

/**
 * AVAILABILITY & FULLY BOOKED CONTROLS
 */
export function subscribeReservationDates(callback: (dates: Record<string, ReservationDate>) => void) {
  return onSnapshot(
    collection(db, 'reservationDates'),
    (snap) => {
      const dates: Record<string, ReservationDate> = {};
      snap.docs.forEach((d) => {
        dates[d.id] = d.data() as ReservationDate;
      });
      callback(dates);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, 'reservationDates');
    }
  );
}

export async function setDateFullyBooked(date: string, isFullyBooked: boolean, closureReason?: string): Promise<void> {
  try {
    await setDoc(
      doc(db, 'reservationDates', date),
      {
        date,
        isFullyBooked,
        closureReason: closureReason || '',
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `reservationDates/${date}`);
  }
}

export function subscribeReservationSlots(callback: (slots: Record<string, ReservationSlot>) => void) {
  return onSnapshot(
    collection(db, 'reservationSlots'),
    (snap) => {
      const slots: Record<string, ReservationSlot> = {};
      snap.docs.forEach((d) => {
        slots[d.id] = d.data() as ReservationSlot;
      });
      callback(slots);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, 'reservationSlots');
    }
  );
}

export async function setSlotClosed(slotKey: string, date: string, time: string, isClosed: boolean, reason?: string): Promise<void> {
  try {
    await setDoc(
      doc(db, 'reservationSlots', slotKey),
      {
        slotKey,
        date,
        time,
        isClosed,
        reason: reason || '',
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `reservationSlots/${slotKey}`);
  }
}

/**
 * RESERVATIONS
 */
export async function createReservation(resData: Omit<Reservation, 'reservationId' | 'status' | 'createdAt'>): Promise<string> {
  // Check backend date availability
  const dateDoc = await getDoc(doc(db, 'reservationDates', resData.reservationDate));
  if (dateDoc.exists() && dateDoc.data()?.isFullyBooked) {
    throw new Error('This date is fully booked. Please choose another available date.');
  }

  // Check backend slot availability
  const slotKey = `${resData.reservationDate}_${resData.reservationTime.replace(':', '-')}`;
  const slotDoc = await getDoc(doc(db, 'reservationSlots', slotKey));
  if (slotDoc.exists() && slotDoc.data()?.isClosed) {
    throw new Error('This specific time slot is closed for bookings. Please choose another time.');
  }

  const reservationId = 'res_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
  const newReservation: Reservation = {
    ...resData,
    reservationId,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, 'reservations', reservationId), newReservation);
    return reservationId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `reservations/${reservationId}`);
  }
}

export function subscribeCustomerReservations(customerUid: string, callback: (res: Reservation[]) => void) {
  const q = query(
    collection(db, 'reservations'),
    where('customerUid', '==', customerUid)
  );
  return onSnapshot(
    q,
    (snap) => {
      const list = snap.docs.map((d) => d.data() as Reservation);
      list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
      callback(list);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, 'reservations');
    }
  );
}

export function subscribeAllReservations(callback: (res: Reservation[]) => void) {
  const q = query(collection(db, 'reservations'));
  return onSnapshot(
    q,
    (snap) => {
      const list = snap.docs.map((d) => d.data() as Reservation);
      list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
      callback(list);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, 'reservations');
    }
  );
}

export async function updateReservationStatus(
  reservationId: string,
  status: Reservation['status'],
  internalNotes?: string,
  assignedTable?: string
): Promise<void> {
  try {
    const updatePayload: Record<string, unknown> = {
      status,
      updatedAt: new Date().toISOString(),
    };
    if (internalNotes !== undefined) {
      updatePayload.internalNotes = internalNotes;
    }
    if (assignedTable !== undefined) {
      updatePayload.assignedTable = assignedTable;
    }
    await updateDoc(doc(db, 'reservations', reservationId), updatePayload);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `reservations/${reservationId}`);
  }
}

/**
 * ORDERS
 */
export async function createOrder(orderData: Omit<Order, 'orderId' | 'status' | 'createdAt'>): Promise<string> {
  const orderId = 'RSH-' + Math.floor(100000 + Math.random() * 900000);
  const newOrder: Order = {
    ...orderData,
    orderId,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, 'orders', orderId), newOrder);
    return orderId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `orders/${orderId}`);
  }
}

export function subscribeCustomerOrders(customerUid: string, callback: (orders: Order[]) => void) {
  const q = query(collection(db, 'orders'), where('customerUid', '==', customerUid));
  return onSnapshot(
    q,
    (snap) => {
      const list = snap.docs.map((d) => d.data() as Order);
      list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
      callback(list);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, 'orders');
    }
  );
}

export function subscribeAllOrders(callback: (orders: Order[]) => void) {
  const q = query(collection(db, 'orders'));
  return onSnapshot(
    q,
    (snap) => {
      const list = snap.docs.map((d) => d.data() as Order);
      list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
      callback(list);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, 'orders');
    }
  );
}

export async function updateOrderStatus(orderId: string, status: Order['status'], internalNotes?: string): Promise<void> {
  try {
    const updatePayload: Record<string, unknown> = {
      status,
      updatedAt: new Date().toISOString(),
    };
    if (internalNotes !== undefined) {
      updatePayload.internalNotes = internalNotes;
    }
    await updateDoc(doc(db, 'orders', orderId), updatePayload);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
  }
}

/**
 * FEEDBACK
 */
export async function submitFeedback(feedbackData: Omit<Feedback, 'feedbackId' | 'status' | 'createdAt'>): Promise<string> {
  const feedbackId = 'fb_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
  const newFeedback: Feedback = {
    ...feedbackData,
    feedbackId,
    status: 'unread',
    createdAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, 'feedback', feedbackId), newFeedback);
    return feedbackId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `feedback/${feedbackId}`);
  }
}

export function subscribeFeedback(callback: (feedbackList: Feedback[]) => void) {
  const q = query(collection(db, 'feedback'));
  return onSnapshot(
    q,
    (snap) => {
      const list = snap.docs.map((d) => d.data() as Feedback);
      list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
      callback(list);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, 'feedback');
    }
  );
}

export async function updateFeedbackStatus(feedbackId: string, status: Feedback['status'], internalNotes?: string): Promise<void> {
  try {
    const updatePayload: Record<string, unknown> = {
      status,
      updatedAt: new Date().toISOString(),
    };
    if (internalNotes !== undefined) {
      updatePayload.internalNotes = internalNotes;
    }
    await updateDoc(doc(db, 'feedback', feedbackId), updatePayload);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `feedback/${feedbackId}`);
  }
}

export async function deleteFeedback(feedbackId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'feedback', feedbackId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `feedback/${feedbackId}`);
  }
}

/**
 * REVIEWS
 */
export function subscribeReviews(callback: (reviews: Review[]) => void) {
  const q = query(collection(db, 'reviews'), orderBy('displayOrder', 'asc'));
  return onSnapshot(
    q,
    (snap) => {
      if (snap.empty) {
        callback(INITIAL_REVIEWS);
      } else {
        callback(snap.docs.map((d) => d.data() as Review));
      }
    },
    (err) => {
      console.warn('Reviews fallback due to error:', err);
      callback(INITIAL_REVIEWS);
    }
  );
}

export async function saveReview(review: Review): Promise<void> {
  try {
    await setDoc(doc(db, 'reviews', review.reviewId), review, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `reviews/${review.reviewId}`);
  }
}

export async function deleteReview(reviewId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'reviews', reviewId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `reviews/${reviewId}`);
  }
}

/**
 * MEDIA LIBRARY
 */
export function subscribeMedia(callback: (media: MediaItem[]) => void) {
  return onSnapshot(
    collection(db, 'media'),
    (snap) => {
      callback(snap.docs.map((d) => d.data() as MediaItem));
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, 'media');
    }
  );
}

export async function saveMediaItem(media: MediaItem): Promise<void> {
  try {
    await setDoc(doc(db, 'media', media.mediaId), media, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `media/${media.mediaId}`);
  }
}

export async function deleteMediaItem(mediaId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'media', mediaId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `media/${mediaId}`);
  }
}
