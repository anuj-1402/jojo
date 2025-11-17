import { create } from 'zustand';

export const useNoticesStore = create((set) => ({
  notices: [],
  noticesByySite: {},
  loading: false,
  error: null,

  // Set all notices
  setNotices: (notices) => set({ notices }),

  // Set notices for a specific site
  setSiteNotices: (siteId, notices) => set((state) => ({
    noticesByySite: {
      ...state.noticesByySite,
      [siteId]: notices
    }
  })),

  // Get notices for a specific site
  getSiteNotices: (siteId) => (state) => state.noticesByySite[siteId] || [],

  // Add notice
  addNotice: (notice) => set((state) => ({ notices: [...state.notices, notice] })),

  // Set loading state
  setLoading: (loading) => set({ loading }),

  // Set error
  setError: (error) => set({ error }),

  // Clear error
  clearError: () => set({ error: null }),

  // Clear notices
  clearNotices: () => set({ notices: [], noticesByySite: {} })
}));
