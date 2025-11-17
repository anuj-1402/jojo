# Job Scraper Frontend - Setup & Usage Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Backend API running on `http://localhost:5000`

### Installation

```bash
# Navigate to frontend directory
cd d:\UnderWorld\sfront

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx        # Navigation with auth support
│   ├── Footer.jsx        # Footer component
│   └── Grid.jsx          # Grid layout component
├── pages/
│   ├── Home.jsx          # Landing page with stats
│   ├── Jobs.jsx          # Job listings with filtering
│   ├── Bookmarks.jsx     # Bookmarked sites & jobs
│   ├── About.jsx         # About page
│   └── Contact.jsx       # Contact page
├── services/
│   └── api.js            # All API endpoints
├── stores/
│   ├── authStore.js      # Authentication state
│   ├── sitesStore.js     # Sites management
│   ├── noticesStore.js   # Job notices state
│   └── bookmarksStore.js # Bookmarks management
├── assets/
│   └── Jobimage.jsx      # Job illustration
├── context/
│   └── AuthContext.jsx   # (Legacy - replaced by authStore)
├── App.jsx               # Main app component
└── main.jsx              # Entry point
```

---

## 🔐 Authentication Flow

### Login
```javascript
import { userAPI } from './services/api'
import { useAuthStore } from './stores/authStore'

const { setUser } = useAuthStore()

const response = await userAPI.login(email, password)
if (response.success) {
  setUser(response.data.user)
}
```

### Logout
```javascript
await userAPI.logout()
logout() // from store
```

### Auto-login on App Mount
App.jsx automatically checks for active session on load.

---

## 📊 State Management (Zustand)

### Authentication Store
```javascript
import { useAuthStore } from './stores/authStore'

const { 
  user,              // Current user object
  isAuthenticated,   // Boolean
  loading,           // Loading state
  error,             // Error message
  setUser,           // Set user
  logout,            // Clear auth
  initialize         // Initialize from backend
} = useAuthStore()
```

### Sites Store
```javascript
import { useSitesStore } from './stores/sitesStore'

const { 
  sites,      // Array of all sites
  loading,    // Loading state
  error,      // Error message
  setSites,   // Set sites
  addSite     // Add new site
} = useSitesStore()
```

### Notices Store
```javascript
import { useNoticesStore } from './stores/noticesStore'

const { 
  notices,           // All notices
  noticesByySite,    // Notices by site ID
  loading,           // Loading state
  setNotices,        // Set notices
  setSiteNotices     // Set notices for specific site
} = useNoticesStore()
```

### Bookmarks Store
```javascript
import { useBookmarksStore } from './stores/bookmarksStore'

const { 
  bookmarkedSites,      // Bookmarked sites array
  bookmarkedNotices,    // Bookmarked notices array
  setBookmarkedSites,   // Set bookmarked sites
  removeBookmarkedSite, // Remove bookmark
  isSiteBookmarked      // Check if bookmarked
} = useBookmarksStore()
```

---

## 🔌 API Integration

### All Available API Calls

```javascript
import { userAPI, sitesAPI, noticesAPI, jobsAPI } from './services/api'

// User APIs
await userAPI.register(userData)
await userAPI.login(email, password)
await userAPI.getProfile()
await userAPI.updateProfile(userData)
await userAPI.changePassword(currentPwd, newPwd)
await userAPI.logout()

// Sites APIs
await sitesAPI.getAllSites()
await sitesAPI.getSiteDetails(siteId)
await sitesAPI.addSite(siteData)
await sitesAPI.toggleBookmark(siteId)
await sitesAPI.toggleNotification(siteId)
await sitesAPI.getBookmarkedSites()

// Notices APIs
await noticesAPI.getSiteNotices(siteId)
await noticesAPI.getBookmarkedNotices()

// Jobs/Scraping APIs
await jobsAPI.scrapeISRO()
await jobsAPI.scrapeDRDO()
```

### API Response Format

All API responses follow this format:
```javascript
{
  "statusCode": 200,
  "success": true,
  "data": { /* actual data */ },
  "message": "Success message"
}
```

