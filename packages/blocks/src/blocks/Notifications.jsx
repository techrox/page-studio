'use client';

import { useMemo } from 'react';
import { StudioLink as Link } from '../context';
import { htmlField } from './HtmlField.jsx';

/**
 * Pure React component for Notifications Board / Container with auto-scroll.
 * Functions as a customizable container card with header, optional "New" badge per item,
 * HTML text, extra links, adjustable dimensions, and seamless auto-scrolling ticker.
 */
export function NotificationsComponent({
  title = 'Notifications & Announcements',
  badge_text = 'Notice Board',
  items = [],
  speed = 25,
  direction = 'up',
  pauseOnHover = true,
  height = 360,
  maxHeight,
  maxWidth = '100%',
  variant = 'card',
  headerBackground,
  backgroundColor,
  textColor,
  showBorder = true,
  viewAllLink = '',
  viewAllText = 'View all notices',
  className = '',
  style = {},
}) {
  // Sort items ascending by order (items with explicit order 1, 2, 3... come first)
  const sortedItems = useMemo(() => {
    if (!Array.isArray(items) || items.length === 0) return [];
    return [...items].sort((a, b) => {
      const orderA = typeof a?.order === 'number' ? a.order : (Number(a?.order) || 9999);
      const orderB = typeof b?.order === 'number' ? b.order : (Number(b?.order) || 9999);
      return orderA - orderB;
    });
  }, [items]);

  const hasHeader = Boolean((title && String(title).trim()) || (badge_text && String(badge_text).trim()) || (viewAllLink && String(viewAllLink).trim()));
  const isVertical = direction === 'up' || direction === 'down';
  const durationSec = Math.max(5, Number(speed) || 25);

  const containerStyle = {
    maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
    ...(backgroundColor ? { backgroundColor } : {}),
    ...(textColor ? { color: textColor } : {}),
    ...style,
  };

  const viewportStyle = {
    ...(isVertical
      ? {
          height: typeof height === 'number' ? `${height}px` : height,
          maxHeight: maxHeight ? (typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight) : undefined,
        }
      : {}),
  };

  if (sortedItems.length === 0) {
    return null;
  }

  const renderNotificationItem = (item, key) => {
    const isNew = Boolean(item.is_new);
    const dateText = item.date ? String(item.date).trim() : '';

    return (
      <div key={key} className="tps-notifications__item">
        <div className="tps-notifications__item-header">
          {isNew && (
            <span className="tps-notifications__new-badge" aria-label="New item">
              {item.new_badge_text || 'NEW'}
            </span>
          )}
          {dateText && (
            <span className="tps-notifications__date">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {dateText}
            </span>
          )}
        </div>

        <div className="tps-notifications__content">
          {item.text ? (
            <div
              className="tps-notifications__html"
              dangerouslySetInnerHTML={{ __html: item.text }}
            />
          ) : null}

          {item.link_label && item.link_href && (
            <div className="tps-notifications__link-wrap">
              <Link href={item.link_href} className="tps-notifications__action-link">
                {item.link_label}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`tps-notifications tps-notifications--${variant} ${showBorder ? 'tps-notifications--bordered' : ''} ${className}`.trim()}
      style={containerStyle}
      role="region"
      aria-label={title || 'Notifications'}
    >
      {hasHeader && (
        <div
          className="tps-notifications__header"
          style={headerBackground ? { backgroundColor: headerBackground } : {}}
        >
          <div className="tps-notifications__header-left">
            {badge_text && (
              <span className="tps-notifications__badge">{badge_text}</span>
            )}
            {title && (
              <h3 className="tps-notifications__title">{title}</h3>
            )}
          </div>
          {viewAllLink && (
            <Link href={viewAllLink} className="tps-notifications__view-all">
              {viewAllText} &rarr;
            </Link>
          )}
        </div>
      )}

      <div
        className={`tps-notifications__viewport tps-notifications__viewport--${isVertical ? 'vertical' : 'horizontal'}`}
        style={viewportStyle}
      >
        <div
          className={`tps-notifications__track tps-notifications__track--${direction} ${
            pauseOnHover ? 'tps-notifications__track--pause-hover' : ''
          }`}
          style={{ animationDuration: `${durationSec}s` }}
        >
          {/* Main sequence */}
          <div className="tps-notifications__group">
            {sortedItems.map((item, idx) =>
              renderNotificationItem(item, item.id || `notif-a-${idx}`),
            )}
          </div>

          {/* Duplicate sequence for seamless loop */}
          <div className="tps-notifications__group" aria-hidden="true">
            {sortedItems.map((item, idx) =>
              renderNotificationItem(item, item.id ? `dup-${item.id}` : `notif-b-${idx}`),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Puck Block configuration for Notifications Container.
 */
export const Notifications = {
  label: 'Notifications board',
  fields: {
    title: {
      type: 'text',
      label: 'Card title (e.g. Latest Announcements)',
    },
    badge_text: {
      type: 'text',
      label: 'Header badge pill (e.g. Notice Board, Live)',
    },
    items: {
      type: 'array',
      label: 'Notification items',
      arrayFields: {
        is_new: {
          type: 'radio',
          label: "Show 'NEW' tag",
          options: [
            { label: 'Yes (Active)', value: true },
            { label: 'No', value: false },
          ],
        },
        new_badge_text: {
          type: 'text',
          label: "Tag text (defaults to 'NEW')",
        },
        order: {
          type: 'number',
          label: 'Order / Priority (e.g. 1, 2, 3)',
        },
        date: {
          type: 'text',
          label: 'Date / Timestamp (e.g. Oct 07, 2026)',
        },
        text: htmlField('HTML content / Announcement body'),
        link_label: {
          type: 'text',
          label: 'Action link label (optional, e.g. View Circular)',
        },
        link_href: {
          type: 'text',
          label: 'Action link URL (e.g. /circulars/oct-2026)',
        },
      },
      defaultItemProps: {
        is_new: true,
        new_badge_text: 'NEW',
        order: 1,
        date: 'Today',
        text: 'Important notification details with <strong>bold emphasis</strong>.',
        link_label: 'Read more',
        link_href: '#',
      },
      getItemSummary: (item, i) =>
        `${item?.is_new ? '[NEW] ' : ''}[#${item?.order ?? i + 1}] ${(item?.text || 'Notification')
          .replace(/<[^>]*>/g, '')
          .slice(0, 30)}...`,
    },
    direction: {
      type: 'select',
      label: 'Auto-scroll direction',
      options: [
        { label: 'Vertical Up (Bottom to Top)', value: 'up' },
        { label: 'Vertical Down (Top to Bottom)', value: 'down' },
        { label: 'Horizontal Left (Right to Left)', value: 'left' },
        { label: 'Horizontal Right (Left to Right)', value: 'right' },
      ],
    },
    speed: {
      type: 'number',
      label: 'Scroll speed (seconds per cycle, e.g. 20-30)',
    },
    pauseOnHover: {
      type: 'radio',
      label: 'Pause scrolling on hover',
      options: [
        { label: 'Yes', value: true },
        { label: 'No', value: false },
      ],
    },
    height: {
      type: 'number',
      label: 'Container height (px, for vertical scroll)',
    },
    maxWidth: {
      type: 'text',
      label: 'Container max width (e.g. 100%, 480px, 600px)',
    },
    variant: {
      type: 'select',
      label: 'Container theme / style',
      options: [
        { label: 'Card (White surface with shadow)', value: 'card' },
        { label: 'Soft (Subtle tint background)', value: 'soft' },
        { label: 'Primary (Brand primary highlight)', value: 'primary' },
        { label: 'Dark (Modern dark container)', value: 'dark' },
        { label: 'Minimal (Clean transparent box)', value: 'minimal' },
      ],
    },
    showBorder: {
      type: 'radio',
      label: 'Show container border',
      options: [
        { label: 'Yes', value: true },
        { label: 'No', value: false },
      ],
    },
    viewAllLink: {
      type: 'text',
      label: 'Header footer / View All URL (optional)',
    },
    viewAllText: {
      type: 'text',
      label: 'View All link text',
    },
    headerBackground: {
      type: 'text',
      label: 'Custom header background (hex/CSS, optional)',
    },
    backgroundColor: {
      type: 'text',
      label: 'Custom box background color (hex/CSS, optional)',
    },
    textColor: {
      type: 'text',
      label: 'Custom text color (hex/CSS, optional)',
    },
  },
  defaultProps: {
    title: 'Notifications & Announcements',
    badge_text: 'Notice Board',
    items: [
      {
        is_new: true,
        new_badge_text: 'NEW',
        order: 1,
        date: 'Oct 07, 2026',
        text: 'Admissions Open for <strong>B.A. LL.B. (Hons)</strong> &amp; <strong>LL.B. 3-Year</strong> batch 2026-27.',
        link_label: 'Download Prospectus',
        link_href: '/admissions',
      },
      {
        is_new: true,
        new_badge_text: 'NEW',
        order: 2,
        date: 'Oct 05, 2026',
        text: 'National Moot Court Competition registration deadline extended till <strong>October 25</strong>.',
        link_label: 'View Circular',
        link_href: '/moot-court',
      },
      {
        is_new: false,
        new_badge_text: 'NEW',
        order: 3,
        date: 'Sep 28, 2026',
        text: 'Special Guest Lecture on <em>Corporate Law and Arbitration</em> at Moot Court Hall on Friday.',
        link_label: 'Schedule details',
        link_href: '/events',
      },
      {
        is_new: false,
        new_badge_text: 'NEW',
        order: 4,
        date: 'Sep 20, 2026',
        text: 'PRIST Law Library subscriptions renewed for <strong>SCC Online</strong> and <strong>Manupatra</strong>.',
        link_label: 'Access Portal',
        link_href: '/library',
      },
    ],
    direction: 'up',
    speed: 22,
    pauseOnHover: true,
    height: 380,
    maxWidth: '100%',
    variant: 'card',
    showBorder: true,
    viewAllLink: '/news',
    viewAllText: 'All Notices',
    headerBackground: '',
    backgroundColor: '',
    textColor: '',
  },
  render: (props) => <NotificationsComponent {...props} />,
};
