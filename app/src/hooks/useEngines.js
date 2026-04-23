import { useState, useEffect } from 'react'

// Engine files are served as static JSON from the data directory.
// Vite imports them eagerly via glob import at build time.
// Glob pattern resolved via vite alias (see vite.config.js)
const engineModules = import.meta.glob('/../../data/engines/*.json', { eager: true, import: 'default' })

function parseEngines() {
  const engines = []
  for (const [filePath, data] of Object.entries(engineModules)) {
    if (!data) continue
    // Derive a stable id from the file path, e.g. "gm.lm7"
    const filename = filePath.split('/').pop().replace('.json', '')
    engines.push({ ...data, _id: filename })
  }
  return engines
}

let _cache = null

export function useEngines() {
  const [engines] = useState(() => {
    if (!_cache) _cache = parseEngines()
    return _cache
  })
  return engines
}

export function useEngine(manufacturer, code) {
  const engines = useEngines()
  return engines.find(
    e =>
      e.manufacturer?.toLowerCase().replace(/[^a-z0-9]/g, '') ===
        manufacturer.toLowerCase() &&
      e.code?.toLowerCase().replace(/[^a-z0-9]/g, '') === code.toLowerCase()
  ) || null
}

export function groupByManufacturer(engines) {
  const groups = {}
  for (const engine of engines) {
    const mfr = engine.manufacturer || 'Unknown'
    if (!groups[mfr]) groups[mfr] = []
    groups[mfr].push(engine)
  }
  return groups
}

export function getMaxPower(engine) {
  if (!engine.applications?.length) return null
  const powers = engine.applications
    .map(a => parseFloat(a.Power))
    .filter(p => !isNaN(p))
  return powers.length ? Math.max(...powers) : null
}
