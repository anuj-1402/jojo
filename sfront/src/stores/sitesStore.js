import { create } from 'zustand';

export const useSitesStore = create((set) => ({
  sites: [],
  loading: false,
  error: null,

  // Set all sites
  setSites: (sites) => set({ sites }),

  // Add site
  addSite: (site) => set((state) => ({ sites: [...state.sites, site] })),

  // Set loading state
  setLoading: (loading) => set({ loading }),

  // Set error
  setError: (error) => set({ error }),

  // Clear error
  clearError: () => set({ error: null }),

  // Clear sites
  clearSites: () => set({ sites: [] })
}));
