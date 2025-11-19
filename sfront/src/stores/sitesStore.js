import { create } from 'zustand';

export const useSitesStore = create((set, get) => ({
  sites: [],
  selectedSite: null,
  loading: false,
  error: null,

  // Set all sites
  setSites: (sites) => set({ sites }),

  // Set selected site
  setSelectedSite: (site) => set({ selectedSite: site }),

  // Get site by ID
  getSiteById: (siteId) => {
    const { sites } = get();
    return sites.find(site => site._id === siteId);
  },

  // Get site by name
  getSiteByName: (siteName) => {
    const { sites } = get();
    return sites.find(site => 
      site.name.toLowerCase() === siteName.toLowerCase()
    );
  },

  // Add site
  addSite: (site) => set((state) => ({ 
    sites: [...state.sites, site] 
  })),

  // Update site
  updateSite: (siteId, updatedSite) => set((state) => ({
    sites: state.sites.map(site => 
      site._id === siteId ? { ...site, ...updatedSite } : site
    )
  })),

  // Delete site
  deleteSite: (siteId) => set((state) => ({
    sites: state.sites.filter(site => site._id !== siteId)
  })),

  // Set loading state
  setLoading: (loading) => set({ loading }),

  // Set error
  setError: (error) => set({ error }),

  // Clear error
  clearError: () => set({ error: null }),

  // Clear sites
  clearSites: () => set({ sites: [], selectedSite: null })
}));
