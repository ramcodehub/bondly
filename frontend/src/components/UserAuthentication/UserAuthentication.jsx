import React from 'react'
import Logo from '../../assets/logo.png'
import Link from 'next/link'

const UserAuthentication = () => {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div className='text-center'>
          <img src={Logo} alt="Logo" className='mx-auto h-16 w-auto' />
        </div>
        <form className='bg-white rounded-lg shadow-sm p-6 sm:p-8 space-y-6'>
          <h1 className='text-2xl sm:text-3xl font-bold text-center text-gray-900'>Login</h1>
          <div className='space-y-4'>
            <div className='relative'>
              <input 
                type="text" 
                placeholder='Username' 
                required
                className='w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm'
              />
              <i className="bi bi-person-fill absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
            <div className='relative'>
              <input 
                type="password" 
                placeholder='Password' 
                required
                className='w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm'
              />
              <i className="bi bi-lock-fill absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <a href='#' className='text-sm text-blue-600 hover:text-blue-800'>Forgot Password?</a>
          </div>
          <Link href='/' className='w-full block'>
            <button type='submit' className='w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors'>
              Login
            </button>
          </Link>
          <div className="text-center">
            <span className="text-sm text-gray-600">
              Don't have an account? 
              <a href="#" className="text-blue-600 hover:text-blue-800 font-medium ml-1">Register</a>
            </span>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserAuthentication