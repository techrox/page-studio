'use client';

import { useMemo, useState } from 'react';
import {
  LinkedinFilled,
  FacebookFilled,
  YoutubeFilled,
  InstagramFilled,
  TwitterOutlined,
  GithubOutlined,
  MailOutlined,
  PhoneOutlined,
  GlobalOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { StudioLink as Link } from '../context';

const SOCIAL_ICON_MAP = {
  linkedin: LinkedinFilled,
  youtube: YoutubeFilled,
  twitter: TwitterOutlined,
  x: TwitterOutlined,
  facebook: FacebookFilled,
  instagram: InstagramFilled,
  github: GithubOutlined,
  website: GlobalOutlined,
  email: MailOutlined,
};

const DEFAULT_COLUMNS = [
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'News & Press', href: '/news' },
      { label: 'Contact Us', href: '/contact' },
    ],
  },
  {
    title: 'Solutions',
    links: [
      { label: 'Product Overview', href: '/products' },
      { label: 'Features', href: '/features' },
      { label: 'Pricing Plans', href: '/pricing' },
      { label: 'Case Studies', href: '/case-studies' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: '/docs' },
      { label: 'Guides & Tutorials', href: '/guides' },
      { label: 'Help Center', href: '/help' },
      { label: 'Community', href: '/community' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms of Service', href: '/terms-of-service' },
      { label: 'Security & Trust', href: '/security' },
      { label: 'Cookie Settings', href: '/cookies' },
    ],
  },
];

const DEFAULT_SOCIAL_LINKS = [
  { network: 'linkedin', name: 'LinkedIn', url: 'https://linkedin.com' },
  { network: 'twitter', name: 'Twitter / X', url: 'https://x.com' },
  { network: 'github', name: 'GitHub', url: 'https://github.com' },
  { network: 'youtube', name: 'YouTube', url: 'https://youtube.com' },
];

const DEFAULT_BOTTOM_LINKS = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms of Service', href: '/terms-of-service' },
  { label: 'Cookie Policy', href: '/cookie-policy' },
];

/**
 * Pure React component for FooterNavigation.
 */
