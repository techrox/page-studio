import { FormBlockBase, COMMON_FORM_FIELDS, COMMON_FORM_DEFAULTS } from './_FormBlockBase';

// Customer feedback — star rating, category, free-text comments, optional contact.
export const FormFeedback = {
  label: 'Feedback form',
  fields: COMMON_FORM_FIELDS,
  defaultProps: {
    ...COMMON_FORM_DEFAULTS,
    form_heading: 'Share your feedback',
    form_lede: 'Your honest opinion helps us improve. Takes less than two minutes.',
    form_submit_label: 'Submit feedback',
    success_heading: 'Feedback received.',
    success_body: 'Thank you — every response shapes what we build next.',
    fields: [
      { field_type: 'rating',   field_key: 'rating',   label: 'Overall rating',   placeholder: '', required: 'yes', width: 'full', validation: 'none', options: '', default_value: '', help_text: '1 = poor, 5 = excellent' },
      {
        field_type: 'select',
        field_key: 'category',
        label: 'Feedback category',
        placeholder: "What's this about?",
        required: 'no',
        width: 'full',
        validation: 'none',
        options: 'Product quality\nCustomer support\nWebsite experience\nPricing\nOther',
        default_value: '',
        help_text: '',
      },
      { field_type: 'textarea', field_key: 'comments',  label: 'Your comments',    placeholder: 'Tell us what you loved or what we could do better…', required: 'yes', width: 'full', validation: 'none', options: '', default_value: '', help_text: '' },
      { field_type: 'text',     field_key: 'full_name', label: 'Name',             placeholder: 'Your name',             required: 'no',  width: 'half', validation: 'none',  options: '', default_value: '', help_text: 'Optional' },
      { field_type: 'email',    field_key: 'email',     label: 'Email',            placeholder: 'you@example.com',       required: 'no',  width: 'half', validation: 'email', options: '', default_value: '', help_text: "Optional — if you'd like a reply" },
    ],
  },
  render: (props) => <FormBlockBase {...props} />,
};
