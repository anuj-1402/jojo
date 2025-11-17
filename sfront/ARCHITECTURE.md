# Architecture & Data Flow Diagram

## Application Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      React Application                          │
│                     (Vite + Tailwind)                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
        ┌───────▼──────┐ ┌────▼────┐ ┌────▼──────┐
        │ Components   │ │ Hooks   │ │ Services  │
        ├──────────────┤ ├─────────┤ ├───────────┤
        │- Navbar      │ │useAuth  │ │ api.js    │
        │- Home        │ │useSites │ │ - users   │
        │- Jobs        │ │useBooks │ │ - sites   │
        │- Bookmarks   │ │useNote  │ │ - notices │
        │- Footer      │ │         │ │ - jobs    │
        └──────────────┘ └─────────┘ └───────────┘
                │
                ▼
        ┌───────────────────┐
        │  Zustand Stores   │
        ├───────────────────┤
        │- authStore        │
        │- sitesStore       │
        │- noticesStore     │
        │- bookmarksStore   │
        └───────────────────┘
                │
                ▼
        ┌───────────────────┐
        │  API Calls via    │
        │  fetch API        │
        └───────────────────┘
                │
                ▼
    ┌────────────────────────────┐
    │   Backend API              │
    │   (Node.js + Express)      │
    │   http://localhost:5000    │
    └────────────────────────────┘
                │
                ▼
    ┌────────────────────────────┐
    │   Database                 │
    │   (MongoDB)                │
    └────────────────────────────┘
```

---

## Data Flow: Authentication

```
1. User Registration
┌──────────────┐
│ Register     │
│ Form         │
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│ userAPI.register()   │
│ POST /users/register │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Backend validates &  │
│ creates user         │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Response with user   │
│ data                 │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ useAuthStore.setUser │
│ (Store updated)      │
└──────────────────────┘


2. User Login
┌──────────────┐
│ Login Form   │
│ email+pwd    │
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│ userAPI.login()      │
│ POST /users/login    │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Backend verifies     │
│ credentials          │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Server sets httpOnly │
│ cookies (tokens)     │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Response with user   │
│ object               │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ useAuthStore.setUser │
│ (Auth state set)     │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Redirect to Home     │
│ page                 │
└──────────────────────┘


3. Auto-Login on App Mount
┌──────────────────────┐
│ App.jsx mounted      │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ useEffect runs       │
│ (empty dependency)   │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ userAPI.getProfile() │
│ GET /users/profile   │
│ (sends cookies)      │
└──────┬───────────────┘
       │
       ▼
       ┌─────────────┬──────────────┐
       │             │              │
    Success       Expired       No Session
       │             │              │
       ▼             ▼              ▼
    ┌───┐         ┌───┐         ┌───┐
    │Set│         │Null│        │Null│
    │User│        │State│       │State│
    └───┘         └───┘         └───┘
```

---

## Data Flow: Jobs & Notifications

```
1. Fetch All Sites
┌──────────────┐
│ Jobs Page    │
│ mounts       │
└──────┬───────┘
       │
       ▼
┌──────────────────────────┐
│ sitesAPI.getAllSites()   │
│ GET /api/v1/sites        │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Response: []             │
│ [Site1, Site2, ...]      │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ useSitesStore.setSites() │
│ (Store updated)          │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Sites displayed in       │
│ sidebar                  │
└──────────────────────────┘


2. Fetch Notices for Site
┌──────────────┐
│ User selects │
│ a site       │
└──────┬───────┘
       │
       ▼
┌──────────────────────────┐
│ selectedSite changes     │
│ (useEffect triggers)     │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│ noticesAPI.getSiteNotices(id)    │
│ GET /api/v1/sites/:id/notices    │
└──────┬───────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│ Response: [Notice1, Notice2, ...] │
└──────┬───────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│ useNoticesStore.setNotices()     │
│ (Store updated)                  │
└──────┬───────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│ Notices displayed in main area   │
│ with search & filter active      │
└──────────────────────────────────┘


3. Bookmark a Site
┌──────────────┐
│ User clicks  │
│ bookmark btn │
└──────┬───────┘
       │
       ▼
