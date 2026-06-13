import { FormBlockBase, COMMON_FORM_FIELDS, COMMON_FORM_DEFAULTS } from './_FormBlockBase';

// Lead-capture form — name, email, company, journey stage, interests, notes.
// Drop above a pricing or services section to convert visitors into leads.
export const FormLeadCapture = {
  label: 'Lead capture form',
  fields: COMMON_FORM_FIELDS,
  defaultProps: {
    ...COMMON_FORM_DEFAULTS,
    form_heading: 'Tell us about your project',
    form_lede:
      "Share a few details and we'll come prepared with ideas specific to your situation.",
    form_submit_label: 'Start the conversation',
    fields: [
      { field_type: 'text',        field_key: 'full_name',    label: 'Full name',                   placeholder: 'Your name',             required: 'yes', width: 'half', validation: 'none',  options: '', default_value: '', help_text: '' },
      { field_type: 'email',       field_key: 'email',        label: 'Work email',                  placeholder: 'you@company.com',       required: 'yes', width: 'half', validation: 'email', options: '', default_value: '', help_text: '' },
      { field_type: 'text',        field_key: 'company',      label: 'Company',                     placeholder: 'Your organisation',     required: 'yes', width: 'half', validation: 'none',  options: '', default_value: '', help_text: '' },
      { field_type: 'tel',         field_key: 'phone',        label: 'Phone',                       placeholder: '+1 555 000 0000',       required: 'no',  width: 'half', validation: 'phone', options: '', default_value: '', help_text: 'Optional' },
      {
        field_type: 'select',
        field_key: 'stage',
        label: 'Where are you in your journey?',
        placeholder: 'Select the stage that fits best',
        required: 'no',
        width: 'full',
        validation: 'none',
        options: 'Just exploring\nStarting a new project\nImproving an existing process\nNeed help with strategy\nOther',
        default_value: '',
        help_text: '',
      },
      {
        field_type: 'multiselect',
        field_key: 'interests',
        label: 'Which capabilities interest you?',
        placeholder: 'Pick one or more (optional)',
        required: 'no',
        width: 'full',
        validation: 'none',
        options: 'Product design\nEngineering\nData & analytics\nMarketing\nStrategy\nOther',
        default_value: '',
        help_text: '',
      },
      { field_type: 'textarea', field_key: 'message', label: 'Anything else to share?', placeholder: 'Current systems, target markets, challenges…', required: 'no', width: 'full', validation: 'none', options: '', default_value: '', help_text: '' },
    ],
  },
  render: (props) => <FormBlockBase {...props} />,
};
