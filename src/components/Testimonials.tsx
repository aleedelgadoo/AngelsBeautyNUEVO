import { useState } from 'react'
import './Testimonials.css'

interface Testimonial {
  id: number
  name: string
  text: string
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'María González',
    text: '¡Hola Angie! Cómo estás? La verdad que fue soñado todo, de comienzo a fin. Fue un día mágico! Y con vos no tengo más que palabras de agradecimiento, principalmente obvio por tu servicio, estuvo intacto todo hasta que me fui a dormir, divino, fascinada quede!',
  },
  {
    id: 2,
    name: 'Valentina Rodríguez',
    text: 'Angie es una profesional exceptual. Su dedicación y trato hacen que me sienta cómoda desde el primer momento. El resultado fue perfecto, me sentí hermosa en mi día especial. ¡Totalmente recomendado!',
  },
  {
    id: 3,
    name: 'Sofia Martinez',
    text: 'No tengo palabras para expresar lo agradecida que estoy. Angie no solo me maquilló, me hizo sentir segura y radiante. Cada detalle fue pensado con amor. Definitivamente vuelvo para mi próximo evento.',
  },
]

interface TestimonialsProps {
  pageData?: any
}

const Testimonials = ({ pageData }: TestimonialsProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const testimonials: Testimonial[] = pageData?.testimonials ?? DEFAULT_TESTIMONIALS

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
  }

  const current = testimonials[Math.min(currentIndex, testimonials.length - 1)]

  if (!current) return null

  const initial = current.name.trim().charAt(0).toUpperCase()

  return (
    <section className="testimonials" id="testimonials">
      <div className="container">
        <h2 className="section-title">EXPERIENCIAS</h2>

        <div className="testimonial-wrapper">
          <button className="testimonial-arrow prev" onClick={handlePrevious} aria-label="Previous testimonial">
            ❮
          </button>

          <div className="testimonial-content">
            {(current as any).photo ? (
              <img src={(current as any).photo} alt={current.name} className="testimonial-avatar-photo" loading="lazy" decoding="async" />
            ) : (
              <div className="testimonial-avatar">{initial}</div>
            )}
            <p className="testimonial-text">"{current.text}"</p>
            <p className="testimonial-name">— {current.name}</p>
          </div>

          <button className="testimonial-arrow next" onClick={handleNext} aria-label="Next testimonial">
            ❯
          </button>
        </div>

        <div className="testimonial-indicators">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to testimonial ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
