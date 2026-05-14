// Single-block deep-dive — full-width render of one block with the
// current brand's defaults injected, plus the field/usage panel on the
// right.

import { Link, useParams, useNavigate } from 'react-router-dom'
import { Button } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'

import { PageStudioRender } from '@techrox/page-studio-renderer'
import { getCatalog } from '../data/blockCatalog.js'

// Puck's <Render> does not auto-apply defaultProps — those only fire when
// a block is inserted via the editor's drawer. To get a populated preview
// here, pull the resolved defaults straight off the config and seed them
// as the block's props.
function singleBlockData(name, blockConfig) {
  const defaults = blockConfig?.components?.[name]?.defaultProps || {}
  return {
    root: { props: { title: name } },
    content: [{ type: name, props: { ...defaults } }],
    zones: {},
  }
}

export default function BlockShowcase({ studio, blockConfig }) {
  const { name } = useParams()
  const navigate = useNavigate()
  const entry = getCatalog().find((b) => b.name === name)

  if (!entry) {
    return (
      <div style={{ padding: 48 }}>
        <h2>Unknown block: {name}</h2>
        <Link to="/blocks">← Back to gallery</Link>
      </div>
    )
  }

  return (
    <div className="block-showcase">
      <div className="block-showcase-render">
        <div style={{ padding: '12px 24px 0' }}>
          <Button size="small" icon={<ArrowLeftOutlined />} onClick={() => navigate('/blocks')}>
            All blocks
          </Button>
        </div>
        <div className="block-showcase-render-frame">
          <PageStudioRender data={singleBlockData(entry.name, blockConfig)} config={blockConfig} studio={studio} />
        </div>
      </div>
      <aside className="block-showcase-meta">
        <div className="tag">{entry.category}</div>
        <h3>{entry.name}</h3>
        <p style={{ margin: '6px 0 0', color: 'var(--tps-ink)', fontSize: 14 }}>{entry.summary}</p>

        <dl>
          <dt>Fields</dt>
          <dd>
            <ul className="block-showcase-fields">
              {entry.fields.map(([n, t]) => (
                <li key={n}>
                  <code>{n}</code> <small>{t}</small>
                </li>
              ))}
            </ul>
          </dd>

          {entry.when && (
            <>
              <dt>When to use</dt>
              <dd>{entry.when}</dd>
            </>
          )}

          {entry.tips && entry.tips.length > 0 && (
            <>
              <dt>Tips</dt>
              <dd>
                <ul style={{ paddingLeft: 18, margin: 0 }}>
                  {entry.tips.map((tip, i) => (
                    <li key={i} style={{ marginBottom: 4 }}>
                      {tip}
                    </li>
                  ))}
                </ul>
              </dd>
            </>
          )}
        </dl>
      </aside>
    </div>
  )
}
