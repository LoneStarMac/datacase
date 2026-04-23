import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
// Logo path resolved via vite alias (see vite.config.js)
import logoSvg from '/data-root/docs/img/crank-case-logo.svg'

export default function Layout() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  function handleSearch(e) {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <div className="app-layout">
      <header className="site-header">
        {/* Logo zone — owner replaces with branding */}
        <Link to="/" className="site-logo">
          <img src={logoSvg} alt="datakase" onError={e => { e.target.style.display='none' }} />
          <span className="site-logo-text" style={{ display: 'none' }}>datakase</span>
        </Link>

        <nav className="site-nav">
          <NavLink to="/" end>Engines</NavLink>
          <NavLink to="/swap-builder">Swap Builder</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>

        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="search"
            placeholder="search engines..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </form>
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="site-footer">
        datakase &mdash; open engine specs &amp; swap data &mdash; github.com/LoneStarMac/datacase
      </footer>
    </div>
  )
}
