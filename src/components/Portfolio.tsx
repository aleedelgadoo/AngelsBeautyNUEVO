import { useState } from 'react'
import Lightbox from './Lightbox'
import './Portfolio.css'

interface PortfolioProps {
  pageData?: any
}

const Portfolio = ({ pageData }: PortfolioProps) => {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)
  const items: Array<{ id: number; image: string }> = pageData?.portfolio ?? []

  if (items.length === 0) return null

  return (
    <section className="portfolio" id="portfolio">
      <div className="container">
        <h2 className="section-title">PORTFOLIO</h2>
        <div className="portfolio-grid">
          {items.map((item) => (
            <div key={item.id} className="portfolio-item" onClick={() => setLightboxSrc(item.image)}>
              <div className="portfolio-image" style={{ backgroundImage: `url(${item.image})` }}></div>
            </div>
          ))}
        </div>
      </div>
      {lightboxSrc && <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />}
    </section>
  )
}

export default Portfolio
