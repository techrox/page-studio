import { FormBlockBase, COMMON_FORM_FIELDS, COMMON_FORM_DEFAULTS } from './_FormBlockBase';

// Lightweight contact form — name, email, phone, company, message.
// Use this when you need just the form; pair with a Hero block above for
// a full contact-page layout. For the combined hero + sidebar + form layout
// use ContactSection instead.
export const FormContact = {
  label: 'Contact form',
  fields: COMMON_FORM_FIELDS,
  defaultProps: {
    ...COMMON_FORM_DEFAULTS,
    form_heading: 'Get in touch',
    form_lede:
      "Have a question or want to work together? Fill in the form and we'll get back to you within one business day.",
    form_submit_label: 'Send message',
    fields: [
      { field_type: 'text',     field_key: 'full_name',    label: 'Full name',     placeholder: 'Your name',          required: 'yes', width: 'half', validation: 'none',  options: '', default_value: '', help_text: '' },
      { field_type: 'email',    field_key: 'email',        label: 'Work email',    placeholder: 'you@company.com',    required: 'yes', width: 'half', validation: 'email', options: '', default_value: '', help_text: '' },
      { field_type: 'tel',      field_key: 'phone',        label: 'Phone',         placeholder: '+1 555 000 0000',    required: 'no',  width: 'half', validation: 'phone', options: '', default_value: '', help_text: 'Optional' },
      { field_type: 'text',     field_key: 'organization', label: 'Organization',  placeholder: 'Your company',       required: 'yes', width: 'half', validation: 'none',  options: '', default_value: '', help_text: '' },
      { field_type: 'textarea', field_key: 'message',      label: 'Message',       placeholder: "What's on your mind?", required: 'yes', width: 'full', validation: 'none',  options: '', default_value: '', help_text: '' },
    ],
  },
  render: (props) => <FormBlockBase {...props} />,
};
