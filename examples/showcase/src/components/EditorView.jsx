// Live editor view — full PageStudio mounted with the home-page Puck data
// preloaded. Saves to in-memory state (no backend) and shows a toast.
//
// The `key` on PageStudio is intentional: when the brand changes we want a
// fresh editor with the new defaults pre-applied to any blocks the author
// hasn't touched. Without the key, switching brands mid-edit would keep
// the existing block defaults baked in.

import { useState } from 'react'
import { App as AntdApp } from 'antd'

import { PageStudio } from '@techrox/page-studio'
import '@techrox/page-studio/styles.css'
import '@techrox/page-studio-blocks/styles.css'

import RouterLink from './RouterLink.jsx'

export default function EditorView({ initialData, studio, branding, blockDefaults, brandId }) {
  const { message } = AntdApp.useApp()
  const [savedData, setSavedData] = useState(initialData)

  return (
    <div className="editor-shell">
      <PageStudio
        key={brandId}
        pageKey="showcase-home"
        pageTitle="Showcase / Home"
        initialData={savedData}
        branding={branding}
        blockDefaults={blockDefaults}
        LinkComponent={RouterLink}
        studio={studio}
        adapter={{
          savePage: async (_key, data) => {
            setSavedData(data)
            message.success('Saved (in-memory only — no backend wired).')
          },
        }}
        homeHref="/"
        account={{ name: 'Demo user', email: 'demo@example.com' }}
      />
    </div>
  )
}
