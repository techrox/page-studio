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
  login_label?: string;
  login_href?: string;
  enquiry_label?: string;
  enquiry_href?: string;
  isLoggedIn?: boolean;
  profile?: ProfileConfig;
  variant?: HeaderVariant;
  background?: 'white' | 'soft' | 'dark' | 'transparent';
  backgroundColor?: string;
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
  login_label?: string;
  login_href?: string;
  isLoggedIn?: boolean;
  profile?: ProfileConfig;
  cta_label?: string;
  cta_href?: string;
  variant?: HeaderVariant;
  background?: 'white' | 'soft' | 'dark' | 'transparent';
  backgroundColor?: string;
  sticky?: boolean;
  maxWidth?: number | string;
  className?: string;
  style?: React.CSSProperties;
  mobileBreakpoint?: number;
  onNavigate?: (path: string, item: MenuItem, event: MouseEvent<HTMLElement>) => void;
  onActionClick?: (action: HeaderAction, event: MouseEvent<HTMLElement>) => void;
  onLoginClick?: (event: MouseEvent<HTMLElement>) => void;
  onProfileClick?: (event: MouseEvent<HTMLElement>) => void;
  renderLink?: (props: { href: string; children: ReactNode; className?: string; onClick?: (e: any) => void }) => ReactNode;
  renderLogo?: (logo: HeaderLogo) => ReactNode;
}

export interface MastheadHeaderProps {
  title?: string;
  subtitle?: string;
  title_alt?: string;
  subtitle_alt?: string;
  crest_url?: string;
  crest_alt?: string;
  crest_href?: string;
  crest_size?: number;
  menus?: MenuItem[];
  bar_color?: string;
  bar_text_color?: string;
  title_color?: string;
  variant?: 'light' | 'soft' | 'transparent';
  backgroundColor?: string;
  sticky?: boolean;
  shrink_on_scroll?: boolean;
  shrink_after?: number;
  maxWidth?: string;
  className?: string;
  style?: React.CSSProperties;
  activePath?: string;
  currentPath?: string;
  isActive?: (item: MenuItem, activePath?: string) => boolean;
  onNavigate?: (path: string, item: MenuItem, event: MouseEvent<HTMLElement>) => void;
  renderLink?: (props: { href: string; children: ReactNode; className?: string; onClick?: (e: any) => void }) => ReactNode;
  renderCrest?: (crest: { url?: string; alt?: string; href?: string; initials?: string }) => ReactNode;
}

export interface MarqueeItem {
  id?: string;
  order?: number;
  text?: string;
  link_label?: string;
  link_href?: string;
}

export interface MarqueeProps {
  items?: MarqueeItem[];
  badge_text?: string;
  speed?: number;
  direction?: 'left' | 'right';
  pauseOnHover?: boolean;
  separator?: string;
  variant?: 'primary' | 'dark' | 'soft' | 'light' | 'accent';
  backgroundColor?: string;
  textColor?: string;
  fontSize?: number | string;
  gap?: number | string;
  maxWidth?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

export interface PopupModalProps {
  heading?: string;
  eyebrow?: string;
  body_html?: string;
  image_url?: string;
  image_alt?: string;
  image_position?: 'top' | 'left' | 'banner' | 'none';
  image_height?: number | string;
  primary_cta_label?: string;
  primary_cta_href?: string;
  secondary_cta_label?: string;
  secondary_cta_href?: string;
  show_dismiss_button?: boolean;
  dismiss_label?: string;
  delay?: number;
  show_frequency?: 'always' | 'once_per_session' | 'once_ever';
  storage_key?: string;
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
  maxWidth?: number | string;
  variant?: 'light' | 'dark' | 'soft';
  backgroundColor?: string;
  className?: string;
  style?: React.CSSProperties;
  onClose?: () => void;
  onPrimaryClick?: (event: MouseEvent<HTMLElement>) => void;
  onSecondaryClick?: (event: MouseEvent<HTMLElement>) => void;
}


