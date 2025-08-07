import React from 'react'
import {Link, Outlet} from 'react-router-dom'
import './Leads.css'
import LeadsTable from './Components/LeadsTable/LeadsTable'

const Leads = () => {
  return (
    <div className='leads'>
      <div className='top'>
        <div className='filter-leads'>
            <button className='filter'>Filter <i className="bi bi-funnel"></i></button>
            <button className='leads1'>All Leads <i className="bi bi-caret-down-fill"></i></button>
        </div>
        <div className='create'>
            <div className="split-button">
                    <Link className="main-button" to='/leads/create'>Create Lead</Link>
               
                <button className="dropdown-button">
                    <i className="bi bi-caret-down-fill"></i>
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
