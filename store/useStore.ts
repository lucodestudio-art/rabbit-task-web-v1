import { create } from 'zustand';
import { Property, User } from '../types';
import { MOCK_PROPERTIES } from '../constants';

interface AppState {
  user: User | null;
  token: string | null;
  savedPropertyIds: string[];
  properties: Property[];
  searchQuery: string;
  
  // Actions
  login: (user: User, token:string) => void;
  logout: () => void;
  setUser: (user: Partial<User>) => void;
  toggleSaveProperty: (id: string) => void;
  setSearchQuery: (query: string) => void;
  getSavedProperties: () => Property[];
}

// Initialize from localStorage so login persists across reloads
let _initialUser: User | null = null;
let _initialToken: string | null = null;
try {
  if (typeof window !== 'undefined') {
    const t = localStorage.getItem('auth_token');
    const u = localStorage.getItem('auth_user');
    if (t) _initialToken = t;
    if (u) _initialUser = JSON.parse(u);
  }
} catch (e) {
  _initialUser = null;
  _initialToken = null;
}

export const useStore = create<AppState>((set, get) => ({
  user: _initialUser,
  token: _initialToken,
  savedPropertyIds: _initialUser?.savedProperties || [],
  properties: MOCK_PROPERTIES,
  searchQuery: '',

  login: (user: User, token: string) => {
    try {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user));
    } catch (e) {}
    return set({
      user: user,
      token: token
    });
  },

  logout: () => {
    try {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    } catch (e) {}
    return set({ user: null, token: null });
  },

  setUser: (user: Partial<User>) => {
    try {
      const currentUser = get().user;
      if (currentUser) {
        const updatedUser = { ...currentUser, ...user };
        localStorage.setItem('auth_user', JSON.stringify(updatedUser));
        set({ user: updatedUser });
      }
    } catch (e) {
      console.error("Failed to set user in store:", e);
    }
  },

  toggleSaveProperty: (id: string) => set((state) => {
    const isSaved = state.savedPropertyIds.includes(id);
    return {
      savedPropertyIds: isSaved 
        ? state.savedPropertyIds.filter(pid => pid !== id)
        : [...state.savedPropertyIds, id]
    };
  }),

  setSearchQuery: (query: string) => set({ searchQuery: query }),

  getSavedProperties: () => {
    const state = get();
    return state.properties.filter(p => state.savedPropertyIds.includes(p.id));
  }
}));