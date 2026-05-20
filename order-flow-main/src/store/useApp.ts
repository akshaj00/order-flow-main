import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MenuItem, Restaurant } from "@/data/restaurants";

export type CartItem = MenuItem & { quantity: number };

export type Address = {
  label: string;
  full: string;
  coords: { lat: number; lng: number };
};

export type Customer = {
  name: string;
  phone: string;
  email: string;
};

export type OrderPayload = {
  orderId: string;
  customer: Customer;
  restaurant: {
    name: string;
    phone: string;
    pickupAddress: string;
    pickupCoordinates: { lat: number; lng: number };
  };
  deliveryLocation: {
    dropAddress: string;
    dropCoordinates: { lat: number; lng: number };
  };
  orderedItems: { name: string; quantity: number; price: number }[];
  totalAmount: number;
  paymentMethod: string;
  estimatedPreparationTime: string;
  specialInstructions: string;
  timestamp: string;
};

export type DeliveryPartner = {
  partnerId: string;
  name: string;
  phone: string;
  vehicle: string;
  vehicleNumber: string;
  rating: number;
  etaPickupMins: number;
  photo: string;
};

export type DispatchResponse = {
  status: "assigned";
  acceptedAt: string;
  partner: DeliveryPartner;
};

type AppState = {
  theme: "dark" | "light";
  toggleTheme: () => void;
  cart: CartItem[];
  cartRestaurantId: string | null;
  addToCart: (r: Restaurant, item: MenuItem) => void;
  removeFromCart: (id: string) => void;
  decrement: (id: string) => void;
  clearCart: () => void;
  customer: Customer;
  setCustomer: (c: Partial<Customer>) => void;
  address: Address;
  setAddress: (a: Address) => void;
  paymentMethod: string;
  setPaymentMethod: (p: string) => void;
  specialInstructions: string;
  setSpecialInstructions: (s: string) => void;
  lastOrder: OrderPayload | null;
  recentOrders: OrderPayload[];
  setLastOrder: (o: OrderPayload) => void;
  dispatch: DispatchResponse | null;
  setDispatch: (d: DispatchResponse | null) => void;
  devOpen: boolean;
  setDevOpen: (b: boolean) => void;
};

const defaultAddress: Address = {
  label: "Home",
  full: "BTM Layout, Bangalore",
  coords: { lat: 12.9166, lng: 77.6101 },
};

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      theme: "dark",
      toggleTheme: () => {
        const t = get().theme === "dark" ? "light" : "dark";
        set({ theme: t });
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("light", t === "light");
        }
      },
      cart: [],
      cartRestaurantId: null,
      addToCart: (r, item) => {
        const state = get();
        if (state.cartRestaurantId && state.cartRestaurantId !== r.id) {
          set({ cart: [{ ...item, quantity: 1 }], cartRestaurantId: r.id });
          return;
        }
        const existing = state.cart.find((c) => c.id === item.id);
        if (existing) {
          set({ cart: state.cart.map((c) => (c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c)) });
        } else {
          set({ cart: [...state.cart, { ...item, quantity: 1 }], cartRestaurantId: r.id });
        }
      },
      removeFromCart: (id) => {
        const cart = get().cart.filter((c) => c.id !== id);
        set({ cart, cartRestaurantId: cart.length ? get().cartRestaurantId : null });
      },
      decrement: (id) => {
        const cart = get()
          .cart.map((c) => (c.id === id ? { ...c, quantity: c.quantity - 1 } : c))
          .filter((c) => c.quantity > 0);
        set({ cart, cartRestaurantId: cart.length ? get().cartRestaurantId : null });
      },
      clearCart: () => set({ cart: [], cartRestaurantId: null }),
      customer: { name: "Akshaj", phone: "+91 98765 43210", email: "akshaj@email.com" },
      setCustomer: (c) => set({ customer: { ...get().customer, ...c } }),
      address: defaultAddress,
      setAddress: (a) => set({ address: a }),
      paymentMethod: "UPI",
      setPaymentMethod: (p) => set({ paymentMethod: p }),
      specialInstructions: "",
      setSpecialInstructions: (s) => set({ specialInstructions: s }),
      lastOrder: null,
      recentOrders: [],
      setLastOrder: (o) =>
        set({ lastOrder: o, recentOrders: [o, ...get().recentOrders].slice(0, 10) }),
      dispatch: null,
      setDispatch: (d) => set({ dispatch: d }),
      devOpen: false,
      setDevOpen: (b) => set({ devOpen: b }),
    }),
    {
      name: "swft-app",
      partialize: (s) => ({
        theme: s.theme,
        customer: s.customer,
        address: s.address,
        recentOrders: s.recentOrders,
      }),
    },
  ),
);
