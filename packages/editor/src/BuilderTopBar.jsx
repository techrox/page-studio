'use client';

// Default top bar for the editor. Replaceable via the `header` prop on
// <PageStudio /> — if you need full control, pass a render function.
//
// Designed to be brand-agnostic: every visible label/color comes from
// `branding` or sensible neutrals. Account/home/publish are all optional;
// hide what you don't need by leaving the corresponding prop unset.

import { Avatar, Button, ConfigProvider, Dropdown, Space, theme as antdTheme } from 'antd';
import {
  ArrowLeftOutlined,
  EyeOutlined,
  HomeOutlined,
  LogoutOutlined,
  PlusOutlined,
  RocketOutlined,
  UserOutlined,
} from '@ant-design/icons';

function DefaultLogo() {
  return (
    <svg width={20} height={20} viewBox="0 0 64 64" aria-hidden>
      <rect width="64" height="64" rx="14" fill="currentColor" />
    </svg>
  );
}

export default function BuilderTopBar({
  pageKey,
  pageTitle,
  account,
  livePath,
  savedAt,
  pending,
  onPublish,
  onSignOut,
  onCreatePage,
  homeHref,
  branding = {},
  extraActions,
  LinkComponent = 'a',
}) {
  const brand = {
    name: 'Page Studio',
    logo: <DefaultLogo />,
    primaryColor: '#0F766E',
    ...branding,
  };
  const Link = LinkComponent;

  const accountMenu = account
    ? {
        items: [
          {
            key: 'who',
            disabled: true,
            label: (
              <div style={{ padding: '4px 0', minWidth: 200 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>
                  {account.name}
                </div>
                {account.email && account.email !== account.name && (
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                    {account.email}
                  </div>
                )}
              </div>
            ),
          },
          { type: 'divider' },
          homeHref && {
            key: 'home',
            icon: <HomeOutlined />,
            label: <Link href={homeHref}>Admin home</Link>,
          },
          onSignOut && {
            key: 'signout',
            icon: <LogoutOutlined />,
            label: (
              <button
                type="button"
                onClick={onSignOut}
                style={{ all: 'unset', cursor: 'pointer', width: '100%', display: 'block' }}
              >
                Sign out
              </button>
            ),
          },
        ].filter(Boolean),
      }
    : null;

  // Locally re-theme AntD so the Publish button + avatar pick up the
  // configured brand colors regardless of the host's ConfigProvider — the
  // top bar should look like the brand, not like the surrounding admin.
  const brandTheme = {
    algorithm: antdTheme.defaultAlgorithm,
    token: {
      colorPrimary: brand.primaryColor,
      colorInfo: brand.primaryColor,
    },
  };

  return (
    <ConfigProvider theme={brandTheme}>
    <div className="psd-builder-bar" style={{ color: '#fff' }}>
      {homeHref ? (
        <Link
          href={homeHref}
          className="psd-builder-bar__brand"
          title="Back to admin"
          style={{ color: 'inherit' }}
        >
          <ArrowLeftOutlined style={{ fontSize: 12 }} />
          <span aria-hidden style={{ color: brand.primaryColor, display: 'inline-flex' }}>
            {brand.logo}
          </span>
          <span>{brand.name}</span>
        </Link>
      ) : (
        <div className="psd-builder-bar__brand">
          <span aria-hidden style={{ color: brand.primaryColor, display: 'inline-flex' }}>
            {brand.logo}
          </span>
          <span>{brand.name}</span>
        </div>
      )}

      <div className="psd-builder-bar__crumbs">
        <span className="psd-builder-bar__current">{pageTitle || pageKey}</span>
        {pageKey && (
          <span style={{ marginLeft: 8, opacity: 0.5, fontSize: 11 }}>
            <code style={{ fontSize: 10 }}>{pageKey}</code>
          </span>
        )}
        {savedAt && (
          <span style={{ marginLeft: 12, fontSize: 11, opacity: 0.55 }}>
            · Saved {new Date(savedAt).toLocaleTimeString()}
          </span>
        )}
        {pending && (
          <span style={{ marginLeft: 12, fontSize: 11, opacity: 0.55 }}>· Saving…</span>
        )}
      </div>

      <Space size={6} className="psd-builder-bar__actions">
        {extraActions}
        {onCreatePage && (
          <Button size="small" icon={<PlusOutlined />} onClick={onCreatePage}>
            New page
          </Button>
        )}
        {livePath && (
          <Link href={livePath} target="_blank" rel="noreferrer">
            <Button size="small" icon={<EyeOutlined />}>
              View live
            </Button>
          </Link>
        )}
        <Button
          type="primary"
          size="small"
          icon={<RocketOutlined />}
          onClick={onPublish}
          loading={pending}
        >
          Publish
        </Button>
        {account && accountMenu && (
          <Dropdown menu={accountMenu} placement="bottomRight">
            <Button type="text" size="small" style={{ color: '#fff' }}>
              <Avatar
                size={22}
                icon={<UserOutlined />}
                style={{ background: brand.primaryColor }}
              />
            </Button>
          </Dropdown>
        )}
      </Space>
    </div>
    </ConfigProvider>
  );
}
