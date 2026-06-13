import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import AboutMe from './components/AboutMe'
import Services from './components/Services'
import Courses from './components/Courses'
import Testimonials from './components/Testimonials'
import FAQ from './components/FAQ'
import Portfolio from './components/Portfolio'
import Footer from './components/Footer'
import ServiceDetail from './components/ServiceDetail'
import CourseDetail from './components/CourseDetail'
import AdminPanel from './components/AdminPanel'
import { loadPageData } from './utils/storage'
import './App.css'

type Page = 'home' | 'service' | 'course' | 'admin'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home')
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null)
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [pageData, setPageData] = useState<any>(null)

  const refreshData = () => {
    loadPageData().then((data) => {
      if (data) setPageData({ social: { instagramLink: 'https://instagram.com' }, ...data })
    })
  }

  useEffect(() => { refreshData() }, [])

  useEffect(() => {
    if (pageData?.logo) {
      const link = document.querySelector("link[rel='icon']") as HTMLLinkElement | null
      if (link) {
        link.href = pageData.logo
        link.type = 'image/png'
      }
    }
  }, [pageData?.logo])

  useEffect(() => {
    const handler = () => {
      if (currentPage === 'service') {
        setCurrentPage('home')
        setSelectedServiceId(null)
      } else if (currentPage === 'course') {
        setCurrentPage('home')
        setSelectedCourseId(null)
      }
    }
    window.addEventListener('popstate', handler)
    return () => window.removeEventListener('popstate', handler)
  }, [currentPage])

  const handleDataSaved = () => refreshData()

  const handleServiceClick = (serviceId: number) => {
    history.pushState({ page: 'service' }, '')
    setSelectedServiceId(serviceId)
    setCurrentPage('service')
  }

  const handleCloseDetail = () => {
    history.back()
  }

  const handleCourseClick = (courseId: number) => {
    history.pushState({ page: 'course' }, '')
    setSelectedCourseId(courseId)
    setCurrentPage('course')
  }

  const handleCloseCourseDetail = () => {
    history.back()
  }

  const handleAdminLogin = () => {
    setIsLoggedIn(true)
    setCurrentPage('admin')
  }

  const handleAdminLogout = () => {
    setIsLoggedIn(false)
    setCurrentPage('home')
  }

  if (currentPage === 'admin' && isLoggedIn) {
    return <AdminPanel onLogout={handleAdminLogout} onDataSaved={handleDataSaved} />
  }

  if (currentPage === 'service' && selectedServiceId) {
    return (
      <ServiceDetail serviceId={selectedServiceId} onClose={handleCloseDetail} pageData={pageData} />
    )
  }

  if (currentPage === 'course' && selectedCourseId) {
    return (
      <CourseDetail courseId={selectedCourseId} onClose={handleCloseCourseDetail} pageData={pageData} />
    )
  }

  return (
    <div className="app">
      <Navbar pageData={pageData} />
      <Hero heroData={pageData?.hero} />
      <AboutMe pageData={pageData} />
      <div className="announcement-strip">
        <span>BOOKING AVAILABLE FOR 2026</span>
      </div>
      <Services onServiceClick={handleServiceClick} pageData={pageData} />
      <Courses onCourseClick={handleCourseClick} pageData={pageData} />
      <Testimonials pageData={pageData} />
      <FAQ />
      <Portfolio pageData={pageData} />
      <Footer onAdminClick={handleAdminLogin} socialData={pageData?.social} pageData={pageData} />
    </div>
  )
}

export default App
