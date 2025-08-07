import React from 'react'
import {BrowserRouter as Router,Routes,Route,useLocation} from 'react-router-dom'
import Header from './Components/Header/Header'
import Page1 from './Components/Page1/Page1'
import UserAuthentication from './Components/UserAuthentication/UserAuthentication'
import Leads from './Components/Leads/Leads'
import Creation from './Components/Leads/Components/Creation/Creation'
import LeadData from './Components/Leads/Components/LeadData/LeadData'
import User from './Components/User/User'

const Travel = () => {
    const location=useLocation();
    const hideHeader=['/login'];
    const showHeader=!hideHeader.includes(location.pathname);
  return (
    <>
        {showHeader&&<Header/>}
        <Routes>
            <Route path='/' element={<Page1/>}/>
            <Route path='/leads' element={<Leads/>}/>
            <Route path='/leads/create' element={<Creation/>}/>
            <Route path='/leads/profile' element={<LeadData/>}/>
            <Route path='/user' element={<User/>}/>
            <Route path='/login' element={<UserAuthentication/>}/>
        </Routes>
    </>
  )
}

export default Travel
