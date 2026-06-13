import { FormBlockBase, COMMON_FORM_FIELDS, COMMON_FORM_DEFAULTS } from './_FormBlockBase';

// Product waitlist — name, email, company, role, intended use case.
export const FormWaitlist = {
  label: 'Waitlist form',
  fields: COMMON_FORM_FIELDS,
  defaultProps: {
    ...COMMON_FORM_DEFAULTS,
    form_heading: 'Join the waitlist',
    form_lede:
      "We're rolling out access in batches. Sign up and we'll let you know when your spot is ready.",
    form_submit_label: 'Join waitlist',
    success_heading: "You're on the list.",
    success_body: "We'll email you as soon as your spot is available. No spam, ever.",
    fields: [
      { field_type: 'text',  field_key: 'full_name', label: 'Name',    placeholder: 'Your name',       required: 'yes', width: 'half', validation: 'none',  options: '', default_value: '', help_text: '' },
      { field_type: 'email', field_key: 'email',     label: 'Email',   placeholder: 'you@example.com', required: 'yes', width: 'half', validation: 'email', options: '', default_value: '', help_text: '' },
      { field_type: 'text',  field_key: 'company',   label: 'Company', placeholder: 'Your organisation', required: 'no',  width: 'half', validation: 'none',  options: '', default_value: '', help_text: 'Optional' },
      {
        field_type: 'select',
        field_key: 'role',
        label: 'Your role',
        placeholder: 'Select your role',
        required: 'no',
        width: 'half',
        validation: 'none',
        options: 'Founder\nProduct manager\nDeveloper\nDesigner\nMarketer\nOther',
        default_value: '',
        help_text: '',
      },
      { field_type: 'textarea', field_key: 'use_case', label: 'How would you use it?', placeholder: 'A sentence or two about your intended use case…', required: 'no', width: 'full', validation: 'none', options: '', default_value: '', help_text: 'Optional — helps us prioritise access' },
    ],
  },
  render: (props) => <FormBlockBase {...props} />,
};
