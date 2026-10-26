import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, signInWithGoogle, logOut, testConnection } from '../lib/firebase';
import {
  SiteSettings,
  MenuCategory,
  MenuItem,
  MenuVariant,
  OrderItemSnapshot,
  ReservationDate,
  ReservationSlot,
  Review,
} from '../types';
import {
  subscribeSiteSettings,
  subscribeCategories,
  subscribeMenuItems,
  subscribeReservationDates,
  subscribeReservationSlots,
  subscribeReviews,
  seedInitialDatabaseIfEmpty,
  checkUserIsAdmin,
} from '../services/dbService';
import { INITIAL_SITE_SETTINGS, INITIAL_CATEGORIES, INITIAL_MENU_ITEMS, INITIAL_REVIEWS } from '../data/seedData';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  user: User | null;
  isAdmin: boolean;
  authLoading: boolean;
  siteSettings: SiteSettings;
  categories: MenuCategory[];
  menuItems: MenuItem[];
  reservationDates: Record<string, ReservationDate>;
  reservationSlots: Record<string, ReservationSlot>;
  reviews: Review[];
  cart: OrderItemSnapshot[];
  cartCount: number;
  cartSubtotal: number;
  cartDiscountPercent: number;
  cartDiscountAmount: number;
  cartTotal: number;
  addToCart: (item: MenuItem, variant?: MenuVariant, quantity?: number) => boolean;
  removeFromCart: (index: number) => void;
  updateCartQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  currentView: string;
  setCurrentView: (view: string) => void;
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [currentView, setCurrentView] = useState<string>('home');
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Real-time Firestore state
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(INITIAL_SITE_SETTINGS);
  const [categories, setCategories] = useState<MenuCategory[]>(INITIAL_CATEGORIES);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [reservationDates, setReservationDates] = useState<Record<string, ReservationDate>>({});
  const [reservationSlots, setReservationSlots] = useState<Record<string, ReservationSlot>>({});
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);

  // Shopping Cart state for collection takeaway
  const [cart, setCart] = useState<OrderItemSnapshot[]>(() => {
    try {
      const saved = sessionStorage.getItem('rashoi_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  // Check auth state & admin status
  useEffect(() => {
    testConnection();

    const unsubAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const adminCheck = await checkUserIsAdmin(currentUser);
        setIsAdmin(adminCheck);
        if (adminCheck) {
          seedInitialDatabaseIfEmpty();
        }
      } else {
        setIsAdmin(false);
      }
      setAuthLoading(false);
    });

    const unsubSettings = subscribeSiteSettings(setSiteSettings);
    const unsubCats = subscribeCategories(setCategories);
    const unsubItems = subscribeMenuItems(setMenuItems);
    const unsubDates = subscribeReservationDates(setReservationDates);
    const unsubSlots = subscribeReservationSlots(setReservationSlots);
    const unsubReviews = subscribeReviews(setReviews);

    return () => {
      unsubAuth();
      unsubSettings();
      unsubCats();
      unsubItems();
      unsubDates();
      unsubSlots();
      unsubReviews();
    };
  }, []);

  // Save cart to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem('rashoi_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  // Cart calculations
  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.lineTotal, 0);
  }, [cart]);

  const cartDiscountPercent = useMemo(() => {
    return siteSettings.collectionDiscount?.enabled ? siteSettings.collectionDiscount.percentage : 0;
  }, [siteSettings]);

  const cartDiscountAmount = useMemo(() => {
    if (cartDiscountPercent <= 0) return 0;
    return Number(((cartSubtotal * cartDiscountPercent) / 100).toFixed(2));
  }, [cartSubtotal, cartDiscountPercent]);

  const cartTotal = useMemo(() => {
    return Number(Math.max(0, cartSubtotal - cartDiscountAmount).toFixed(2));
  }, [cartSubtotal, cartDiscountAmount]);

  const addToCart = (item: MenuItem, variant?: MenuVariant, quantity: number = 1): boolean => {
    let unitPrice: number | null = null;
    let variantName: string | undefined = undefined;
    let variantId: string | undefined = undefined;

    if (variant) {
      if (variant.price === null || variant.price === undefined) {
        showToast('This item price is not yet confirmed. Please contact the restaurant.', 'error');
        return false;
      }
      unitPrice = variant.price;
      variantName = variant.name;
      variantId = variant.id;
    } else {
      if (item.basePrice === null || item.basePrice === undefined) {
        showToast('Please select a variation or contact the restaurant for pricing.', 'error');
        return false;
      }
      unitPrice = item.basePrice;
    }

    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (ci) => ci.itemId === item.id && ci.variantId === variantId
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        const newQty = updated[existingIdx].quantity + quantity;
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: newQty,
          lineTotal: Number((newQty * unitPrice!).toFixed(2)),
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            itemId: item.id,
            name: item.name,
            variantId,
            variantName,
            unitPrice: unitPrice!,
            quantity,
            lineTotal: Number((quantity * unitPrice!).toFixed(2)),
          },
        ];
      }
    });

    showToast(`Added ${item.name} to your collection basket.`, 'success');
    return true;
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, idx) => idx !== index));
    showToast('Item removed from basket.', 'info');
  };

  const updateCartQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }
    setCart((prev) => {
      const updated = [...prev];
      if (!updated[index]) return prev;
      updated[index] = {
        ...updated[index],
        quantity,
        lineTotal: Number((quantity * updated[index].unitPrice).toFixed(2)),
      };
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const loginWithGoogle = async () => {
    try {
      const loggedUser = await signInWithGoogle();
      if (loggedUser) {
        showToast(`Welcome, ${loggedUser.displayName || 'Guest'}!`, 'success');
      }
    } catch (err: unknown) {
      console.error(err);
      showToast('Could not sign in with Google. Please try again.', 'error');
    }
  };

  const logout = async () => {
    try {
      await logOut();
      showToast('You have been signed out.', 'info');
      if (currentView === 'admin' || currentView === 'my-account') {
        setCurrentView('home');
      }
    } catch (err) {
      console.error(err);
      showToast('Error signing out', 'error');
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAdmin,
        authLoading,
        siteSettings,
        categories,
        menuItems,
        reservationDates,
        reservationSlots,
        reviews,
        cart,
        cartCount,
        cartSubtotal,
        cartDiscountPercent,
        cartDiscountAmount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        currentView,
        setCurrentView,
        toasts,
        showToast,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
