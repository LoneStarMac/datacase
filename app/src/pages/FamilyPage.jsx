import { Link, useParams } from 'react-router-dom'
import { useEngines, getMaxPower } from '../hooks/useEngines'

export default function FamilyPage() {
  const { manufacturer } = useParams()
  const engines = useEngines()

  const family = engines.filter(e =>
    e.manufacturer?.toLowerCase().replace(/[^a-z0-9]/g, '') === manufacturer
  )

  if (!family.length) {
    return (
      <div>
        <div className="breadcrumb">
          <Link to="/">home</Link>
          <span className="breadcrumb-sep">/</span>
          <span>not found</span>
        </div>
        <p style={{ color: 'var(--color-neon-pink)' }}>No engines found for this manufacturer.</p>
      </div>
    )
  }

  const mfrName = family[0].manufacturer

  return (
    <>
      <div className="breadcrumb">
        <Link to="/">home</Link>
        <span className="breadcrumb-sep">/</span>
        <span style={{ color: 'var(--color-text)' }}>{mfrName}</span>
      </div>

      <h1 className="page-title">{mfrName}</h1>
      <p className="page-subtitle">{family.length} engine{family.length !== 1 ? 's' : ''} indexed</p>

      <div className="engine-grid">
        {family.map(engine => {
          const power = getMaxPower(engine)
          const mfrSlug = engine.manufacturer.toLowerCase().replace(/[^a-z0-9]/g, '')
          const codeSlug = engine.code.toLowerCase().replace(/[^a-z0-9-]/g, '')
          return (
            <Link key={engine._id} to={`/engine/${mfrSlug}/${codeSlug}`} className="engine-card">
              <div className="engine-card-code">{engine.code}</div>
              <div className="engine-card-disp">
                {(engine.displacement_cc / 1000).toFixed(1)}L
                {' '}
                {engine.configuration
                  ? `${engine.configuration}-${engine.cylinders}`
                  : `${engine.cylinders}cyl`}
              </div>
              {power && <div className="engine-card-power">{power} hp</div>}
            </Link>
          )
        })}
      </div>
    </>
  )
}
