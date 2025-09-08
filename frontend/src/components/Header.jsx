import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-dark text-white py-3">
      <div className="container d-flex justify-content-between align-items-center">
        <Link href="/" className="text-white text-decoration-none fs-4 fw-bold">Travels App</Link>
        
        <nav>
          <ul className="d-flex list-unstyled m-0">
            <li className="mx-2">
              <Link href="/" className="text-decoration-none text-white opacity-75">
                Home
              </Link>
            </li>
            <li className="mx-2">
              <Link href="/leads" className="text-decoration-none text-white opacity-75">
                Leads
              </Link>
            </li>
            <li className="mx-2">
              <Link href="/login" className="text-decoration-none text-white opacity-75">
                Login
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header