import { FormBlockBase, COMMON_FORM_FIELDS, COMMON_FORM_DEFAULTS } from './_FormBlockBase';

// Demo / appointment booking — name, email, company, date preference, time slot, notes.
export const FormBooking = {
  label: 'Booking / demo form',
  fields: COMMON_FORM_FIELDS,
  defaultProps: {
    ...COMMON_FORM_DEFAULTS,
    form_heading: 'Book a demo',
    form_lede:
      "Pick a date and time that works for you. We'll send a calendar invite within a few hours.",
    form_submit_label: 'Request booking',
    success_heading: 'Request received.',
    success_body: "We'll confirm your booking by email within a few hours.",
    fields: [
      { field_type: 'text',  field_key: 'full_name',       label: 'Full name',       placeholder: 'Your name',         required: 'yes', width: 'half', validation: 'none',  options: '', default_value: '', help_text: '' },
      { field_type: 'email', field_key: 'email',           label: 'Email',           placeholder: 'you@company.com',   required: 'yes', width: 'half', validation: 'email', options: '', default_value: '', help_text: '' },
      { field_type: 'text',  field_key: 'company',         label: 'Company',         placeholder: 'Your organisation', required: 'yes', width: 'full', validation: 'none',  options: '', default_value: '', help_text: '' },
      { field_type: 'date',  field_key: 'preferred_date',  label: 'Preferred date',  placeholder: 'Pick a date',       required: 'yes', width: 'half', validation: 'none',  options: '', default_value: '', help_text: '' },
      {
        field_type: 'select',
        field_key: 'preferred_time',
        label: 'Preferred time',
        placeholder: 'Select a slot',
        required: 'yes',
        width: 'half',
        validation: 'none',
        options: 'Morning (9 am – 12 pm)\nAfternoon (12 pm – 5 pm)\nEvening (5 pm – 7 pm)',
        default_value: '',
        help_text: '',
      },
      { field_type: 'textarea', field_key: 'notes', label: 'Anything to prepare?', placeholder: 'Topics, questions, or context that would help us tailor the session…', required: 'no', width: 'full', validation: 'none', options: '', default_value: '', help_text: 'Optional' },
    ],
  },
  render: (props) => <FormBlockBase {...props} />,
};
