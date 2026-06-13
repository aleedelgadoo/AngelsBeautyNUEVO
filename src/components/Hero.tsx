import './Hero.css'

interface HeroData {
  title: string
  subtitle: string
  buttonText: string
  buttonLink: string
  image: string
}

interface HeroProps {
  heroData?: HeroData
}

const Hero = ({ heroData }: HeroProps) => {
  const defaultData: HeroData = {
    title: 'UNLEASH YOUR BEAUTY WITH CONFIDENCE',
    subtitle: 'Professional Makeup Services Tailored Just For You',
    buttonText: 'AGENDA TU CITA',
    buttonLink: '#services',
    image: '',
  }

  const data = heroData || defaultData

  const handleButtonClick = () => {
    if (data.buttonLink.startsWith('#')) {
      const element = document.getElementById(data.buttonLink.substring(1))
      element?.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.location.href = data.buttonLink
    }
  }

  return (
    <section
      className="hero"
      id="hero"
      style={data.image ? { backgroundImage: `url(${data.image})`, backgroundSize: 'cover', backgroundPosition: '50% 15%' } : undefined}
    >
      <div className="hero-content">
        <h1 className="hero-title">{data.title}</h1>
        <p className="hero-subtitle">{data.subtitle}</p>
        <button className="hero-button" onClick={handleButtonClick}>
          {data.buttonText}
        </button>
      </div>
      <div className="hero-background"></div>
    </section>
  )
}

export default Hero
