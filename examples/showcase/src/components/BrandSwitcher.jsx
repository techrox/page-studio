// Brand switcher — colored chips that swap between Techrox, Neutral,
// Lumin Labs, and Acme Co. Toggling updates the active brand on App,
// which re-keys the renderer/editor tree so blocks pick up new defaults.
//
// Two layouts:
//   - `inline` (default): horizontal row used in the topbar. Names hide
//     under 600 px so the chips collapse to colored dots.
//   - `stacked`: vertical list used inside the off-canvas mobile drawer
//     so the full brand name is always visible alongside the swatch.

import { Tooltip } from 'antd'

export default function BrandSwitcher({ brands, current, onChange, layout = 'inline' }) {
  return (
    <div
      className={`brand-switcher brand-switcher--${layout}`}
      role="radiogroup"
      aria-label="Brand defaults"
    >
      {brands.map((b) => {
        const isActive = b.id === current
        return (
          <Tooltip key={b.id} title={b.name} placement={layout === 'stacked' ? 'right' : 'bottom'}>
            <button
              type="button"
              role="radio"
              aria-checked={isActive}
              aria-label={b.name}
              className={`brand-chip${isActive ? ' is-active' : ''}`}
              style={{ '--brand-chip-color': b.primaryColor }}
              onClick={() => onChange(b.id)}
            >
              <span className="brand-chip-dot" aria-hidden="true" />
              <span className="brand-chip-label">{b.name}</span>
            </button>
          </Tooltip>
        )
      })}
    </div>
  )
}
