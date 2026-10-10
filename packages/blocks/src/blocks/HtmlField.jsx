import { RichTextCustomField } from './RichText.jsx';

/**
 * Reusable Puck field definition for blocks that support HTML content.
 * Provides a seamless toggle between interactive Rich Text Editor and raw HTML code editor.
 */
export const htmlField = (label = 'HTML content') => ({
  type: 'custom',
  label,
  render: ({ value, onChange, readOnly }) => (
    <RichTextCustomField value={value} onChange={onChange} readOnly={readOnly} />
  ),
});

export { RichTextCustomField };
