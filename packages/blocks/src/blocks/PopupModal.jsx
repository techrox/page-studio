'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from 'antd';
import { CloseOutlined, EyeOutlined } from '@ant-design/icons';
import { StudioLink as Link } from '../context';
import { htmlField } from './HtmlField.jsx';

/**
 * Pure React component for a center-aligned popup modal that opens on page load.
 * Supports image, rich HTML content, CTA actions, and close triggers.
 */
export function PopupModalComponent({
  heading = 'Special Announcement',
  eyebrow = 'Welcome',
  body_html = '<p>We are thrilled to welcome you to our new portal. Explore our latest products, updates, and events.</p>',
  image_url = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80',
  image_alt = 'Announcement Image',
  image_position = 'top',
  image_height = 200,
  primary_cta_label = 'Explore Now',
  primary_cta_href = '/explore',
  secondary_cta_label = 'Learn More',
  secondary_cta_href = '/about',
  show_dismiss_button = true,
  dismiss_label = 'Maybe later',
  delay = 0,
  show_frequency = 'always',
  storage_key = 'tps_popup_modal_dismissed',
  closeOnBackdrop = true,
  closeOnEsc = true,
  maxWidth = 540,
  variant = 'light',
  backgroundColor,
  className = '',
  style = {},
  onClose,
  onPrimaryClick,
  onSecondaryClick,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Check frequency rules & trigger opening with optional delay
  useEffect(() => {
    setMounted(true);

    if (typeof window !== 'undefined') {
      if (show_frequency === 'once_per_session') {
        const seen = sessionStorage.getItem(storage_key);
        if (seen) return;
      } else if (show_frequency === 'once_ever') {
        const seen = localStorage.getItem(storage_key);
        if (seen) return;
      }
    }

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, Math.max(0, (Number(delay) || 0) * 1000));

    return () => clearTimeout(timer);
  }, [delay, show_frequency, storage_key]);

  // Handle closing modal
  const handleClose = useCallback(() => {
    setIsOpen(false);
    if (typeof window !== 'undefined') {
      if (show_frequency === 'once_per_session') {
        sessionStorage.setItem(storage_key, 'true');
      } else if (show_frequency === 'once_ever') {
        localStorage.setItem(storage_key, 'true');
      }
    }
    if (onClose) {
      onClose();
    }
  }, [show_frequency, storage_key, onClose]);

  // ESC key listener
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, closeOnEsc, handleClose]);

  if (!mounted) {
    return null;
  }

  const isDark = variant === 'dark';
  const isSoft = variant === 'soft';

  const modalStyle = {
    maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
    ...(backgroundColor ? { backgroundColor } : {}),
    ...style,
  };

  const hasImage = Boolean(image_url && String(image_url).trim());
  const isBannerImg = image_position === 'top' || image_position === 'banner';
  const isSideImg = image_position === 'left' && hasImage;

  return (
    <>
      {/* Visual Canvas Inline Banner (for editor convenience when dismissed) */}
      {!isOpen && (
        <div className="tps-modal-placeholder">
          <div className="tps-modal-placeholder__info">
            <span className="tps-modal-placeholder__badge">Popup Modal</span>
            <span className="tps-modal-placeholder__title">
              {heading || 'Centered Popup Modal'}
            </span>
          </div>
          <button
            type="button"
            className="tps-modal-placeholder__btn"
            onClick={() => setIsOpen(true)}
          >
            <EyeOutlined /> Open Preview
          </button>
        </div>
      )}

      {/* Actual Popup Overlay & Centered Modal */}
      {isOpen && (
        <div
          className="tps-modal-overlay"
          onClick={(e) => {
            if (closeOnBackdrop && e.target === e.currentTarget) {
              handleClose();
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="tps-modal-heading"
        >
          <div
            className={`tps-modal-card ${isDark ? 'tps-modal-card--dark' : ''} ${
              isSoft ? 'tps-modal-card--soft' : ''
            } ${isSideImg ? 'tps-modal-card--side-img' : ''} ${className}`.trim()}
            style={modalStyle}
          >
            {/* Close Button */}
            <button
              type="button"
              className="tps-modal-card__close"
              onClick={handleClose}
              aria-label="Close modal"
            >
              <CloseOutlined />
            </button>

            {/* Top / Banner Image */}
            {hasImage && isBannerImg && (
              <div className="tps-modal-card__img-wrap" style={{ height: image_height || 200 }}>
                <img
                  src={image_url}
                  alt={image_alt || 'Modal image'}
                  className="tps-modal-card__img"
                />
              </div>
            )}

            {/* Side Image */}
            {hasImage && isSideImg && (
              <div className="tps-modal-card__side-img-wrap">
                <img
                  src={image_url}
                  alt={image_alt || 'Modal image'}
                  className="tps-modal-card__img"
                />
              </div>
            )}

            {/* Modal Body & Actions */}
            <div className="tps-modal-card__content">
              {eyebrow && <div className="tps-modal-card__eyebrow">{eyebrow}</div>}
              {heading && (
                <h2 id="tps-modal-heading" className="tps-modal-card__title">
                  {heading}
                </h2>
              )}

              {body_html && (
                <div
                  className="tps-modal-card__body"
                  dangerouslySetInnerHTML={{ __html: body_html }}
                />
              )}

              {/* Action Buttons */}
              {(primary_cta_label || secondary_cta_label || show_dismiss_button) && (
                <div className="tps-modal-card__actions">
                  {primary_cta_label && (
                    primary_cta_href ? (
                      <Link href={primary_cta_href}>
                        <Button
                          type="primary"
                          size="large"
                          className="tps-modal-btn"
                          onClick={(e) => {
                            if (onPrimaryClick) onPrimaryClick(e);
                            handleClose();
                          }}
                        >
                          {primary_cta_label}
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        type="primary"
                        size="large"
                        className="tps-modal-btn"
                        onClick={(e) => {
                          if (onPrimaryClick) onPrimaryClick(e);
                          handleClose();
                        }}
                      >
                        {primary_cta_label}
                      </Button>
                    )
                  )}

                  {secondary_cta_label && (
                    secondary_cta_href ? (
                      <Link href={secondary_cta_href}>
                        <Button
                          size="large"
                          className="tps-modal-btn"
                          onClick={(e) => {
                            if (onSecondaryClick) onSecondaryClick(e);
                            handleClose();
                          }}
                        >
                          {secondary_cta_label}
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        size="large"
                        className="tps-modal-btn"
                        onClick={(e) => {
                          if (onSecondaryClick) onSecondaryClick(e);
                          handleClose();
                        }}
                      >
                        {secondary_cta_label}
                      </Button>
                    )
                  )}

                  {show_dismiss_button && dismiss_label && (
                    <button
                      type="button"
                      className="tps-modal-card__dismiss-link"
                      onClick={handleClose}
                    >
                      {dismiss_label}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * Puck Block configuration for PopupModal.
 */
export const PopupModal = {
  label: 'Popup modal',
  fields: {
    heading: {
      type: 'text',
      label: 'Heading',
    },
    eyebrow: {
      type: 'text',
      label: 'Eyebrow / Subtitle (optional)',
    },
    body_html: htmlField('Body text (HTML supported)'),
    // Image
    image_url: {
      type: 'text',
      label: 'Image URL (optional)',
    },
    image_alt: {
      type: 'text',
      label: 'Image alt text',
    },
    image_position: {
      type: 'select',
      label: 'Image position',
      options: [
        { label: 'Top Banner', value: 'top' },
        { label: 'Left Side (Split)', value: 'left' },
        { label: 'None (Hidden)', value: 'none' },
      ],
    },
    image_height: {
      type: 'number',
      label: 'Top image height (px)',
    },
    // CTAs
    primary_cta_label: {
      type: 'text',
      label: 'Primary button label',
    },
    primary_cta_href: {
      type: 'text',
      label: 'Primary button link',
    },
    secondary_cta_label: {
      type: 'text',
      label: 'Secondary button label (optional)',
    },
    secondary_cta_href: {
      type: 'text',
      label: 'Secondary button link (optional)',
    },
    show_dismiss_button: {
      type: 'radio',
      label: 'Show dismiss link',
      options: [
        { label: 'Yes', value: true },
        { label: 'No', value: false },
      ],
    },
    dismiss_label: {
      type: 'text',
      label: 'Dismiss text (e.g. Maybe later)',
    },
    // Trigger & Display Rules
    delay: {
      type: 'number',
      label: 'Delay before popup opens (seconds, 0 = immediately)',
    },
    show_frequency: {
      type: 'select',
      label: 'Display frequency',
      options: [
        { label: 'Always (Every page visit)', value: 'always' },
        { label: 'Once per session (SessionStorage)', value: 'once_per_session' },
        { label: 'Once ever (LocalStorage)', value: 'once_ever' },
      ],
    },
    storage_key: {
      type: 'text',
      label: 'Storage key (for frequency tracking)',
    },
    // Styling
    variant: {
      type: 'select',
      label: 'Color scheme',
      options: [
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
        { label: 'Soft', value: 'soft' },
      ],
    },
    backgroundColor: {
      type: 'text',
      label: 'Custom background color (hex/CSS)',
    },
    maxWidth: {
      type: 'number',
      label: 'Max width (px)',
    },
    closeOnBackdrop: {
      type: 'radio',
      label: 'Close on backdrop click',
      options: [
        { label: 'Yes', value: true },
        { label: 'No', value: false },
      ],
    },
  },
  defaultProps: {
    heading: 'Special Announcement',
    eyebrow: 'Welcome',
    body_html:
      '<p>Welcome! Explore our latest updates, resources, and upcoming events.</p>',
    image_url:
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80',
    image_alt: 'Welcome Banner',
    image_position: 'top',
    image_height: 200,
    primary_cta_label: 'Explore Now',
    primary_cta_href: '/explore',
    secondary_cta_label: 'Learn More',
    secondary_cta_href: '/about',
    show_dismiss_button: true,
    dismiss_label: 'Maybe later',
    delay: 0,
    show_frequency: 'always',
    storage_key: 'tps_popup_modal_dismissed',
    closeOnBackdrop: true,
    maxWidth: 540,
    variant: 'light',
    backgroundColor: '',
  },
  render: (props) => <PopupModalComponent {...props} />,
};
