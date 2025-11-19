import { create } from 'zustand';

export const useNoticesStore = create((set) => ({
  notices: [],
  noticesBySite: {},
  loading: false,
  error: null,

  // Set all notices
  setNotices: (notices) => set({ notices }),

  // Set notices for a specific site
  setSiteNotices: (siteName, notices) => set((state) => ({
    noticesBySite: {
      ...state.noticesBySite,
      [siteName]: notices
    }
  })),

  // Get notices for a specific site
  getSiteNotices: (siteName) => (state) => state.noticesBySite[siteName] || [],

  // Add notice
  addNotice: (notice) => set((state) => ({ notices: [...state.notices, notice] })),

  // Set loading state
  setLoading: (loading) => set({ loading }),

  // Set error
  setError: (error) => set({ error }),

  // Clear error
  clearError: () => set({ error: null }),

  // Clear notices
  clearNotices: () => set({ notices: [], noticesBySite: {} })
}));
