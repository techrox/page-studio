'use client';

import { useMemo } from 'react';
import { Button, Dropdown, Avatar, Tooltip } from 'antd';
import {
  PhoneOutlined,
  MailOutlined,
  UserOutlined,
  LoginOutlined,
  SendOutlined,
} from '@ant-design/icons';
import { StudioLink as Link } from '../context';

/**
 * Pure React component for the Contact Header.
 * Can be used standalone outside Puck or rendered by the Puck ContactHeader block.
 */
export function ContactHeaderComponent({
  phones = [],
  emails = [],
  contacts,
  logo,
  logo_url,
  logo_alt = 'Logo',
  logo_href = '/',
  logo_text,
  logo_height = 36,
  actions,
  login_label = 'Login',
  login_href = '/login',
  enquiry_label = 'Enquiry',
  enquiry_href = '/contact',
  isLoggedIn = false,
  profile,
  variant = 'light',
  background,
  backgroundColor,
  sticky = false,
  divider = true,
  maxWidth = 'var(--tps-max, 1240px)',
  className = '',
  style = {},
  onActionClick,
  onLoginClick,
  onEnquiryClick,
  onProfileClick,
  renderLogo,
}) {
  // Normalize contact items respecting maximum 3 phones and 3 emails
  const contactItems = useMemo(() => {
    // If a generic `contacts` array is provided, partition into phones and emails
    if (Array.isArray(contacts) && contacts.length > 0) {
      const p = contacts
        .filter((c) => c && (c.type === 'phone' || c.number))
        .slice(0, 3);
      const e = contacts
        .filter((c) => c && (c.type === 'email' || c.email))
        .slice(0, 3);
      return [...p, ...e];
    }

    // Process phones array (limit max 3)
    const rawPhones = Array.isArray(phones) ? phones : [];
    const validPhones = rawPhones
      .filter((p) => Boolean(p && (typeof p === 'string' ? p.trim() : p.number)))
      .slice(0, 3)
      .map((p, idx) => {
        if (typeof p === 'string') {
          return {
            id: `phone-${idx}`,
            type: 'phone',
            value: p.trim(),
            href: `tel:${p.replace(/\s+/g, '')}`,
            icon: <PhoneOutlined className="tps-contact-item__icon" />,
          };
        }
        return {
          id: `phone-${idx}`,
          type: 'phone',
          value: p.number || p.value,
          label: p.label,
          href: p.href || (p.number ? `tel:${String(p.number).replace(/\s+/g, '')}` : undefined),
          icon: p.icon || <PhoneOutlined className="tps-contact-item__icon" />,
        };
      });

    // Process emails array (limit max 3)
    const rawEmails = Array.isArray(emails) ? emails : [];
    const validEmails = rawEmails
      .filter((e) => Boolean(e && (typeof e === 'string' ? e.trim() : e.email)))
      .slice(0, 3)
      .map((e, idx) => {
        if (typeof e === 'string') {
          return {
            id: `email-${idx}`,
            type: 'email',
            value: e.trim(),
            href: `mailto:${e.trim()}`,
            icon: <MailOutlined className="tps-contact-item__icon" />,
          };
        }
        return {
          id: `email-${idx}`,
          type: 'email',
          value: e.email || e.value,
          label: e.label,
          href: e.href || (e.email ? `mailto:${e.email.trim()}` : undefined),
          icon: e.icon || <MailOutlined className="tps-contact-item__icon" />,
        };
      });

    return [...validPhones, ...validEmails];
  }, [contacts, phones, emails]);

  // Normalize logo config
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

  // Normalize actions (max 2 action buttons)
  const normalizedActions = useMemo(() => {
    if (Array.isArray(actions) && actions.length > 0) {
      return actions.slice(0, 2);
    }

    // Default 2 actions if not specified: Login + Enquiry
    const list = [];
    if (login_label) {
      list.push({
        type: 'login',
        label: login_label,
        href: login_href,
        variant: 'default',
        onClick: onLoginClick,
      });
    }
    if (enquiry_label) {
      list.push({
        type: 'enquiry',
        label: enquiry_label,
        href: enquiry_href,
        variant: 'primary',
        onClick: onEnquiryClick,
      });
    }
    return list.slice(0, 2);
  }, [actions, login_label, login_href, enquiry_label, enquiry_href, onLoginClick, onEnquiryClick]);

  // Handle action click
  const handleActionClick = (action, e) => {
    if (action.onClick) {
      action.onClick(e);
    } else if (action.type === 'login' && onLoginClick) {
      onLoginClick(e);
    } else if (action.type === 'enquiry' && onEnquiryClick) {
      onEnquiryClick(e);
    }
    if (onActionClick) {
      onActionClick(action, e);
    }
  };

  // Render profile control when logged in
  const renderProfileControl = (action) => {
    if (profile?.renderProfile) {
      return profile.renderProfile({ ...profile, isLoggedIn });
    }

    const profileIconNode = profile?.icon || <UserOutlined />;
    const profileName = profile?.name;
    const profileAvatar = profile?.avatar;

    const handleProfileClick = (e) => {
      if (profile?.onClick) profile.onClick(e);
      if (onProfileClick) onProfileClick(e);
    };

    const profileBtn = (
      <button
        type="button"
        className="tps-profile-btn"
        onClick={handleProfileClick}
        aria-label={profileName ? `Profile: ${profileName}` : 'User Profile'}
      >
        {profileAvatar ? (
          <Avatar size={30} src={profileAvatar} />
        ) : (
          <span className="tps-profile-btn__icon">{profileIconNode}</span>
        )}
        {profileName && <span className="tps-profile-btn__name">{profileName}</span>}
      </button>
    );

    if (profile?.menuItems && profile.menuItems.length > 0) {
      const items = profile.menuItems.map((item, idx) => ({
        key: item.key || String(idx),
        label: item.href ? (
          <Link href={item.href}>{item.label}</Link>
        ) : (
          <span>{item.label}</span>
        ),
        icon: item.icon,
        danger: item.danger,
        disabled: item.disabled,
        onClick: item.onClick,
      }));

      return (
        <Dropdown menu={{ items }} placement="bottomRight" arrow>
          {profileBtn}
        </Dropdown>
      );
    }

    if (profileName) {
      return (
        <Tooltip title={profileName} placement="bottom">
          {profileBtn}
        </Tooltip>
      );
    }

    return profileBtn;
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

  const bgStyle = backgroundColor ? { backgroundColor } : {};

  return (
    <header
      className={`tps-contact-header ${isDark ? 'tps-contact-header--dark' : ''} ${
        isSoft ? 'tps-contact-header--soft' : ''
      } ${isTransparent ? 'tps-contact-header--transparent' : ''} ${
        sticky ? 'tps-contact-header--sticky' : ''
      } ${className}`.trim()}
      style={bgStyle}
    >
      <div className="tps-contact-header__container" style={containerStyle}>
        {/* Left Section: Contact Information */}
        <div className="tps-contact-header__left" role="region" aria-label="Contact Information">
          {contactItems.length > 0 && (
            <div className="tps-contact-header__contacts">
              {contactItems.map((item, idx) => (
                <div key={item.id || idx} className="tps-contact-header__contact-wrap">
                  {idx > 0 && (
                    <span className="tps-contact-header__divider" aria-hidden="true">
                      {divider === true ? '|' : divider || '|'}
                    </span>
                  )}
                  {item.href ? (
                    <a
                      href={item.href}
                      className="tps-contact-item"
                      title={item.label || item.value}
                    >
                      {item.icon}
                      <span className="tps-contact-item__text">{item.value}</span>
                    </a>
                  ) : (
                    <span className="tps-contact-item">
                      {item.icon}
                      <span className="tps-contact-item__text">{item.value}</span>
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Center Section: Logo (Perfect Centering) */}
        <div className="tps-contact-header__center" role="banner">
          {renderLogo ? (
            renderLogo(logoConfig)
          ) : logo && typeof logo === 'object' && '$$typeof' in logo ? (
            logo
          ) : logoConfig.url ? (
            <Link
              href={logoConfig.href || '/'}
              className="tps-contact-header__logo-link"
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
              className="tps-contact-header__logo-text"
            >
              {logoConfig.text}
            </Link>
          ) : null}
        </div>

        {/* Right Section: Actions (Max 2 Buttons or Profile when Logged In) */}
        <div className="tps-contact-header__right" role="region" aria-label="User Actions">
          <div className="tps-contact-header__actions">
            {normalizedActions.map((action, idx) => {
              const isLoginType = action.type === 'login';

              // If logged in and action is login, replace with profile icon/menu
              if (isLoginType && isLoggedIn) {
                return (
                  <div key={action.type || idx} className="tps-contact-header__action-item">
                    {renderProfileControl(action)}
                  </div>
                );
              }

              const btnVariant = action.variant || (action.type === 'enquiry' ? 'primary' : 'default');
              const btnType = btnVariant === 'primary' ? 'primary' : 'default';
              const btnIcon =
                action.icon ||
                (action.type === 'login' ? (
                  <LoginOutlined />
                ) : action.type === 'enquiry' ? (
                  <SendOutlined />
                ) : undefined);

              return (
                <div key={action.type || idx} className="tps-contact-header__action-item">
                  {action.href && !action.onClick ? (
                    <Link href={action.href}>
                      <Button
                        type={btnType}
                        icon={btnIcon}
                        className={`tps-header-btn ${action.className || ''}`}
                        disabled={action.disabled}
                        onClick={(e) => handleActionClick(action, e)}
                      >
                        {action.label || (action.type === 'login' ? 'Login' : 'Action')}
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      type={btnType}
                      icon={btnIcon}
                      className={`tps-header-btn ${action.className || ''}`}
                      disabled={action.disabled}
                      onClick={(e) => handleActionClick(action, e)}
                    >
                      {action.label || (action.type === 'login' ? 'Login' : 'Action')}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}

/**
 * Puck Block configuration for ContactHeader.
 */
export const ContactHeader = {
  label: 'Contact header',
  fields: {
    // Phones (up to 3)
    phones: {
      type: 'array',
      label: 'Phone numbers (max 3)',
      arrayFields: {
        number: { type: 'text', label: 'Phone number' },
      },
      defaultItemProps: { number: '+1 (555) 000-0000' },
      getItemSummary: (item, i) => item?.number || `Phone ${i + 1}`,
    },
    // Emails (up to 3)
    emails: {
      type: 'array',
      label: 'Email addresses (max 3)',
      arrayFields: {
        email: { type: 'text', label: 'Email address' },
      },
      defaultItemProps: { email: 'hello@example.com' },
      getItemSummary: (item, i) => item?.email || `Email ${i + 1}`,
    },
    // Logo
    logo_url: { type: 'text', label: 'Logo image URL' },
    logo_alt: { type: 'text', label: 'Logo alt text' },
    logo_text: { type: 'text', label: 'Logo brand text (fallback)' },
    logo_href: { type: 'text', label: 'Logo link URL' },
    logo_height: { type: 'number', label: 'Logo height (px)' },
    // Actions & Auth
    isLoggedIn: {
      type: 'radio',
      label: 'User status',
      options: [
        { label: 'Logged out (Show Login)', value: false },
        { label: 'Logged in (Show Profile)', value: true },
      ],
    },
    login_label: { type: 'text', label: 'Login button label' },
    login_href: { type: 'text', label: 'Login URL' },
    enquiry_label: { type: 'text', label: 'Enquiry button label' },
    enquiry_href: { type: 'text', label: 'Enquiry URL' },
    // Style
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
    backgroundColor: {
      type: 'text',
      label: 'Background color (hex/CSS)',
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
    phones: [
      { number: '+1 (555) 234-5678' },
      { number: '+1 (555) 876-5432' },
    ],
    emails: [
      { email: 'info@techrox.com' },
    ],
    logo_url: '',
    logo_text: 'PageStudio',
    logo_alt: 'Page Studio Logo',
    logo_href: '/',
    logo_height: 36,
    isLoggedIn: false,
    login_label: 'Login',
    login_href: '/login',
    enquiry_label: 'Enquiry',
    enquiry_href: '/contact',
    variant: 'light',
    backgroundColor: '',
    sticky: false,
  },
  render: (props) => <ContactHeaderComponent {...props} />,
};
