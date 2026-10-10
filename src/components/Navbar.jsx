import BrandLogo from './BrandLogo'
import { useEffect, useRef, useState } from 'react'
import { farmContent } from '../content/farm'
import { pages } from '../content/navigation'
const Navbar = ({ activePage = 'home' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const toggle = useRef(null)
  useEffect(() => {
    const query = window.matchMedia('(min-width: 1000px)')
    const close = () => { if (query.matches) setIsMenuOpen(false) }
    query.addEventListener('change', close)
    return () => query.removeEventListener('change', close)
  }, [])
  const navigationLinks = pages.map(({ name, href, key }) => <li key={key}><a aria-current={activePage === key ? 'page' : undefined} href={href} onClick={() => setIsMenuOpen(false)}>{name}</a></li>)
  return <header className="site-header"><nav className="section-shell navigation" aria-label="Main navigation" onKeyDown={event => { if (event.key === 'Escape' && isMenuOpen) { setIsMenuOpen(false); toggle.current?.focus() } }}>
    <a className="brand" href="/" aria-label={`${farmContent.name} home`}><BrandLogo responsive /></a>
    <ul className="desktop-links">{navigationLinks}</ul>
    <button ref={toggle} id="menu-toggle" type="button" className="menu-toggle" aria-label={isMenuOpen ? 'Close menu' : 'Open menu'} aria-expanded={isMenuOpen} aria-controls="mobile-menu" onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? 'Close' : 'Menu'} <span aria-hidden="true">{isMenuOpen ? '×' : '☰'}</span></button>
    {isMenuOpen && <ul id="mobile-menu" className="mobile-links">{navigationLinks}</ul>}
  </nav></header>
}
export default Navbar
