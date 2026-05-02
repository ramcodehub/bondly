import Link from 'next/link';
import { useState, useEffect } from 'react';

const Header = () => {
  const [navLinks, setNavLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNavLinks = async () => {
      try {
        const response = await fetch('/api/settings');
        const data = await response.json();
        setNavLinks(data.navigation_links || [
          { title: 'Home', path: '/' },
          { title: 'Leads', path: '/leads' },
          { title: 'Opportunities', path: '/opportunities' },
          { title: 'Account', path: '/account' },
          { title: 'Contact', path: '/contact' }
        ]);
      } catch (error) {
        console.error('Error fetching navigation links:', error);
        // Fallback to static links if API fails
        setNavLinks([
          { title: 'Home', path: '/' },
          { title: 'Leads', path: '/leads' },
          { title: 'Opportunities', path: '/opportunities' },
          { title: 'Account', path: '/account' },
          { title: 'Contact', path: '/contact' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchNavLinks();
  }, []);

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-dark text-white py-3">
      <div className="container d-flex justify-content-between align-items-center">
        <Link href="/" className="text-white text-decoration-none fs-4 fw-bold">Travels App</Link>
        
        <button 
          className="navbar-toggler d-lg-none"
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <nav className={`lg:flex ${menuOpen ? 'block' : 'hidden'} absolute lg:relative top-full left-0 right-0 lg:top-auto bg-white lg:bg-transparent shadow-lg lg:shadow-none border-t lg:border-t-0`}>
          <ul className="flex flex-col lg:flex-row lg:items-center lg:space-x-8">
            {navLinks.map((link, index) => (
              <li key={index} className="border-b lg:border-b-0">
                <Link 
                  className="block px-4 py-3 lg:py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 lg:hover:bg-transparent transition-colors" 
                  href={link.path}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header