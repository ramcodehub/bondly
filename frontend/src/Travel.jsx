import React from 'react'
import {BrowserRouter as Router,Routes,Route,useLocation} from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import UserAuthentication from './components/UserAuthentication/UserAuthentication'
import Leads from './components/Leads/Leads'
import Creation from './components/Leads/Components/Creation/Creation'
import LeadData from './components/Leads/Components/LeadData/LeadData'
import User from './components/User/User'
import HomePage from './pages/HomePage'
import LeadsPage from './pages/LeadsPage'
import LoginPage from './pages/LoginPage'
import OpportunitiesPage from './pages/OpportunitiesPage'
import AccountPage from './pages/AccountPage'
import ContactPage from './pages/ContactPage'

const Travel = () => {
    const location=useLocation();
    const hideNavbar=['/login', '/signup'];
    const showNavbar=!hideNavbar.includes(location.pathname);
  return (
    <>
        {showNavbar&&<Navbar/>}
        <Routes>
            <Route path='/' element={<HomePage/>}/>
            <Route path='/leads' element={<LeadsPage/>}/>
            <Route path='/leads/create' element={<Creation/>}/>
            <Route path='/leads/profile' element={<LeadData/>}/>
            <Route path='/opportunities' element={<OpportunitiesPage/>}/>
            <Route path='/account' element={<AccountPage/>}/>
            <Route path='/contact' element={<ContactPage/>}/>
            <Route path='/login' element={<LoginPage/>}/>
            <Route path='/signup' element={<LoginPage/>}/>
        </Routes>
    </>
  )
}

export default Travel