Error responses:
```javascript
{
  "statusCode": 400,
  "success": false,
  "message": "Error message"
}
```

---

## 🎨 Features Implemented

### 1. **Home Page**
- Landing hero section
- Feature highlights
- Real-time statistics from backend
- Call-to-action buttons
- Responsive design

### 2. **Jobs Page**
- Sidebar with site filtering
- Job listings with details
- Search functionality (title, location, ref #)
- External links to job postings
- Responsive layout
- Loading states

### 3. **Bookmarks Page**
- Tab-based interface (Sites & Jobs)
- Bookmarked sites with notifications status
- Bookmarked job notices
- Remove bookmark functionality
- Auth-protected (requires login)

### 4. **Navigation**
- Dark mode toggle
- User profile display
- Login/Logout buttons
- Mobile responsive menu
- Active page highlighting

---

## 🔧 Configuration

### Backend URL
Edit `src/services/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:5000/api/v1'
```

### Environment Variables (Optional)
Create `.env` file in root:
```
VITE_API_URL=http://localhost:5000/api/v1
```

Update `src/services/api.js`:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'
```

---

## 🧪 Testing Checklist

### Authentication
- [ ] User can register
- [ ] User can login
- [ ] User stays logged in on page refresh
- [ ] User can logout
- [ ] Login persists across navigation

### Sites & Jobs
- [ ] All sites load on Jobs page
- [ ] Clicking site shows its notices
- [ ] Search filters jobs correctly
- [ ] External links work
- [ ] Stats update on Home page

### Bookmarks
- [ ] Can only access when logged in
- [ ] Bookmarked sites display correctly
- [ ] Bookmarked jobs display correctly
- [ ] Can remove bookmarks
- [ ] Notification status shows correctly

### UI/UX
- [ ] Dark mode toggles properly
- [ ] Mobile menu works
- [ ] All pages are responsive
- [ ] Loading states display
- [ ] Error messages show

---

## 🐛 Common Issues

### Issue: "Cannot find module" errors
**Solution:** Clear node_modules and reinstall
```bash
rm -r node_modules package-lock.json
npm install
```

### Issue: API calls return 401 (Unauthorized)
**Solution:** 
- Ensure backend is running
- Check if session cookies are being sent
- Verify CORS is enabled on backend

### Issue: Dark mode not persisting
**Solution:** Currently stored in component state. To persist:
```javascript
// In Navbar.jsx, add to theme toggle:
localStorage.setItem('theme', dark ? 'dark' : 'light')

// On mount, restore:
const saved = localStorage.getItem('theme')
if (saved) setDark(saved === 'dark')
```

### Issue: Bookmarks show empty
**Solution:**
- Check user is logged in
- Verify backend bookmarks endpoint is working
- Check browser DevTools network tab for API errors

---

## 📝 Development Tips

### Adding a New Page
1. Create component in `src/pages/`
2. Import in `App.jsx`
3. Add route in Routes
4. Add nav link in `Navbar.jsx`

### Adding a New API Call
1. Add function to appropriate module in `src/services/api.js`
2. Import in component
3. Use in useEffect or event handler
4. Update relevant Zustand store

### Debugging State
```javascript
// In browser console:
// Import store and check state
import { useAuthStore } from './stores/authStore'
useAuthStore.getState()
```

---

## 📚 Technology Stack

- **React 18** - UI library
- **Vite** - Build tool
- **Zustand** - State management
- **React Router v6** - Routing
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons

---

## 🚢 Deployment

### Build for Production
```bash
npm run build
```

Output: `dist/` folder ready to deploy

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm install -g netlify-cli
netlify deploy
```

### Environment for Production
Create `.env.production`:
```
VITE_API_URL=https://your-backend-api.com/api/v1
```

---

## 📞 Support

For issues or questions:
1. Check the console for errors (F12 in browser)
2. Check network tab for API failures
3. Verify backend is running
4. Check CORS settings if cross-origin issues

---

## 📄 License

This project is part of the Job Scraper application.
