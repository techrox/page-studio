'use client';

import { useMemo, useState } from 'react';
import { Dropdown, Button, Drawer, Avatar, Tooltip } from 'antd';
import {
  DownOutlined,
  MenuOutlined,
  CloseOutlined,
  RightOutlined,
  UserOutlined,
  LoginOutlined,
  PhoneOutlined,
  MailOutlined,
  ClockCircleOutlined,
  SendOutlined,
} from '@ant-design/icons';
import { StudioLink as Link, useStudio } from '../context';
import { normalizePath } from '../sanitize.js';

/**
 * Merged Contact + Navigation Header Component.
 * - On desktop: Displays a top contact bar (phones, emails, timing) + main navigation bar (logo, menus, CTA).
 * - On mobile: Merges into a SINGLE clean header row with logo and ONE hamburger button.
 *   The mobile drawer contains ALL menus, CTA/login actions, AND the full contact details!
 */
export function ContactNavigationHeaderComponent({
  // Contact details
  phones = [],
  emails = [],
  timing_text = '',
  top_action_label,
  top_action_href,
  showTopBar = true,
  // Navigation & Logo
  logo,
  logo_url,
  logo_alt = 'Logo',
  logo_href = '/',
  logo_text,
  logo_height = 38,
  menus = [],
  activePath,
  currentPath,
  isActive,
  // Actions & Auth
  actions,
  login_label = 'Login',
  login_href = '/login',
  isLoggedIn = false,
  profile,
  cta_label,
  cta_href,
  // Styling
  variant = 'light',
  topBarVariant = 'primary',
  backgroundColor,
  topBarBackgroundColor,
  sticky = true,
  maxWidth = 'var(--tps-max, 1240px)',
  className = '',
  style = {},
  onNavigate,
  onActionClick,
  onLoginClick,
  onProfileClick,
  renderLink,
  renderLogo,
}) {
  const studio = useStudio();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileKeys, setExpandedMobileKeys] = useState({});

  const studioUser = studio?.currentUser || studio?.user;
  const effectiveIsLoggedIn =
    studio?.currentUser !== undefined || studio?.user !== undefined || studio?.isLoggedIn !== undefined
      ? Boolean(studio?.currentUser || studio?.user || studio?.isLoggedIn)
      : Boolean(isLoggedIn);

  const effectiveProfile =
    profile ||
    studio?.profile ||
    (studioUser
      ? {
          name:
            studioUser?.fullName ||
            studioUser?.name ||
            studioUser?.userName ||
            studioUser?.username ||
            studioUser?.email,
          avatar: studioUser?.avatarUrl || studioUser?.avatar,
          menuItems:
            studio?.profileMenuItems ||
            studio?.userMenuItems ||
            studio?.menuItems ||
            studioUser?.menuItems,
          onClick: studio?.onProfileClick || studioUser?.onClick,
        }
      : undefined);

  const effectiveActivePath =
    activePath !== undefined
      ? activePath
      : currentPath !== undefined
      ? currentPath
      : studio?.activePath !== undefined
      ? studio.activePath
      : studio?.currentPath !== undefined
      ? studio.currentPath
      : typeof window !== 'undefined'
      ? window.location.pathname
      : undefined;

  // Active path checking
  const checkIsActive = (item) => {
    if (typeof isActive === 'function') {
      return Boolean(isActive(item, effectiveActivePath));
    }
    if (!effectiveActivePath) return false;
    const itemPath = item.path || item.href;
    if (itemPath) {
      const cleanItem = normalizePath(itemPath);
      const cleanActive = normalizePath(effectiveActivePath);
      if (cleanItem === cleanActive) return true;
      if (cleanItem !== '/' && (cleanActive.endsWith(cleanItem) || cleanItem.endsWith(cleanActive))) {
        return true;
      }
      if ((cleanItem === '/home' && cleanActive === '/') || (cleanItem === '/' && cleanActive === '/home')) {
        return true;
      }
    }
    if (Array.isArray(item.children)) {
      return item.children.some((child) => checkIsActive(child));
    }
    return false;
  };

  // Normalize contact items
  const normalizedPhones = useMemo(() => {
    const raw = Array.isArray(phones) ? phones : [];
    return raw
      .filter((p) => Boolean(p && (typeof p === 'string' ? p.trim() : p.number)))
      .slice(0, 3)
      .map((p, idx) => {
        if (typeof p === 'string') {
          return {
            id: `phone-${idx}`,
            value: p.trim(),
            href: `tel:${p.replace(/\s+/g, '')}`,
          };
        }
        return {
          id: `phone-${idx}`,
          value: p.number || p.value,
          label: p.label,
          href: p.href || (p.number ? `tel:${String(p.number).replace(/\s+/g, '')}` : undefined),
        };
      });
  }, [phones]);

  const normalizedEmails = useMemo(() => {
    const raw = Array.isArray(emails) ? emails : [];
    return raw
      .filter((e) => Boolean(e && (typeof e === 'string' ? e.trim() : e.email)))
      .slice(0, 3)
      .map((e, idx) => {
        if (typeof e === 'string') {
          return {
            id: `email-${idx}`,
            value: e.trim(),
            href: `mailto:${e.trim()}`,
          };
        }
        return {
          id: `email-${idx}`,
          value: e.email || e.value,
          label: e.label,
          href: e.href || (e.email ? `mailto:${e.email}` : undefined),
        };
      });
  }, [emails]);

  // Normalize logo configuration
  const logoConfig = useMemo(() => {
    if (typeof logo === 'string') {
      return { url: logo, alt: logo_alt, href: logo_href, text: logo_text, height: logo_height };
    }
    if (logo && typeof logo === 'object' && !('$$typeof' in logo)) {
      return {
        url: logo.url || logo.src || logo_url,
        alt: logo.alt || logo_alt,
        href: logo.href || logo_href,
        text: logo.text || logo_text,
        height: logo.height || logo_height,
        width: logo.width,
      };
    }
    return {
      url: logo_url,
      alt: logo_alt,
      href: logo_href,
      text: logo_text,
      height: logo_height,
    };
  }, [logo, logo_url, logo_alt, logo_href, logo_text, logo_height]);

  // Normalize actions
  const normalizedActions = useMemo(() => {
    if (Array.isArray(actions) && actions.length > 0) {
      return actions.slice(0, 2);
    }
    const result = [];
    if (login_label && !effectiveIsLoggedIn) {
      result.push({
        type: 'login',
        label: login_label,
        href: login_href || '/login',
        variant: 'default',
      });
    } else if (effectiveIsLoggedIn) {
      result.push({
        type: 'login',
        label: 'Account',
        href: '#',
        variant: 'default',
      });
    }
    if (cta_label) {
      result.push({
        type: 'cta',
        label: cta_label,
        href: cta_href || '#',
        variant: 'primary',
      });
    }
    return result;
  }, [actions, login_label, login_href, effectiveIsLoggedIn, cta_label, cta_href]);

  const handleActionClick = (action, e) => {
    if (action.type === 'login' && onLoginClick) {
      onLoginClick(e);
      return;
    }
    if (onActionClick) {
      onActionClick(action, e);
    }
  };

  const toggleMobileSubmenu = (key) => {
    setExpandedMobileKeys((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Render profile avatar/dropdown
  const renderProfileControl = (action) => {
    if (!effectiveProfile) {
      return (
        <Button
          type="text"
          icon={<UserOutlined />}
          shape="circle"
          onClick={onProfileClick || (() => handleActionClick(action))}
          aria-label="User profile"
        />
      );
    }
    const avatarNode = effectiveProfile.avatar ? (
      <Avatar src={effectiveProfile.avatar} size={32} />
    ) : (
      <Avatar icon={<UserOutlined />} size={32} />
    );

    if (Array.isArray(effectiveProfile.menuItems) && effectiveProfile.menuItems.length > 0) {
      const items = effectiveProfile.menuItems.map((item, idx) => ({
        key: item.key || `profile-item-${idx}`,
        label: item.href ? (
          <Link href={item.href}>{item.label}</Link>
        ) : (
          <span onClick={item.onClick}>{item.label}</span>
        ),
        icon: item.icon,
      }));
      return (
        <Dropdown menu={{ items }} placement="bottomRight" trigger={['click']}>
          <span style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
            {avatarNode}
          </span>
        </Dropdown>
      );
    }
    return (
      <span
        style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
        onClick={effectiveProfile.onClick || onProfileClick}
      >
        {avatarNode}
      </span>
    );
  };

  // Desktop navigation items
  const renderDesktopMenuItems = (items) => {
    return items.map((item, idx) => {
      const active = checkIsActive(item);
      const hasChildren = Array.isArray(item.children) && item.children.length > 0;
      const key = item.key || item.path || `nav-item-${idx}`;

      if (hasChildren) {
        const dropdownMenuItems = item.children.map((child, cIdx) => {
          const childActive = checkIsActive(child);
          const childKey = child.key || child.path || `child-${idx}-${cIdx}`;
          return {
            key: childKey,
            label: (
              <Link
                href={child.path || child.href}
                className={`tps-dropdown-item ${childActive ? 'tps-dropdown-item--active' : ''}`}
                onClick={(e) => {
                  if (onNavigate) {
                    e.preventDefault();
                    onNavigate(child.path || child.href);
                  }
                }}
              >
                {child.icon && <span className="tps-dropdown-item__icon">{child.icon}</span>}
                <span>{child.label || child.title}</span>
              </Link>
            ),
          };
        });

        return (
          <li key={key} className="tps-nav-item">
            <Dropdown menu={{ items: dropdownMenuItems }} placement="bottomLeft">
              <button
                type="button"
                className={`tps-nav-link ${active ? 'tps-nav-link--active' : ''}`}
              >
                {item.icon && <span className="tps-nav-link__icon">{item.icon}</span>}
                <span>{item.label || item.title}</span>
                <DownOutlined className="tps-nav-link__chevron" />
              </button>
            </Dropdown>
          </li>
        );
      }

      return (
        <li key={key} className="tps-nav-item">
          <Link
            href={item.path || item.href}
            className={`tps-nav-link ${active ? 'tps-nav-link--active' : ''}`}
            onClick={(e) => {
              if (onNavigate) {
                e.preventDefault();
                onNavigate(item.path || item.href);
              }
            }}
          >
            {item.icon && <span className="tps-nav-link__icon">{item.icon}</span>}
            <span>{item.label || item.title}</span>
          </Link>
        </li>
      );
    });
  };

  // Mobile drawer menu items
  const renderMobileMenuItems = (items) => {
    return items.map((item, idx) => {
      const active = checkIsActive(item);
      const hasChildren = Array.isArray(item.children) && item.children.length > 0;
      const key = item.key || item.path || `m-item-${idx}`;
      const isExpanded = Boolean(expandedMobileKeys[key]);

      if (hasChildren) {
        return (
          <div key={key} className="tps-mobile-nav__item-group">
            <div className={`tps-mobile-nav__row ${active ? 'tps-mobile-nav__row--active' : ''}`}>
              <Link
                href={item.path || item.href}
                className="tps-mobile-nav__link"
                onClick={(e) => {
                  if (item.path && item.path !== '#') {
                    setMobileMenuOpen(false);
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate(item.path);
                    }
                  } else {
                    e.preventDefault();
                    toggleMobileSubmenu(key);
                  }
                }}
              >
                {item.icon && <span>{item.icon}</span>}
                <span>{item.label || item.title}</span>
              </Link>
              <button
                type="button"
                className="tps-mobile-nav__toggle"
                onClick={() => toggleMobileSubmenu(key)}
                aria-label="Toggle sub-menu"
              >
                <DownOutlined
                  style={{
                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                  }}
                />
              </button>
            </div>
            {isExpanded && (
              <div className="tps-mobile-nav__children">
                {item.children.map((child, cIdx) => {
                  const childActive = checkIsActive(child);
                  const childKey = child.key || child.path || `m-child-${idx}-${cIdx}`;
                  return (
                    <Link
                      key={childKey}
                      href={child.path || child.href}
                      className={`tps-mobile-nav__link tps-mobile-nav__link--sub ${
                        childActive ? 'tps-mobile-nav__link--active' : ''
                      }`}
                      onClick={(e) => {
                        setMobileMenuOpen(false);
                        if (onNavigate) {
                          e.preventDefault();
                          onNavigate(child.path || child.href);
                        }
                      }}
                    >
                      {child.icon && <span>{child.icon}</span>}
                      <span>{child.label || child.title}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      }

      return (
        <div key={key} className={`tps-mobile-nav__row ${active ? 'tps-mobile-nav__row--active' : ''}`}>
          <Link
            href={item.path || item.href}
            className="tps-mobile-nav__link"
            onClick={(e) => {
              setMobileMenuOpen(false);
              if (onNavigate) {
                e.preventDefault();
                onNavigate(item.path || item.href);
              }
            }}
          >
            {item.icon && <span>{item.icon}</span>}
            <span>{item.label || item.title}</span>
          </Link>
        </div>
      );
    });
  };

  const variantClass =
    variant === 'dark'
      ? 'tps-nav-header--dark'
      : variant === 'soft'
      ? 'tps-nav-header--soft'
      : variant === 'transparent'
      ? 'tps-nav-header--transparent'
      : '';

  const stickyClass = sticky ? 'tps-contact-nav-header--sticky' : '';
  const hasContacts = normalizedPhones.length > 0 || normalizedEmails.length > 0 || timing_text;

  return (
    <header
      className={`tps-contact-nav-header ${variantClass} ${stickyClass} ${className}`.trim()}
      style={{
        backgroundColor: backgroundColor || undefined,
        ...style,
      }}
    >
      {/* 1. TOP CONTACT BAR (Desktop only, hides gracefully on mobile) */}
      {showTopBar && hasContacts && (
        <div
          className={`tps-contact-topbar tps-contact-topbar--${topBarVariant}`}
          style={{
            backgroundColor: topBarBackgroundColor || undefined,
          }}
        >
          <div
            className="tps-contact-topbar__container"
            style={{ maxWidth }}
          >
            <div className="tps-contact-topbar__left">
              {normalizedPhones.map((p, i) => (
                <a key={p.id || i} href={p.href} className="tps-topbar-item">
                  <PhoneOutlined className="tps-topbar-item__icon" />
                  <span>{p.value}</span>
                </a>
              ))}
              {normalizedEmails.map((e, i) => (
                <a key={e.id || i} href={e.href} className="tps-topbar-item">
                  <MailOutlined className="tps-topbar-item__icon" />
                  <span>{e.value}</span>
                </a>
              ))}
              {timing_text && (
                <span className="tps-topbar-item tps-topbar-item--timing">
                  <ClockCircleOutlined className="tps-topbar-item__icon" />
                  <span>{timing_text}</span>
                </span>
              )}
            </div>

            <div className="tps-contact-topbar__right">
              {top_action_label && top_action_href && (
                <Link href={top_action_href} className="tps-topbar-action-link">
                  {top_action_label} <RightOutlined style={{ fontSize: 10, marginLeft: 2 }} />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. MAIN NAVIGATION BAR */}
      <div className="tps-nav-header__container" style={{ maxWidth }}>
        {/* Left: Brand Logo */}
        <div className="tps-nav-header__left">
          {renderLogo ? (
            renderLogo(logoConfig)
          ) : logo && typeof logo === 'object' && '$$typeof' in logo ? (
            logo
          ) : logoConfig.url ? (
            <Link
              href={logoConfig.href || '/'}
              className="tps-nav-header__logo-link"
              aria-label={logoConfig.alt || 'Home'}
            >
              <img
                src={logoConfig.url}
                alt={logoConfig.alt || 'Logo'}
                style={{
                  height: logoConfig.height || 38,
                  width: logoConfig.width || 'auto',
                  maxHeight: 52,
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            </Link>
          ) : logoConfig.text ? (
            <Link
              href={logoConfig.href || '/'}
              className="tps-nav-header__logo-text"
            >
              {logoConfig.text}
            </Link>
          ) : null}
        </div>

        {/* Center: Desktop Navigation Menus */}
        <nav className="tps-nav-header__nav" aria-label="Main Navigation">
          <ul className="tps-nav-header__menu-list">
            {renderDesktopMenuItems(menus)}
          </ul>
        </nav>

        {/* Right: Actions + Mobile Hamburger Toggle */}
        <div className="tps-nav-header__right">
          {/* Action buttons on desktop */}
          <div className="tps-nav-header__actions">
            {normalizedActions.map((action, idx) => {
              const isLoginType = action.type === 'login';
              if (isLoginType && effectiveIsLoggedIn) {
                return (
                  <div key={action.type || idx} className="tps-nav-header__action-item">
                    {renderProfileControl(action)}
                  </div>
                );
              }
              const btnVariant = action.variant === 'primary' ? 'primary' : 'default';
              const btnIcon = action.icon || (isLoginType ? <LoginOutlined /> : undefined);

              return (
                <div key={action.type || idx} className="tps-nav-header__action-item">
                  <Link href={action.href || '#'}>
                    <Button
                      type={btnVariant}
                      icon={btnIcon}
                      className="tps-header-btn"
                      onClick={(e) => handleActionClick(action, e)}
                    >
                      {action.label || (isLoginType ? 'Login' : 'Action')}
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>

          {/* SINGLE Unified Mobile hamburger toggle */}
          <button
            type="button"
            className="tps-nav-header__mobile-toggle"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open Navigation Menu"
          >
            <MenuOutlined />
          </button>
        </div>
      </div>

      {/* 3. UNIFIED MOBILE DRAWER (Combines Nav Menus + Actions + Contact Info) */}
      <Drawer
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        placement="right"
        width={320}
        closeIcon={<CloseOutlined />}
        title={
          logoConfig.url ? (
            <img
              src={logoConfig.url}
              alt={logoConfig.alt || 'Logo'}
              style={{ height: 28, maxWidth: 160, objectFit: 'contain' }}
            />
          ) : (
            logoConfig.text || 'Menu'
          )
        }
      >
        <div className="tps-mobile-nav">
          {/* Section A: Navigation Links */}
          <div className="tps-mobile-nav__list">
            {renderMobileMenuItems(menus)}
          </div>

          {/* Section B: Action Buttons */}
          {normalizedActions.length > 0 && (
            <div className="tps-mobile-nav__actions" style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {normalizedActions.map((action, idx) => {
                const isLoginType = action.type === 'login';
                if (isLoginType && effectiveIsLoggedIn) {
                  return (
                    <div key={action.type || idx} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0' }}>
                      {renderProfileControl(action)}
                      {effectiveProfile?.name && <span style={{ fontWeight: 500 }}>{effectiveProfile.name}</span>}
                    </div>
                  );
                }
                const btnIcon = action.icon || (isLoginType ? <LoginOutlined /> : undefined);
                return (
                  <Button
                    key={idx}
                    type={action.variant === 'primary' ? 'primary' : 'default'}
                    icon={btnIcon}
                    block
                    href={action.href}
                    onClick={(e) => {
                      setMobileMenuOpen(false);
                      handleActionClick(action, e);
                    }}
                  >
                    {action.label || (isLoginType ? 'Login' : 'Action')}
                  </Button>
                );
              })}
            </div>
          )}

          {/* Section C: Contact Information inside Drawer */}
          {hasContacts && (
            <div className="tps-mobile-nav__contact-section" style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--tps-line)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--tps-muted)', marginBottom: 12 }}>
                Contact & Information
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {normalizedPhones.map((p, i) => (
                  <a
                    key={p.id || i}
                    href={p.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      color: 'var(--tps-ink)',
                      textDecoration: 'none',
                      fontSize: 14,
                      fontWeight: 500,
                    }}
                  >
                    <div style={{ width: 30, height: 30, borderRadius: 6, background: 'var(--tps-primary-soft)', color: 'var(--tps-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <PhoneOutlined style={{ fontSize: 14 }} />
                    </div>
                    <span>{p.value}</span>
                  </a>
                ))}

                {normalizedEmails.map((e, i) => (
                  <a
                    key={e.id || i}
                    href={e.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      color: 'var(--tps-ink)',
                      textDecoration: 'none',
                      fontSize: 14,
                      fontWeight: 500,
                    }}
                  >
                    <div style={{ width: 30, height: 30, borderRadius: 6, background: 'var(--tps-primary-soft)', color: 'var(--tps-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <MailOutlined style={{ fontSize: 14 }} />
                    </div>
                    <span style={{ wordBreak: 'break-all' }}>{e.value}</span>
                  </a>
                ))}

                {timing_text && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      color: 'var(--tps-muted)',
                      fontSize: 13,
                      marginTop: 4,
                    }}
                  >
                    <div style={{ width: 30, height: 30, borderRadius: 6, background: 'var(--tps-bg-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <ClockCircleOutlined style={{ fontSize: 14 }} />
                    </div>
                    <span>{timing_text}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Drawer>
    </header>
  );
}

/**
 * Puck Block configuration for ContactNavigationHeader.
 */
export const ContactNavigationHeader = {
  label: 'Contact + Navigation header',
  fields: {
    // Top Contact Bar
    showTopBar: {
      type: 'radio',
      label: 'Show top contact bar',
      options: [
        { label: 'Yes', value: true },
        { label: 'No', value: false },
      ],
    },
    phones: {
      type: 'array',
      label: 'Phone numbers (top bar & mobile drawer)',
      arrayFields: {
        number: { type: 'text', label: 'Phone number' },
      },
      defaultItemProps: { number: '+1 (555) 234-5678' },
      getItemSummary: (it, i) => it?.number || `Phone ${i + 1}`,
    },
    emails: {
      type: 'array',
      label: 'Email addresses (top bar & mobile drawer)',
      arrayFields: {
        email: { type: 'text', label: 'Email address' },
      },
      defaultItemProps: { email: 'contact@example.com' },
      getItemSummary: (it, i) => it?.email || `Email ${i + 1}`,
    },
    timing_text: {
      type: 'text',
      label: 'Timings / announcement badge',
    },
    topBarVariant: {
      type: 'select',
      label: 'Top contact bar theme',
      options: [
        { label: 'Primary Brand Color', value: 'primary' },
        { label: 'Dark Navy', value: 'dark' },
        { label: 'Soft Gray', value: 'soft' },
        { label: 'Light White', value: 'light' },
      ],
    },
    topBarBackgroundColor: {
      type: 'text',
      label: 'Top bar custom background (hex/CSS)',
    },

    // Main Nav Bar: Logo
    logo_url: { type: 'text', label: 'Logo image URL' },
    logo_alt: { type: 'text', label: 'Logo alt text' },
    logo_text: { type: 'text', label: 'Brand text (fallback)' },
    logo_href: { type: 'text', label: 'Logo link URL' },
    logo_height: { type: 'number', label: 'Logo height (px)' },

    // Menus
    menus: {
      type: 'array',
      label: 'Navigation menu items',
      arrayFields: {
        label: { type: 'text', label: 'Menu label' },
        path: { type: 'text', label: 'Path / URL' },
        children: {
          type: 'array',
          label: 'Sub-menu items (dropdown)',
          arrayFields: {
            label: { type: 'text', label: 'Sub-item label' },
            path: { type: 'text', label: 'Sub-item path' },
          },
          defaultItemProps: { label: 'Subpage', path: '/subpage' },
          getItemSummary: (c, j) => c?.label || `Sub item ${j + 1}`,
        },
      },
      defaultItemProps: { label: 'New Page', path: '/' },
      getItemSummary: (it, i) => it?.label || `Menu ${i + 1}`,
    },

    // Actions & CTA
    login_label: { type: 'text', label: 'Login button label' },
    login_href: { type: 'text', label: 'Login URL' },
    cta_label: { type: 'text', label: 'Main CTA button label' },
    cta_href: { type: 'text', label: 'Main CTA link' },

    // Styling
    variant: {
      type: 'select',
      label: 'Main header color scheme',
      options: [
        { label: 'Light', value: 'light' },
        { label: 'Soft', value: 'soft' },
        { label: 'Dark', value: 'dark' },
        { label: 'Transparent', value: 'transparent' },
      ],
    },
    backgroundColor: {
      type: 'text',
      label: 'Main header custom background (hex/CSS)',
    },
    sticky: {
      type: 'radio',
      label: 'Sticky header on scroll',
      options: [
        { label: 'Yes', value: true },
        { label: 'No', value: false },
      ],
    },
  },
  defaultProps: {
    showTopBar: true,
    phones: [{ number: '+1 (555) 234-5678' }, { number: '+1 (555) 876-5432' }],
    emails: [{ email: 'contact@example.com' }, { email: 'info@example.com' }],
    timing_text: 'Mon - Fri: 9:00 AM - 6:00 PM',
    topBarVariant: 'primary',
    topBarBackgroundColor: '',
    logo_url: '',
    logo_text: 'Organization Name',
    logo_alt: 'Organization Logo',
    logo_href: '/',
    logo_height: 38,
    menus: [
      { label: 'Home', path: '/' },
      { label: 'About', path: '/about' },
      {
        label: 'Services',
        path: '/services',
        children: [
          { label: 'Service One', path: '/services/one' },
          { label: 'Service Two', path: '/services/two' },
        ],
      },
      { label: 'Resources', path: '/resources' },
      { label: 'Contact', path: '/contact' },
    ],
    login_label: 'Login',
    login_href: '/login',
    cta_label: 'Get Started',
    cta_href: '/contact',
    variant: 'light',
    backgroundColor: '',
    sticky: true,
  },
  render: (props) => <ContactNavigationHeaderComponent {...props} />,
};

// Backwards-compatibility alias
export const ContactHeader = ContactNavigationHeader;
export const ContactHeaderComponent = ContactNavigationHeaderComponent;
