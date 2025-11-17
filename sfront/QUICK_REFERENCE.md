# Quick Reference Guide

## 🚀 Quick Start (5 minutes)

### 1. Install & Run
```bash
cd d:\UnderWorld\sfront
npm install
npm run dev
# App runs on http://localhost:3000
```

### 2. Backend Required
Backend must run on `http://localhost:5000`

### 3. Test Flow
1. Register a new user
2. Login with credentials
3. Go to Jobs page
4. View job listings
5. Go to Bookmarks (requires login)

---

## 📚 File Quick Reference

| File | Purpose |
|------|---------|
| `src/services/api.js` | All API calls |
| `src/stores/authStore.js` | User authentication |
| `src/stores/sitesStore.js` | Sites/organizations |
| `src/stores/noticesStore.js` | Job notices |
| `src/stores/bookmarksStore.js` | User bookmarks |
| `src/components/Navbar.jsx` | Header with auth |
| `src/pages/Home.jsx` | Landing page |
| `src/pages/Jobs.jsx` | Job listings |
| `src/pages/Bookmarks.jsx` | Saved jobs & sites |
| `src/App.jsx` | Main app, auth init |

---

## 🔧 Common Tasks

### Fetch Data in Component
```javascript
import { useEffect } from 'react'
import { sitesAPI } from '../services/api'
import { useSitesStore } from '../stores/sitesStore'

function MyComponent() {
  const { sites, setSites, setLoading } = useSitesStore()

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const res = await sitesAPI.getAllSites()
        if (res.success) setSites(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
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

### Use Auth Store
```javascript
import { useAuthStore } from '../stores/authStore'

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuthStore()

  if (!isAuthenticated) {
    return <p>Please login</p>
  }

  return (
    <div>
      <p>Welcome, {user.name}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

### Handle API Errors
```javascript
try {
  const res = await userAPI.login(email, password)
  if (res.success) {
    // Handle success
  }
} catch (error) {
  if (error.message.includes('401')) {
    console.log('Invalid credentials')
  } else {
    console.log('Network error')
  }
}
```

---

## 🎯 API Endpoints Cheat Sheet

### User Endpoints
```
POST   /api/v1/users/register
POST   /api/v1/users/login
GET    /api/v1/users/profile           (protected)
PATCH  /api/v1/users/update-profile    (protected)
PATCH  /api/v1/users/change-password   (protected)
POST   /api/v1/users/logout            (protected)
POST   /api/v1/users/register-admin    (admin only)
```

### Sites Endpoints
```
GET    /api/v1/sites
GET    /api/v1/sites/:siteId
POST   /api/v1/sites
POST   /api/v1/sites/bookmark          (protected)
PATCH  /api/v1/sites/notification      (protected)
GET    /api/v1/users/bookmarks         (protected)
```

### Notices Endpoints
```
GET    /api/v1/sites/:siteId/notices
GET    /api/v1/users/bookmarked-notices (protected)
```

### Jobs Endpoints
```
POST   /api/v1/jobs/scrape
POST   /api/v1/jobs/drdo
```

---

## 🧠 Zustand Stores Quick Guide

### Import Store
```javascript
import { useAuthStore } from '../stores/authStore'
```

### Use in Component
```javascript
const { user, isAuthenticated, setUser, logout } = useAuthStore()
```

### Available Stores
- `useAuthStore` - Authentication
- `useSitesStore` - Sites/organizations
- `useNoticesStore` - Job notices
- `useBookmarksStore` - Bookmarks

---

## 🔐 Authentication Flow

### Login
```javascript
const response = await userAPI.login(email, password)
if (response.success) {
  useAuthStore.getState().setUser(response.data.user)
}
```

### Logout
```javascript
await userAPI.logout()
useAuthStore.getState().logout()
```

### Check Auth Status
```javascript
const { isAuthenticated } = useAuthStore()
if (!isAuthenticated) {
  // redirect to login
}
```

---

## 🎨 Component Structure

### Typical Page Component
```javascript
import { useEffect, useState } from 'react'
import { useStore } from '../stores/storeFile'
import { api } from '../services/api'

export default function Page() {
  const { data, setData, loading } = useStore()
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await api.endpoint()
      if (res.success) setData(res.data)
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      {/* Component JSX */}
    </div>
  )
}
```

---

## 🐛 Debugging Tips

### Check Store State
```javascript
// In browser console
import { useAuthStore } from './stores/authStore'
console.log(useAuthStore.getState())
```

### View API Response
```javascript
// In browser DevTools Network tab
// Click on API request → Response tab
```

### Check Component Props
```javascript
console.log('Props:', props)
```

### Monitor Store Changes
```javascript
const unsubscribe = useAuthStore.subscribe(
  state => console.log('State updated:', state)
)
```

---

## 📱 Responsive Design

- **Mobile**: 0-640px (single column)
- **Tablet**: 641-1024px (2 columns)
- **Desktop**: 1025px+ (3+ columns)

Tailwind breakpoints used:
- `sm:` - 640px
- `md:` - 768px
- `lg:` - 1024px
- `xl:` - 1280px

---

## 🎯 Key Features

| Feature | Location | Status |
|---------|----------|--------|
| User Auth | Navbar + authStore | ✅ Done |
| Sites List | Jobs page | ✅ Done |
| Job Search | Jobs page | ✅ Done |
| Bookmarks | Bookmarks page | ✅ Done |
| Dark Mode | Navbar | ✅ Done |
| Mobile Menu | Navbar | ✅ Done |
| Loading States | All pages | ✅ Done |
| Error Handling | All pages | ✅ Done |

---

## 🚨 Common Errors & Fixes

### "Cannot read property '_id' of undefined"
```javascript
// Fix: Add null checks
{site?.name} instead of {site.name}
// Or
if (!site) return null
```

### API returns 401 Unauthorized
```javascript
// Fix: Check if user is logged in
if (!isAuthenticated) {
  // redirect to login
}
```

### Store not updating
```javascript
// Fix: Ensure store setter is called
setSites(response.data) // after API call
```

### Dark mode not applying
```javascript
// Check Navbar.jsx dark class logic
// In Tailwind: apply dark: prefix for dark mode
```

---

## 📊 Response Format

All API responses follow this format:

**Success (200)**
```json
{
  "statusCode": 200,
  "success": true,
  "data": { /* actual data */ },
  "message": "Success message"
}
```

**Error (4xx/5xx)**
```json
{
  "statusCode": 400,
  "success": false,
  "message": "Error description"
}
```

---

## 🔑 Environment Variables

### Development
```bash
# .env.development (optional)
VITE_API_URL=http://localhost:5000/api/v1
```

### Production
```bash
# .env.production (optional)
VITE_API_URL=https://api.yourdomain.com/api/v1
```

### Usage in Code
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'
```

---

## 📦 Build & Deploy

### Development Build
```bash
npm run dev
```

### Production Build
```bash
npm run build  # Creates dist/ folder
npm run preview  # Preview dist/ locally
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

---

## 🧪 Testing Checklist

### Must Test
- [ ] Register new user
- [ ] Login
- [ ] View sites
- [ ] View notices
- [ ] Search jobs
- [ ] Dark mode toggle
- [ ] Mobile responsiveness
- [ ] Logout
- [ ] Re-login (session persistence)

---

## 📞 Help & Resources

- **React**: https://react.dev
- **Zustand**: https://github.com/pmndrs/zustand
- **Tailwind**: https://tailwindcss.com
- **Vite**: https://vitejs.dev
- **Docs**: See FRONTEND_GUIDE.md

---

## 📝 Notes

- All timestamps are ISO 8601 format
- Cookies are httpOnly and secure
- CORS credentials included in all requests
- No manual token management needed
- File uploads use FormData

---

**Version**: 1.0.0  
**Last Updated**: November 17, 2025  
**Status**: Production Ready ✅