┌──────────────────────────┐
│ sitesAPI.toggleBookmark()│
│ POST /sites/bookmark     │
│ {siteId: "..."}          │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│ Backend adds to user's bookmarks │
└──────┬───────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│ Response: [bookmarkedSites]      │
└──────┬───────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│ useBookmarksStore.setBookmarked  │
│ Stores updated                   │
└──────┬───────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│ UI reflects bookmark status      │
│ (filled star, etc.)              │
└──────────────────────────────────┘


4. View Bookmarks
┌──────────────┐
│ User goes to │
│ Bookmarks pg │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────┐
│ useAuthStore.isAuthenticated?    │
└──────┬───────────────────────────┘
       │
   ┌───┴───┐
Yes│       │No
   │       ▼
   │  ┌──────────────┐
   │  │Show login    │
   │  │prompt        │
   │  └──────────────┘
   │
   ▼
┌──────────────────────────────────┐
│ sitesAPI.getBookmarkedSites()    │
│ GET /users/bookmarks             │
└──────┬───────────────────────────┘
       │
       ├─► noticesAPI.getBookmarkedNotices()
       │   GET /users/bookmarked-notices
       │
       ▼
┌──────────────────────────────────┐
│ Responses with bookmarked data   │
└──────┬───────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│ useBookmarksStore.set*()         │
│ (Both stores updated)            │
└──────┬───────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│ Display two tabs:                │
│ - Bookmarked Sites               │
│ - Bookmarked Jobs                │
└──────────────────────────────────┘
```

---

## Store Relationships

```
┌─────────────────────────────┐
│      authStore              │
├─────────────────────────────┤
│- user: User | null          │
│- isAuthenticated: boolean   │
│- loading: boolean           │
│- error: string | null       │
│                             │
│ Methods:                    │
│- setUser(user)              │
│- logout()                   │
│- initialize(user)           │
└─────────────────────────────┘
         │ Provides
         │ (user context)
         ▼
   All other stores
   use this for auth
   checks


┌─────────────────────────────┐
│    sitesStore               │
├─────────────────────────────┤
│- sites: Site[]              │
│- loading: boolean           │
│- error: string | null       │
│                             │
│ Methods:                    │
│- setSites(sites)            │
│- addSite(site)              │
└─────────────────────────────┘
         ▲
         │ Fetches from
         │ Jobs page


┌─────────────────────────────┐
│   noticesStore              │
├─────────────────────────────┤
│- notices: Notice[]          │
│- noticesByySite: {[id]: []} │
│- loading: boolean           │
│                             │
│ Methods:                    │
│- setNotices(notices)        │
│- setSiteNotices(id, notice)│
└─────────────────────────────┘
         ▲
         │ Populated when
         │ site selected


┌─────────────────────────────┐
│   bookmarksStore            │
├─────────────────────────────┤
│- bookmarkedSites: Site[]    │
│- bookmarkedNotices: Notice[]│
│- loading: boolean           │
│                             │
│ Methods:                    │
│- setBookmarkedSites(sites)  │
│- setBookmarkedNotices(note) │
│- toggleSiteBookmark(site)   │
└─────────────────────────────┘
         ▲
         │ Only for
         │ logged-in users
```

---

## Component Hierarchy

```
App
├── Navbar
│   ├── Logo
│   ├── NavLinks
│   ├── ThemeToggle
│   ├── Auth Display
│   │   ├── User Name (if logged in)
│   │   ├── Logout Button (if logged in)
│   │   └── Login Button (if not logged in)
│   └── MobileMenu
│
├── Main Routes
│   ├── Home
│   │   ├── HeroSection
│   │   ├── Features
│   │   └── Stats (with backend data)
│   │
│   ├── Jobs
│   │   ├── SitesSidebar (list of sites)
│   │   ├── SearchBar
│   │   └── NoticesList
│   │       └── NoticeCard (repeating)
│   │
│   ├── Bookmarks
│   │   ├── AuthGuard
│   │   ├── TabNavigation
│   │   ├── BookmarkedSitesTab
│   │   │   └── SiteCard (repeating)
│   │   └── BookmarkedNoticesTab
│   │       └── NoticeCard (repeating)
│   │
│   ├── About
│   └── Contact
│
└── Footer
    ├── Links
    ├── Social
    └── Copyright
