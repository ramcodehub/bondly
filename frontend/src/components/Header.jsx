import { Link, NavLink } from 'react-router-dom'

const Header = () => {
  return (
    <header className="bg-dark text-white py-3">
      <div className="container d-flex justify-content-between align-items-center">
        <Link to="/" className="text-white text-decoration-none fs-4 fw-bold">Travels App</Link>
        
        <nav>
          <ul className="d-flex list-unstyled m-0">
            <li className="mx-2">
              <NavLink to="/" className={({isActive}) => 
                `text-decoration-none ${isActive ? 'text-white' : 'text-light opacity-75'}`
              }>
                Home
              </NavLink>
            </li>
            <li className="mx-2">
              <NavLink to="/leads" className={({isActive}) => 
                `text-decoration-none ${isActive ? 'text-white' : 'text-light opacity-75'}`
              }>
                Leads
              </NavLink>
            </li>
            <li className="mx-2">
              <NavLink to="/login" className={({isActive}) => 
                `text-decoration-none ${isActive ? 'text-white' : 'text-light opacity-75'}`
              }>
                Login
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header