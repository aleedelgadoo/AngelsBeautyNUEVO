import { useState, useEffect } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import Lightbox from './Lightbox'
import './CourseDetail.css'

interface CourseDetailProps {
  courseId: number
  onClose: () => void
  pageData?: any
}

const CourseDetail = ({ courseId, onClose, pageData }: CourseDetailProps) => {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)

  useEffect(() => { window.scrollTo(0, 0) }, [])

  const coursesData: Record<number, any> = pageData?.courses?.reduce((acc: any, course: any) => {
    acc[course.id] = course
    return acc
  }, {}) || {}

  const course = coursesData[courseId]

  if (!course) return null

  return (
    <div className="course-detail-page">
      <Navbar pageData={pageData} onNavClick={onClose} />
      <div className="course-detail-container">
        <button className="back-button" onClick={onClose}>← Volver</button>

        <div className="course-detail-hero">
          {course.image ? (
            <img src={course.image} alt={course.name} className="course-detail-image-real" />
          ) : (
            <div className={`course-detail-image-placeholder course-placeholder-${course.id}`}></div>
          )}
        </div>

        <div className="course-detail-content">
          <h1 className="course-detail-title">{course.name}</h1>
          <div className="course-detail-meta">
            <span className="duration">⏱ {course.duration}</span>
          </div>
          <p className="course-detail-description">{course.description}</p>

          {course.portfolioImages?.length > 0 && (
            <div className="portfolio-section">
              <h2 className="portfolio-title">RESULTADOS</h2>
              <div className="portfolio-grid">
                {course.portfolioImages.map((img: any) => (
                  <div
                    key={img.id}
                    className="portfolio-image-item"
                    style={img.image ? { backgroundImage: `url(${img.image})`, backgroundSize: 'cover', backgroundPosition: 'center', cursor: 'pointer' } : {}}
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

export default CourseDetail
