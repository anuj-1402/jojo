# API Integration Documentation

## Base Configuration

```javascript
// src/services/api.js
const API_BASE_URL = 'http://localhost:5000/api/v1'
```

All requests include `credentials: 'include'` for cookie-based authentication.

---

## User API (`userAPI`)

### 1. Register User
```javascript
const response = await userAPI.register({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
  profilePhoto: File // optional
})

// Response on success (201):
{
  statusCode: 201,
  success: true,
  data: {
    _id: '...',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
    profilePhotoUrl: 'https://...',
    bookmarkedSites: []
  },
  message: 'User registered successfully'
}
```

### 2. Login User
```javascript
const response = await userAPI.login(email, password)

// Response on success (200):
{
  statusCode: 200,
  success: true,
  data: {
    user: {
      _id: '...',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user'
    },
    accessToken: 'eyJhbGc...',
    refreshToken: 'eyJhbGc...'
  },
  message: 'User logged in successfully'
}

// Note: Tokens are set as secure httpOnly cookies
```

### 3. Get User Profile (Protected)
```javascript
const response = await userAPI.getProfile()

// Response (200):
{
  statusCode: 200,
  success: true,
  data: {
    _id: '...',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
    profilePhotoUrl: 'https://...',
    bookmarkedSites: [
      {
        _id: '...',
        siteId: {
          _id: '...',
          name: 'ISRO',
          baseUrl: 'https://...',
          logoUrl: 'https://...'
        },
        notificationsEnabled: true,
        createdAt: '2024-11-10T...',
        updatedAt: '2024-11-10T...'
      }
    ],
    createdAt: '2024-11-01T...',
    updatedAt: '2024-11-10T...'
  },
  message: 'User profile fetched successfully'
}
```

### 4. Update User Profile (Protected)
```javascript
const response = await userAPI.updateProfile({
  name: 'Jane Doe',
  email: 'jane@example.com',
  profilePhoto: File // optional
})

// Response (200):
{
  statusCode: 200,
  success: true,
  data: { _id: '...', name: 'Jane Doe', email: 'jane@example.com', ... },
  message: 'Profile updated successfully'
}
```

### 5. Change Password (Protected)
```javascript
const response = await userAPI.changePassword(currentPassword, newPassword)

// Response (200):
{
  statusCode: 200,
  success: true,
  data: {},
  message: 'Password changed successfully'
}
```

### 6. Logout (Protected)
```javascript
const response = await userAPI.logout()

// Response (200):
{
  statusCode: 200,
  success: true,
  data: {},
  message: 'User logged out successfully'
}

// Note: Clears cookies on client and server
```

### 7. Register Admin (Admin Only)
```javascript
const response = await userAPI.registerAdmin({
  name: 'Admin User',
  email: 'admin@example.com',
  password: 'adminpass',
  profilePhoto: File // required
})

// Response (201):
{
  statusCode: 201,
  success: true,
  data: { _id: '...', name: 'Admin User', role: 'admin', ... },
  message: 'Admin registered successfully'
}
```

---

## Sites API (`sitesAPI`)

### 1. Get All Sites
```javascript
const response = await sitesAPI.getAllSites()

// Response (200):
{
  statusCode: 200,
  success: true,
  data: [
    {
      _id: '68e10bcf0c9d409f3f5dd7c1',
      name: 'ISRO - Indian Space Research Organisation',
      baseUrl: 'https://www.isro.gov.in',
      careersUrl: 'https://www.isro.gov.in/ViewAllOpportunities.html',
      logoUrl: 'https://www.isro.gov.in/logo.png',
      description: 'ISRO job opportunities',
      enabled: true,
      scrapeFrequency: '24h',
      lastScrapedAt: '2024-11-10T08:00:00.000Z',
      createdAt: '2024-10-04T11:58:07.924Z',
      updatedAt: '2024-11-10T08:00:00.000Z'
    },
    // ... more sites
  ],
  message: 'Sites fetched successfully'
}
```

### 2. Get Site Details
```javascript
const response = await sitesAPI.getSiteDetails(siteId)

// Response (200):
{
  statusCode: 200,
  success: true,
  data: {
    _id: '68e10bcf0c9d409f3f5dd7c1',
    name: 'ISRO - Indian Space Research Organisation',
    baseUrl: 'https://www.isro.gov.in',
    careersUrl: 'https://www.isro.gov.in/ViewAllOpportunities.html',
    logoUrl: 'https://www.isro.gov.in/logo.png',
    description: '...',
    enabled: true,
    scrapeFrequency: '24h',
    lastScrapedAt: '2024-11-10T08:00:00.000Z',
    createdAt: '2024-10-04T11:58:07.924Z',
    updatedAt: '2024-11-10T08:00:00.000Z'
  },
  message: 'Site details fetched successfully'
}
```

