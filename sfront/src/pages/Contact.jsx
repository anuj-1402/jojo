import React, {useState} from 'react'

export default function Contact(){
  const [msg, setMsg] = useState('')
  function handleSubmit(e){
    e.preventDefault()
    alert('Message submitted (placeholder). Message length: '+msg.length)
    setMsg('')
  }
  return (
    <div className='container mx-auto px-6 py-20 max-w-2xl'>
      <h2 className='text-4xl font-bold text-center text-gray-900 dark:text-white mb-4'>Contact Us</h2>
      <p className='text-center text-gray-600 dark:text-gray-300 mb-8'>Have questions or feedback? We'd love to hear from you.</p>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='block text-sm text-gray-700 dark:text-gray-300 mb-1'>Name</label>
          <input required className='w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100' placeholder='Your name'/>
        </div>
        <div>
          <label className='block text-sm text-gray-700 dark:text-gray-300 mb-1'>Email</label>
          <input required type='email' className='w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100' placeholder='you@example.com'/>
        </div>
        <div>
          <label className='block text-sm text-gray-700 dark:text-gray-300 mb-1'>Message</label>
          <textarea value={msg} onChange={e=>setMsg(e.target.value)} required rows={6} className='w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100' placeholder="Tell us what's on your mind..."></textarea>
        </div>
        <div className='text-center'>
          <button type='submit' className='px-6 py-3 rounded-md bg-blue-800 text-white'>Send Message</button>
        </div>
      </form>
    </div>
  )
}