export function FooterNavigationComponent({
  // Layout & Sizing
  fullWidth = false,
  maxWidth = 'var(--tps-max, 1240px)',

  // Brand Info (clean dummy defaults)
  logo_url = '',
  logo_alt = 'Company Logo',
  logo_text = 'Company Name',
  logo_href = '/',
  logo_height = 36,
  legal_name = 'Company Name Inc.',
  address = '123 Business Avenue, Suite 100, City, State - 10001',
  email = 'contact@example.com',
  phone = '+1 (555) 234-5678',

  // Socials
  social_links = DEFAULT_SOCIAL_LINKS,

  // Link Columns
  columns = DEFAULT_COLUMNS,

  // Bottom Bar
  show_divider = true,
  copyright_text = '© {year} Company Name Inc. All rights reserved.',
  bottom_links = DEFAULT_BOTTOM_LINKS,

  // Styling & Theme (adjustable: white, soft, dark, etc.)
  background = 'dark', // 'white' | 'soft' | 'dark' | 'navy' | 'gradient' | 'custom'
  variant, // backward compatibility
  backgroundColor = '',
  accentColor = '',
  textColor = '',
  className = '',
  style = {},
  renderLink,
  renderLogo,
}) {
  const activeBackground = background || variant || 'dark';

  const currentYear = new Date().getFullYear();
  const formattedCopyright = useMemo(() => {
    if (!copyright_text) {
      return `© ${currentYear} ${legal_name || 'All rights reserved.'}`;
    }
    return copyright_text.replace(/\{year\}/g, String(currentYear));
  }, [copyright_text, currentYear, legal_name]);

  const backgroundStyle = useMemo(() => {
    if (backgroundColor) {
      return { background: backgroundColor };
    }
    switch (activeBackground) {
      case 'white':
        return {
          background: 'var(--tps-bg, #ffffff)',
          borderTop: '1px solid var(--tps-line, #e2e8f0)',
        };
      case 'soft':
        return {
          background: 'var(--tps-bg-soft, #f8fafc)',
          borderTop: '1px solid var(--tps-line, #e2e8f0)',
        };
      case 'dark':
        return {
          background: '#0f172a',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        };
      case 'navy':
        return {
          background: 'linear-gradient(180deg, #030712 0%, #0a192f 100%)',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        };
      case 'gradient':
        return {
          background: 'linear-gradient(180deg, #000000 0%, #031b14 100%)',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        };
      case 'custom':
      default:
        return {
          background: '#0f172a',
        };
    }
  }, [activeBackground, backgroundColor]);

  const isLightMode = activeBackground === 'white' || activeBackground === 'soft';
  const effectiveTextColor = textColor || (isLightMode ? 'var(--tps-muted, #64748b)' : '#94a3b8');
  const headingColor = isLightMode ? 'var(--tps-ink, #0f172a)' : '#ffffff';
  const dividerColor = isLightMode ? 'var(--tps-line, rgba(0, 0, 0, 0.08))' : 'rgba(255, 255, 255, 0.08)';
  const effectiveAccent = accentColor || (isLightMode ? 'var(--tps-primary, #0b60d8)' : '#89DE74');

  const containerPadding = fullWidth
    ? 'clamp(32px, 4vw, 56px) clamp(20px, 4vw, 56px) clamp(20px, 3vw, 32px)'
    : 'clamp(32px, 4vw, 56px) clamp(16px, 3vw, 24px) clamp(20px, 3vw, 32px)';

  const containerMaxWidth = fullWidth ? '100%' : maxWidth;

  const validSocialLinks = useMemo(() => {
    if (!Array.isArray(social_links)) return [];
    return social_links.filter((item) => item?.url || item?.href || item?.link);
  }, [social_links]);

  const validColumns = useMemo(() => {
    if (!Array.isArray(columns)) return [];
    return columns.filter((col) => col && (col.title || (Array.isArray(col.links) && col.links.length > 0)));
  }, [columns]);

  return (
    <footer
      className={`tps-footer-nav ${fullWidth ? 'tps-footer-nav--fullwidth' : ''} ${
        isLightMode ? 'tps-footer-nav--light' : 'tps-footer-nav--dark'
      } tps-footer-nav--${activeBackground} ${className}`.trim()}
      style={{
        ...backgroundStyle,
        color: effectiveTextColor,
        width: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
        ...style,
      }}
    >
      <div
        className="tps-footer-nav__container"
        style={{
          maxWidth: containerMaxWidth,
          margin: '0 auto',
          padding: containerPadding,
          boxSizing: 'border-box',
          width: '100%',
        }}
      >
        {/* Main Content: Brand Column + Navigation Columns */}
        <div className="tps-footer-nav__grid">
          {/* 1. Left Brand Info Column */}
          <div className="tps-footer-nav__brand">
            {/* Logo */}
            <div className="tps-footer-nav__logo-wrapper" style={{ marginBottom: 16 }}>
              {renderLogo ? (
                renderLogo({ url: logo_url, alt: logo_alt, href: logo_href, text: logo_text, height: logo_height })
              ) : logo_url ? (
                <Link href={logo_href || '/'} aria-label={logo_alt || logo_text || 'Home'}>
                  <img
                    src={logo_url}
                    alt={logo_alt || 'Logo'}
                    style={{
                      height: logo_height || 38,
                      width: 'auto',
                      maxHeight: 56,
                      objectFit: 'contain',
                      display: 'block',
                    }}
                  />
                </Link>
              ) : logo_text ? (
                <Link
                  href={logo_href || '/'}
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: headingColor,
                    textDecoration: 'none',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {logo_text}
                </Link>
              ) : null}
            </div>

            {/* Legal Name & Address */}
            {(legal_name || address) && (
              <address
                className="tps-footer-nav__address"
                style={{
                  color: effectiveTextColor,
                  fontSize: 'clamp(13px, 1.1vw, 15px)',
                  fontStyle: 'normal',
                  lineHeight: '26px',
                  maxWidth: 420,
                  margin: '0 0 14px',
                }}
              >
                {legal_name && <strong style={{ color: headingColor, display: 'block', marginBottom: 2 }}>{legal_name}</strong>}
                {address && <span>{address}</span>}
              </address>
            )}

            {/* Email link with icon */}
            {email && (
              <div style={{ marginBottom: 8 }}>
                <a
                  href={`mailto:${email}`}
                  className="tps-footer-nav__contact-link"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    color: effectiveAccent,
                    fontSize: 14,
                    textDecoration: 'none',
                    fontWeight: 500,
                    transition: 'opacity 0.2s ease',
                  }}
                >
                  <MailOutlined />
                  <span>{email}</span>
                </a>
              </div>
            )}

            {/* Phone link with icon */}
            {phone && (
              <div style={{ marginBottom: 16 }}>
                <a
                  href={`tel:${phone}`}
                  className="tps-footer-nav__contact-link"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    color: effectiveAccent,
                    fontSize: 14,
                    textDecoration: 'none',
                    fontWeight: 500,
                    transition: 'opacity 0.2s ease',
                  }}
                >
                  <PhoneOutlined />
                  <span>{phone}</span>
                </a>
              </div>
            )}

            {/* Social media circular buttons */}
            {validSocialLinks.length > 0 && (
              <div className="tps-footer-nav__socials" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 18 }}>
                {validSocialLinks.map((item, idx) => {
                  const targetUrl = item.url || item.href || item.link;
                  const networkKey = (item.network || item.name || '').toLowerCase();
                  const IconComponent = SOCIAL_ICON_MAP[networkKey] || GlobalOutlined;
                  const label = item.name || item.network || 'Social link';

                  return (
                    <a
                      key={item.id || idx}
                      href={targetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="tps-footer-nav__social-btn"
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: isLightMode ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.08)',
                        border: isLightMode ? '1px solid rgba(0, 0, 0, 0.1)' : '1px solid rgba(255, 255, 255, 0.15)',
                        color: isLightMode ? '#334155' : '#ffffff',
                        fontSize: 18,
                        transition: 'all 0.3s ease',
                        textDecoration: 'none',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #7EE45F, #4FE9D4)';
                        e.currentTarget.style.color = '#071107';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.borderColor = 'transparent';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = isLightMode
                          ? 'rgba(0, 0, 0, 0.05)'
                          : 'rgba(255, 255, 255, 0.08)';
                        e.currentTarget.style.color = isLightMode ? '#334155' : '#ffffff';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = isLightMode
                          ? 'rgba(0, 0, 0, 0.1)'
                          : 'rgba(255, 255, 255, 0.15)';
                      }}
                    >
                      <IconComponent />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* 2. Navigation Columns ("Pages and their clickable links") */}
          <div className="tps-footer-nav__columns-wrapper">
            {validColumns.map((col, colIdx) => {
              const linksList = Array.isArray(col.links) ? col.links : [];

              return (
                <div key={col.id || colIdx} className="tps-footer-nav__column">
                  {col.title && (
                    <h3
                      className="tps-footer-nav__column-title"
                      style={{
                        margin: '0 0 16px',
                        fontSize: 16,
                        fontWeight: 600,
                        color: headingColor,
                        lineHeight: '26px',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {col.title}
                    </h3>
                  )}

                  <div className="tps-footer-nav__link-list" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {linksList.map((linkItem, linkIdx) => {
                      const linkHref = linkItem.href || linkItem.to || linkItem.url || '#';
                      const linkLabel = linkItem.label || linkItem.text || linkItem.title || 'Page Link';

                      if (renderLink) {
                        return (
                          <span key={linkIdx} className="tps-footer-nav__link-item">
                            {renderLink({
                              href: linkHref,
                              className: 'tps-footer-nav__link',
                              children: linkLabel,
                              target: linkItem.target,
                            })}
                          </span>
                        );
                      }

                      return (
                        <Link
                          key={linkIdx}
                          href={linkHref}
                          target={linkItem.target}
                          className="tps-footer-nav__link"
                          style={{
                            color: effectiveTextColor,
                            textDecoration: 'none',
                            fontSize: 14,
                            lineHeight: 1.5,
                            transition: 'color 0.2s ease, transform 0.2s ease',
                            display: 'inline-block',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = effectiveAccent;
                            e.currentTarget.style.transform = 'translateX(2px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = effectiveTextColor;
                            e.currentTarget.style.transform = 'translateX(0)';
                          }}
                        >
                          {linkLabel}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Divider Line */}
        {show_divider && (
          <div
            className="tps-footer-nav__divider"
            style={{
              height: 1,
              background: dividerColor,
              margin: '36px 0 20px',
              width: '100%',
            }}
          />
        )}

        {/* 4. Bottom Row: Copyright + Optional Bottom Links */}
        <div
          className="tps-footer-nav__bottom"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: bottom_links && bottom_links.length > 0 ? 'space-between' : 'center',
            flexWrap: 'wrap',
            gap: 16,
            fontSize: 14,
            color: effectiveTextColor,
            textAlign: bottom_links && bottom_links.length > 0 ? 'left' : 'center',
          }}
        >
          <div className="tps-footer-nav__copyright">{formattedCopyright}</div>

          {Array.isArray(bottom_links) && bottom_links.length > 0 && (
            <div className="tps-footer-nav__bottom-links" style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {bottom_links.map((bLink, bIdx) => (
                <Link
                  key={bIdx}
                  href={bLink.href || '#'}
                  style={{
                    color: effectiveTextColor,
                    textDecoration: 'none',
                    fontSize: 13,
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = effectiveAccent)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = effectiveTextColor)}
                >
                  {bLink.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}

/**
 * Puck Block configuration for FooterNavigation.
 */
export const FooterNavigation = {
  label: 'Footer navigation',
  fields: {
    // Layout & Sizing
    fullWidth: {
      type: 'radio',
      label: 'Full width (End-to-end screen)',
      options: [
        { label: 'No', value: false },
        { label: 'Yes', value: true },
      ],
    },
    background: {
      type: 'select',
      label: 'Background surface',
      options: [
        { label: 'Dark', value: 'dark' },
        { label: 'White', value: 'white' },
        { label: 'Soft', value: 'soft' },
        { label: 'Navy', value: 'navy' },
        { label: 'Gradient', value: 'gradient' },
        { label: 'Custom', value: 'custom' },
      ],
    },
    backgroundColor: {
      type: 'text',
      label: 'Custom background (CSS / Gradient / Hex)',
    },
    accentColor: {
      type: 'text',
      label: 'Accent color override (Links hover & icons)',
    },
    textColor: {
      type: 'text',
      label: 'Text color override',
    },

    // Brand Details
    logo_url: { type: 'text', label: 'Logo image URL' },
    logo_alt: { type: 'text', label: 'Logo alt text' },
    logo_text: { type: 'text', label: 'Brand title (fallback)' },
    logo_href: { type: 'text', label: 'Logo link URL' },
    logo_height: { type: 'number', label: 'Logo height (px)' },
    legal_name: { type: 'text', label: 'Company / Organization name' },
    address: { type: 'textarea', label: 'Physical office address', rows: 3 },
    email: { type: 'text', label: 'Contact email (clickable)' },
    phone: { type: 'text', label: 'Contact phone (clickable)' },

    // Social Links
    social_links: {
      type: 'array',
      label: 'Social media links',
      arrayFields: {
        network: {
          type: 'select',
          label: 'Platform',
          options: [
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'Twitter / X', value: 'twitter' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'GitHub', value: 'github' },
            { label: 'Website / Other', value: 'website' },
          ],
        },
        name: { type: 'text', label: 'Display name / Tooltip' },
        url: { type: 'text', label: 'Profile URL' },
      },
      defaultItemProps: {
        network: 'linkedin',
        name: 'LinkedIn',
        url: 'https://linkedin.com',
      },
      getItemSummary: (it, i) => it?.name || it?.network || `Social ${i + 1}`,
    },

    // Link Columns
    columns: {
      type: 'array',
      label: 'Page link columns',
      arrayFields: {
        title: { type: 'text', label: 'Column header title' },
        links: {
          type: 'array',
          label: 'Clickable page links',
          arrayFields: {
            label: { type: 'text', label: 'Link label' },
            href: { type: 'text', label: 'Page path or URL' },
          },
          defaultItemProps: {
            label: 'Page Link',
            href: '/page',
          },
          getItemSummary: (linkItem, j) => linkItem?.label || `Link ${j + 1}`,
        },
      },
      defaultItemProps: {
        title: 'New Section',
        links: [
          { label: 'Overview', href: '/overview' },
          { label: 'Features', href: '/features' },
        ],
      },
      getItemSummary: (col, i) => col?.title || `Column ${i + 1}`,
    },

    // Bottom Bar
    show_divider: {
      type: 'radio',
      label: 'Show divider line',
      options: [
        { label: 'Yes', value: true },
        { label: 'No', value: false },
      ],
    },
    copyright_text: {
      type: 'text',
      label: 'Copyright notice (use {year} for current year)',
    },
    bottom_links: {
      type: 'array',
      label: 'Bottom legal links',
      arrayFields: {
        label: { type: 'text', label: 'Label' },
        href: { type: 'text', label: 'URL' },
      },
      defaultItemProps: { label: 'Privacy Policy', href: '/privacy-policy' },
      getItemSummary: (it, i) => it?.label || `Link ${i + 1}`,
    },
  },

  defaultProps: {
    fullWidth: false,
    background: 'dark',
    backgroundColor: '',
    accentColor: '',
    textColor: '',
    logo_url: '',
    logo_alt: 'Company Logo',
    logo_text: 'Company Name',
    logo_href: '/',
    logo_height: 36,
    legal_name: 'Company Name Inc.',
    address: '123 Business Avenue, Suite 100, City, State - 10001',
    email: 'contact@example.com',
    phone: '+1 (555) 234-5678',
    social_links: DEFAULT_SOCIAL_LINKS,
    columns: DEFAULT_COLUMNS,
    show_divider: true,
    copyright_text: '© {year} Company Name Inc. All rights reserved.',
    bottom_links: DEFAULT_BOTTOM_LINKS,
  },

  render: (props) => <FooterNavigationComponent {...props} />,
};
