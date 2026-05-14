// Custom TipTap node extensions for the Cibus IQ admin editor:
//   • CiqImage — image with width + align attributes (overrides @tiptap/extension-image
//     with extra attrs and richer renderHTML).
//   • Columns — a container of N columns (N is configurable: 2 or 3).
//   • Column — the per-column slot (only used as a child of Columns).
//   • Callout — a tone-colored info / warning / success card with editable body.
//   • ShareBlock — leaf node, renders as social share buttons on the public site.
//   • SubscribeBlock — leaf node, renders as a newsletter form.
//
// All blocks emit semantic HTML with stable `tps-block-*` classes. The same
// classes are styled both inside the editor canvas and on the public site
// (globals.css) so the WYSIWYG experience matches.

import { Node, mergeAttributes } from '@tiptap/core';
import Image from '@tiptap/extension-image';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';

// ---------------------------------------------------------------------------
// Table cells with vertical alignment + alternating-row support
// ---------------------------------------------------------------------------
const vAlignAttrs = {
  verticalAlign: {
    default: 'top',
    parseHTML: (el) =>
      el.style?.verticalAlign || el.getAttribute('data-valign') || 'top',
    renderHTML: (attrs) => ({
      'data-valign': attrs.verticalAlign,
      style: `vertical-align: ${attrs.verticalAlign};`,
    }),
  },
};

export const CiqTableCell = TableCell.extend({
  addAttributes() {
    return { ...this.parent?.(), ...vAlignAttrs };
  },
});

export const CiqTableHeader = TableHeader.extend({
  addAttributes() {
    return { ...this.parent?.(), ...vAlignAttrs };
  },
});

// ---------------------------------------------------------------------------
// Image with alignment + width
// ---------------------------------------------------------------------------
export const CiqImage = Image.extend({
  name: 'ciqImage',
  // Inline images don't get alignment — we use block images so we can wrap
  // them in a container div and apply text-align.
  inline: false,
  group: 'block',
  draggable: true,

  addAttributes() {
    return {
      ...this.parent?.(),
      align: {
        default: 'center',
        parseHTML: (el) => el.getAttribute('data-align') || 'center',
        renderHTML: (attrs) => ({ 'data-align': attrs.align }),
      },
      width: {
        default: 'medium', // 'small' | 'medium' | 'large' | 'full'
        parseHTML: (el) => el.getAttribute('data-width') || 'medium',
        renderHTML: (attrs) => ({ 'data-width': attrs.width }),
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    const { align, width, ...rest } = HTMLAttributes;
    return [
      'div',
      {
        class: `tps-block-image tps-img-${width || 'medium'}`,
        'data-align': align || 'center',
      },
      ['img', mergeAttributes(this.options.HTMLAttributes, rest)],
    ];
  },

  parseHTML() {
    return [
      {
        tag: 'div.tps-block-image > img',
        getAttrs: (img) => {
          const wrapper = img.closest('.tps-block-image');
          return {
            src: img.getAttribute('src'),
            alt: img.getAttribute('alt'),
            title: img.getAttribute('title'),
            align: wrapper?.getAttribute('data-align') || 'center',
            width:
              wrapper?.className.match(/tps-img-(small|medium|large|full)/)?.[1] ||
              'medium',
          };
        },
      },
      // Fallback: legacy plain <img> tags
      { tag: 'img[src]:not([src^="data:"])' },
    ];
  },
});

// ---------------------------------------------------------------------------
// Column slot — a wrapper for content. Lives only inside Columns.
// ---------------------------------------------------------------------------
export const Column = Node.create({
  name: 'column',
  group: 'column',
  // Allow any block content inside — paragraphs, headings, lists, images.
  content: 'block+',
  isolating: true,
  defining: true,

  parseHTML() {
    return [{ tag: 'div.tps-block-column' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, { class: 'tps-block-column' }),
      0,
    ];
  },
});

// ---------------------------------------------------------------------------
// Columns container
// ---------------------------------------------------------------------------
export const Columns = Node.create({
  name: 'columns',
  group: 'block',
  content: 'column{2,4}', // 2–4 columns
  defining: true,

  addAttributes() {
    return {
      cols: {
        default: 2,
        parseHTML: (el) => Number(el.getAttribute('data-cols')) || 2,
        renderHTML: (attrs) => ({ 'data-cols': attrs.cols }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div.tps-block-columns' }];
  },

  renderHTML({ HTMLAttributes }) {
    const cols = HTMLAttributes['data-cols'] || HTMLAttributes.cols || 2;
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        class: `tps-block-columns tps-cols-${cols}`,
      }),
      0,
    ];
  },

  addCommands() {
    return {
      insertColumns:
        (cols = 2) =>
        ({ commands }) => {
          const n = Math.max(2, Math.min(4, Number(cols) || 2));
          return commands.insertContent({
            type: this.name,
            attrs: { cols: n },
            content: Array.from({ length: n }, () => ({
              type: 'column',
              content: [
                { type: 'paragraph' },
              ],
            })),
          });
        },
    };
  },
});

// ---------------------------------------------------------------------------
// Callout — info / warning / success card
// ---------------------------------------------------------------------------
export const Callout = Node.create({
  name: 'callout',
  group: 'block',
  content: 'block+',
  defining: true,

  addAttributes() {
    return {
      tone: {
        default: 'info', // 'info' | 'success' | 'warning' | 'danger'
        parseHTML: (el) => el.getAttribute('data-tone') || 'info',
        renderHTML: (attrs) => ({ 'data-tone': attrs.tone }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div.tps-block-callout' }];
  },

  renderHTML({ HTMLAttributes }) {
    const tone = HTMLAttributes['data-tone'] || 'info';
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        class: `tps-block-callout tps-callout-${tone}`,
      }),
      0,
    ];
  },

  addCommands() {
    return {
      insertCallout:
        (tone = 'info') =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { tone },
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'Highlight something important here.' }],
              },
            ],
          });
        },
    };
  },
});

