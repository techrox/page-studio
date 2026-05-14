# @techrox/page-studio-form

Schema-driven structured-form page editor for admin CMS UIs. Companion to
[`@techrox/page-studio`](../editor) (the Puck visual builder). Both packages
edit the same page record; they differ in surface area:

- **page-studio** — drag-and-drop visual builder, for marketing pages where
  block layout matters.
- **page-studio-form** — typed fields per page key (hero, summary, deliverables,
  pricing rows…), for content-shaped pages where layout is fixed and only the
  copy changes.

## What you get

- `<PageStudioForm />` — full admin shell: title, publish toggle, tabbed
  content / SEO / preview / history panes.
- `<RichText />` — Notion-style WYSIWYG with toolbar, bubble menu, table
  editing, callouts, columns, image upload.
- `<HistoryPanel />` — revision viewer with side-by-side diff + one-click
  restore.

## Install

```bash
npm i @techrox/page-studio-form antd @ant-design/icons \
      @tiptap/react @tiptap/starter-kit @tiptap/extension-underline \
      @tiptap/extension-link @tiptap/extension-placeholder \
      @tiptap/extension-text-align @tiptap/extension-text-style \
      @tiptap/extension-color @tiptap/extension-highlight \
      @tiptap/extension-table @tiptap/extension-table-row \
      @tiptap/extension-task-list @tiptap/extension-task-item \
      @tiptap/extension-character-count @tiptap/extension-typography \
      @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities \
      diff dayjs
```

Then import the styles once at the app root:

```js
import '@techrox/page-studio-form/styles.css';
```

## Usage

```jsx
import { PageStudioForm } from '@techrox/page-studio-form';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';

import {
  savePage,
  deletePage,
  listRevisions,
  restoreRevision,
  uploadMedia,
} from '@/lib/admin-api';
import { getSchema, getContentDefaults } from '@/lib/page-schemas';

export default function EditorPage({ pageKey, initialPage }) {
  const router = useRouter();
  return (
    <PageStudioForm
      pageKey={pageKey}
      initialPage={initialPage}
      schema={getSchema(pageKey)}
      contentDefaults={getContentDefaults(pageKey)}
      livePath={`/pages/${pageKey}`}
      homeHref="/admin/pages"
      LinkComponent={NextLink}
      adapter={{
        savePage:        (key, payload) => savePage(key, payload),
        deletePage:      (key) => deletePage(key),
        loadHistory:     (key) => listRevisions(key),
        restoreRevision: (key, revId) => restoreRevision(key, revId),
        uploadMedia:     (formData) => uploadMedia(formData),
      }}
      onSaved={() => router.refresh()}
      onDeleted={() => router.replace('/admin/pages')}
      onRestored={() => router.refresh()}
    />
  );
}
```

## Adapter contract

| Method | Signature | When called |
|---|---|---|
| `savePage` | `(key, payload) => Promise<{ page }>` | User clicks Save. `payload` has `{ title, seo, content, published }`. |
| `deletePage` | `(key) => Promise<void>` | User confirms "Remove override". |
| `loadHistory` | `(key) => Promise<{ revisions }>` | History tab mounts or user clicks Reload. |
| `restoreRevision` | `(key, revisionId) => Promise<void>` | User confirms Restore on a revision. |
| `uploadMedia` | `(FormData) => Promise<{ url }>` | RichText image upload / paste / drop. |

All adapter methods may throw; errors surface to the user via the AntD
`message` API. The package never reads cookies, talks to a router, or
performs side effects beyond rendering. Wiring those is the host's job
(via `onSaved` / `onDeleted` / `onRestored`).

## Schema shape

The `schema` prop is a flat array of `{ title, help?, fields[] }` sections.
Each `field` is one of:

| `type` | Renders | Notes |
|---|---|---|
| `text` | `<Input>` | Single line |
| `textarea` / `html-text` | `<TextArea>` | Multiline plain text |
| `richtext` | `<RichText>` | TipTap WYSIWYG; emits HTML |
| `list` | `<TextArea>` → string[] | One entry per line |
| `list-csv` | `<Input>` → string[] | Comma-separated |
| `repeater` | `<Form.List>` | Drag-sortable; `itemFields[]` recurses |

The host owns the schema registry — typically a `getSchema(pageKey)` map
keyed by page identifier.

## Branding

The form inherits the `--tps-*` CSS variables from the host. Override on
`:root` (or any parent) to retheme without touching package internals:

```css
:root {
  --tps-primary: #6366F1;
  --tps-accent:  #EC4899;
  --tps-bg-soft: #F1F5F9;
}
```

## Standalone components

`<RichText />` and `<HistoryPanel />` are exported separately if you only
need one piece:

```jsx
import { RichText, HistoryPanel } from '@techrox/page-studio-form';

<RichText value={html} onChange={setHtml} uploadMedia={uploadFn} />
```

## Companion packages

- **[@techrox/page-studio](../editor)** — drag-and-drop visual builder
- **[@techrox/page-studio-blocks](../blocks)** — the 50 blocks the builder ships with
- **[@techrox/page-studio-renderer](../renderer)** — public-page renderer for builder output
