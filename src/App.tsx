import { useState, useEffect, lazy, Suspense } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import AboutMe from './components/AboutMe'
import Services from './components/Services'
import Courses from './components/Courses'
import Testimonials from './components/Testimonials'
import FAQ from './components/FAQ'
import Portfolio from './components/Portfolio'
import Footer from './components/Footer'
import { loadPageData, getCachedPageData } from './utils/storage'
import './App.css'

const ServiceDetail = lazy(() => import('./components/ServiceDetail'))
const CourseDetail = lazy(() => import('./components/CourseDetail'))
const AdminPanel = lazy(() => import('./components/AdminPanel'))

type Page = 'home' | 'service' | 'course' | 'admin'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home')
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null)
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [pageData, setPageData] = useState<any>(() => {
    const cached = getCachedPageData()
    return cached ? { social: { instagramLink: 'https://instagram.com' }, ...cached } : null
  })

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

  // Hint the browser to fetch the logo and hero image ahead of everything
  // else on the page, since they're what the visitor sees first.
  useEffect(() => {
    const preload = (key: string, href?: string) => {
      if (!href) return
      let link = document.querySelector(`link[data-preload="${key}"]`) as HTMLLinkElement | null
      if (!link) {
        link = document.createElement('link')
        link.rel = 'preload'
        link.as = 'image'
        link.setAttribute('fetchpriority', 'high')
        link.setAttribute('data-preload', key)
        document.head.appendChild(link)
      }
      link.href = href
    }
    preload('logo', pageData?.logo)
    preload('hero', pageData?.hero?.image)
  }, [pageData?.logo, pageData?.hero?.image])

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
    return (
      <Suspense fallback={null}>
        <AdminPanel onLogout={handleAdminLogout} onDataSaved={handleDataSaved} />
      </Suspense>
    )
  }

  if (currentPage === 'service' && selectedServiceId) {
    return (
      <Suspense fallback={null}>
        <ServiceDetail serviceId={selectedServiceId} onClose={handleCloseDetail} pageData={pageData} />
      </Suspense>
    )
  }

  if (currentPage === 'course' && selectedCourseId) {
    return (
      <Suspense fallback={null}>
        <CourseDetail courseId={selectedCourseId} onClose={handleCloseCourseDetail} pageData={pageData} />
      </Suspense>
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
