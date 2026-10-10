import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { App as AntdApp } from 'antd';

import { PageStudioProvider } from '../src/context.jsx';
import { createPuckConfig, defaultBlocks } from '../src/config.jsx';
import { ContactSection } from '../src/blocks/ContactSection.jsx';
import { FormContact } from '../src/blocks/FormContact.jsx';
import { FormFeedback } from '../src/blocks/FormFeedback.jsx';
import { FormRegistration } from '../src/blocks/FormRegistration.jsx';
import { FormApplication } from '../src/blocks/FormApplication.jsx';

function Wrap({ children, studio }) {
  return (
    <AntdApp>
      <PageStudioProvider value={studio}>{children}</PageStudioProvider>
    </AntdApp>
  );
}

describe('Form and Contact blocks rendering', () => {
  it('createPuckConfig includes all form blocks in components and categories', () => {
    const config = createPuckConfig({ blocks: defaultBlocks });
    expect(config.components.ContactSection).toBeDefined();
    expect(config.components.FormContact).toBeDefined();
    expect(config.components.FormFeedback).toBeDefined();
    expect(config.components.FormRegistration).toBeDefined();
    expect(config.components.FormApplication).toBeDefined();

    expect(config.categories.Forms.components).toContain('ContactSection');
    expect(config.categories.Forms.components).toContain('FormContact');
  });

  it('createPuckConfig prunes categories when blocks are omitted', () => {
    const config = createPuckConfig({ blocks: { Hero: defaultBlocks.Hero } });
    expect(config.components.Hero).toBeDefined();
    expect(config.components.ContactSection).toBeUndefined();
    // Forms category should be pruned completely since no components in Forms exist in blocks
    expect(config.categories.Forms).toBeUndefined();
  });

  it('renders ContactSection without crashing even without AntdApp', () => {
    const Component = ContactSection.render;
    const { container } = render(
      <PageStudioProvider>
        <Component {...ContactSection.defaultProps} />
      </PageStudioProvider>,
    );
    expect(container.querySelector('form')).not.toBeNull();
  });

  it('renders FormContact without crashing', () => {
    const Component = FormContact.render;
    const { container } = render(
      <Wrap>
        <Component {...FormContact.defaultProps} />
      </Wrap>,
    );
    expect(container.querySelector('form')).not.toBeNull();
  });

  it('renders FormFeedback without crashing', () => {
    const Component = FormFeedback.render;
    const { container } = render(
      <Wrap>
        <Component {...FormFeedback.defaultProps} />
      </Wrap>,
    );
    expect(container.querySelector('form')).not.toBeNull();
  });

  it('renders FormRegistration without crashing', () => {
    const Component = FormRegistration.render;
    const { container } = render(
      <Wrap>
        <Component {...FormRegistration.defaultProps} />
      </Wrap>,
    );
    expect(container.querySelector('form')).not.toBeNull();
  });

  it('renders FormApplication without crashing', () => {
    const Component = FormApplication.render;
    const { container } = render(
      <Wrap>
        <Component {...FormApplication.defaultProps} />
      </Wrap>,
    );
    expect(container.querySelector('form')).not.toBeNull();
  });
});
