// ImageGallery — responsive photo grid with lightweight, non-jumping lightbox.
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { CloseOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';

export function ImageGalleryComponent({
  eyebrow = '',
  heading = '',
  columns = 3,
  items = [],
  background = 'white',
}) {
  const [activeIdx, setActiveIdx] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const validItems = useMemo(
    () => (items || []).filter((it) => it && it.url),
    [items],
  );

  const openLightbox = useCallback((itemIndex) => {
    setActiveIdx(itemIndex);
  }, []);

  const closeLightbox = useCallback(() => {
    setActiveIdx(null);
  }, []);

  const currentImage = activeIdx !== null ? items?.[activeIdx] : null;

  const currentValidIdx = useMemo(() => {
    if (!currentImage || !currentImage.url) return -1;
    return validItems.findIndex(
      (it) =>
        it === currentImage ||
        (it.url === currentImage.url && it.alt === currentImage.alt),
    );
  }, [currentImage, validItems]);

  const goToPrev = useCallback(() => {
    if (validItems.length <= 1) return;
    const nextValidIdx =
      currentValidIdx > 0 ? currentValidIdx - 1 : validItems.length - 1;
    const nextItem = validItems[nextValidIdx];
    const realIdx = (items || []).indexOf(nextItem);
    setActiveIdx(realIdx >= 0 ? realIdx : 0);
  }, [validItems, currentValidIdx, items]);

  const goToNext = useCallback(() => {
    if (validItems.length <= 1) return;
    const nextValidIdx =
      currentValidIdx < validItems.length - 1 ? currentValidIdx + 1 : 0;
    const nextItem = validItems[nextValidIdx];
    const realIdx = (items || []).indexOf(nextItem);
    setActiveIdx(realIdx >= 0 ? realIdx : 0);
  }, [validItems, currentValidIdx, items]);

  // Keyboard navigation
  useEffect(() => {
    if (activeIdx === null) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        goToPrev();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIdx, closeLightbox, goToPrev, goToNext]);

  // Prevent background scroll WITHOUT touching document.body styles (which causes page jump)
  useEffect(() => {
    if (activeIdx === null) return;

    const preventScroll = (e) => {
      e.preventDefault();
    };

    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });
    return () => {
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
    };
  }, [activeIdx]);

  return (
    <section
      className={`tps-section ${background === 'soft' ? 'tps-section-soft' : ''}${
        background === 'dark' ? ' tps-section-dark' : ''
      }`}
      style={{ paddingTop: 56, paddingBottom: 56 }}
    >
      <div className="tps-container">
        {(eyebrow || heading) && (
          <div style={{ marginBottom: 32 }}>
            {eyebrow && <span className="tps-eyebrow">{eyebrow}</span>}
            {heading && (
              <h2 className="tps-h2" style={{ marginTop: 8 }}>
                {heading}
              </h2>
            )}
          </div>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fit, minmax(min(${
              columns === 4 ? 200 : columns === 3 ? 280 : 360
            }px, 100%), 1fr))`,
            gap: 12,
          }}
        >
          {(items || []).map((img, i) => (
            <figure key={i} style={{ margin: 0 }}>
              {img?.url ? (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => openLightbox(i)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openLightbox(i);
                    }
                  }}
                  aria-label={img.alt || `View image ${i + 1}`}
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 'var(--tps-radius, 14px)',
                    aspectRatio: '4 / 3',
                    width: '100%',
                    cursor: 'pointer',
                    backgroundColor: 'var(--tps-line, #e2e8f0)',
                    display: 'block',
                  }}
                >
                  <img
                    src={img.url}
                    alt={img.alt || ''}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      transition: 'transform 0.25s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.03)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  />
                </div>
              ) : (
                <div
                  style={{
                    aspectRatio: '4 / 3',
                    background: 'var(--tps-line, #e2e8f0)',
                    borderRadius: 'var(--tps-radius, 14px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#94A3B8',
                    fontSize: 12,
                  }}
                >
                  Image
                </div>
              )}
              {img?.caption && (
                <figcaption
                  style={{
                    marginTop: 6,
                    fontSize: 12,
                    color: 'var(--tps-muted, #64748b)',
                  }}
                >
                  {img.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {mounted &&
        activeIdx !== null &&
        currentImage &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={currentImage.alt || 'Image lightbox'}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                closeLightbox();
              }
            }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99999,
              backgroundColor: 'rgba(15, 23, 42, 0.92)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              boxSizing: 'border-box',
              animation: 'tps-fade-in 0.2s ease-out',
            }}
          >
            {/* Top Bar: Counter & Close Button */}
            <div
              style={{
                position: 'absolute',
                top: 20,
                left: 24,
                right: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                zIndex: 10,
                pointerEvents: 'none',
              }}
            >
              {validItems.length > 1 && currentValidIdx >= 0 ? (
                <span
                  style={{
                    pointerEvents: 'auto',
                    backgroundColor: 'rgba(255, 255, 255, 0.16)',
                    color: '#ffffff',
                    padding: '4px 14px',
                    borderRadius: '9999px',
                    fontSize: '13px',
                    fontWeight: 500,
                    backdropFilter: 'blur(4px)',
                    letterSpacing: '0.5px',
                  }}
                >
                  {currentValidIdx + 1} / {validItems.length}
                </span>
              ) : (
                <span />
              )}

              <button
                type="button"
                onClick={closeLightbox}
                aria-label="Close image preview"
                style={{
                  pointerEvents: 'auto',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  border: 'none',
                  color: '#ffffff',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: 18,
                  transition: 'background-color 0.15s ease, transform 0.15s ease',
                  outline: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.28)';
                  e.currentTarget.style.transform = 'scale(1.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <CloseOutlined />
              </button>
            </div>

            {/* Prev Button */}
            {validItems.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrev();
                }}
                aria-label="Previous image"
                style={{
                  position: 'absolute',
                  left: 20,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 10,
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  border: 'none',
                  color: '#ffffff',
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: 18,
                  transition: 'background-color 0.15s ease, transform 0.15s ease',
                  outline: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.28)';
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                }}
              >
                <LeftOutlined />
              </button>
            )}

            {/* Next Button */}
            {validItems.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                aria-label="Next image"
                style={{
                  position: 'absolute',
                  right: 20,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 10,
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  border: 'none',
                  color: '#ffffff',
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: 18,
                  transition: 'background-color 0.15s ease, transform 0.15s ease',
                  outline: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.28)';
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                }}
              >
                <RightOutlined />
              </button>
            )}

            {/* Center Image & Caption */}
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                maxWidth: '90vw',
                maxHeight: '82vh',
                boxSizing: 'border-box',
              }}
            >
              <img
                src={currentImage.url}
                alt={currentImage.alt || ''}
                style={{
                  maxWidth: '100%',
                  maxHeight: '75vh',
                  objectFit: 'contain',
                  borderRadius: '8px',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
                  userSelect: 'none',
                }}
              />
              {(currentImage.caption || currentImage.alt) && (
                <div
                  style={{
                    marginTop: 12,
                    color: 'rgba(255, 255, 255, 0.88)',
                    fontSize: 14,
                    textAlign: 'center',
                    maxWidth: 680,
                    lineHeight: 1.5,
                  }}
                >
                  {currentImage.caption || currentImage.alt}
                </div>
              )}
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
}

export const ImageGallery = {
  label: 'Image gallery',
  fields: {
    eyebrow: { type: 'text', label: 'Eyebrow' },
    heading: { type: 'text', label: 'Heading' },
    columns: {
      type: 'radio',
      label: 'Columns',
      options: [
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
      ],
    },
    items: {
      type: 'array',
      label: 'Images',
      arrayFields: {
        url: { type: 'text', label: 'Image URL' },
        alt: { type: 'text', label: 'Alt text' },
        caption: { type: 'text', label: 'Caption (optional)' },
      },
      defaultItemProps: { url: '', alt: '', caption: '' },
      getItemSummary: (it, i) => it?.alt || it?.caption || `Image ${i + 1}`,
    },
    background: {
      type: 'radio',
      label: 'Background',
      options: [
        { label: 'White', value: 'white' },
        { label: 'Soft', value: 'soft' },
        { label: 'Dark', value: 'dark' },
      ],
    },
  },
  defaultProps: {
    eyebrow: '',
    heading: '',
    columns: 3,
    items: [
      { url: '', alt: 'Image 1', caption: '' },
      { url: '', alt: 'Image 2', caption: '' },
      { url: '', alt: 'Image 3', caption: '' },
    ],
    background: 'white',
  },
  render: (props) => <ImageGalleryComponent {...props} />,
};
