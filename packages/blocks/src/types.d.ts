import type { ReactNode, MouseEvent } from 'react';

export type HeaderVariant = 'light' | 'dark' | 'soft' | 'transparent';

export interface ContactItem {
  type?: 'phone' | 'email';
  value: string;
  label?: string;
  href?: string;
  icon?: ReactNode;
}

export type PhoneItem = string | {
  number: string;
  label?: string;
  href?: string;
  icon?: ReactNode;
};

export type EmailItem = string | {
  email: string;
  label?: string;
  href?: string;
  icon?: ReactNode;
};

export interface HeaderLogo {
  url?: string;
  src?: string;
  alt?: string;
  href?: string;
  text?: string;
  height?: number | string;
  width?: number | string;
  className?: string;
}

export interface HeaderAction {
  type?: 'login' | 'enquiry' | 'custom' | string;
  label?: string;
  href?: string;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  variant?: 'primary' | 'default' | 'dashed' | 'link' | 'text';
  icon?: ReactNode;
  className?: string;
  disabled?: boolean;
}

export interface ProfileMenuItem {
  key: string;
  label: string;
  icon?: ReactNode;
  href?: string;
  danger?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export interface ProfileConfig {
  icon?: ReactNode;
  avatar?: string;
  name?: string;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  menuItems?: ProfileMenuItem[];
  renderProfile?: (props: ProfileConfig) => ReactNode;
}

export interface ContactHeaderProps {
  phones?: PhoneItem[];
  emails?: EmailItem[];
  contacts?: ContactItem[];
  logo?: HeaderLogo | string | ReactNode;
  logo_url?: string;
  logo_alt?: string;
  logo_href?: string;
  logo_text?: string;
  logo_height?: number | string;
  actions?: HeaderAction[];
  isLoggedIn?: boolean;
  profile?: ProfileConfig;
  variant?: HeaderVariant;
  background?: 'white' | 'soft' | 'dark' | 'transparent';
  sticky?: boolean;
  divider?: ReactNode | boolean;
  maxWidth?: number | string;
  className?: string;
  style?: React.CSSProperties;
  onActionClick?: (action: HeaderAction, event: MouseEvent<HTMLElement>) => void;
  onLoginClick?: (event: MouseEvent<HTMLElement>) => void;
  onEnquiryClick?: (event: MouseEvent<HTMLElement>) => void;
  onProfileClick?: (event: MouseEvent<HTMLElement>) => void;
  renderLogo?: (logo: HeaderLogo) => ReactNode;
}

export interface MenuItem {
  label: string;
  path?: string;
  href?: string;
  target?: string;
  icon?: ReactNode;
  badge?: string | number;
  disabled?: boolean;
  onClick?: (item: MenuItem, event: MouseEvent<HTMLElement>) => void;
  children?: MenuItem[];
  [key: string]: any;
}

export interface NavigationHeaderProps {
  logo?: HeaderLogo | string | ReactNode;
  logo_url?: string;
  logo_alt?: string;
  logo_href?: string;
  logo_text?: string;
  logo_height?: number | string;
  menus?: MenuItem[];
  activePath?: string;
  currentPath?: string;
  isActive?: (item: MenuItem, activePath?: string) => boolean;
  actions?: HeaderAction[];
  cta_label?: string;
  cta_href?: string;
  variant?: HeaderVariant;
  background?: 'white' | 'soft' | 'dark' | 'transparent';
  sticky?: boolean;
  maxWidth?: number | string;
  className?: string;
  style?: React.CSSProperties;
  mobileBreakpoint?: number;
  onNavigate?: (path: string, item: MenuItem, event: MouseEvent<HTMLElement>) => void;
  renderLink?: (props: { href: string; children: ReactNode; className?: string; onClick?: (e: any) => void }) => ReactNode;
  renderLogo?: (logo: HeaderLogo) => ReactNode;
}
