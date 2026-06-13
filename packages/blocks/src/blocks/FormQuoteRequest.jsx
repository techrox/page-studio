import { FormBlockBase, COMMON_FORM_FIELDS, COMMON_FORM_DEFAULTS } from './_FormBlockBase';

// Quote / pricing request — company, contact, project type, budget range, requirements, timeline.
export const FormQuoteRequest = {
  label: 'Quote request form',
  fields: COMMON_FORM_FIELDS,
  defaultProps: {
    ...COMMON_FORM_DEFAULTS,
    form_heading: 'Request a quote',
    form_lede:
      "Tell us about your project and we'll put together a tailored proposal within two business days.",
    form_submit_label: 'Request quote',
    success_heading: 'Request received.',
    success_body:
      "We'll review your requirements and send a tailored proposal within two business days.",
    fields: [
      { field_type: 'text',  field_key: 'company',      label: 'Company',        placeholder: 'Your organisation', required: 'yes', width: 'half', validation: 'none',  options: '', default_value: '', help_text: '' },
      { field_type: 'text',  field_key: 'full_name',    label: 'Your name',      placeholder: 'Full name',         required: 'yes', width: 'half', validation: 'none',  options: '', default_value: '', help_text: '' },
      { field_type: 'email', field_key: 'email',        label: 'Email',          placeholder: 'you@company.com',   required: 'yes', width: 'half', validation: 'email', options: '', default_value: '', help_text: '' },
      { field_type: 'tel',   field_key: 'phone',        label: 'Phone',          placeholder: '+1 555 000 0000',   required: 'no',  width: 'half', validation: 'phone', options: '', default_value: '', help_text: 'Optional' },
      {
        field_type: 'select',
        field_key: 'project_type',
        label: 'Project type',
        placeholder: 'What are you building?',
        required: 'yes',
        width: 'half',
        validation: 'none',
        options: 'Website\nMobile app\nWeb application\nBranding\nMarketing campaign\nData / analytics\nOther',
        default_value: '',
        help_text: '',
      },
      {
        field_type: 'select',
        field_key: 'budget',
        label: 'Budget range',
        placeholder: 'Approximate budget',
        required: 'no',
        width: 'half',
        validation: 'none',
        options: 'Under $5k\n$5k – $20k\n$20k – $50k\n$50k – $100k\n$100k+\nNot sure yet',
        default_value: '',
        help_text: '',
      },
      {
        field_type: 'select',
        field_key: 'timeline',
        label: 'Desired timeline',
        placeholder: 'When do you need this?',
        required: 'no',
        width: 'full',
        validation: 'none',
        options: 'As soon as possible\n1 – 3 months\n3 – 6 months\n6+ months\nFlexible',
        default_value: '',
        help_text: '',
      },
      { field_type: 'textarea', field_key: 'requirements', label: 'Project requirements', placeholder: 'Describe what you need — features, integrations, constraints, goals…', required: 'yes', width: 'full', validation: 'none', options: '', default_value: '', help_text: '' },
    ],
  },
  render: (props) => <FormBlockBase {...props} />,
};
