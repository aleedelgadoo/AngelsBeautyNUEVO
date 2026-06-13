import { useState, useEffect, useRef } from 'react'
import { savePageData, loadPageData } from '../utils/storage'
import { uploadImage } from '../utils/supabase'
import './AdminPanel.css'

interface AdminPanelProps {
  onLogout: () => void
  onDataSaved: () => void
}

interface Package {
  name: string
  description: string
}

interface ServiceData {
  id: number
  name: string
  duration: string
  description: string
  image: string
  packages: Package[]
  portfolioImages: Array<{ id: number; image: string }>
}

interface CourseData {
  id: number
  name: string
  duration: string
  description: string
  image: string
  objectives: string[]
  portfolioImages: Array<{ id: number; image: string }>
}

interface FAQItem {
  id: number
  question: string
  answer: string
}

interface Testimonial {
  id: number
  name: string
  text: string
  photo?: string
}

interface PortfolioItem {
  id: number
  image: string
}

interface PageData {
  hero: {
    title: string
    subtitle: string
    buttonText: string
    buttonLink: string
    image: string
  }
  about: {
    title: string
    subtitle: string
    text1: string
    text2: string
    text3: string
    image: string
  }
  social: {
    instagramLink: string
  }
  services: ServiceData[]
  courses: CourseData[]
  faq: FAQItem[]
  testimonials: Testimonial[]
  portfolio: PortfolioItem[]
  logo?: string
}

const DEFAULT_PAGE_DATA: PageData = {
  hero: {
    title: 'UNLEASH YOUR BEAUTY WITH CONFIDENCE',
    subtitle: 'Professional Makeup Services Tailored Just For You',
    buttonText: 'AGENDA TU CITA',
    buttonLink: '#services',
    image: '',
  },
  about: {
    title: '¿QUIÉN ESTÁ DETRÁS DE ANGELS BEAUTY?',
    subtitle: 'Hola! Soy Angie',
    text1: 'Maquilladora profesional de Córdoba Capital con más de siete años dedicados al mundo del maquillaje, capacitándome constantemente en maquillaje social, novias y perfeccionamientos.',
    text2: 'Mi objetivo es que te sientas cómoda, segura y radiante en tus momentos más especiales. Te acompañaré en cada paso para que brilles con confianza.',
    text3: 'Cada cliente es único y especial, por eso personalizo cada servicio según tus gustos y necesidades.',
    image: '',
  },
  social: {
    instagramLink: 'https://instagram.com',
  },
  services: [
    {
      id: 1,
      name: 'QUINCEAÑERAS 2026',
      duration: '2.5 - 3 horas',
      description: 'Maquillaje y peinado personalizado para el día más especial de tu vida.',
      image: '',
      packages: [
        { name: 'MAQUILLAJE PROFESIONAL', description: 'Maquillaje de larga duración' },
        { name: 'MAQUILLAJE + PEINADO', description: 'Maquillaje y peinado completo' },
      ],
      portfolioImages: [],
    },
    {
      id: 2,
      name: 'MAQUILLAJE SOCIAL/INVITADAS',
      duration: '01/02 hs',
      description: 'Un servicio pensado para acompañarte en eventos especiales.',
      image: '',
      packages: [
        { name: 'MAQUILLAJE PROFESIONAL', description: 'Maquillaje personalizado' },
      ],
      portfolioImages: [],
    },
    {
      id: 3,
      name: 'NOVIAS 2026',
      duration: '2 - 2.5 horas',
      description: 'Tu día especial merece un maquillaje impecable.',
      image: '',
      packages: [],
      portfolioImages: [],
    },
  ],
  courses: [
    {
      id: 1,
      name: 'PERFECCIONAMIENTOS',
      duration: '4 - 6 semanas',
      description: 'Cursos diseñados para perfeccionar técnicas específicas.',
      image: '',
      objectives: [],
      portfolioImages: [],
    },
    {
      id: 2,
      name: 'MASTERCLASS AUTOMAQUILLAJE',
      duration: '3 sesiones',
      description: 'Aprende a maquillarte profesionalmente.',
      image: '',
      objectives: [],
      portfolioImages: [],
    },
  ],
  faq: [
    {
      id: 1,
      question: '¿Cuánto tiempo antes debo agendar?',
      answer: 'Se recomienda agendar con al menos 2 semanas de anticipación.',
    },
  ],
  testimonials: [
    {
      id: 1,
      name: 'María González',
      text: '¡Fue un día mágico!',
    },
  ],
  portfolio: [],
}

