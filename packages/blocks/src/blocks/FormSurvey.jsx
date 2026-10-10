import { FormBlockBase, COMMON_FORM_FIELDS, COMMON_FORM_DEFAULTS } from './_FormBlockBase';

// Configurable survey — defaults to an NPS-style pulse survey.
// Authors swap in their own questions via the fields array editor.
export const FormSurvey = {
  label: 'Survey form',
  fields: COMMON_FORM_FIELDS,
  defaultProps: {
    ...COMMON_FORM_DEFAULTS,
    form_heading: 'Quick survey',
    form_lede: 'Three questions, under two minutes. Your answers help us get better.',
    form_submit_label: 'Submit survey',
    success_heading: 'Survey submitted.',
    success_body: 'Thank you for taking the time. Your input is genuinely valued.',
    fields: [
      { field_type: 'rating',   field_key: 'satisfaction',   label: 'How satisfied are you overall?',      placeholder: '', required: 'yes', width: 'full', validation: 'none', options: '', default_value: '', help_text: '1 = very dissatisfied · 5 = very satisfied' },
      {
        field_type: 'radio',
        field_key: 'recommend',
        label: 'Would you recommend us to a colleague?',
        placeholder: '',
        required: 'yes',
        width: 'full',
        validation: 'none',
        options: 'Definitely yes\nProbably yes\nNot sure\nProbably not\nDefinitely not',
        default_value: '',
        help_text: '',
      },
      { field_type: 'textarea', field_key: 'improvements',   label: 'What could we do better?',            placeholder: 'Any suggestions are welcome…',   required: 'no',  width: 'full', validation: 'none', options: '', default_value: '', help_text: 'Optional' },
      { field_type: 'text',     field_key: 'full_name',      label: 'Name',                                placeholder: 'Your name',                      required: 'no',  width: 'half', validation: 'none',  options: '', default_value: '', help_text: 'Optional' },
      { field_type: 'email',    field_key: 'email',          label: 'Email',                               placeholder: 'you@example.com',                required: 'no',  width: 'half', validation: 'email', options: '', default_value: '', help_text: 'Optional' },
    ],
  },
  render: (props) => <FormBlockBase {...props} />,
};
