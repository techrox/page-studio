// Brand switcher — the top-right control that swaps between Techrox,
// Neutral, Lumin Labs, and Acme Co. Toggling it updates the active brand
// on the App, which re-keys the renderer tree so blocks pick up the new
// defaults.

import { Segmented, Tooltip } from 'antd'

export default function BrandSwitcher({ brands, current, onChange }) {
  return (
    <Tooltip title="Each brand passes a different `blockDefaults` to the renderer/editor — same pages, different copy.">
      <Segmented
        size="small"
        value={current}
        onChange={onChange}
        options={brands.map((b) => ({ label: b.name, value: b.id }))}
      />
    </Tooltip>
  )
}
