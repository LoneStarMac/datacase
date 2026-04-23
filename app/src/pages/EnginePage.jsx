import { useParams, Link } from 'react-router-dom'
import { useEngines, getMaxPower } from '../hooks/useEngines'

function SpecItem({ label, value, highlight }) {
  if (!value && value !== 0) return null
  return (
    <div className="spec-item">
      <div className="spec-label">{label}</div>
      <div className={`spec-value${highlight ? ' highlight' : ''}`}>{value}</div>
    </div>
  )
}

function TagBadge({ tag }) {
  let cls = 'tag'
  if (tag.includes('junkyard')) cls = 'tag junkyard'
  else if (tag.includes('performance') || tag.includes('track')) cls = 'tag performance'
  else if (tag.includes('swap')) cls = 'tag swap'
  return <span className={cls}>{tag.replace(/_/g, ' ')}</span>
}

export default function EnginePage() {
  const { manufacturer, code } = useParams()
  const engines = useEngines()

  const engine = engines.find(e =>
    e.manufacturer?.toLowerCase().replace(/[^a-z0-9]/g, '') === manufacturer &&
    e.code?.toLowerCase().replace(/[^a-z0-9-]/g, '') === code
  )

  if (!engine) {
    return (
      <div>
        <div className="breadcrumb">
          <Link to="/">home</Link>
          <span className="breadcrumb-sep">/</span>
          <span>not found</span>
        </div>
        <p style={{ color: 'var(--color-neon-pink)' }}>Engine not found.</p>
      </div>
    )
  }

  const maxPower = getMaxPower(engine)

  return (
    <>
      <div className="breadcrumb">
        <Link to="/">home</Link>
        <span className="breadcrumb-sep">/</span>
        <span>{engine.manufacturer}</span>
        <span className="breadcrumb-sep">/</span>
        <span style={{ color: 'var(--color-text)' }}>{engine.code}</span>
      </div>

      <div className="engine-detail">
        <div className="engine-detail-title">{engine.code}</div>
        <div className="engine-detail-subtitle">
          {engine.manufacturer} &mdash; {(engine.displacement_cc / 1000).toFixed(1)}L
          {' '}
          {engine.configuration ? `${engine.configuration}-${engine.cylinders}` : `${engine.cylinders}-cylinder`}
          {engine.turbocharged ? ' · Turbocharged' : ''}
          {engine.supercharged ? ' · Supercharged' : ''}
        </div>

        <div className="section-heading mt-2">Core Specs</div>
        <div className="spec-grid">
          <SpecItem label="Displacement" value={`${engine.displacement_cc} cc`} highlight />
          <SpecItem label="Cylinders" value={engine.cylinders} />
          <SpecItem label="Configuration" value={engine.configuration} />
          <SpecItem label="Bore × Stroke" value={engine.bore_mm && engine.stroke_mm ? `${engine.bore_mm} × ${engine.stroke_mm} mm` : null} />
          <SpecItem label="Valves / Cyl" value={engine.valves_per_cyl} />
          <SpecItem label="Block Material" value={engine.block_material} />
          <SpecItem label="Head Material" value={engine.head_material} />
          <SpecItem label="Crank Type" value={engine.crank_type} />
          {maxPower && <SpecItem label="Peak Power" value={`${maxPower} hp`} highlight />}
        </div>

        {engine.dimensions && (
          <>
            <div className="section-heading mt-3">Dimensions &amp; Weight</div>
            <div className="spec-grid">
              <SpecItem label="Length" value={engine.dimensions.length_mm ? `${engine.dimensions.length_mm} mm` : null} />
              <SpecItem label="Width" value={engine.dimensions.width_mm ? `${engine.dimensions.width_mm} mm` : null} />
              <SpecItem label="Height" value={engine.dimensions.height_mm ? `${engine.dimensions.height_mm} mm` : null} />
              <SpecItem label="Wet Weight" value={engine.dimensions.weight_kg ? `${engine.dimensions.weight_kg} kg` : null} />
              <SpecItem label="Dry Weight" value={engine.dimensions.weight_dry_kg ? `${engine.dimensions.weight_dry_kg} kg` : null} />
            </div>
          </>
        )}

        {(engine.bellhousing_pattern || engine.engine_mount_style || engine.oilpan_orientation) && (
          <>
            <div className="section-heading mt-3">Swap Info</div>
            <div className="spec-grid">
              <SpecItem label="Bellhousing Pattern" value={engine.bellhousing_pattern} />
              <SpecItem label="Mount Style" value={engine.engine_mount_style} />
              <SpecItem label="Oil Pan" value={engine.oilpan_orientation} />
            </div>
          </>
        )}

        {engine.swap_tags?.length > 0 && (
          <div className="mt-2">
            <div className="spec-label mb-1">Tags</div>
            <div className="tag-list">
              {engine.swap_tags.map(t => <TagBadge key={t} tag={t} />)}
            </div>
          </div>
        )}

        {engine.notes && (
          <div className="mt-3" style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', lineHeight: '1.7' }}>
            <div className="spec-label mb-1">Notes</div>
            {engine.notes}
          </div>
        )}

        {engine.applications?.length > 0 && (
          <>
            <div className="section-heading mt-3">Applications</div>
            <table className="app-table">
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Market</th>
                  <th>Compression</th>
                  <th>Power (hp)</th>
                  <th>Power RPM</th>
                  <th>Torque (lb-ft)</th>
                  <th>Torque RPM</th>
                  <th>Redline</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {engine.applications.map((app, i) => (
                  <tr key={i}>
                    <td>{app.Application}</td>
                    <td>{app.Mkt || '—'}</td>
                    <td>{app.Comp || '—'}</td>
                    <td className="power-cell">{app.Power || '—'}</td>
                    <td>{app['Power RPM'] ? `${app['Power RPM'].toLocaleString()}` : '—'}</td>
                    <td className="torque-cell">{app.Torque || '—'}</td>
                    <td>{app['Torque RPM'] ? `${app['Torque RPM'].toLocaleString()}` : '—'}</td>
                    <td>{app.Redline ? `${app.Redline.toLocaleString()}` : '—'}</td>
                    <td>{app.Addl || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </>
  )
}
