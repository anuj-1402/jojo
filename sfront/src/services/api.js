const API_BASE_URL = 'http://localhost:5000/api/v1';

// Helper function to handle responses
const handleResponse = async (response) => {
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

  // Bookmark/Unbookmark site
  toggleBookmark: async (siteId) => {
    const response = await fetch(`${API_BASE_URL}/sites/bookmark`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ siteId }),
      credentials: 'include'
    });
    return handleResponse(response);
  },

  // Toggle notification for bookmarked site
  toggleNotification: async (siteId) => {
    const response = await fetch(`${API_BASE_URL}/sites/notification`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ siteId }),
      credentials: 'include'
    });
    return handleResponse(response);
  },

  // Get bookmarked sites
  getBookmarkedSites: async () => {
    const response = await fetch(`${API_BASE_URL}/users/bookmarks`, {
      method: 'GET',
      credentials: 'include'
    });
    return handleResponse(response);
  }
};

// ============== NOTICES API CALLS ==============

export const noticesAPI = {
  // Get notices for a specific site
  getSiteNotices: async (siteId) => {
    const response = await fetch(`${API_BASE_URL}/sites/${siteId}/notices`, {
      method: 'GET',
      credentials: 'include'
    });
    return handleResponse(response);
  },

  // Get notices from bookmarked sites
  getBookmarkedNotices: async () => {
    const response = await fetch(`${API_BASE_URL}/users/bookmarked-notices`, {
      method: 'GET',
      credentials: 'include'
    });
    return handleResponse(response);
  }
};

// ============== JOBS/SCRAPING API CALLS ==============

export const jobsAPI = {
  // Scrape ISRO jobs
  scrapeISRO: async () => {
    const response = await fetch(`${API_BASE_URL}/jobs/scrape`, {
      method: 'POST',
      credentials: 'include'
    });
    return handleResponse(response);
  },

  // Scrape DRDO jobs
  scrapeDRDO: async () => {
    const response = await fetch(`${API_BASE_URL}/jobs/drdo`, {
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
