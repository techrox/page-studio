import { FormBlockBase, COMMON_FORM_FIELDS, COMMON_FORM_DEFAULTS } from './_FormBlockBase';

// Address / location collection — name, street, city, state, country, postal code.
export const FormAddress = {
  label: 'Address form',
  fields: COMMON_FORM_FIELDS,
  defaultProps: {
    ...COMMON_FORM_DEFAULTS,
    form_heading: 'Your address',
    form_lede: 'Please provide your delivery or billing address.',
    form_submit_label: 'Save address',
    success_heading: 'Address saved.',
    success_body: 'Your address details have been recorded.',
    fields: [
      { field_type: 'text',    field_key: 'full_name', label: 'Full name',       placeholder: 'Recipient name',    required: 'yes', width: 'full', validation: 'none', options: '', default_value: '', help_text: '' },
      { field_type: 'text',    field_key: 'line1',     label: 'Address line 1',  placeholder: 'Street address',    required: 'yes', width: 'full', validation: 'none', options: '', default_value: '', help_text: '' },
      { field_type: 'text',    field_key: 'line2',     label: 'Address line 2',  placeholder: 'Apartment, suite, unit…', required: 'no', width: 'full', validation: 'none', options: '', default_value: '', help_text: 'Optional' },
      { field_type: 'text',    field_key: 'city',      label: 'City',            placeholder: 'City',              required: 'yes', width: 'half', validation: 'none', options: '', default_value: '', help_text: '' },
      { field_type: 'text',    field_key: 'state',     label: 'State / region',  placeholder: 'State or region',   required: 'no',  width: 'half', validation: 'none', options: '', default_value: '', help_text: '' },
      { field_type: 'country', field_key: 'country',   label: 'Country',         placeholder: 'Select country',    required: 'yes', width: 'half', validation: 'none', options: '', default_value: '', help_text: '' },
      { field_type: 'text',    field_key: 'pincode',   label: 'Postal / ZIP code', placeholder: 'Postal code',     required: 'yes', width: 'half', validation: 'none', options: '', default_value: '', help_text: '' },
    ],
  },
  render: (props) => <FormBlockBase {...props} />,
};
