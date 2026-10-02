'use client';

import { useMemo, useState } from 'react';
import { Dropdown, Button, Drawer } from 'antd';
import {
  DownOutlined,
  MenuOutlined,
  CloseOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { StudioLink as Link } from '../context';

/**
 * Pure React component for the Navigation Header.
 * Can be used standalone outside Puck or rendered by the Puck NavigationHeader block.
 */
export function NavigationHeaderComponent({
  logo,
  logo_url,
  logo_alt = 'Logo',
  logo_href = '/',
  logo_text,
  logo_height = 36,
  menus = [],
  activePath,
  currentPath,
  isActive,
  actions,
  cta_label,
  cta_href,
  variant = 'light',
  background,
  sticky = false,
  maxWidth = 'var(--tps-max, 1240px)',
  className = '',
  style = {},
  onNavigate,
  renderLink,
  renderLogo,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileKeys, setExpandedMobileKeys] = useState({});

  const effectiveActivePath = activePath !== undefined ? activePath : currentPath;

  // Check if a menu item or any of its descendants is currently active
  const checkIsActive = (item) => {
    if (typeof isActive === 'function') {
      return Boolean(isActive(item, effectiveActivePath));
    }
    if (!effectiveActivePath) return false;
    const itemPath = item.path || item.href;
    if (itemPath && itemPath === effectiveActivePath) {
      return true;
    }
    if (Array.isArray(item.children)) {
      return item.children.some((child) => checkIsActive(child));
    }
    return false;
  };

  // Normalize logo configuration
  const logoConfig = useMemo(() => {
    if (typeof logo === 'string') {
      return {
        url: logo,
        alt: logo_alt,
        href: logo_href,
        text: logo_text,
        height: logo_height,
      };
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
    if (cta_label) {
      return [
        {
          label: cta_label,
          href: cta_href || '#',
          variant: 'primary',
        },
      ];
    }
    return [];
  }, [actions, cta_label, cta_href]);

  // Handle menu item navigation
  const handleItemClick = (item, e) => {
    if (item.onClick) {
      item.onClick(item, e);
    }
    const path = item.path || item.href;
    if (path && onNavigate) {
      onNavigate(path, item, e);
    }
    setMobileMenuOpen(false);
  };

  // Convert menu children structure recursively for AntD Dropdown
  const buildAntDMenuItems = (children, parentKey = 'sub') => {
    if (!Array.isArray(children)) return [];
    return children.map((child, idx) => {
      const key = child.key || `${parentKey}-${idx}`;
      const hasSubChildren = Array.isArray(child.children) && child.children.length > 0;
      const childActive = checkIsActive(child);
      const childPath = child.path || child.href;

      if (hasSubChildren) {
        return {
          key,
          label: (
            <span className={`tps-dropdown-item ${childActive ? 'tps-dropdown-item--active' : ''}`}>
              {child.icon && <span className="tps-dropdown-item__icon">{child.icon}</span>}
              <span>{child.label}</span>
            </span>
          ),
          children: buildAntDMenuItems(child.children, key),
          disabled: child.disabled,
        };
      }

      return {
        key,
        label: childPath ? (
          renderLink ? (
            renderLink({
              href: childPath,
              className: `tps-dropdown-item ${childActive ? 'tps-dropdown-item--active' : ''}`,
              children: (
                <>
                  {child.icon && <span className="tps-dropdown-item__icon">{child.icon}</span>}
                  <span>{child.label}</span>
                </>
              ),
              onClick: (e) => handleItemClick(child, e),
            })
          ) : (
            <Link
              href={childPath}
              target={child.target}
              className={`tps-dropdown-item ${childActive ? 'tps-dropdown-item--active' : ''}`}
              onClick={(e) => handleItemClick(child, e)}
            >
              {child.icon && <span className="tps-dropdown-item__icon">{child.icon}</span>}
              <span>{child.label}</span>
            </Link>
          )
        ) : (
          <span
            className={`tps-dropdown-item ${childActive ? 'tps-dropdown-item--active' : ''}`}
            onClick={(e) => handleItemClick(child, e)}
          >
            {child.icon && <span className="tps-dropdown-item__icon">{child.icon}</span>}
            <span>{child.label}</span>
          </span>
        ),
        disabled: child.disabled,
      };
    });
  };

  // Render individual top-level menu item
  const renderTopMenuItem = (menu, index) => {
    const hasChildren = Array.isArray(menu.children) && menu.children.length > 0;
    const active = checkIsActive(menu);
    const itemPath = menu.path || menu.href;
    const itemKey = menu.key || `menu-${index}`;

    if (hasChildren) {
      const dropdownItems = buildAntDMenuItems(menu.children, itemKey);
      return (
        <Dropdown
          key={itemKey}
          menu={{ items: dropdownItems }}
          placement="bottomLeft"
          trigger={['hover', 'click']}
          arrow
        >
          <button
            type="button"
            className={`tps-nav-link tps-nav-link--dropdown ${
              active ? 'tps-nav-link--active' : ''
            }`}
            aria-haspopup="true"
            aria-expanded="false"
          >
            {menu.icon && <span className="tps-nav-link__icon">{menu.icon}</span>}
            <span>{menu.label}</span>
            <DownOutlined className="tps-nav-link__chevron" />
          </button>
        </Dropdown>
      );
    }

    if (itemPath) {
      if (renderLink) {
        return (
          <span key={itemKey} className="tps-nav-link-wrap">
            {renderLink({
              href: itemPath,
              className: `tps-nav-link ${active ? 'tps-nav-link--active' : ''}`,
              children: (
                <>
                  {menu.icon && <span className="tps-nav-link__icon">{menu.icon}</span>}
                  <span>{menu.label}</span>
                </>
              ),
              onClick: (e) => handleItemClick(menu, e),
            })}
          </span>
        );
      }
      return (
        <Link
          key={itemKey}
          href={itemPath}
          target={menu.target}
          className={`tps-nav-link ${active ? 'tps-nav-link--active' : ''}`}
          onClick={(e) => handleItemClick(menu, e)}
        >
          {menu.icon && <span className="tps-nav-link__icon">{menu.icon}</span>}
          <span>{menu.label}</span>
        </Link>
      );
    }

    return (
      <button
        key={itemKey}
        type="button"
        className={`tps-nav-link ${active ? 'tps-nav-link--active' : ''}`}
        onClick={(e) => handleItemClick(menu, e)}
      >
        {menu.icon && <span className="tps-nav-link__icon">{menu.icon}</span>}
        <span>{menu.label}</span>
      </button>
    );
  };

  // Toggle mobile submenu accordion
  const toggleMobileSubmenu = (key) => {
    setExpandedMobileKeys((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Render mobile menu hierarchy recursively
  const renderMobileMenuItems = (items, parentKey = 'mobile', level = 0) => {
    if (!Array.isArray(items)) return null;
    return items.map((item, idx) => {
      const key = `${parentKey}-${idx}`;
      const hasChildren = Array.isArray(item.children) && item.children.length > 0;
      const isExpanded = Boolean(expandedMobileKeys[key]);
      const active = checkIsActive(item);
      const itemPath = item.path || item.href;

      return (
        <div key={key} className="tps-mobile-nav__item-group" style={{ paddingLeft: level * 16 }}>
          <div className={`tps-mobile-nav__row ${active ? 'tps-mobile-nav__row--active' : ''}`}>
            {itemPath && !hasChildren ? (
              <Link
                href={itemPath}
                target={item.target}
                className="tps-mobile-nav__link"
                onClick={(e) => handleItemClick(item, e)}
              >
                {item.icon && <span className="tps-mobile-nav__icon">{item.icon}</span>}
                <span>{item.label}</span>
              </Link>
            ) : (
              <button
                type="button"
                className="tps-mobile-nav__link"
                onClick={(e) => {
                  if (hasChildren) {
                    toggleMobileSubmenu(key);
                  } else {
                    handleItemClick(item, e);
                  }
                }}
              >
                {item.icon && <span className="tps-mobile-nav__icon">{item.icon}</span>}
                <span>{item.label}</span>
              </button>
            )}

            {hasChildren && (
              <button
                type="button"
                className="tps-mobile-nav__toggle"
                onClick={() => toggleMobileSubmenu(key)}
                aria-label="Toggle Submenu"
              >
                {isExpanded ? <DownOutlined /> : <RightOutlined />}
              </button>
            )}
          </div>

          {hasChildren && isExpanded && (
            <div className="tps-mobile-nav__children">
              {renderMobileMenuItems(item.children, key, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  // Theme / background styling
  const bgVariant = background || variant;
  const isDark = bgVariant === 'dark';
  const isSoft = bgVariant === 'soft';
  const isTransparent = bgVariant === 'transparent';

  const containerStyle = {
    maxWidth,
    ...style,
  };

  return (
    <header
      className={`tps-nav-header ${isDark ? 'tps-nav-header--dark' : ''} ${
        isSoft ? 'tps-nav-header--soft' : ''
      } ${isTransparent ? 'tps-nav-header--transparent' : ''} ${
        sticky ? 'tps-nav-header--sticky' : ''
      } ${className}`.trim()}
    >
      <div className="tps-nav-header__container" style={containerStyle}>
        {/* Left Section: Logo */}
        <div className="tps-nav-header__left" role="banner">
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
                  height: logoConfig.height || 36,
                  width: logoConfig.width || 'auto',
                  maxHeight: 56,
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

        {/* Center / Main Section: Dynamic Navigation Menus */}
        <nav className="tps-nav-header__nav" aria-label="Main Navigation">
          <div className="tps-nav-header__menu-list">
            {Array.isArray(menus) && menus.map((menu, index) => renderTopMenuItem(menu, index))}
          </div>
        </nav>

        {/* Right Section: Actions & Mobile Toggle */}
        <div className="tps-nav-header__right">
          {normalizedActions.length > 0 && (
            <div className="tps-nav-header__actions">
              {normalizedActions.map((action, idx) => (
                <div key={idx} className="tps-nav-header__action-item">
                  {action.href && !action.onClick ? (
                    <Link href={action.href}>
                      <Button
                        type={action.variant === 'primary' ? 'primary' : 'default'}
                        className="tps-header-btn"
                        icon={action.icon}
                        disabled={action.disabled}
                      >
                        {action.label}
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      type={action.variant === 'primary' ? 'primary' : 'default'}
                      className="tps-header-btn"
                      icon={action.icon}
                      disabled={action.disabled}
                      onClick={(e) => action.onClick && action.onClick(e)}
                    >
                      {action.label}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Mobile hamburger menu button */}
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

      {/* Mobile Drawer Navigation */}
      <Drawer
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        placement="right"
        width={300}
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
          <div className="tps-mobile-nav__list">
            {renderMobileMenuItems(menus)}
          </div>
          {normalizedActions.length > 0 && (
            <div className="tps-mobile-nav__actions" style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {normalizedActions.map((action, idx) => (
                <Button
                  key={idx}
                  type={action.variant === 'primary' ? 'primary' : 'default'}
                  block
                  href={action.href}
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    if (action.onClick) action.onClick(e);
                  }}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </Drawer>
    </header>
  );
}

/**
 * Puck Block configuration for NavigationHeader.
 */
export const NavigationHeader = {
  label: 'Navigation header',
  fields: {
    // Logo
    logo_url: { type: 'text', label: 'Logo image URL' },
    logo_alt: { type: 'text', label: 'Logo alt text' },
    logo_text: { type: 'text', label: 'Brand text (fallback)' },
    logo_href: { type: 'text', label: 'Logo link URL' },
    logo_height: { type: 'number', label: 'Logo height (px)' },
    // Menus
    menus: {
      type: 'array',
      label: 'Menu items',
      arrayFields: {
        label: { type: 'text', label: 'Menu label' },
        path: { type: 'text', label: 'Path / URL (for direct links)' },
        children: {
          type: 'array',
          label: 'Child items (dropdown)',
          arrayFields: {
            label: { type: 'text', label: 'Child label' },
            path: { type: 'text', label: 'Child path / URL' },
          },
          defaultItemProps: { label: 'Subpage', path: '/subpage' },
          getItemSummary: (child, j) => child?.label || `Sub item ${j + 1}`,
        },
      },
      defaultItemProps: { label: 'New Item', path: '/' },
      getItemSummary: (item, i) => item?.label || `Menu ${i + 1}`,
    },
    // Optional Right CTA
    cta_label: { type: 'text', label: 'CTA button label' },
    cta_href: { type: 'text', label: 'CTA button link' },
    // Styling
    variant: {
      type: 'select',
      label: 'Color scheme',
      options: [
        { label: 'Light', value: 'light' },
        { label: 'Soft', value: 'soft' },
        { label: 'Dark', value: 'dark' },
        { label: 'Transparent', value: 'transparent' },
      ],
    },
    sticky: {
      type: 'radio',
      label: 'Sticky header',
      options: [
        { label: 'No', value: false },
        { label: 'Yes', value: true },
      ],
    },
  },
  defaultProps: {
    logo_url: '',
    logo_text: 'PageStudio',
    logo_alt: 'Page Studio Logo',
    logo_href: '/',
    logo_height: 36,
    menus: [
      { label: 'Home', path: '/' },
      { label: 'About', path: '/about' },
      {
        label: 'Courses',
        children: [
          { label: 'LLB', path: '/courses/llb' },
          { label: 'BA LLB', path: '/courses/ba-llb' },
          { label: 'LLM', path: '/courses/llm' },
        ],
      },
      { label: 'Contact', path: '/contact' },
    ],
    cta_label: 'Get Started',
    cta_href: '/get-started',
    variant: 'light',
    sticky: false,
  },
  render: (props) => <NavigationHeaderComponent {...props} />,
};
