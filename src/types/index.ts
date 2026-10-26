export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface AdminUser {
  uid: string;
  email: string;
  role: 'admin' | 'owner';
  createdAt: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface MenuVariant {
  id: string;
  name: string; // e.g. 'Chicken', 'Lamb', 'Prawn', 'King Prawn', 'Vegetable'
  price: number | null; // null if price not supplied!
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  basePrice: number | null; // null if variants used or not supplied
  variants?: MenuVariant[];
  imageUrl?: string;
  isAvailable: boolean;
  isFeatured?: boolean;
  displayOrder: number;
  dietary?: {
    vegetarian?: boolean;
    spicyLevel?: 0 | 1 | 2 | 3;
    containsNuts?: boolean;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface OpeningPeriod {
  open: string; // "12:00"
  close: string; // "14:30"
  label: string; // "Lunch"
}

export interface SiteSettings {
  restaurantName: string;
  brandSubtitle: string;
  establishedYear: number;
  address: {
    street: string;
    village: string;
    county: string;
    postcode: string;
    country: string;
  };
  phoneNumbers: string[];
  contactEmail: string;
  whatsappNumber: string;
  websiteUrl: string;
  googleMapsUrl: string;
  openingHours: {
    lunch: string;
    evening: string;
    daysOpen: string;
    temporaryNotice?: string;
  };
  collectionDiscount: {
    enabled: boolean;
    percentage: number;
    title: string;
    description: string;
    applicableConditions?: string;
  };
  collectionOrderingEnabled: boolean;
  hero: {
    heading: string;
    subtitle: string;
    heroImageUrl: string;
  };
  aboutText: string;
  allergenNotice: string;
  sundaySpecial: {
    title: string;
    subtitle: string;
    price: number;
    description: string;
    supplements: string;
    isAvailable: boolean;
  };
  thaliMeals?: {
    meatThali: {
      name: string;
      price: number;
      description: string;
    };
    vegetableThali: {
      name: string;
      price: number;
      description: string;
    };
  };
  updatedAt?: string;
}

export interface Reservation {
  reservationId: string;
  customerUid: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  reservationDate: string; // YYYY-MM-DD
  reservationTime: string; // HH:mm
  numberOfGuests: number;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'cancelled' | 'completed';
  internalNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ReservationDate {
  date: string; // YYYY-MM-DD
  isFullyBooked: boolean;
  closureReason?: string;
  updatedAt?: string;
}

export interface ReservationSlot {
  slotKey: string; // YYYY-MM-DD_HH-mm
  date: string;
  time: string;
  isClosed: boolean;
  reason?: string;
  updatedAt?: string;
}

export interface OrderItemSnapshot {
  itemId: string;
  name: string;
  variantId?: string;
  variantName?: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface Order {
  orderId: string;
  customerUid: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItemSnapshot[];
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  total: number;
  collectionDate: string;
  collectionTime: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  notes?: string;
  internalNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Feedback {
  feedbackId: string;
  customerUid?: string;
  name: string;
  email: string;
  phone?: string;
  category: 'complaint' | 'suggestion' | 'food' | 'general' | 'other';
  message: string;
  status: 'unread' | 'read' | 'resolved';
  internalNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Review {
  reviewId: string;
  reviewerName: string;
  text: string;
  rating: number;
  date: string;
  isFeatured: boolean;
  isVisible: boolean;
  displayOrder: number;
  source?: string;
  imageUrl?: string;
  createdAt?: string;
}

export interface MediaItem {
  mediaId: string;
  name: string;
  url: string;
  storagePath?: string;
  altText: string;
  category?: string;
  usedIn?: string;
  createdAt: string;
}
