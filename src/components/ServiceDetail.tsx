import { useState, useEffect } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import Lightbox from './Lightbox'
import './ServiceDetail.css'

interface ServiceDetailProps {
  serviceId: number
  onClose: () => void
  pageData?: any
}

const ServiceDetail = ({ serviceId, onClose, pageData }: ServiceDetailProps) => {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)

  useEffect(() => { window.scrollTo(0, 0) }, [])

  const servicesData: Record<number, any> = pageData?.services?.reduce((acc: any, service: any) => {
    acc[service.id] = service
    return acc
  }, {}) || {}

  const service = servicesData[serviceId]

  if (!service) return null

  return (
    <div className="service-detail-page">
      <Navbar pageData={pageData} onNavClick={onClose} />
      <div className="service-detail-container">
        <button className="back-button" onClick={onClose}>← Volver</button>

        <div className="service-detail-hero">
          {service.image ? (
            <img src={service.image} alt={service.name} className="service-detail-image-real" decoding="async" />
          ) : (
            <div className={`service-detail-image-placeholder service-placeholder-${service.id}`}></div>
          )}
        </div>

        <div className="service-detail-content">
          <h1 className="service-detail-title">{service.name}</h1>
          <div className="service-detail-meta">
            <span className="duration">⏱ {service.duration}</span>
          </div>
          <p className="service-detail-description">{service.description}</p>

          {service.packages?.length > 0 && (
            <div className="packages-section">
              <h2 className="packages-title">PAQUETES</h2>
              {service.packages.map((pkg: any, index: number) => (
                <div key={index} className="package-item">
                  <h3 className="package-name">{pkg.name}</h3>
                  <p className="package-description">{pkg.description}</p>
                </div>
              ))}
            </div>
          )}

          {service.portfolioImages?.length > 0 && (
            <div className="portfolio-section">
              <h2 className="portfolio-title">PORTFOLIO</h2>
              <div className="portfolio-grid">
                {service.portfolioImages.map((img: any) => (
                  <div
                    key={img.id}
                    className="portfolio-image-item"
                    style={img.image ? { backgroundImage: `url(${img.image})`, backgroundSize: 'cover', backgroundPosition: img.position || '50% 50%', cursor: 'pointer' } : {}}
                    onClick={() => img.image && setLightboxSrc(img.image)}
                  ></div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
      {lightboxSrc && <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />}
    </div>
  )
}

export default ServiceDetail
