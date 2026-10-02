import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import { App as AntdApp } from 'antd';

import { PageStudioProvider } from '../src/context.jsx';
import { ContactHeader, ContactHeaderComponent } from '../src/blocks/ContactHeader.jsx';
import { NavigationHeader, NavigationHeaderComponent } from '../src/blocks/NavigationHeader.jsx';

function Wrap({ children, studio }) {
  return (
    <AntdApp>
      <PageStudioProvider value={studio}>{children}</PageStudioProvider>
    </AntdApp>
  );
}

describe('ContactHeader component & block', () => {
  it('renders correctly with defaultProps in Puck format', () => {
    const { container } = render(
      <Wrap>{ContactHeader.render(ContactHeader.defaultProps)}</Wrap>
    );
    expect(container.querySelector('.tps-contact-header')).not.toBeNull();
    expect(container.textContent).toContain('+1 (555) 234-5678');
    expect(container.textContent).toContain('info@techrox.com');
    expect(container.textContent).toContain('Login');
    expect(container.textContent).toContain('Enquiry');
  });

  it('dynamically renders contact information from props with links', () => {
    const phones = ['+1 111 222 3333', '+1 444 555 6666'];
    const emails = ['contact@example.com'];

    const { container } = render(
      <Wrap>
        <ContactHeaderComponent
          phones={phones}
          emails={emails}
          logo={{ text: 'TestBrand' }}
        />
      </Wrap>
    );

    expect(container.textContent).toContain('+1 111 222 3333');
    expect(container.textContent).toContain('+1 444 555 6666');
    expect(container.textContent).toContain('contact@example.com');

    const telLink = container.querySelector('a[href="tel:+11112223333"]');
    const mailLink = container.querySelector('a[href="mailto:contact@example.com"]');
    expect(telLink).not.toBeNull();
    expect(mailLink).not.toBeNull();
  });

  it('strictly respects maximum limits of 3 phone numbers and 3 emails', () => {
    const phones = [
      'Phone 1',
      'Phone 2',
      'Phone 3',
      'Phone 4 (should not show)',
      'Phone 5 (should not show)',
    ];
    const emails = [
      'email1@test.com',
      'email2@test.com',
      'email3@test.com',
      'email4@test.com (should not show)',
    ];

    const { container } = render(
      <Wrap>
        <ContactHeaderComponent phones={phones} emails={emails} />
      </Wrap>
    );

    expect(container.textContent).toContain('Phone 1');
    expect(container.textContent).toContain('Phone 2');
    expect(container.textContent).toContain('Phone 3');
    expect(container.textContent).not.toContain('Phone 4');
    expect(container.textContent).not.toContain('Phone 5');

    expect(container.textContent).toContain('email1@test.com');
    expect(container.textContent).toContain('email2@test.com');
    expect(container.textContent).toContain('email3@test.com');
    expect(container.textContent).not.toContain('email4@test.com');
  });

  it('renders visual dividers only between available contact items', () => {
    const phones = ['+1 111 222 3333'];
    const emails = ['test@example.com'];

    const { container } = render(
      <Wrap>
        <ContactHeaderComponent phones={phones} emails={emails} />
      </Wrap>
    );

    const dividers = container.querySelectorAll('.tps-contact-header__divider');
    // For 2 items (1 phone + 1 email), there should be exactly 1 divider between them
    expect(dividers.length).toBe(1);
  });

  it('centers the logo container in a 3-column layout', () => {
    const { container } = render(
      <Wrap>
        <ContactHeaderComponent
          logo={{ url: 'https://example.com/logo.png', alt: 'Acme Logo' }}
        />
      </Wrap>
    );

    const centerCol = container.querySelector('.tps-contact-header__center');
    expect(centerCol).not.toBeNull();
    const logoImg = centerCol.querySelector('img');
    expect(logoImg).not.toBeNull();
    expect(logoImg.getAttribute('src')).toBe('https://example.com/logo.png');
    expect(logoImg.getAttribute('alt')).toBe('Acme Logo');
  });

  it('supports maximum of 2 action buttons', () => {
    const actions = [
      { type: 'login', label: 'Sign In' },
      { type: 'enquiry', label: 'Contact Us' },
      { type: 'custom', label: 'Extra 3rd (ignored)' },
    ];

    const { container } = render(
      <Wrap>
        <ContactHeaderComponent actions={actions} />
      </Wrap>
    );

    expect(container.textContent).toContain('Sign In');
    expect(container.textContent).toContain('Contact Us');
    expect(container.textContent).not.toContain('Extra 3rd');
  });

  it('replaces Login button with Profile icon when isLoggedIn is true', () => {
    const onProfileClick = vi.fn();
    const { container, rerender } = render(
      <Wrap>
        <ContactHeaderComponent
          isLoggedIn={false}
          login_label="Login Now"
        />
      </Wrap>
    );

    // When logged out: Login button is visible
    expect(container.textContent).toContain('Login Now');
    expect(container.querySelector('.tps-profile-btn')).toBeNull();

    // When logged in: Login button is replaced with Profile button
    rerender(
      <Wrap>
        <ContactHeaderComponent
          isLoggedIn={true}
          login_label="Login Now"
          profile={{ name: 'Jane Doe', onClick: onProfileClick }}
        />
      </Wrap>
    );

    expect(container.textContent).not.toContain('Login Now');
    const profileBtn = container.querySelector('.tps-profile-btn');
    expect(profileBtn).not.toBeNull();
    expect(profileBtn.textContent).toContain('Jane Doe');

    fireEvent.click(profileBtn);
    expect(onProfileClick).toHaveBeenCalledTimes(1);
  });

  it('gracefully handles empty/missing contact and logo data without error', () => {
    const { container } = render(
      <Wrap>
        <ContactHeaderComponent phones={[]} emails={[]} actions={[]} />
      </Wrap>
    );
    expect(container.querySelector('.tps-contact-header')).not.toBeNull();
  });
});

