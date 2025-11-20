import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import JobIimage from '../assets/Jobimage'
import { useSitesStore } from '../stores/sitesStore'
import { useNoticesStore } from '../stores/noticesStore'
import { sitesAPI, noticesAPI, userAPI } from '../services/api'


function Feature({ title, desc, bgColor, illustration }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 200 }}
      className={`${bgColor} rounded-3xl p-8 flex flex-col justify-between min-h-[280px] shadow-lg hover:shadow-xl transition-shadow`}
    >
      <div>
        <h3 className='text-2xl font-bold text-white mb-3'>{title}</h3>
        <p className='text-white/90 text-sm leading-relaxed'>{desc}</p>
      </div>
      <div className='mt-6 flex justify-end text-6xl'>{illustration}</div>
    </motion.div>
  )
}

export default function Home() {
  const { sites, setSites } = useSitesStore()
  const { notices, setNotices } = useNoticesStore()
  const [loading, setLoading] = useState(true)
  const [userCount, setUserCount] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const sitesRes = await sitesAPI.getAllSites()
        if (sitesRes.success && sitesRes.data) {
          setSites(sitesRes.data)
        }
        const noticesRes = await noticesAPI.getAllNotices()
        if (noticesRes.success && noticesRes.data) {
          setNotices(noticesRes.data)
        }
        userAPI.getUserCount().then(res => {
          if (res.count !== undefined) setUserCount(res.count);
        });
      } catch (error) {
        console.error('Failed to fetch sites:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [setSites, setNotices])
  return (
    <div className='bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen'>
      {/* Hero Section */}
      <section className='py-20 px-6 overflow-hidden'>
        <div className='container mx-auto max-w-7xl'>
          <div className='grid lg:grid-cols-2 gap-12 items-center'>
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -80 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className='space-y-6'
            >
              {/* Rating Badge */}
              <div className='flex items-center gap-2'>
                <div className='flex -space-x-2'>
                  <div className='w-8 h-8 rounded-full bg-blue-400 border-2 border-white'></div>
                  <div className='w-8 h-8 rounded-full bg-green-400 border-2 border-white'></div>
                  <div className='w-8 h-8 rounded-full bg-purple-400 border-2 border-white'></div>
                  <div className='w-8 h-8 rounded-full bg-orange-400 border-2 border-white'></div>
                  <div className='w-8 h-8 rounded-full bg-pink-400 border-2 border-white'></div>
                </div>
                <div className='flex items-center gap-1'>
                  <span className='text-yellow-500 text-lg'>★★★★★</span>
                  <span className='text-sm text-gray-600 dark:text-gray-300'>
                  {userCount === null ? '...' : userCount}
                  {' '}
                      users trust us
                  </span>
                </div>
              </div>

              {/* Main Heading */}
              <h1 className='text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight'>
                Find Your Dream Job
                <span className='block mt-2 text-orange-600'>Effortlessly</span>
              </h1>

              {/* Description */}
              <p className='text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl'>
                Search, save, and track government and private job openings from verified sources. 
                Simplify your job hunt — all opportunities in one place.
              </p>

              {/* CTA Button */}
              <div className='pt-4'>
                <Link
                  to='/jobs'
                  className='inline-block px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl'
                >
                  Start Your Job Search Today
                </Link>
              </div>
            </motion.div>

            {/* Right Illustration */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className='flex justify-center items-center'
            >
              <div className='relative w-full max-w-md'>
                <div className='absolute inset-0 bg-gradient-to-br from-orange-200 to-pink-200 dark:from-orange-900 dark:to-pink-900 opacity-25 rounded-full blur-3xl'></div>
                <JobIimage />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-16 px-6'>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='container mx-auto max-w-7xl'
        >
          <div className='mt-16 grid md:grid-cols-3 gap-8'>
            {/* Smart Engine */}
            <div className='bg-white dark:bg-gray-900 rounded-xl shadow p-6 flex flex-col items-center text-center'>
              <div className='mb-4 text-purple-600'>
                <svg width='36' height='36' fill='none' viewBox='0 0 24 24'>
                  <path
                    d='M12 2v2m0 16v2m10-10h-2M4 12H2m15.07-7.07l-1.41 1.41M6.34 17.66l-1.41 1.41m12.02 0l1.41-1.41M6.34 6.34L4.93 4.93'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Smart Job Engine</h3>
              <p className='text-gray-600 dark:text-gray-300'>
                Our intelligent engine scans top government and research sites to bring you the latest job opportunities, tailored to your interests.
              </p>
            </div>

            {/* Real-time Updates */}
            <div className='bg-white dark:bg-gray-900 rounded-xl shadow p-6 flex flex-col items-center text-center'>
              <div className='mb-4 text-purple-600'>
                <svg width='36' height='36' fill='none' viewBox='0 0 24 24'>
                  <path
                    d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Real-time Updates</h3>
              <p className='text-gray-600 dark:text-gray-300'>
                Get notified instantly when new jobs are posted.{' '}
                <span className='font-medium text-purple-600'>
                  You’ll also receive email alerts
                </span>{' '}
                for your bookmarked sites, so you never miss an opportunity.
              </p>
            </div>

            {/* Bookmarks */}
            <div className='bg-white dark:bg-gray-900 rounded-xl shadow p-6 flex flex-col items-center text-center'>
              <div className='mb-4 text-purple-600'>
                <svg width='36' height='36' fill='none' viewBox='0 0 24 24'>
                  <path
                    d='M5 5v16l7-5 7 5V5a2 2 0 00-2-2H7a2 2 0 00-2 2z'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Easy Bookmarks</h3>
              <p className='text-gray-600 dark:text-gray-300'>
                Bookmark your favorite job boards and organizations. Manage your list and enable notifications for the updates that matter most to you.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className='py-16 px-6 bg-white dark:bg-gray-800'>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className='container mx-auto max-w-7xl'
        >
          <div className='grid md:grid-cols-4 gap-8 text-center'>
            <motion.div whileHover={{ scale: 1.1 }} className='cursor-default'>
              <div className='text-4xl font-bold text-gray-900 dark:text-white mb-2'>
                {loading ? '...' : sites.length}
              </div>
              <div className='text-gray-600 dark:text-gray-300'>Active Sites</div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} className='cursor-default'>
              <div className='text-4xl font-bold text-gray-900 dark:text-white mb-2'>
                {loading ? '...' : notices.length}
              </div>
              <div className='text-gray-600 dark:text-gray-300'>Job Listings</div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} className='cursor-default'>
              <div className='text-4xl font-bold text-gray-900 dark:text-white mb-2'>
                {userCount === null ? '...' : userCount}
              </div>
              <div className='text-gray-600 dark:text-gray-300'>Happy Users</div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} className='cursor-default'>
              <div className='text-4xl font-bold text-gray-900 dark:text-white mb-2'>Daily</div>
              <div className='text-gray-600 dark:text-gray-300'>Updates</div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className='py-20 px-6'>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='container mx-auto max-w-4xl text-center'
        >
          <h2 className='text-4xl font-bold text-gray-900 dark:text-white mb-4'>
            Ready to Start Your Journey?
          </h2>
          <p className='text-lg text-gray-600 dark:text-gray-300 mb-8'>
            Join thousands of job seekers who found their dream careers through our platform.
          </p>
          <div className='flex gap-4 justify-center flex-wrap'>
            <Link
              to='/jobs'
              className='px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-lg'
            >
              Browse All Jobs
            </Link>
            <Link
              to='/about'
              className='px-8 py-4 border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white rounded-full font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'
            >
              Learn More
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
