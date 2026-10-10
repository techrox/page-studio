// MastheadHeader - the university-style masthead: a primary title + subtitle
// on the left, an optional translated title + subtitle on the right, and a
// round crest centred between them that straddles the coloured navigation
// bar underneath.
//
// Two behaviours the block is built around:
//   1. `sticky` pins the whole masthead to the top of the viewport.
//   2. `shrink_on_scroll` compacts it once the page scrolls past
//      `shrink_after` px - titles/subtitles drop a size, the crest scales
//      down and the band padding tightens, so the masthead keeps the page
//      content in view without disappearing.
//
// SSR-safe: the scroll listener lives in an effect, the render path never
// touches `window`. Layout is CSS-driven (`.is-compact` on the root), so the
// block renders identically on first paint whether or not JS is available.

import { useEffect, useMemo, useState } from 'react';
import { Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { StudioLink as Link, useStudio } from '../context';

function normalizePath(path) {
  if (!path) return '';
  const clean = String(path).split('?')[0].split('#')[0].replace(/\/+$/, '');
  return clean || '/';
}

function initialsOf(...candidates) {
  for (const candidate of candidates) {
    const words = String(candidate || '')
      .replace(/[()]/g, ' ')
      .split(/\s+/)
      .filter(Boolean);
    if (words.length > 0) {
      return words
        .slice(0, 3)
        .map((word) => word[0])
        .join('')
        .toUpperCase();
    }
  }
  return '';
}

/**
 * Pure React component for the Masthead Header.
 * Can be used standalone outside Puck or rendered by the Puck MastheadHeader block.
 */
export function MastheadHeaderComponent({
  title = '',
  subtitle = '',
  title_alt = '',
  subtitle_alt = '',
  crest_url = '',
  crest_alt = 'Crest',
  crest_href = '/',
  crest_size = 116,
  menus = [],
  bar_color = '',
  bar_text_color = '',
  title_color = '',
  subtitle_color = '',
  font_family = '',
  variant = 'light',
  backgroundColor = '',
  sticky = true,
  shrink_on_scroll = true,
  shrink_after = 60,
  maxWidth = '100%',
  className = '',
  style = {},
  activePath,
  currentPath,
  isActive,
  onNavigate,
  renderLink,
  renderCrest,
}) {
  const studio = useStudio();
  const [compact, setCompact] = useState(false);

  // Compact once the page has scrolled past the threshold. Reads on mount too
  // so a restored scroll position doesn't flash the full-size masthead.
  useEffect(() => {
    if (!shrink_on_scroll) {
      setCompact(false);
      return undefined;
    }
    const threshold = Math.max(0, Number(shrink_after) || 0);
    const read = () => {
      const y =
        typeof window !== 'undefined'
          ? window.scrollY || document.documentElement.scrollTop || 0
          : 0;
      setCompact(y > threshold);
    };
    read();
    window.addEventListener('scroll', read, { passive: true });
    window.addEventListener('resize', read);
    return () => {
      window.removeEventListener('scroll', read);
      window.removeEventListener('resize', read);
    };
  }, [shrink_on_scroll, shrink_after]);

  const effectiveActivePath = useMemo(() => {
    if (activePath !== undefined) return activePath;
    if (currentPath !== undefined) return currentPath;
    if (studio?.activePath !== undefined) return studio.activePath;
    if (studio?.currentPath !== undefined) return studio.currentPath;
    if (typeof window !== 'undefined') return window.location.pathname;
    return undefined;
  }, [activePath, currentPath, studio?.activePath, studio?.currentPath]);

  const checkIsActive = (item) => {
    if (!item) return false;
    if (typeof isActive === 'function') return Boolean(isActive(item, effectiveActivePath));
    if (!effectiveActivePath) return false;
    const itemPath = item.path || item.href;
    if (itemPath) {
      const cleanItem = normalizePath(itemPath);
      const cleanActive = normalizePath(effectiveActivePath);
      if (cleanItem === cleanActive) return true;
      if (cleanItem !== '/' && cleanActive.endsWith(cleanItem)) return true;
    }
    return Array.isArray(item.children) && item.children.some(checkIsActive);
  };

  const handleItemClick = (item, event) => {
    if (typeof item.onClick === 'function') item.onClick(item, event);
    const path = item.path || item.href;
    if (path && onNavigate) onNavigate(path, item, event);
  };

  const linkClass = (item) =>
    `tps-masthead__link${checkIsActive(item) ? ' is-active' : ''}`;

  const renderLinkNode = (item, content) => {
    const path = item.path || item.href;
    const node = content !== undefined ? content : item.label;
    if (renderLink) {
      return renderLink({
        href: path,
        className: linkClass(item),
        children: node,
        onClick: (event) => handleItemClick(item, event),
      });
    }
    if (!path) {
      return (
        <button
          type="button"
          className={linkClass(item)}
          onClick={(event) => handleItemClick(item, event)}
        >
          {node}
        </button>
      );
    }
    return (
      <Link
        href={path}
        target={item.target}
        className={linkClass(item)}
        onClick={(event) => handleItemClick(item, event)}
      >
        {node}
      </Link>
    );
  };

  const renderItem = (item, index) => {
    if (!item || !item.label) return null;
    const key = item.key || `masthead-${index}`;
    const children = Array.isArray(item.children)
      ? item.children.filter((child) => child && child.label)
      : [];

    if (children.length > 0) {
      const dropdownItems = children.map((child, childIndex) => ({
        key: child.key || `${key}-${childIndex}`,
        label: renderLinkNode(
          child,
          <span
            className={`tps-dropdown-item${
              checkIsActive(child) ? ' tps-dropdown-item--active' : ''
            }`}
          >
            {child.label}
          </span>
        ),
      }));
      return (
        <Dropdown
          key={key}
          menu={{ items: dropdownItems }}
          trigger={['hover', 'click']}
          placement="bottomLeft"
        >
          <button
            type="button"
            className={`${linkClass(item)} tps-masthead__link--dropdown`}
            aria-haspopup="true"
            onClick={(event) => handleItemClick(item, event)}
          >
            <span>{item.label}</span>
            <DownOutlined className="tps-masthead__chevron" />
          </button>
        </Dropdown>
      );
    }

    return renderLinkNode(item);
  };

  const items = Array.isArray(menus) ? menus.filter((item) => item && item.label) : [];
  const splitAt = Math.ceil(items.length / 2);
  const startItems = items.slice(0, splitAt);
  const endItems = items.slice(splitAt);

  const initials = initialsOf(title, title_alt);

  const cssVars = {
    '--tps-masthead-crest-base': `${Math.max(48, Number(crest_size) || 116)}px`,
  };
  if (title_color) cssVars['--tps-masthead-title'] = title_color;
  if (subtitle_color) cssVars['--tps-masthead-subtitle'] = subtitle_color;
  if (bar_color) cssVars['--tps-masthead-bar'] = bar_color;
  if (bar_text_color) cssVars['--tps-masthead-bar-text'] = bar_text_color;
  if (font_family) cssVars['--tps-masthead-font'] = font_family;

  const headerClass = [
    'tps-masthead',
    variant === 'soft' && 'tps-masthead--soft',
    variant === 'dark' && 'tps-masthead--dark',
    variant === 'transparent' && 'tps-masthead--transparent',
    sticky && 'tps-masthead--sticky',
    compact && 'is-compact',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const crest = renderCrest ? (
    renderCrest({ url: crest_url, alt: crest_alt, href: crest_href, initials })
  ) : crest_url ? (
    <Link href={crest_href || '/'} className="tps-masthead__crest-link" aria-label={crest_alt || 'Home'}>
      <img className="tps-masthead__crest-img" src={crest_url} alt={crest_alt || 'Crest'} />
    </Link>
  ) : initials ? (
    <Link href={crest_href || '/'} className="tps-masthead__crest-link" aria-label={crest_alt || 'Home'}>
      <span className="tps-masthead__crest-fallback" aria-hidden="true">
        {initials}
      </span>
    </Link>
  ) : null;

  return (
    <header
      className={headerClass}
      style={{
        ...cssVars,
        ...(backgroundColor ? { backgroundColor } : {}),
        ...style,
      }}
    >
      <div className="tps-masthead__band" style={maxWidth ? { maxWidth } : undefined}>
        <div className="tps-masthead__side tps-masthead__side--start">
          {title && <span className="tps-masthead__title">{title}</span>}
          {subtitle && <span className="tps-masthead__subtitle">{subtitle}</span>}
        </div>

        <div className="tps-masthead__crest-cell">
          <div className="tps-masthead__crest">{crest}</div>
        </div>

        <div className="tps-masthead__side tps-masthead__side--end">
          {title_alt && <span className="tps-masthead__title">{title_alt}</span>}
          {subtitle_alt && <span className="tps-masthead__subtitle">{subtitle_alt}</span>}
        </div>
      </div>

      <div className="tps-masthead__bar">
        <nav
          className="tps-masthead__nav"
          style={maxWidth ? { maxWidth } : undefined}
          aria-label="Primary"
        >
          <ul className="tps-masthead__menu tps-masthead__menu--start">
            {startItems.map((item, index) => (
              <li className="tps-masthead__item" key={item.key || `start-${index}`}>
                {renderItem(item, index)}
              </li>
            ))}
          </ul>
          <span className="tps-masthead__crest-gap" aria-hidden="true" />
          <ul className="tps-masthead__menu tps-masthead__menu--end">
            {endItems.map((item, index) => (
              <li className="tps-masthead__item" key={item.key || `end-${index}`}>
                {renderItem(item, index + splitAt)}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

/**
 * Puck block configuration for MastheadHeader.
 */
export const MastheadHeader = {
  label: 'Masthead header',
  fields: {
    title: { type: 'text', label: 'Primary title' },
    subtitle: { type: 'text', label: 'Primary subtitle' },
    title_alt: { type: 'text', label: 'Secondary title (right, e.g. translation)' },
    subtitle_alt: { type: 'text', label: 'Secondary subtitle' },
    crest_url: { type: 'text', label: 'Centre crest image URL' },
    crest_alt: { type: 'text', label: 'Crest alt text' },
    crest_href: { type: 'text', label: 'Crest link URL' },
    crest_size: { type: 'number', label: 'Crest size (px)' },
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
    sticky: {
      type: 'radio',
      label: 'Sticky header',
      options: [
        { label: 'No', value: false },
        { label: 'Yes', value: true },
      ],
    },
    shrink_on_scroll: {
      type: 'radio',
      label: 'Shrink text on scroll',
      options: [
        { label: 'No', value: false },
        { label: 'Yes', value: true },
      ],
    },
    shrink_after: { type: 'number', label: 'Shrink after scroll (px)' },
    title_color: { type: 'text', label: 'Title color (empty = brand default)' },
    subtitle_color: { type: 'text', label: 'Subtitle color (empty = brand default)' },
    bar_color: { type: 'text', label: 'Nav bar color (empty = brand default)' },
    bar_text_color: { type: 'text', label: 'Nav bar text color (empty = brand default)' },
    font_family: {
      type: 'select',
      label: 'Font style',
      options: [
        { label: 'Default / Inherit (Match site)', value: '' },
        { label: 'Serif (Classic university)', value: "Georgia, 'Times New Roman', serif" },
        { label: 'Monospace', value: 'ui-monospace, monospace' },
      ],
    },
    variant: {
      type: 'select',
      label: 'Band background / Color scheme',
      options: [
        { label: 'Light', value: 'light' },
        { label: 'Soft', value: 'soft' },
        { label: 'Dark', value: 'dark' },
        { label: 'Transparent', value: 'transparent' },
      ],
    },
    backgroundColor: { type: 'text', label: 'Band background color (hex/CSS)' },
    maxWidth: { type: 'text', label: 'Content max width' },
  },
  defaultProps: {
    title: 'Organization Name',
    subtitle: 'Your tagline or department name',
    title_alt: '',
    subtitle_alt: '',
    crest_url: '',
    crest_alt: 'Organization crest',
    crest_href: '/',
    crest_size: 116,
    menus: [
      { label: 'About', path: '/about' },
      { label: 'Services', path: '/services' },
      { label: 'Products', path: '/products' },
      { label: 'Resources', path: '/resources' },
      { label: 'News', path: '/news' },
      { label: 'Contact', path: '/contact' },
    ],
    sticky: true,
    shrink_on_scroll: true,
    shrink_after: 60,
    title_color: '',
    subtitle_color: '',
    bar_color: '',
    bar_text_color: '',
    font_family: '',
    variant: 'light',
    backgroundColor: '',
    maxWidth: '100%',
  },
  render: (props) => <MastheadHeaderComponent {...props} />,
};
