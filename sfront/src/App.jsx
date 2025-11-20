import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Jobs from './pages/Jobs'
import Bookmarks from './pages/Bookmarks'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Sites from './pages/Sites'
import Site from './pages/Site'

import { useAuthStore } from './stores/authStore'
import { userAPI } from './services/api'

export default function App(){
  const { initialize, setLoading } = useAuthStore()

  // Initialize auth on app mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true)
        const response = await userAPI.getProfile()
        if (response.success && response.data) {
          initialize(response.data)
        }
      } catch (error) {
        console.log('User not authenticated or session expired')
        initialize(null)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [initialize, setLoading])

  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar />
      <main className='flex-1'>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/jobs' element={<Jobs/>} />
          <Route path='/bookmarked' element={<Bookmarks/>} />
          <Route path='/about' element={<About/>} />
          <Route path='/contact' element={<Contact/>} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/sites' element={<Sites />} />
          <Route path='/sites/:id' element={<Site />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