### 3. Add New Site
```javascript
const response = await sitesAPI.addSite({
  name: 'ISRO',
  baseUrl: 'https://www.isro.gov.in',
  careersUrl: 'https://www.isro.gov.in/ViewAllOpportunities.html',
  logoUrl: 'https://www.isro.gov.in/logo.png',
  description: 'ISRO job opportunities',
  scrapeFrequency: '24h'
})

// Response (201):
{
  statusCode: 201,
  success: true,
  data: { _id: '...', name: 'ISRO', enabled: true, ... },
  message: 'Site added successfully'
}
```

### 4. Bookmark/Unbookmark Site (Protected)
```javascript
const response = await sitesAPI.toggleBookmark(siteId)

// Response when bookmarked (200):
{
  statusCode: 200,
  success: true,
  data: [
    {
      siteId: '68e10bcf0c9d409f3f5dd7c1',
      notificationsEnabled: false,
      createdAt: '...',
      updatedAt: '...'
    }
  ],
  message: 'Site bookmarked'
}

// Response when unbookmarked:
{
  statusCode: 200,
  success: true,
  data: [],
  message: 'Site unbookmarked'
}
```

### 5. Toggle Notification (Protected)
```javascript
const response = await sitesAPI.toggleNotification(siteId)

// Response (200):
{
  statusCode: 200,
  success: true,
  data: {
    siteId: '68e10bcf0c9d409f3f5dd7c1',
    notificationsEnabled: true,
    createdAt: '...',
    updatedAt: '...'
  },
  message: 'Notification preference toggled'
}
```

### 6. Get Bookmarked Sites (Protected)
```javascript
const response = await sitesAPI.getBookmarkedSites()

// Response (200):
{
  statusCode: 200,
  success: true,
  data: [
    {
      _id: '673a1b2c3d4e5f6a7b8c9d0f',
      siteId: {
        _id: '68e10bcf0c9d409f3f5dd7c1',
        name: 'ISRO - Indian Space Research Organisation',
        baseUrl: 'https://www.isro.gov.in',
        logoUrl: 'https://www.isro.gov.in/logo.png',
        description: '...'
      },
      notificationsEnabled: true,
      createdAt: '2024-11-10T10:30:00.000Z',
      updatedAt: '2024-11-10T12:45:00.000Z'
    }
  ],
  message: 'Bookmarked sites fetched successfully'
}
```

---

## Notices API (`noticesAPI`)

### 1. Get Site Notices
```javascript
const response = await noticesAPI.getSiteNotices(siteId)

// Response (200):
{
  statusCode: 200,
  success: true,
  data: [
    {
      _id: '673a1b2c3d4e5f6a7b8c9d11',
      site: '68e10bcf0c9d409f3f5dd7c1',
      title: 'Recruitment for Scientist/Engineer SC',
      link: 'https://www.isro.gov.in/Scientist_Engineer_SC_2024.html',
      advNo: 'ADV123',
      externalId: 'ADV123',
      location: 'Bangalore',
      openDate: '2024-11-01T00:00:00.000Z',
      endDate: '2024-11-30T23:59:59.000Z',
      scrapedAt: '2024-11-10T08:00:00.000Z',
      isActive: true,
      createdAt: '2024-11-10T08:00:00.000Z',
      updatedAt: '2024-11-10T08:00:00.000Z'
    },
    // ... more notices
  ],
  message: 'Notices fetched successfully'
}
```

### 2. Get Bookmarked Notices (Protected)
```javascript
const response = await noticesAPI.getBookmarkedNotices()

// Response (200):
{
  statusCode: 200,
  success: true,
  data: [
    {
      _id: '673a1b2c3d4e5f6a7b8c9d11',
      site: {
        _id: '68e10bcf0c9d409f3f5dd7c1',
        name: 'ISRO - Indian Space Research Organisation',
        logoUrl: 'https://www.isro.gov.in/logo.png'
      },
      title: 'Recruitment for Scientist/Engineer SC',
      link: 'https://www.isro.gov.in/Scientist_Engineer_SC_2024.html',
      externalId: 'ADV123',
      location: 'Bangalore',
      openDate: '2024-11-01T00:00:00.000Z',
      endDate: '2024-11-30T23:59:59.000Z',
      scrapedAt: '2024-11-10T08:00:00.000Z',
      isActive: true,
      createdAt: '2024-11-10T08:00:00.000Z',
      updatedAt: '2024-11-10T08:00:00.000Z'
    }
  ],
  message: 'Bookmarked notices fetched successfully'
}
```

