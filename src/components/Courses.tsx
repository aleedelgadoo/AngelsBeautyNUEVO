import { useState, useEffect } from 'react'
import './Courses.css'

interface Course {
  id: number
  name: string
  image: string
  imagePosition?: string
}

interface CoursesProps {
  onCourseClick: (courseId: number) => void
  pageData?: any
}

const DEFAULT_COURSES: Course[] = [
  { id: 1, name: 'PERFECCIONAMIENTOS', image: '' },
  { id: 2, name: 'MASTERCLASS AUTOMAQUILLAJE', image: '' },
  { id: 3, name: 'CURSO DE AUTOMAQUILLAJE', image: '' },
  { id: 4, name: 'TÉCNICAS AVANZADAS', image: '' },
]

const Courses = ({ onCourseClick, pageData }: CoursesProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [columns, setColumns] = useState(() => window.innerWidth <= 768 ? 1 : 3)

  const courses: Course[] = pageData?.courses ?? DEFAULT_COURSES

  useEffect(() => {
    const onResize = () => setColumns(window.innerWidth <= 768 ? 1 : 3)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    setCurrentIndex(prev => Math.min(prev, Math.max(0, courses.length - columns)))
  }, [columns, courses.length])

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(courses.length - columns, prev + 1))
  }

  return (
    <section className="courses" id="courses">
      <div className="container">
        <h2 className="section-title">CURSOS</h2>

        <div className="carousel-container">
          <div className="carousel-controls">
            <button className="carousel-arrow prev" onClick={handlePrevious} aria-label="Previous course">
              ❮
            </button>
            <button className="carousel-arrow next" onClick={handleNext} aria-label="Next course">
              ❯
            </button>
          </div>

          <div className="carousel">
            {courses.map((course, index) => {
              const isVisible = index >= currentIndex && index < currentIndex + columns
              return (
                <div
                  key={course.id}
                  className={`carousel-item ${isVisible ? '' : 'hidden'}`}
                  onClick={() => onCourseClick(course.id)}
                >
                  <div className="course-image-wrapper">
                    {course.image ? (
                      <img src={course.image} alt={course.name} className="course-image-uploaded" loading="lazy" decoding="async" style={{ objectPosition: course.imagePosition || '50% 50%' }} />
                    ) : (
                      <div className={`course-image course-image-placeholder course-${course.id}`}></div>
                    )}
                  </div>
                  <p className="course-name">{course.name}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Courses
