import './Footer.css'

interface FooterProps {
  onAdminClick?: () => void
  socialData?: any
  pageData?: any
}

const Footer = ({ onAdminClick, socialData, pageData }: FooterProps) => {
  const instagramLink = socialData?.instagramLink || pageData?.social?.instagramLink || 'https://instagram.com'
  const logo = pageData?.logo || ''

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          {logo ? (
            <img src={logo} alt="Logo" className="footer-logo-image" decoding="async" fetchPriority="low" />
          ) : (
            <span className="logo-text">AB</span>
          )}
        </div>

        <div className="footer-socials">
          <a
            href={instagramLink}
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
            aria-label="Instagram"
            title="Sígueme en Instagram"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <circle cx="17.5" cy="6.5" r="1.5"></circle>
            </svg>
          </a>
          {onAdminClick && (
            <button
              className="admin-link"
              onClick={onAdminClick}
              aria-label="Admin Panel"
              title="Panel de Control"
            >
              ⚙️
            </button>
          )}
        </div>

        <div className="footer-name">
          <p className="footer-text">© 2026 Angels Beauty - Angie</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
