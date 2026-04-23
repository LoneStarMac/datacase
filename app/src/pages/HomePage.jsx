import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useEngines, groupByManufacturer, getMaxPower } from '../hooks/useEngines'

// Tag color class mapping
function tagClass(tag) {
  if (tag.includes('junkyard')) return 'tag junkyard'
  if (tag.includes('performance') || tag.includes('track')) return 'tag performance'
  if (tag.includes('swap') || tag.includes('ls_swap')) return 'tag swap'
  return 'tag'
}

function EngineCard({ engine }) {
  const power = getMaxPower(engine)
  const mfrSlug = engine.manufacturer.toLowerCase().replace(/[^a-z0-9]/g, '')
  const codeSlug = engine.code.toLowerCase().replace(/[^a-z0-9-]/g, '')

  return (
    <Link
      to={`/engine/${mfrSlug}/${codeSlug}`}
      className="engine-card"
    >
      <div className="engine-card-code">{engine.code}</div>
      <div className="engine-card-disp">
        {(engine.displacement_cc / 1000).toFixed(1)}L
        {' '}
        {engine.configuration ? `${engine.configuration}-${engine.cylinders}` : `${engine.cylinders}cyl`}
      </div>
      {power && <div className="engine-card-power">{power} hp</div>}
    </Link>
  )
}

function FamilySection({ manufacturer, engines }) {
  const mfrSlug = manufacturer.toLowerCase().replace(/[^a-z0-9]/g, '')
  return (
    <section className="mt-3">
      <div className="section-heading">
        <span>{manufacturer}</span>
        <span style={{ color: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
          {engines.length} engine{engines.length !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="engine-grid">
        {engines.map(e => <EngineCard key={e._id} engine={e} />)}
      </div>
    </section>
  )
}

export default function HomePage() {
  const engines = useEngines()
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  const filtered = useMemo(() => {
    if (!query) return engines
    const q = query.toLowerCase()
    return engines.filter(e =>
      e.code?.toLowerCase().includes(q) ||
      e.manufacturer?.toLowerCase().includes(q) ||
      e.notes?.toLowerCase().includes(q) ||
      e.swap_tags?.some(t => t.toLowerCase().includes(q)) ||
      e.applications?.some(a => a.Application?.toLowerCase().includes(q))
    )
  }, [engines, query])

  const grouped = useMemo(() => groupByManufacturer(filtered), [filtered])
  const families = Object.keys(grouped).sort()

  return (
    <>
      <h1 className="page-title insert-cursor">datakase</h1>
      <p className="page-subtitle">
        The open engine spec &amp; swap reference. {engines.length} engines indexed.
      </p>

      {query && (
        <p className="page-subtitle" style={{ color: 'var(--color-neon-yellow)' }}>
          &rarr; {filtered.length} result{filtered.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
        </p>
      )}

      {families.length === 0 && (
        <p style={{ color: 'var(--color-text-muted)' }}>No engines match that search.</p>
      )}

      {families.map(mfr => (
        <FamilySection
          key={mfr}
          manufacturer={mfr}
          engines={grouped[mfr]}
        />
      ))}
    </>
  )
}
