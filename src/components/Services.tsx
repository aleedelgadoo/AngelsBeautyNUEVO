import { useState, useEffect } from 'react'
import './Services.css'

interface Service {
  id: number
  name: string
  image: string
}

interface ServicesProps {
  onServiceClick: (serviceId: number) => void
  pageData?: any
}

const DEFAULT_SERVICES: Service[] = [
  { id: 1, name: 'QUINCEAÑERAS 2026', image: '' },
  { id: 2, name: 'MAQUILLAJE SOCIAL/INVITADAS', image: '' },
  { id: 3, name: 'NOVIAS 2026', image: '' },
  { id: 4, name: 'MAQUILLAJE ARTÍSTICO', image: '' },
  { id: 5, name: 'EVENTOS ESPECIALES', image: '' },
]

const Services = ({ onServiceClick, pageData }: ServicesProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [columns, setColumns] = useState(() => window.innerWidth <= 768 ? 1 : 3)

  const services: Service[] = pageData?.services ?? DEFAULT_SERVICES

  useEffect(() => {
    const onResize = () => setColumns(window.innerWidth <= 768 ? 1 : 3)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    setCurrentIndex(prev => Math.min(prev, Math.max(0, services.length - columns)))
  }, [columns, services.length])

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(services.length - columns, prev + 1))
  }

  return (
    <section className="services" id="services">
      <div className="container">
        <h2 className="section-title">SERVICIOS</h2>

        <div className="carousel-container">
          <div className="carousel-controls">
            <button className="carousel-arrow prev" onClick={handlePrevious} aria-label="Previous service">
              ❮
            </button>
            <button className="carousel-arrow next" onClick={handleNext} aria-label="Next service">
              ❯
            </button>
          </div>

          <div className="carousel">
            {services.map((service, index) => {
              const isVisible = index >= currentIndex && index < currentIndex + columns
              return (
                <div
                  key={service.id}
                  className={`carousel-item ${isVisible ? '' : 'hidden'}`}
                  onClick={() => onServiceClick(service.id)}
                >
                  <div className="service-image-wrapper">
                    {service.image ? (
                      <img src={service.image} alt={service.name} className="service-image-uploaded" loading="lazy" decoding="async" />
                    ) : (
                      <div className={`service-image service-image-placeholder service-${service.id}`}></div>
                    )}
                  </div>
                  <p className="service-name">{service.name}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Services
