import { FormBlockBase, COMMON_FORM_FIELDS, COMMON_FORM_DEFAULTS } from './_FormBlockBase';

// Support ticket — name, email, category, priority, subject, description, optional attachment.
export const FormSupport = {
  label: 'Support ticket form',
  fields: COMMON_FORM_FIELDS,
  defaultProps: {
    ...COMMON_FORM_DEFAULTS,
    form_heading: 'Open a support ticket',
    form_lede:
      "Describe the issue and we'll get back to you as quickly as we can.",
    form_submit_label: 'Submit ticket',
    success_heading: 'Ticket submitted.',
    success_body:
      "We've logged your request. Expect a reply to your email within one business day.",
    fields: [
      { field_type: 'text',  field_key: 'full_name',   label: 'Name',     placeholder: 'Your name',         required: 'yes', width: 'half', validation: 'none',  options: '', default_value: '', help_text: '' },
      { field_type: 'email', field_key: 'email',       label: 'Email',    placeholder: 'you@company.com',   required: 'yes', width: 'half', validation: 'email', options: '', default_value: '', help_text: '' },
      {
        field_type: 'select',
        field_key: 'category',
        label: 'Category',
        placeholder: "What's this about?",
        required: 'yes',
        width: 'half',
        validation: 'none',
        options: 'Technical issue\nBilling\nAccount access\nFeature request\nGeneral enquiry\nOther',
        default_value: '',
        help_text: '',
      },
      {
        field_type: 'select',
        field_key: 'priority',
        label: 'Priority',
        placeholder: 'How urgent is this?',
        required: 'yes',
        width: 'half',
        validation: 'none',
        options: 'Low\nMedium\nHigh\nUrgent',
        default_value: 'Medium',
        help_text: '',
      },
      { field_type: 'text',     field_key: 'subject',      label: 'Subject',      placeholder: 'One-line summary of the issue',           required: 'yes', width: 'full', validation: 'none', options: '', default_value: '', help_text: '' },
      { field_type: 'textarea', field_key: 'description',  label: 'Description',  placeholder: 'Steps to reproduce, error messages, expected vs actual behaviour…', required: 'yes', width: 'full', validation: 'none', options: '', default_value: '', help_text: '' },
      { field_type: 'upload',   field_key: 'attachment',   label: 'Attachment',   placeholder: 'Upload a screenshot or file',             required: 'no',  width: 'full', validation: 'none', options: '', default_value: '', help_text: 'Optional — screenshots, logs, or related files' },
    ],
  },
  render: (props) => <FormBlockBase {...props} />,
};