const AdminPanel = ({ onLogout, onDataSaved }: AdminPanelProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [pageData, setPageData] = useState<PageData>(DEFAULT_PAGE_DATA)

  const initialized = useRef(false)

  useEffect(() => {
    loadPageData().then((data) => {
      if (data) setPageData(data)
      initialized.current = true
    })
  }, [])

  // auto-save 800ms after any change (debounced)
  useEffect(() => {
    if (!initialized.current || !isAuthenticated) return
    const timer = setTimeout(() => {
      savePageData(pageData).then(() => {
        setHasChanges(false)
        onDataSaved()
      }).catch((err: any) => {
        console.error('Auto-save error:', err)
      })
    }, 800)
    return () => clearTimeout(timer)
  }, [pageData])

  // warn before closing/refreshing with unsaved changes
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [hasChanges])

  const [editingServiceIdx, setEditingServiceIdx] = useState<number | null>(null)
  const [editingCourseIdx, setEditingCourseIdx] = useState<number | null>(null)
  const [editingPackageIdx, setEditingPackageIdx] = useState<number | null>(null)
  const [editingFaqIdx, setEditingFaqIdx] = useState<number | null>(null)
  const [editingTestimonialIdx, setEditingTestimonialIdx] = useState<number | null>(null)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (username === 'Angie2026' && password === 'Julianamaquillajeartistico') {
      setIsAuthenticated(true)
      setLoginError('')
      setUsername('')
      setPassword('')
    } else {
      setLoginError('Usuario o contraseña incorrecta')
    }
  }

  const markAsChanged = () => setHasChanges(true)

  const [uploading, setUploading] = useState(false)

  const resizeToBlob = (file: File, maxWidth = 1200): Promise<Blob> => {
    const isPng = file.type === 'image/png'
    const mimeType = isPng ? 'image/png' : 'image/jpeg'
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let { width, height } = img
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width)
            width = maxWidth
          }
          canvas.width = width
          canvas.height = height
          canvas.getContext('2d')!.drawImage(img, 0, 0, width, height)
          canvas.toBlob((blob) => resolve(blob!), mimeType, 1)
        }
        img.src = e.target?.result as string
      }
      reader.readAsDataURL(file)
    })
  }

  const uploadDirect = async (file: File, callback: (url: string) => void) => {
    setUploading(true)
    try {
      const ext = file.name.split('.').pop() || 'png'
      const fileName = `${Date.now()}_${file.name.replace(/[^a-z0-9]/gi, '_')}.${ext}`
      const url = await uploadImage(file, fileName)
      callback(url)
      markAsChanged()
    } catch (err: any) {
      alert('Error al subir: ' + (err?.message || JSON.stringify(err)))
    } finally {
      setUploading(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    resizeToBlob(file).then(async (blob) => {
      try {
        const ext = file.type === 'image/png' ? 'png' : 'jpg'
        const fileName = `${Date.now()}_${file.name.replace(/[^a-z0-9]/gi, '_')}.${ext}`
        const url = await uploadImage(blob, fileName)
        callback(url)
        markAsChanged()
      } catch (err: any) {
        alert('Error al subir: ' + (err?.message || JSON.stringify(err)))
      } finally {
        setUploading(false)
        e.target.value = ''
      }
    })
  }

  const handleSave = async () => {
    try {
      await savePageData(pageData)
      setHasChanges(false)
      onDataSaved()
      alert('Cambios guardados exitosamente')
    } catch (err: any) {
      alert('Error al guardar: ' + (err?.message || JSON.stringify(err)))
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <div className="login-container">
          <h1 className="login-title">Angels Beauty - Panel de Control</h1>
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Usuario</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingresa tu usuario"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                required
              />
            </div>
            {loginError && <p className="login-error">{loginError}</p>}
            <button type="submit" className="login-button">
              INGRESAR
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Panel de Control - Angels Beauty</h1>
        <button onClick={onLogout} className="logout-button">
          Cerrar Sesión
        </button>
      </div>

      <div className="admin-content">
        <div className="admin-sidebar">
          <h2>Secciones</h2>
          <button className={`section-button ${selectedSection === 'hero' ? 'active' : ''}`} onClick={() => setSelectedSection('hero')}>Hero</button>
          <button className={`section-button ${selectedSection === 'about' ? 'active' : ''}`} onClick={() => setSelectedSection('about')}>Sobre Mí</button>
          <button className={`section-button ${selectedSection === 'services' ? 'active' : ''}`} onClick={() => setSelectedSection('services')}>Servicios</button>
          <button className={`section-button ${selectedSection === 'courses' ? 'active' : ''}`} onClick={() => setSelectedSection('courses')}>Cursos</button>
          <button className={`section-button ${selectedSection === 'portfolio' ? 'active' : ''}`} onClick={() => setSelectedSection('portfolio')}>Portfolio</button>
          <button className={`section-button ${selectedSection === 'testimonials' ? 'active' : ''}`} onClick={() => setSelectedSection('testimonials')}>Testimonios</button>
          <button className={`section-button ${selectedSection === 'faq' ? 'active' : ''}`} onClick={() => setSelectedSection('faq')}>FAQ</button>
          <button className={`section-button ${selectedSection === 'social' ? 'active' : ''}`} onClick={() => setSelectedSection('social')}>Redes Sociales</button>
        </div>

        <div className="admin-main">
          {selectedSection === 'hero' && (
            <div className="section-editor">
              <h2>Editar Sección Hero</h2>
              <div className="form-group">
                <label>Título Principal</label>
                <textarea
                  value={pageData.hero.title}
                  onChange={(e) => {
                    setPageData({ ...pageData, hero: { ...pageData.hero, title: e.target.value } })
                    markAsChanged()
                  }}
                  rows={3}
                />
              </div>
              <div className="form-group">
                <label>Subtítulo</label>
                <input
                  type="text"
                  value={pageData.hero.subtitle}
                  onChange={(e) => {
                    setPageData({ ...pageData, hero: { ...pageData.hero, subtitle: e.target.value } })
                    markAsChanged()
                  }}
                />
              </div>
              <div className="form-group">
                <label>Texto del Botón</label>
                <input
                  type="text"
                  value={pageData.hero.buttonText}
                  onChange={(e) => {
                    setPageData({ ...pageData, hero: { ...pageData.hero, buttonText: e.target.value } })
                    markAsChanged()
                  }}
                />
              </div>
              <div className="form-group">
                <label>Link del Botón</label>
                <input
                  type="text"
                  value={pageData.hero.buttonLink}
                  onChange={(e) => {
                    setPageData({ ...pageData, hero: { ...pageData.hero, buttonLink: e.target.value } })
                    markAsChanged()
                  }}
                  placeholder="ej: #services, https://example.com"
                />
              </div>
              <div className="form-group">
                <label>Imagen de Fondo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, (image) => {
                    setPageData((prev) => ({ ...prev, hero: { ...prev.hero, image } }))
                  })}
                />
                {pageData.hero.image && <img src={pageData.hero.image} alt="Hero" className="preview-image" />}
              </div>
            </div>
          )}

          {selectedSection === 'about' && (
            <div className="section-editor">
              <h2>Editar Sección Sobre Mí</h2>
              <div className="form-group">
                <label>Título</label>
                <input type="text" value={pageData.about.title} onChange={(e) => { setPageData({ ...pageData, about: { ...pageData.about, title: e.target.value } }); markAsChanged() }} />
              </div>
              <div className="form-group">
                <label>Subtítulo (Nombre)</label>
                <input type="text" value={pageData.about.subtitle} onChange={(e) => { setPageData({ ...pageData, about: { ...pageData.about, subtitle: e.target.value } }); markAsChanged() }} />
              </div>
              <div className="form-group">
                <label>Párrafo 1</label>
                <textarea value={pageData.about.text1} onChange={(e) => { setPageData({ ...pageData, about: { ...pageData.about, text1: e.target.value } }); markAsChanged() }} rows={3} />
              </div>
              <div className="form-group">
                <label>Párrafo 2</label>
                <textarea value={pageData.about.text2} onChange={(e) => { setPageData({ ...pageData, about: { ...pageData.about, text2: e.target.value } }); markAsChanged() }} rows={3} />
              </div>
              <div className="form-group">
                <label>Párrafo 3</label>
                <textarea value={pageData.about.text3} onChange={(e) => { setPageData({ ...pageData, about: { ...pageData.about, text3: e.target.value } }); markAsChanged() }} rows={3} />
              </div>
              <div className="form-group">
                <label>Imagen</label>
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (image) => { setPageData((prev) => ({ ...prev, about: { ...prev.about, image } })) })} />
                {pageData.about.image && <img src={pageData.about.image} alt="About" className="preview-image" />}
              </div>
            </div>
          )}

          {selectedSection === 'services' && (
            <div className="section-editor">
              <h2>Editar Servicios</h2>
              {editingServiceIdx === null ? (
                <div className="items-list">
                  {pageData.services.map((service: any, idx: number) => (
                    <div key={service.id} className="item-card">
                      <h3>{service.name}</h3>
                      <div className="item-card-actions">
                        <button onClick={() => { setEditingServiceIdx(idx); setEditingPackageIdx(null) }} className="edit-button">Editar</button>
                        <button onClick={() => {
                          if (confirm(`¿Eliminar "${service.name}"?`)) {
                            setPageData((prev: any) => ({ ...prev, services: prev.services.filter((_: any, i: number) => i !== idx) }))
                            markAsChanged()
                          }
                        }} className="delete-button">Eliminar</button>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => {
                    setPageData((prev: any) => ({
                      ...prev,
                      services: [...prev.services, { id: Date.now(), name: 'Nuevo Servicio', duration: '', description: '', image: '', packages: [], portfolioImages: [] }]
                    }))
                    markAsChanged()
                  }} className="add-button">+ Nuevo Servicio</button>
                </div>
              ) : (
                <div className="item-editor">
                  <button onClick={() => setEditingServiceIdx(null)} className="back-button">← Volver a Servicios</button>
                  <div className="form-group">
                    <label>Nombre</label>
                    <input type="text" value={pageData.services[editingServiceIdx].name} onChange={(e) => { setPageData((prev: any) => { const s = prev.services.map((sv: any, i: number) => i === editingServiceIdx ? { ...sv, name: e.target.value } : sv); return { ...prev, services: s } }); markAsChanged() }} />
                  </div>
                  <div className="form-group">
                    <label>Duración</label>
                    <input type="text" value={pageData.services[editingServiceIdx].duration} onChange={(e) => { setPageData((prev: any) => { const s = prev.services.map((sv: any, i: number) => i === editingServiceIdx ? { ...sv, duration: e.target.value } : sv); return { ...prev, services: s } }); markAsChanged() }} />
                  </div>
                  <div className="form-group">
                    <label>Descripción</label>
                    <textarea value={pageData.services[editingServiceIdx].description} onChange={(e) => { setPageData((prev: any) => { const s = prev.services.map((sv: any, i: number) => i === editingServiceIdx ? { ...sv, description: e.target.value } : sv); return { ...prev, services: s } }); markAsChanged() }} rows={3} />
                  </div>
                  <div className="form-group">
                    <label>Imagen del Servicio</label>
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (image) => { setPageData((prev: any) => { const s = prev.services.map((sv: any, i: number) => i === editingServiceIdx ? { ...sv, image } : sv); return { ...prev, services: s } }) })} />
                    {pageData.services[editingServiceIdx].image && <img src={pageData.services[editingServiceIdx].image} alt="Service" className="preview-image" />}
                  </div>

                  <h3>Paquetes</h3>
                  {editingPackageIdx === null ? (
                    <div>
                      {pageData.services[editingServiceIdx].packages.map((pkg: any, pkgIdx: number) => (
                        <div key={pkgIdx} className="sub-item-card">
                          <p>{pkg.name}</p>
                          <div>
                            <button onClick={() => setEditingPackageIdx(pkgIdx)} className="edit-button">Editar</button>
                            <button onClick={() => {
                              setPageData((prev: any) => {
                                const s = prev.services.map((sv: any, i: number) => i === editingServiceIdx
                                  ? { ...sv, packages: sv.packages.filter((_: any, pi: number) => pi !== pkgIdx) }
                                  : sv)
                                return { ...prev, services: s }
                              })
                              markAsChanged()
                            }} className="delete-button">Eliminar</button>
                          </div>
                        </div>
                      ))}
                      <button onClick={() => {
                        setPageData((prev: any) => {
                          const s = prev.services.map((sv: any, i: number) => i === editingServiceIdx
                            ? { ...sv, packages: [...sv.packages, { name: 'Nuevo Paquete', description: '' }] }
                            : sv)
                          return { ...prev, services: s }
                        })
                        markAsChanged()
                      }} className="add-button">+ Agregar Paquete</button>
                    </div>
                  ) : (
                    <div className="sub-item-editor">
                      <button onClick={() => setEditingPackageIdx(null)} className="back-button">← Volver</button>
                      <div className="form-group">
                        <label>Nombre del Paquete</label>
                        <input type="text" value={pageData.services[editingServiceIdx].packages[editingPackageIdx].name} onChange={(e) => { setPageData((prev: any) => { const s = prev.services.map((sv: any, i: number) => i === editingServiceIdx ? { ...sv, packages: sv.packages.map((p: any, pi: number) => pi === editingPackageIdx ? { ...p, name: e.target.value } : p) } : sv); return { ...prev, services: s } }); markAsChanged() }} />
                      </div>
                      <div className="form-group">
                        <label>Descripción</label>
                        <textarea value={pageData.services[editingServiceIdx].packages[editingPackageIdx].description} onChange={(e) => { setPageData((prev: any) => { const s = prev.services.map((sv: any, i: number) => i === editingServiceIdx ? { ...sv, packages: sv.packages.map((p: any, pi: number) => pi === editingPackageIdx ? { ...p, description: e.target.value } : p) } : sv); return { ...prev, services: s } }); markAsChanged() }} rows={2} />
                      </div>
                    </div>
                  )}

                  <h3>Portfolio del Servicio</h3>
                  <div className="portfolio-upload">
                    {pageData.services[editingServiceIdx].portfolioImages.map((img: any, pIdx: number) => (
                      <div key={img.id} className="portfolio-item">
                        {img.image && <img src={img.image} alt={`Portfolio ${pIdx}`} />}
                        <button onClick={() => {
                          setPageData((prev: any) => {
                            const s = prev.services.map((sv: any, i: number) => i === editingServiceIdx
                              ? { ...sv, portfolioImages: sv.portfolioImages.filter((_: any, pi: number) => pi !== pIdx) }
                              : sv)
                            return { ...prev, services: s }
                          })
                          markAsChanged()
                        }} className="delete-button portfolio-delete">✕</button>
                      </div>
                    ))}
                  </div>
                  <label className="upload-label">
                    + Agregar foto al portfolio
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (image) => { setPageData((prev: any) => { const s = prev.services.map((sv: any, i: number) => i === editingServiceIdx ? { ...sv, portfolioImages: [...sv.portfolioImages, { id: Date.now(), image }] } : sv); return { ...prev, services: s } }) })} />
                  </label>
                </div>
              )}
            </div>
          )}

          {selectedSection === 'courses' && (
            <div className="section-editor">
              <h2>Editar Cursos</h2>
              {editingCourseIdx === null ? (
                <div className="items-list">
                  {pageData.courses.map((course: any, idx: number) => (
                    <div key={course.id} className="item-card">
                      <h3>{course.name}</h3>
                      <div className="item-card-actions">
                        <button onClick={() => setEditingCourseIdx(idx)} className="edit-button">Editar</button>
                        <button onClick={() => {
                          if (confirm(`¿Eliminar "${course.name}"?`)) {
                            setPageData((prev: any) => ({ ...prev, courses: prev.courses.filter((_: any, i: number) => i !== idx) }))
                            markAsChanged()
                          }
                        }} className="delete-button">Eliminar</button>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => {
                    setPageData((prev: any) => ({
                      ...prev,
                      courses: [...prev.courses, { id: Date.now(), name: 'Nuevo Curso', duration: '', description: '', image: '', objectives: [], portfolioImages: [] }]
                    }))
                    markAsChanged()
                  }} className="add-button">+ Nuevo Curso</button>
                </div>
              ) : (
                <div className="item-editor">
                  <button onClick={() => setEditingCourseIdx(null)} className="back-button">← Volver a Cursos</button>
                  <div className="form-group">
                    <label>Nombre</label>
                    <input type="text" value={pageData.courses[editingCourseIdx].name} onChange={(e) => { setPageData((prev: any) => { const c = prev.courses.map((cv: any, i: number) => i === editingCourseIdx ? { ...cv, name: e.target.value } : cv); return { ...prev, courses: c } }); markAsChanged() }} />
                  </div>
                  <div className="form-group">
                    <label>Duración</label>
                    <input type="text" value={pageData.courses[editingCourseIdx].duration} onChange={(e) => { setPageData((prev: any) => { const c = prev.courses.map((cv: any, i: number) => i === editingCourseIdx ? { ...cv, duration: e.target.value } : cv); return { ...prev, courses: c } }); markAsChanged() }} />
                  </div>
                  <div className="form-group">
                    <label>Descripción</label>
                    <textarea value={pageData.courses[editingCourseIdx].description} onChange={(e) => { setPageData((prev: any) => { const c = prev.courses.map((cv: any, i: number) => i === editingCourseIdx ? { ...cv, description: e.target.value } : cv); return { ...prev, courses: c } }); markAsChanged() }} rows={3} />
                  </div>
                  <div className="form-group">
                    <label>Imagen del Curso</label>
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (image) => { setPageData((prev: any) => { const c = prev.courses.map((cv: any, i: number) => i === editingCourseIdx ? { ...cv, image } : cv); return { ...prev, courses: c } }) })} />
                    {pageData.courses[editingCourseIdx].image && <img src={pageData.courses[editingCourseIdx].image} alt="Course" className="preview-image" />}
                  </div>

                  <h3>Portfolio de Trabajos de Alumnos</h3>
                  <div className="portfolio-upload">
                    {pageData.courses[editingCourseIdx].portfolioImages.map((img: any, pIdx: number) => (
                      <div key={img.id} className="portfolio-item">
                        {img.image && <img src={img.image} alt={`Portfolio ${pIdx}`} />}
                        <button onClick={() => {
                          setPageData((prev: any) => {
                            const c = prev.courses.map((cv: any, i: number) => i === editingCourseIdx
                              ? { ...cv, portfolioImages: cv.portfolioImages.filter((_: any, pi: number) => pi !== pIdx) }
                              : cv)
                            return { ...prev, courses: c }
                          })
                          markAsChanged()
                        }} className="delete-button portfolio-delete">✕</button>
                      </div>
                    ))}
                  </div>
                  <label className="upload-label">
                    + Agregar foto al portfolio
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (image) => { setPageData((prev: any) => { const c = prev.courses.map((cv: any, i: number) => i === editingCourseIdx ? { ...cv, portfolioImages: [...cv.portfolioImages, { id: Date.now(), image }] } : cv); return { ...prev, courses: c } }) })} />
                  </label>
                </div>
              )}
            </div>
          )}

          {selectedSection === 'portfolio' && (
            <div className="section-editor">
              <h2>Portfolio General</h2>
              <div className="portfolio-upload">
                {pageData.portfolio.map((item: any, idx: number) => (
                  <div key={item.id} className="portfolio-item">
                    {item.image && <img src={item.image} alt={`Portfolio ${idx}`} />}
                    <button onClick={() => {
                      setPageData((prev: any) => ({ ...prev, portfolio: prev.portfolio.filter((_: any, i: number) => i !== idx) }))
                      markAsChanged()
                    }} className="delete-button portfolio-delete">✕</button>
                  </div>
                ))}
              </div>
              <label className="upload-label">
                + Agregar foto al portfolio
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (image) => { setPageData((prev: any) => ({ ...prev, portfolio: [...prev.portfolio, { id: Date.now(), image }] })) })} />
              </label>
            </div>
          )}

          {selectedSection === 'testimonials' && (
            <div className="section-editor">
              <h2>Testimonios</h2>
              {editingTestimonialIdx === null ? (
                <div className="items-list">
                  {pageData.testimonials.map((testimonial: any, idx: number) => (
                    <div key={testimonial.id} className="item-card">
                      <h3>{testimonial.name}</h3>
                      <div className="item-card-actions">
                        <button onClick={() => setEditingTestimonialIdx(idx)} className="edit-button">Editar</button>
                        <button onClick={() => { setPageData((prev: any) => ({ ...prev, testimonials: prev.testimonials.filter((_: any, i: number) => i !== idx) })); markAsChanged() }} className="delete-button">Eliminar</button>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => { setPageData((prev: any) => ({ ...prev, testimonials: [...prev.testimonials, { id: Date.now(), name: 'Nuevo', text: '', photo: '' }] })); markAsChanged() }} className="add-button">+ Agregar Testimonio</button>
                </div>
              ) : (
                <div className="item-editor">
                  <button onClick={() => setEditingTestimonialIdx(null)} className="back-button">← Volver</button>
                  <div className="form-group">
                    <label>Nombre</label>
                    <input type="text" value={pageData.testimonials[editingTestimonialIdx].name} onChange={(e) => { setPageData((prev: any) => { const t = prev.testimonials.map((tv: any, i: number) => i === editingTestimonialIdx ? { ...tv, name: e.target.value } : tv); return { ...prev, testimonials: t } }); markAsChanged() }} />
                  </div>
                  <div className="form-group">
                    <label>Texto</label>
                    <textarea value={pageData.testimonials[editingTestimonialIdx].text} onChange={(e) => { setPageData((prev: any) => { const t = prev.testimonials.map((tv: any, i: number) => i === editingTestimonialIdx ? { ...tv, text: e.target.value } : tv); return { ...prev, testimonials: t } }); markAsChanged() }} rows={4} />
                  </div>
                  <div className="form-group">
                    <label>Foto (opcional)</label>
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (photo) => { setPageData((prev: any) => { const t = prev.testimonials.map((tv: any, i: number) => i === editingTestimonialIdx ? { ...tv, photo } : tv); return { ...prev, testimonials: t } }) })} />
                    {pageData.testimonials[editingTestimonialIdx].photo && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                        <img src={pageData.testimonials[editingTestimonialIdx].photo} alt="Foto" className="preview-image" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }} />
                        <button onClick={() => { setPageData((prev: any) => { const t = prev.testimonials.map((tv: any, i: number) => i === editingTestimonialIdx ? { ...tv, photo: '' } : tv); return { ...prev, testimonials: t } }); markAsChanged() }} className="delete-button">Quitar foto</button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {selectedSection === 'faq' && (
            <div className="section-editor">
              <h2>Preguntas Frecuentes</h2>
              {editingFaqIdx === null ? (
                <div className="items-list">
                  {pageData.faq.map((item, idx) => (
                    <div key={item.id} className="item-card">
                      <h3>{item.question}</h3>
                      <button onClick={() => setEditingFaqIdx(idx)} className="edit-button">Editar</button>
                      <button onClick={() => { setPageData({ ...pageData, faq: pageData.faq.filter((_, i) => i !== idx) }); markAsChanged() }} className="delete-button">Eliminar</button>
                    </div>
                  ))}
                  <button onClick={() => { setPageData({ ...pageData, faq: [...pageData.faq, { id: Date.now(), question: '', answer: '' }] }); markAsChanged() }} className="add-button">+ Agregar Pregunta</button>
                </div>
              ) : (
                <div className="item-editor">
                  <button onClick={() => setEditingFaqIdx(null)} className="back-button">← Volver</button>
                  <div className="form-group">
                    <label>Pregunta</label>
                    <input type="text" value={pageData.faq[editingFaqIdx].question} onChange={(e) => { const newFaq = [...pageData.faq]; newFaq[editingFaqIdx].question = e.target.value; setPageData({ ...pageData, faq: newFaq }); markAsChanged() }} />
                  </div>
                  <div className="form-group">
                    <label>Respuesta</label>
                    <textarea value={pageData.faq[editingFaqIdx].answer} onChange={(e) => { const newFaq = [...pageData.faq]; newFaq[editingFaqIdx].answer = e.target.value; setPageData({ ...pageData, faq: newFaq }); markAsChanged() }} rows={4} />
                  </div>
                </div>
              )}
            </div>
          )}

          {selectedSection === 'social' && (
            <div className="section-editor">
              <h2>Redes Sociales y Enlaces</h2>
              <div className="form-group">
                <label>Logo de la Navbar</label>
                <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadDirect(f, (url) => setPageData((prev: any) => ({ ...prev, logo: url }))); e.target.value = '' }} />
                {pageData.logo && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                    <img src={pageData.logo} alt="Logo" style={{ height: 50, objectFit: 'contain', background: '#f5f0e8', padding: '4px', borderRadius: '4px' }} />
                    <button onClick={() => { setPageData((prev: any) => ({ ...prev, logo: '' })); markAsChanged() }} className="delete-button">Quitar logo</button>
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>Link de Instagram</label>
                <input
                  type="text"
                  value={pageData.social.instagramLink}
                  onChange={(e) => {
                    setPageData({ ...pageData, social: { instagramLink: e.target.value } })
                    markAsChanged()
                  }}
                  placeholder="ej: https://instagram.com/angelbeauty"
                />
              </div>
            </div>
          )}

          {!selectedSection && (
            <div className="no-section">
              <p>Selecciona una sección para comenzar a editar</p>
            </div>
          )}
        </div>
      </div>

      {uploading && (
        <div className="uploading-indicator">Subiendo imagen...</div>
      )}
      {hasChanges && !uploading && (
        <button className="save-button-floating" onClick={handleSave}>
          💾 Guardar Cambios
        </button>
      )}
    </div>
  )
}

export default AdminPanel
