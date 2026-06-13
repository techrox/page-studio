import { FormBlockBase, COMMON_FORM_FIELDS, COMMON_FORM_DEFAULTS } from './_FormBlockBase';

// Job / grant / programme application — personal details, role, cover note, CV upload.
export const FormApplication = {
  label: 'Application form',
  fields: COMMON_FORM_FIELDS,
  defaultProps: {
    ...COMMON_FORM_DEFAULTS,
    form_heading: 'Apply now',
    form_lede: 'Tell us about yourself. We read every application carefully.',
    form_submit_label: 'Submit application',
    success_heading: 'Application submitted.',
    success_body:
      "Thanks for applying. We'll review your application and be in touch within 5–7 business days.",
    fields: [
      { field_type: 'text',  field_key: 'full_name',   label: 'Full name',      placeholder: 'Your name',            required: 'yes', width: 'half', validation: 'none',  options: '', default_value: '', help_text: '' },
      { field_type: 'email', field_key: 'email',       label: 'Email',          placeholder: 'you@example.com',      required: 'yes', width: 'half', validation: 'email', options: '', default_value: '', help_text: '' },
      { field_type: 'tel',   field_key: 'phone',       label: 'Phone',          placeholder: '+1 555 000 0000',      required: 'no',  width: 'half', validation: 'phone', options: '', default_value: '', help_text: 'Optional' },
      { field_type: 'text',  field_key: 'linkedin',    label: 'LinkedIn',       placeholder: 'linkedin.com/in/you',  required: 'no',  width: 'half', validation: 'url',   options: '', default_value: '', help_text: 'Optional' },
      { field_type: 'text',  field_key: 'portfolio',   label: 'Portfolio / website', placeholder: 'https://yoursite.com', required: 'no',  width: 'half', validation: 'url',   options: '', default_value: '', help_text: 'Optional' },
      {
        field_type: 'select',
        field_key: 'role',
        label: 'Role applying for',
        placeholder: 'Select a role',
        required: 'yes',
        width: 'half',
        validation: 'none',
        options: 'Engineering\nDesign\nProduct\nMarketing\nOperations\nOther',
        default_value: '',
        help_text: '',
      },
      { field_type: 'textarea', field_key: 'cover_note', label: 'Cover note',     placeholder: 'Why are you interested? What would you bring to the role?', required: 'yes', width: 'full', validation: 'none',  options: '', default_value: '', help_text: '' },
      { field_type: 'upload',   field_key: 'cv',         label: 'CV / résumé',    placeholder: 'Upload CV (PDF preferred)',                                  required: 'no',  width: 'full', validation: 'none',  options: '', default_value: '', help_text: 'PDF, DOC, or DOCX — max 5 MB' },
    ],
  },
  render: (props) => <FormBlockBase {...props} />,
};
