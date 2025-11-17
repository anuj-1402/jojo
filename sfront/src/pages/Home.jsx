import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import JobIimage from '../assets/Jobimage'
import { useSitesStore } from '../stores/sitesStore'
import { useNoticesStore } from '../stores/noticesStore'
import { sitesAPI, noticesAPI } from '../services/api'


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
  const { sites } = useSitesStore()
  const { notices } = useNoticesStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const sitesRes = await sitesAPI.getAllSites()
        if (sitesRes.success && sitesRes.data) {
          // Update sites count dynamically from backend
        }
      } catch (error) {
        console.error('Failed to fetch sites:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])
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
                    1400+ users trust us
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
          <div className='grid md:grid-cols-3 gap-6'>
            <Feature
              title='Smart Search Engine'
              desc='Our AI-powered search helps you find the perfect job openings that match your skills instantly.'
              bgColor='bg-gradient-to-br from-blue-500 to-blue-600'
              illustration='🔍'
            />
            <Feature
              title='Real-Time Updates'
              desc='Get instant alerts about new openings from government and private sectors.'
              bgColor='bg-gradient-to-br from-green-500 to-green-600'
              illustration='📊'
            />
            <Feature
              title='Easy Bookmarking'
              desc='Save and organize your favorite jobs and companies in one click.'
              bgColor='bg-gradient-to-br from-red-500 to-pink-600'
              illustration='🎯'
            />
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
            {[
              { num: sites.length || '500+', label: 'Active Sites' },
              { num: notices.length || '5000+', label: 'Job Listings' },
              { num: '1400+', label: 'Happy Users' },
              { num: 'Daily', label: 'Updates' }
            ].map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.1 }}
                className='cursor-default'
              >
                <div className='text-4xl font-bold text-gray-900 dark:text-white mb-2'>{stat.num}</div>
                <div className='text-gray-600 dark:text-gray-300'>{stat.label}</div>
              </motion.div>
            ))}
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