```

---

## API Call Sequence

```
Initialization:
┌─────────────────────────────────────┐
│ 1. App mounts                       │
│ 2. userAPI.getProfile() called      │
│ 3. Auth initialized                 │
│ 4. Page renders                     │
└─────────────────────────────────────┘

Navigation to Jobs:
┌─────────────────────────────────────┐
│ 1. Jobs component mounts            │
│ 2. sitesAPI.getAllSites()           │
│ 3. Sites displayed in sidebar       │
│ 4. First site auto-selected         │
│ 5. noticesAPI.getSiteNotices()      │
│ 6. Notices displayed                │
└─────────────────────────────────────┘

Bookmarking:
┌─────────────────────────────────────┐
│ 1. User clicks bookmark              │
│ 2. sitesAPI.toggleBookmark()        │
│ 3. Server updates user.bookmarks    │
│ 4. Response returns updated list    │
│ 5. Local store updated              │
│ 6. UI reflects change               │
└─────────────────────────────────────┘

Viewing Bookmarks:
┌─────────────────────────────────────┐
│ 1. User clicks Bookmarks nav        │
│ 2. Auth check (isAuthenticated)     │
│ 3. Two parallel API calls:          │
│    - sitesAPI.getBookmarkedSites()  │
│    - noticesAPI.getBookmarkedNotices│
│ 4. Both stores updated              │
│ 5. Both tabs display data           │
└─────────────────────────────────────┘
```

---

## Error Handling Flow

```
API Call
    │
    ▼
Try-Catch Block
    │
    ├─ Success Response
    │  ├─ Check response.success
    │  ├─ Update Store
    │  └─ Update UI
    │
    └─ Error (Exception)
       ├─ Catch Error
       ├─ Log to Console
       ├─ Set error state
       └─ Display Error Message
          │
          ├─ 401: Unauthorized
          │  └─ Clear auth
          │  └─ Redirect to login
          │
          ├─ 404: Not Found
          │  └─ Show "No results"
          │
          ├─ 5xx: Server Error
          │  └─ Show "Try again later"
          │
          └─ Network Error
             └─ Show "Connection failed"
```

---

## State Updates Sequence

```
┌─────────────┐
│ User Action │
└──────┬──────┘
       │
       ▼
┌──────────────────┐
│ Event Handler    │
└──────┬───────────┘
       │
       ▼
┌──────────────────────┐
│ API Call Started     │
│ setLoading(true)     │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ API Request Sent     │
│ (with credentials)   │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Server Processing    │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Response Received    │
└──────┬───────────────┘
       │
       ├─ Success?
       │  │
       │  Yes
       │  │
       │  ▼
       │ ┌──────────────────┐
       │ │ Parse Response   │
       │ └────┬─────────────┘
       │      │
       │      ▼
       │ ┌──────────────────┐
       │ │ Update Store     │
       │ └────┬─────────────┘
       │      │
       │      ▼
       │ ┌──────────────────┐
       │ │ Clear Error      │
       │ └────┬─────────────┘
       │      │
       │      ▼
       │ ┌──────────────────┐
       │ │ setLoading(false)│
       │ └────┬─────────────┘
       │      │
       │      ▼
       │ ┌──────────────────┐
       │ │ Component Re-    │
       │ │ renders with new │
       │ │ data             │
       │ └──────────────────┘
       │
       No (Error)
       │
       ▼
       ┌──────────────────┐
       │ setError(message)│
       └────┬─────────────┘
            │
            ▼
       ┌──────────────────┐
       │ setLoading(false)│
       └────┬─────────────┘
            │
            ▼
       ┌──────────────────┐
       │ Component renders│
       │ error message    │
       └──────────────────┘
```

---

This diagram shows the complete data flow, component hierarchy, and state management patterns used throughout the application.
