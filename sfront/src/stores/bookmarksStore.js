import { create } from 'zustand';

export const useBookmarksStore = create((set) => ({
  bookmarkedSites: [],
  bookmarkedNotices: [],
  loading: false,
  error: null,

  // Set bookmarked sites
  setBookmarkedSites: (sites) => set({ bookmarkedSites: sites }),

  // Set bookmarked notices
  setBookmarkedNotices: (notices) => set({ bookmarkedNotices: notices }),

  // Toggle site bookmark
  toggleSiteBookmark: (site) => set((state) => {
    const isBookmarked = state.bookmarkedSites.some((s) => s.siteId._id === site.siteId._id);
    if (isBookmarked) {
      return {
        bookmarkedSites: state.bookmarkedSites.filter((s) => s.siteId._id !== site.siteId._id)
      };
    } else {
      return {
        bookmarkedSites: [...state.bookmarkedSites, site]
      };
    }
  }),

  // Add bookmarked site
  addBookmarkedSite: (site) => set((state) => ({
    bookmarkedSites: [...state.bookmarkedSites, site]
  })),

  // Remove bookmarked site
  removeBookmarkedSite: (siteId) => set((state) => ({
    bookmarkedSites: state.bookmarkedSites.filter((s) => s.siteId._id !== siteId)
  })),

  // Check if site is bookmarked
  isSiteBookmarked: (siteId) => (state) => {
    return state.bookmarkedSites.some((s) => s.siteId._id === siteId);
  },

  // Set loading state
  setLoading: (loading) => set({ loading }),

  // Set error
  setError: (error) => set({ error }),

  // Clear error
  clearError: () => set({ error: null }),

  // Clear all bookmarks
  clearBookmarks: () => set({ bookmarkedSites: [], bookmarkedNotices: [] })
}));
