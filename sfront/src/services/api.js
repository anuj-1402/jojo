import { useAuthStore } from '../stores/authStore';

const API_BASE_URL =import.meta.env.VITE_API_BASE_URL ;


// Helper function to handle responses
const handleResponse = async (response, retry = false, originalRequest) => {
  // Access Zustand store directly (works outside React components)
  const isAuthenticated = useAuthStore.getState().isAuthenticated;

  if (response.status === 401 && !retry && isAuthenticated) {
    // Try to refresh token only if authenticated
    const refreshRes = await fetch(`${API_BASE_URL}/users/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (refreshRes.ok) {
      if (originalRequest) {
        const retryRes = await fetch(originalRequest.url, originalRequest.options);
        return handleResponse(retryRes, true);
      }
    } else {
      throw new Error("Session expired. Please login again.");
    }
  }
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'An error occurred');
  }
  return response.json();
};

// ============== USER API CALLS ==============

export const userAPI = {
  // Register user
  register: async (userData) => {
    const formData = new FormData();
    formData.append('name', userData.name);
    formData.append('email', userData.email);
    formData.append('password', userData.password);
    if (userData.profilePhoto) {
      formData.append('profilePhoto', userData.profilePhoto);
    }

    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });
    return handleResponse(response);
  },

  // Login user
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    });
    return handleResponse(response);
  },

  // Get current user profile
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'GET',
      credentials: 'include'
    });
    return handleResponse(response);
  },

  // Update user profile
  updateProfile: async (userData) => {
    const formData = new FormData();
    formData.append('name', userData.name);
    formData.append('email', userData.email);
    if (userData.profilePhoto) {
      formData.append('profilePhoto', userData.profilePhoto);
    }

    const response = await fetch(`${API_BASE_URL}/users/update-profile`, {
      method: 'PATCH',
      body: formData,
      credentials: 'include'
    });
    return handleResponse(response);
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    const response = await fetch(`${API_BASE_URL}/users/change-password`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ currentPassword, newPassword }),
      credentials: 'include'
    });
    return handleResponse(response);
  },

  // Logout user
  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/users/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    return handleResponse(response);
  },

  // Register admin
  registerAdmin: async (userData) => {
    const formData = new FormData();
    formData.append('name', userData.name);
    formData.append('email', userData.email);
    formData.append('password', userData.password);
    formData.append('profilePhoto', userData.profilePhoto);

    const response = await fetch(`${API_BASE_URL}/users/register-admin`, {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });
    return handleResponse(response);
  },

  // Get user count
  getUserCount: async () => {
    const res = await fetch(`${API_BASE_URL}/users/count`);
    return res.json();
  }
};

// ============== SITES API CALLS ==============

export const sitesAPI = {
  // Get all sites
  getAllSites: async () => {
    const response = await fetch(`${API_BASE_URL}/sites`, {
      method: 'GET',
      credentials: 'include'
    });
    return handleResponse(response);
  },

  // Get site details
  getSiteDetails: async (siteId) => {
    const response = await fetch(`${API_BASE_URL}/sites/${siteId}`, {
      method: 'GET',
      credentials: 'include'
    });
    return handleResponse(response);
  },

  // Add new site
  addSite: async (siteData) => {
    const response = await fetch(`${API_BASE_URL}/sites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(siteData),
      credentials: 'include'
    });
    return handleResponse(response);
  },

  // Get site by ID
  getSiteById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/sites/${id}`);
    return handleResponse(res);
  },

  // Get bookmarked sites
  getBookmarkedSites: async () => {
    const res = await fetch(`${API_BASE_URL}/users/bookmarks`, { credentials: "include" });
    return handleResponse(res);
  },

  // Bookmark/Unbookmark site
  toggleBookmark: async (siteId) => {
    const res = await fetch(`${API_BASE_URL}/sites/bookmark`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ siteId }),
    });
    return handleResponse(res);
  },

  // Toggle notification for bookmarked site
  toggleNotification: async (siteId) => {
    const res = await fetch(`${API_BASE_URL}/sites/notification`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ siteId }),
    });
    return handleResponse(res);
  },
};

// ============== NOTICES API CALLS ==============



// ============== JOBS/SCRAPING API CALLS ==============

export const noticesAPI = {
  // Get all jobs from database
  getAllNotices: async () => {
    const response = await fetch(`${API_BASE_URL}/notices/getnotices`, {
      method: 'GET',
      credentials: 'include'
    });
    return handleResponse(response);
  },

  // Get jobs by site name
  getNoticesBySite: async (siteName) => {
    const response = await fetch(`${API_BASE_URL}/notices/getnotices/${siteName}`);
    return handleResponse(response);
  },

  getBookmarkedNotices: async () => {
    const response = await fetch(`${API_BASE_URL}/users/bookmarked-notices`, {
      method: 'GET',
      credentials: 'include'
    });
    return handleResponse(response);
  },

  // Get notices by site ID
  getNoticesBySiteId: async (siteId) => {
    const res = await fetch(`${API_BASE_URL}/sites/${siteId}/notices`);
    return handleResponse(res);
  },
};

// For scraping, you should probably have a separate scrapeAPI object
export const scrapeAPI = {
  // Scrape ISRO jobs
  scrapeISRO: async () => {
    const response = await fetch(`${API_BASE_URL}/scrape/isro`, {
      method: 'POST',
      credentials: 'include'
    });
    return handleResponse(response);
  },

  // Scrape DRDO jobs  
  scrapeDRDO: async () => {
    const response = await fetch(`${API_BASE_URL}/scrape/drdo`, {
      method: 'POST',
      credentials: 'include'
    });
    return handleResponse(response);
  }
};

// ============== TEST API CALLS ==============

export const testAPI = {
  // Save notice (for testing)
  saveNotice: async (noticeData, siteId) => {
    const response = await fetch(`${API_BASE_URL}/test/save-notice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ noticeData, siteId }),
      credentials: 'include'
    });
    return handleResponse(response);
  }
};
