// Page view — renders one sample page via PageStudioRender, with the
// brand's block defaults baked into the Puck config.

import { useParams, Link } from 'react-router-dom'
import { Button } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'

import { PageStudioRender } from '@techrox/page-studio-renderer'

export default function PageView({ pages, studio, blockConfig }) {
  const { slug } = useParams()
  const page = pages.find((p) => p.slug === slug)
  if (!page) {
    return (
      <div style={{ padding: 48 }}>
        <h2>Unknown page: {slug}</h2>
        <Link to="/pages">← Back to pages</Link>
      </div>
    )
  }
  return (
    <>
      <div style={{ padding: '12px 24px 0' }}>
        <Link to="/pages">
          <Button size="small" icon={<ArrowLeftOutlined />}>
            All pages
          </Button>
        </Link>
      </div>
      <article>
        <PageStudioRender data={page.data} config={blockConfig} studio={studio} />
      </article>
    </>
  )
}