---

## Jobs API (`jobsAPI`)

### 1. Scrape ISRO Jobs
```javascript
const response = await jobsAPI.scrapeISRO()

// Response (200):
{
  message: 'All jobs scraped successfully'
}

// Side effects: 
// - Scrapes ISRO website
// - Saves new notices to database
// - Sends emails to subscribed users
```

### 2. Scrape DRDO Jobs
```javascript
const response = await jobsAPI.scrapeDRDO()

// Response (200):
{
  message: 'DRDO scraped and saved successfully'
}
```

---

## Test API (`testAPI`)

### Save Notice (For Testing)
```javascript
const response = await testAPI.saveNotice({
  title: 'Test Notice',
  link: 'https://example.com/notice',
  advNo: 'ADV123',
  externalId: 'ADV123',
  openDate: '2025-10-10T00:00:00.000Z',
  endDate: '2025-10-20T00:00:00.000Z',
  location: 'Test Location'
}, siteId)

// Response (200):
{
  success: true,
  message: 'Notice saved and notifications sent (if any).'
}
```

---

## Error Handling

All API calls throw errors on failure. Standard error responses:

```javascript
// 400 - Bad Request
{
  statusCode: 400,
  success: false,
  message: 'Validation error message'
}

// 401 - Unauthorized
{
  statusCode: 401,
  success: false,
  message: 'Access token is required'
}

// 403 - Forbidden
{
  statusCode: 403,
  success: false,
  message: 'You are not authorized'
}

// 404 - Not Found
{
  statusCode: 404,
  success: false,
  message: 'Resource not found'
}

// 500 - Server Error
{
  statusCode: 500,
  success: false,
  message: 'Internal server error'
}
```

### Handling Errors in Components

```javascript
try {
  const response = await sitesAPI.getAllSites()
  if (response.success) {
    setSites(response.data)
  }
} catch (error) {
  console.error('Failed to fetch sites:', error.message)
  setError(error.message)
}
```

---

## Authentication

### Token Management
- Tokens are automatically stored in secure httpOnly cookies
- No manual token handling needed
- Cookies are automatically sent with every request
- CORS credentials required: `credentials: 'include'`

### Protected Routes
All protected endpoints require a valid `accessToken` cookie:
- GET /api/v1/users/profile
- PATCH /api/v1/users/update-profile
- PATCH /api/v1/users/change-password
- POST /api/v1/users/logout
- POST /api/v1/sites/bookmark
- PATCH /api/v1/sites/notification
- GET /api/v1/users/bookmarks
- GET /api/v1/users/bookmarked-notices

### Re-authentication
If accessToken expires, a refresh token is used automatically by the backend. If both expire, user must login again.

---

## Usage in Components

### Example: Fetch Sites and Use Store

```javascript
import { useEffect } from 'react'
import { useSitesStore } from '../stores/sitesStore'
import { sitesAPI } from '../services/api'

export function SitesList() {
  const { sites, setSites, setLoading, error } = useSitesStore()

  useEffect(() => {
    const fetchSites = async () => {
      try {
        setLoading(true)
        const response = await sitesAPI.getAllSites()
        if (response.success) {
          setSites(response.data)
        }
      } catch (err) {
        console.error('Failed:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSites()
  }, [setSites, setLoading])

  return (
    <div>
      {sites.map(site => (
        <div key={site._id}>{site.name}</div>
      ))}
    </div>
  )
}
```

---

## Rate Limiting

No rate limiting currently implemented. Backend may add this in future.

## CORS Settings

Frontend: `http://localhost:3000`
Backend: `http://localhost:5000`

Both must be configured for cross-origin requests.

---

## Response Time Expectations

- GET endpoints: < 500ms
- POST/PATCH endpoints: < 1000ms
- Scraping endpoints: 10-30 seconds

---

For more information, see `FRONTEND_GUIDE.md` and `REFACTORING_SUMMARY.md`
