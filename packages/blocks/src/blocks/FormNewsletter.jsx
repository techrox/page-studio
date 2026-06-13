import { FormBlockBase, COMMON_FORM_FIELDS, COMMON_FORM_DEFAULTS } from './_FormBlockBase';

// Newsletter signup — name, email, optional consent checkbox.
// Lighter than the full NewsletterSignup block (no hero imagery).
export const FormNewsletter = {
  label: 'Newsletter form',
  fields: COMMON_FORM_FIELDS,
  defaultProps: {
    ...COMMON_FORM_DEFAULTS,
    form_heading: 'Stay in the loop',
    form_lede: 'Join our newsletter for updates, articles, and early access to new features.',
    form_submit_label: 'Subscribe',
    success_heading: "You're subscribed.",
    success_body: 'Thank you for subscribing. Check your inbox for a confirmation email.',
    fields: [
      { field_type: 'text',     field_key: 'full_name', label: 'Name',  placeholder: 'Your name',       required: 'yes', width: 'half', validation: 'none',  options: '', default_value: '', help_text: '' },
      { field_type: 'email',    field_key: 'email',     label: 'Email', placeholder: 'you@example.com', required: 'yes', width: 'half', validation: 'email', options: '', default_value: '', help_text: '' },
      { field_type: 'checkbox', field_key: 'consent',   label: 'I agree to receive marketing emails. Unsubscribe any time.', placeholder: '', required: 'yes', width: 'full', validation: 'none', options: '', default_value: '', help_text: '' },
    ],
  },
  render: (props) => <FormBlockBase {...props} />,
};
