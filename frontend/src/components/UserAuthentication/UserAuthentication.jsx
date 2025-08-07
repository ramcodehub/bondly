import React from 'react'
import './UserAuthentication.css'
import Logo from '../../assets/logo.png'
import {Link} from 'react-router-dom'

const UserAuthentication = () => {
  return (
    <div className='login'>
        <img src={Logo}/>
        <form action="" className='login-form'>
            <h1>Login</h1>
            <div className='input-box'>
                <input type="text" placeholder='Username' required/>
                <i class="bi bi-person-fill"></i>
            </div>
            <div className='input-box'>
                <input type="password" placeholder='Password' required/>
                <i class="bi bi-lock-fill"></i>
            </div>
            <div className="remember-forgot">
                <input type="checkbox"/><label>Remember me</label>
                <a href='#'>Forgot Password?</a>
            </div>
            <Link to='/'><button type='submit'>Login</button></Link>
            <div className="register-link">
                <span>Don't have an account? <a href="#">Register</a></span>
            </div>
        </form>
      
    </div>
  )
}

export default UserAuthentication
