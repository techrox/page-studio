// ImageGallery — responsive photo grid. Images displayed in a masonry-style
// grid with lightbox on click via a simple modal.
'use client';
import { useState } from 'react';
import { Image } from 'antd';

export const ImageGallery = {
  label: 'Image gallery',
  fields: {
    eyebrow: { type: 'text', label: 'Eyebrow' },
    heading: { type: 'text', label: 'Heading' },
    columns: {
      type: 'radio', label: 'Columns',
      options: [{ label: '2', value: 2 }, { label: '3', value: 3 }, { label: '4', value: 4 }],
    },
    items: {
      type: 'array', label: 'Images',
      arrayFields: {
        url: { type: 'text', label: 'Image URL' },
        alt: { type: 'text', label: 'Alt text' },
        caption: { type: 'text', label: 'Caption (optional)' },
      },
      defaultItemProps: { url: '', alt: '', caption: '' },
      getItemSummary: (it, i) => it?.alt || it?.caption || `Image ${i + 1}`,
    },
    background: {
      type: 'radio', label: 'Background',
      options: [{ label: 'White', value: 'white' }, { label: 'Soft', value: 'soft' }],
    },
  },
  defaultProps: {
    eyebrow: '', heading: '', columns: 3, items: [
      { url: '', alt: 'Image 1', caption: '' },
      { url: '', alt: 'Image 2', caption: '' },
      { url: '', alt: 'Image 3', caption: '' },
    ], background: 'white',
  },
  render: ({ eyebrow, heading, columns, items, background }) => (
    <section className={`tps-section ${background === 'soft' ? 'tps-section-soft' : ''}`} style={{ paddingTop: 56, paddingBottom: 56 }}>
      <div className="tps-container">
        {(eyebrow || heading) && (
          <div style={{ marginBottom: 32 }}>
            {eyebrow && <span className="tps-eyebrow">{eyebrow}</span>}
            {heading && <h2 className="tps-h2" style={{ marginTop: 8 }}>{heading}</h2>}
          </div>
        )}
        <Image.PreviewGroup>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(min(${columns === 4 ? 200 : columns === 3 ? 280 : 360}px, 100%), 1fr))`, gap: 12 }}>
            {(items || []).map((img, i) => (
              <figure key={i} style={{ margin: 0 }}>
                {img.url ? (
                  <Image
                    src={img.url}
                    alt={img.alt || ''}
                    style={{ borderRadius: 'var(--tps-radius)', objectFit: 'cover', aspectRatio: '4 / 3', width: '100%' }}
                  />
                ) : (
                  <div style={{ aspectRatio: '4 / 3', background: '#E2E8F0', borderRadius: 'var(--tps-radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', fontSize: 12 }}>Image</div>
                )}
                {img.caption && <figcaption style={{ marginTop: 6, fontSize: 12, color: 'var(--tps-muted)' }}>{img.caption}</figcaption>}
              </figure>
            ))}
          </div>
        </Image.PreviewGroup>
      </div>
    </section>
  ),
};
