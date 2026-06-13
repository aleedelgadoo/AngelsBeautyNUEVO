import { useState } from 'react'
import './Navbar.css'

interface NavLink {
  label: string
  href: string
}

interface NavbarProps {
  pageData?: any
  onNavClick?: () => void
}

const Navbar = ({ pageData, onNavClick }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks: NavLink[] = [
    { label: 'SOBRE MÍ', href: '#about' },
    { label: 'SERVICIOS', href: '#services' },
    { label: 'CURSOS', href: '#courses' },
    { label: 'EXPERIENCIAS', href: '#testimonials' },
    { label: 'FAQ', href: '#faq' },
  ]

  const toggleMenu = () => setIsOpen(!isOpen)

  const handleLinkClick = () => setIsOpen(false)

  return (
    <nav className="navbar">
      <div className="navbar-header">
        <h1 className="navbar-title">Angels Beauty</h1>
      </div>
      <div className="navbar-container">
        <div className="navbar-logo">
          {pageData?.logo ? (
            <img src={pageData.logo} alt="Logo" className="logo-image" />
          ) : (
            <span className="logo-text">AB</span>
          )}
        </div>

        <button className="hamburger" onClick={toggleMenu} aria-label="Toggle menu">
          <span className={`hamburger-line ${isOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${isOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${isOpen ? 'open' : ''}`}></span>
        </button>

        <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
          {navLinks.map((link) => (
            <li key={link.label}>
              <a href={onNavClick ? undefined : link.href} onClick={() => { handleLinkClick(); onNavClick?.() }}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
