import React from 'react'
import {Link, Outlet} from 'react-router-dom'
import LeadsTable from './Components/LeadsTable/LeadsTable'

const Leads = () => {
  return (
    <div className='w-full px-4 sm:px-6 lg:px-8 pt-20'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6'>
        <div className='flex flex-col sm:flex-row gap-2 sm:gap-4'>
            <button className='flex items-center gap-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 px-3 py-2 rounded-lg text-sm font-medium transition-colors'>
              <i className="bi bi-funnel"></i>
              <span>Filter</span>
            </button>
            <button className='flex items-center gap-2 bg-white border border-gray-300 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors'>
              <span>All Leads</span>
              <i className="bi bi-caret-down-fill"></i>
            </button>
        </div>
        <div className='flex justify-center sm:justify-end'>
            <div className="flex rounded-lg overflow-hidden shadow-sm">
                <Link className="bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2" to='/leads/create'>
                  <i className="bi bi-plus-lg"></i>
                  <span>Create Lead</span>
                </Link>
                <button className="bg-blue-600 text-white px-2 py-2 hover:bg-blue-700 transition-colors border-l border-blue-500">
                    <i className="bi bi-caret-down-fill text-xs"></i>
                </button>
            </div>
        </div>
      </div>
      <LeadsTable/>
      <Outlet/>
    </div>
  )
}

export default Leads
