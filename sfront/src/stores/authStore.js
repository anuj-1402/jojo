import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  // Set user after successful login or profile fetch
  setUser: (user) => set({ user, isAuthenticated: !!user }),

  // Set loading state
  setLoading: (loading) => set({ loading }),

  // Set error
  setError: (error) => set({ error }),

  // Clear error
  clearError: () => set({ error: null }),

  // Logout
  logout: () => set({ user: null, isAuthenticated: false, error: null }),

  // Initialize from stored data
  initialize: (user) => {
    if (user) {
      set({ user, isAuthenticated: true, loading: false });
    } else {
      set({ user: null, isAuthenticated: false, loading: false });
    }
  }
}));