// ---------------------------------------------------------------------------
// Share block — leaf, renders as social share buttons (rendered statically
// on the public site, no JS needed).
// ---------------------------------------------------------------------------
export const ShareBlock = Node.create({
  name: 'shareBlock',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      label: {
        default: 'Share this page',
        parseHTML: (el) => el.getAttribute('data-label') || 'Share this page',
        renderHTML: (attrs) => ({ 'data-label': attrs.label }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div.tps-block-share' }];
  },

  renderHTML({ HTMLAttributes }) {
    const label = HTMLAttributes['data-label'] || 'Share this page';
    // Static markup; client-side share URLs use the canonical page URL via
    // window.location at render time (in the public-side hydration script,
    // future work) — for now, links use a generic share intent.
    return [
      'div',
      mergeAttributes(HTMLAttributes, { class: 'tps-block-share' }),
      ['div', { class: 'tps-block-share-label' }, label],
      [
        'div',
        { class: 'tps-block-share-row' },
        [
          'a',
          {
            class: 'tps-block-share-btn',
            href: 'https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fcibusiq.com',
            target: '_blank',
            rel: 'noopener noreferrer',
          },
          'LinkedIn',
        ],
        [
          'a',
          {
            class: 'tps-block-share-btn',
            href: 'mailto:?subject=Cibus%20IQ&body=Thought%20you%27d%20find%20this%20interesting%3A%20https%3A%2F%2Fcibusiq.com',
          },
          'Email',
        ],
        [
          'a',
          {
            class: 'tps-block-share-btn',
            href: 'https://twitter.com/intent/tweet?url=https%3A%2F%2Fcibusiq.com',
            target: '_blank',
            rel: 'noopener noreferrer',
          },
          'X / Twitter',
        ],
      ],
    ];
  },

  addCommands() {
    return {
      insertShareBlock:
        () =>
        ({ commands }) =>
          commands.insertContent({ type: this.name }),
    };
  },
});

// ---------------------------------------------------------------------------
// Subscribe block — newsletter signup. Posts to /api/leads with
// source=newsletter; the existing leads endpoint accepts that.
// ---------------------------------------------------------------------------
export const SubscribeBlock = Node.create({
  name: 'subscribeBlock',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      heading: {
        default: 'Stay in the loop',
        parseHTML: (el) => el.getAttribute('data-heading') || 'Stay in the loop',
        renderHTML: (attrs) => ({ 'data-heading': attrs.heading }),
      },
      body: {
        default: 'One short email when we publish — never more.',
        parseHTML: (el) => el.getAttribute('data-body') || '',
        renderHTML: (attrs) => ({ 'data-body': attrs.body }),
      },
      button: {
        default: 'Subscribe',
        parseHTML: (el) => el.getAttribute('data-button') || 'Subscribe',
        renderHTML: (attrs) => ({ 'data-button': attrs.button }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div.tps-block-subscribe' }];
  },

  renderHTML({ HTMLAttributes }) {
    const heading = HTMLAttributes['data-heading'] || 'Stay in the loop';
    const body = HTMLAttributes['data-body'] || '';
    const button = HTMLAttributes['data-button'] || 'Subscribe';
    return [
      'div',
      mergeAttributes(HTMLAttributes, { class: 'tps-block-subscribe' }),
      ['h3', { class: 'tps-block-subscribe-heading' }, heading],
      body ? ['p', { class: 'tps-block-subscribe-body' }, body] : '',
      [
        'form',
        { class: 'tps-block-subscribe-form', action: '/api/leads', method: 'post' },
        ['input', { type: 'hidden', name: 'source', value: 'newsletter' }],
        [
          'input',
          {
            type: 'email',
            name: 'email',
            required: 'true',
            placeholder: 'you@company.com',
            class: 'tps-block-subscribe-input',
          },
        ],
        ['button', { type: 'submit', class: 'tps-block-subscribe-button' }, button],
      ],
    ];
  },

  addCommands() {
    return {
      insertSubscribeBlock:
        () =>
        ({ commands }) =>
          commands.insertContent({ type: this.name }),
    };
  },
});
