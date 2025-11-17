import React from 'react'
export default function Footer(){
  return (
    <footer className='bg-white dark:bg-gray-800 border-t mt-12'>
      <div className='container mx-auto px-6 py-8 text-center text-gray-600 dark:text-gray-300'>
        © {new Date().getFullYear()} JobScraper. All rights reserved.
      </div>
    </footer>
  )
}
