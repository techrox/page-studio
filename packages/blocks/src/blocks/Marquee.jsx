'use client';

import { useMemo } from 'react';
import { StudioLink as Link } from '../context';
import { htmlField } from './HtmlField.jsx';

/**
 * Pure React component for running ticker / marquee text with HTML link support.
 * Items run in the order defined by the `order` property.
 */
export function MarqueeComponent({
  items = [],
  badge_text = 'Updates',
  speed = 30,
  direction = 'left',
  pauseOnHover = true,
  separator = '•',
  variant = 'primary',
  backgroundColor,
  textColor,
  fontSize = 14,
  gap = 32,
  maxWidth = '100%',
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

  // Compute container and text styling
  const customStyle = {
    fontSize: typeof fontSize === 'number' ? `${fontSize}px` : fontSize,
    maxWidth,
    ...(backgroundColor ? { backgroundColor } : {}),
    ...(textColor ? { color: textColor } : {}),
    ...style,
  };

  const hasBadge = Boolean(badge_text && String(badge_text).trim());

  if (sortedItems.length === 0) {
    return null;
  }

  const renderItemContent = (item, key) => (
    <span key={key} className="tps-marquee__item">
      {item.text ? (
        <span
          className="tps-marquee__html"
          dangerouslySetInnerHTML={{ __html: item.text }}
        />
      ) : null}
      {item.link_label && item.link_href && (
        <Link href={item.link_href} className="tps-marquee__extra-link">
          {item.link_label}
        </Link>
      )}
      {separator && separator !== 'none' && (
        <span className="tps-marquee__separator" aria-hidden="true">
          {separator}
        </span>
      )}
    </span>
  );

  const durationSec = Math.max(5, Number(speed) || 30);

  return (
    <div
      className={`tps-marquee tps-marquee--${variant} ${className}`.trim()}
      style={customStyle}
      role="region"
      aria-label="Marquee Announcements"
    >
      {hasBadge && (
        <div className="tps-marquee__badge-wrap">
          <span className="tps-marquee__badge">{badge_text}</span>
        </div>
      )}

      <div className="tps-marquee__viewport">
        <div
          className={`tps-marquee__track ${
            pauseOnHover ? 'tps-marquee__track--pause-hover' : ''
          } ${direction === 'right' ? 'tps-marquee__track--reverse' : ''}`}
          style={{ animationDuration: `${durationSec}s` }}
        >
          {/* First sequence */}
          <div className="tps-marquee__group" style={{ paddingRight: `${gap}px` }}>
            {sortedItems.map((item, idx) =>
              renderItemContent(item, item.id || `item-a-${idx}`),
            )}
          </div>

          {/* Second duplicate sequence for seamless infinite loop */}
          <div
            className="tps-marquee__group"
            style={{ paddingRight: `${gap}px` }}
            aria-hidden="true"
          >
            {sortedItems.map((item, idx) =>
              renderItemContent(item, item.id ? `dup-${item.id}` : `item-b-${idx}`),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Puck Block configuration for Marquee.
 */
export const Marquee = {
  label: 'Marquee banner',
  fields: {
    badge_text: {
      type: 'text',
      label: 'Badge / Pill label (optional)',
    },
    items: {
      type: 'array',
      label: 'Marquee items (ordered)',
      arrayFields: {
        order: {
          type: 'number',
          label: 'Order / Priority (e.g. 1, 2, 3)',
        },
        text: htmlField('HTML text (supports formatting & links)'),
        link_label: {
          type: 'text',
          label: 'Extra link label (optional)',
        },
        link_href: {
          type: 'text',
          label: 'Extra link URL (optional)',
        },
      },
      defaultItemProps: {
        order: 1,
        text: 'New announcement here! <a href="/details">Click here</a>',
        link_label: '',
        link_href: '',
      },
      getItemSummary: (item, i) =>
        `[#${item?.order ?? i + 1}] ${(item?.text || 'Empty text')
          .replace(/<[^>]*>/g, '')
          .slice(0, 35)}...`,
    },
    speed: {
      type: 'number',
      label: 'Scroll speed (seconds per cycle, e.g. 25)',
    },
    direction: {
      type: 'select',
      label: 'Scroll direction',
      options: [
        { label: 'Left (Right to Left)', value: 'left' },
        { label: 'Right (Left to Right)', value: 'right' },
      ],
    },
    pauseOnHover: {
      type: 'radio',
      label: 'Pause on hover',
      options: [
        { label: 'Yes', value: true },
        { label: 'No', value: false },
      ],
    },
    separator: {
      type: 'select',
      label: 'Item separator',
      options: [
        { label: 'Bullet ( • )', value: '•' },
        { label: 'Pipe ( | )', value: '|' },
        { label: 'Star ( * )', value: '*' },
        { label: 'Slash ( / )', value: '/' },
        { label: 'None', value: 'none' },
      ],
    },
    variant: {
      type: 'select',
      label: 'Color scheme',
      options: [
        { label: 'Primary', value: 'primary' },
        { label: 'Dark', value: 'dark' },
        { label: 'Soft', value: 'soft' },
        { label: 'Light', value: 'light' },
        { label: 'Accent', value: 'accent' },
      ],
    },
    backgroundColor: {
      type: 'text',
      label: 'Custom background color (hex/CSS)',
    },
    textColor: {
      type: 'text',
      label: 'Custom text color (hex/CSS)',
    },
  },
  defaultProps: {
    badge_text: 'Updates',
    items: [
      {
        order: 1,
        text: 'New platform update now live. <a href="/updates">Read release notes</a>',
        link_label: '',
        link_href: '',
      },
      {
        order: 2,
        text: 'Join our upcoming community webinar on digital transformation. <a href="/events">Register now</a>',
        link_label: '',
        link_href: '',
      },
      {
        order: 3,
        text: 'Explore our latest documentation and developer guides.',
        link_label: '',
        link_href: '',
      },
    ],
    speed: 30,
    direction: 'left',
    pauseOnHover: true,
    separator: '•',
    variant: 'primary',
    backgroundColor: '',
    textColor: '',
  },
  render: (props) => <MarqueeComponent {...props} />,
};
