import { create } from 'zustand';
import { cartAPI, authAPI } from '../services/api';
import { supabase } from '../services/supabase';

// ─── Theme Store ────────────────────────────────────────────────────────────
const savedTheme = localStorage.getItem('ak_theme') || 'light';
if (savedTheme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
else document.documentElement.removeAttribute('data-theme');

export const useThemeStore = create((set) => ({
  theme: savedTheme,
  toggle: () => {
    set((s) => {
      const newTheme = s.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('ak_theme', newTheme);
      if (newTheme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
      else document.documentElement.removeAttribute('data-theme');
      return { theme: newTheme };
    });
  },
}));

// ─── Language Store ────────────────────────────────────────────────────────
export const useLangStore = create((set) => ({
  lang: localStorage.getItem('ak_lang') || 'fr',
  setLang: (lang) => {
    localStorage.setItem('ak_lang', lang);
    document.documentElement.lang = lang;
    set({ lang });
  },
}));

// ─── Auth Store ────────────────────────────────────────────────────────────
const savedUser = JSON.parse(localStorage.getItem('ak_user') || 'null');

export const useAuthStore = create((set, get) => ({
  user: savedUser,
  token: localStorage.getItem('ak_token') || null,
  isAuthenticated: !!savedUser,

  login: (user, token) => {
    localStorage.setItem('ak_token', token);
    localStorage.setItem('ak_user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },
  logout: async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('ak_token');
    localStorage.removeItem('ak_user');
    set({ user: null, token: null, isAuthenticated: false });
  },
  updateUser: (updates) => {
    const updated = { ...get().user, ...updates };
    localStorage.setItem('ak_user', JSON.stringify(updated));
    set({ user: updated });
  },
  isAdmin: () => get().user?.role === 'ADMIN',

  initAuth: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      try {
        const { data } = await authAPI.getMe();
        localStorage.setItem('ak_token', session.access_token);
        localStorage.setItem('ak_user', JSON.stringify(data.user));
        set({ user: data.user, token: session.access_token, isAuthenticated: true });
      } catch {
        localStorage.removeItem('ak_token');
        localStorage.removeItem('ak_user');
        set({ user: null, token: null, isAuthenticated: false });
      }
    }
  },
}));

// ─── Cart Store ────────────────────────────────────────────────────────────
export const useCartStore = create((set, get) => ({
  cartItems: [],
  cartCount: 0,
  total: 0,
  loading: false,

  fetchCart: async () => {
    try {
      set({ loading: true });
      const { data } = await cartAPI.get();
      set({ cartItems: data.cartItems, total: data.total, cartCount: data.count, loading: false });
    } catch (error) {
      console.error('Cart fetch error:', error);
      set({ loading: false });
    }
  },
  fetchCount: async () => {
    try { const { data } = await cartAPI.count(); set({ cartCount: data.count }); } catch {}
  },
  addItem: async (carId, paymentType = 'full') => {
    try {
      const { data } = await cartAPI.add({ carId, paymentType });
      set({ cartItems: data.cartItems, cartCount: data.count, total: data.total });
      return data;
    } catch (error) {
      console.error('Cart add error:', error);
      throw error;
    }
  },
  removeItem: async (carId) => {
    const { data } = await cartAPI.remove(carId);
    const newItems = get().cartItems.filter(i => i.carId !== carId);
    const newTotal = newItems.reduce((s, i) => s + i.car.price * i.quantity, 0);
    set({ cartItems: newItems, total: newTotal, cartCount: data.cartCount });
  },
  clear: () => set({ cartItems: [], total: 0, cartCount: 0 }),
}));

// ─── Toast Store ───────────────────────────────────────────────────────────
let toastId = 0;
export const useToastStore = create((set, get) => ({
  toasts: [],
  addToast: (message, type = 'success', duration = 3800) => {
    const id = ++toastId;
    set({ toasts: [...get().toasts, { id, message, type }] });
    setTimeout(() => set({ toasts: get().toasts.filter(t => t.id !== id) }), duration);
    return id;
  },
  removeToast: (id) => set({ toasts: get().toasts.filter(t => t.id !== id) }),
}));