describe('NavigationHeader component & block', () => {
  const testMenus = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    {
      label: 'Courses',
      children: [
        { label: 'LLB', path: '/courses/llb' },
        { label: 'BA LLB', path: '/courses/ba-llb' },
        {
          label: 'Specializations',
          children: [
            { label: 'Corporate Law', path: '/courses/corporate' },
          ],
        },
      ],
    },
    { label: 'Contact', path: '/contact' },
  ];

  it('renders correctly with defaultProps in Puck format', () => {
    const { container } = render(
      <Wrap>{NavigationHeader.render(NavigationHeader.defaultProps)}</Wrap>
    );
    expect(container.querySelector('.tps-nav-header')).not.toBeNull();
    expect(container.textContent).toContain('Home');
    expect(container.textContent).toContain('About');
    expect(container.textContent).toContain('Courses');
    expect(container.textContent).toContain('Get Started');
  });

  it('dynamically generates menus from configuration without hardcoding', () => {
    const customMenus = [
      { label: 'Products', path: '/products' },
      { label: 'Pricing', path: '/pricing' },
    ];

    const { container } = render(
      <Wrap>
        <NavigationHeaderComponent menus={customMenus} />
      </Wrap>
    );

    expect(container.textContent).toContain('Products');
    expect(container.textContent).toContain('Pricing');
    expect(container.textContent).not.toContain('Courses');
  });

  it('renders dropdown items for parent menus with children', () => {
    const { container } = render(
      <Wrap>
        <NavigationHeaderComponent menus={testMenus} />
      </Wrap>
    );

    // Parent item with children has dropdown button with chevron
    const coursesBtn = container.querySelector('.tps-nav-link--dropdown');
    expect(coursesBtn).not.toBeNull();
    expect(coursesBtn.textContent).toContain('Courses');
  });

  it('highlights active menu item matching activePath', () => {
    const { container } = render(
      <Wrap>
        <NavigationHeaderComponent menus={testMenus} activePath="/about" />
      </Wrap>
    );

    const activeLink = container.querySelector('.tps-nav-link--active');
    expect(activeLink).not.toBeNull();
    expect(activeLink.textContent).toContain('About');
  });

  it('invokes onNavigate callback when menu item is clicked', () => {
    const onNavigate = vi.fn();
    const { container } = render(
      <Wrap>
        <NavigationHeaderComponent menus={testMenus} onNavigate={onNavigate} />
      </Wrap>
    );

    const homeLink = container.querySelector('a[href="/"]');
    expect(homeLink).not.toBeNull();
    fireEvent.click(homeLink);

    expect(onNavigate).toHaveBeenCalledWith('/', expect.objectContaining({ label: 'Home' }), expect.anything());
  });

  it('gracefully handles empty menus and missing logos', () => {
    const { container } = render(
      <Wrap>
        <NavigationHeaderComponent menus={[]} />
      </Wrap>
    );
    expect(container.querySelector('.tps-nav-header')).not.toBeNull();
  });
});
