// Live editor view — full PageStudio mounted with the home-page Puck data
// preloaded. Saves to in-memory state (no backend) and shows a toast.
//
// We deliberately do NOT key PageStudio by brandId. A key swap forces a
// full Puck remount (new iframe, new dnd-kit context, full sidebar paint)
// which makes brand switching feel sluggish — 500ms-plus on first switch.
// Since PageStudio writes brand CSS vars synchronously during render, a
// brand change now flows through as a single CSS-var write and an Ant
// theme refresh, with no remount cost. Trade-off: blocks the author has
// already placed keep the prop values they were given on first mount;
// only their colours follow the new brand. For the showcase that's the
// desired behaviour anyway — we want fast feedback.

import { useState } from 'react'
import { App as AntdApp } from 'antd'

import { PageStudio } from '@techrox/page-studio'
import '@techrox/page-studio/styles.css'
import '@techrox/page-studio-blocks/styles.css'

import RouterLink from './RouterLink.jsx'

export default function EditorView({ initialData, studio, branding, blockDefaults }) {
  const { message } = AntdApp.useApp()
  const [savedData, setSavedData] = useState(initialData)

  return (
    <div className="editor-shell">
      <PageStudio
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
