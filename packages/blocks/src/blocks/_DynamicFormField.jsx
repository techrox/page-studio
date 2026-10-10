import {
  Form,
  Input,
  Select,
  Radio,
  Checkbox,
  DatePicker,
  Rate,
  InputNumber,
  Upload,
  Button,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';

export const COUNTRY_OPTIONS = [
  { value: 'AU', label: 'Australia' },
  { value: 'AT', label: 'Austria' },
  { value: 'BE', label: 'Belgium' },
  { value: 'BR', label: 'Brazil' },
  { value: 'CA', label: 'Canada' },
  { value: 'CN', label: 'China' },
  { value: 'DK', label: 'Denmark' },
  { value: 'EG', label: 'Egypt' },
  { value: 'FI', label: 'Finland' },
  { value: 'FR', label: 'France' },
  { value: 'DE', label: 'Germany' },
  { value: 'GH', label: 'Ghana' },
  { value: 'GR', label: 'Greece' },
  { value: 'HK', label: 'Hong Kong' },
  { value: 'IN', label: 'India' },
  { value: 'ID', label: 'Indonesia' },
  { value: 'IE', label: 'Ireland' },
  { value: 'IL', label: 'Israel' },
  { value: 'IT', label: 'Italy' },
  { value: 'JP', label: 'Japan' },
  { value: 'KE', label: 'Kenya' },
  { value: 'MY', label: 'Malaysia' },
  { value: 'MX', label: 'Mexico' },
  { value: 'NL', label: 'Netherlands' },
  { value: 'NZ', label: 'New Zealand' },
  { value: 'NG', label: 'Nigeria' },
  { value: 'NO', label: 'Norway' },
  { value: 'PK', label: 'Pakistan' },
  { value: 'PH', label: 'Philippines' },
  { value: 'PL', label: 'Poland' },
  { value: 'PT', label: 'Portugal' },
  { value: 'QA', label: 'Qatar' },
  { value: 'SA', label: 'Saudi Arabia' },
  { value: 'SG', label: 'Singapore' },
  { value: 'ZA', label: 'South Africa' },
  { value: 'KR', label: 'South Korea' },
  { value: 'ES', label: 'Spain' },
  { value: 'SE', label: 'Sweden' },
  { value: 'CH', label: 'Switzerland' },
  { value: 'TW', label: 'Taiwan' },
  { value: 'TH', label: 'Thailand' },
  { value: 'TR', label: 'Turkey' },
  { value: 'AE', label: 'UAE' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'US', label: 'United States' },
  { value: 'VN', label: 'Vietnam' },
];

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'nonbinary', label: 'Non-binary' },
  { value: 'prefer_not', label: 'Prefer not to say' },
];

function parseOptions(str) {
  if (!str) return [];
  return str
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => ({ value: s, label: s }));
}

function buildRules(field) {
  const isRequired = field.required === 'yes' || field.required === true;
  const rules = [];
  if (isRequired) {
    rules.push({ required: true, message: `${field.label || 'This field'} is required` });
  }
  switch (field.validation) {
    case 'email':
      rules.push({ type: 'email', message: 'Enter a valid email address' });
      break;
    case 'url':
      rules.push({ type: 'url', message: 'Enter a valid URL' });
      break;
    case 'phone':
      rules.push({ pattern: /^\+?[\d\s\-().]{7,20}$/, message: 'Enter a valid phone number' });
      break;
    case 'number_positive':
      rules.push({ type: 'number', min: 0, message: 'Must be a positive number' });
      break;
    case 'min6':
      rules.push({ min: 6, message: 'Must be at least 6 characters' });
      break;
    case 'min8':
      rules.push({ min: 8, message: 'Must be at least 8 characters' });
      break;
    default:
      break;
  }
  return rules;
}

// Renders a single form field based on the field config object.
// Each form block passes its `fields` array items here one-by-one.
export function DynamicFormField({ field }) {
  const {
    field_type = 'text',
    field_key,
    label,
    placeholder,
    help_text,
    options,
    default_value,
  } = field;

  if (!field_key) return null;

  const rules = buildRules(field);
  const opts = parseOptions(options);
  const lg = { size: 'large' };

  // Upload needs valuePropName="fileList"
  if (field_type === 'upload') {
    return (
      <Form.Item
        name={field_key}
        label={label}
        valuePropName="fileList"
        getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
        rules={rules}
        help={help_text || undefined}
      >
        <Upload beforeUpload={() => false}>
          <Button icon={<UploadOutlined />}>{placeholder || 'Choose file'}</Button>
        </Upload>
      </Form.Item>
    );
  }

  // Checkbox (single agree/consent) needs valuePropName="checked"
  if (field_type === 'checkbox') {
    const isRequired = field.required === 'yes' || field.required === true;
    return (
      <Form.Item
        name={field_key}
        valuePropName="checked"
        rules={
          isRequired
            ? [
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error(help_text || `${label || 'This field'} is required`),
                        ),
                },
              ]
            : []
        }
        style={{ marginBottom: 16 }}
      >
        <Checkbox>{label}</Checkbox>
      </Form.Item>
    );
  }

  // DatePicker: don't pass string default_value — incompatible type
  const initialValue =
    field_type === 'date' || field_type === 'rating' ? undefined : default_value || undefined;

  let control;
  switch (field_type) {
    case 'email':
      control = <Input {...lg} placeholder={placeholder} type="email" />;
      break;
    case 'tel':
      control = <Input {...lg} placeholder={placeholder} type="tel" />;
      break;
    case 'textarea':
      control = <Input.TextArea rows={4} placeholder={placeholder} />;
      break;
    case 'number':
      control = <InputNumber size="large" style={{ width: '100%' }} placeholder={placeholder} />;
      break;
    case 'currency':
      control = (
        <InputNumber
          size="large"
          style={{ width: '100%' }}
          placeholder={placeholder}
          prefix="$"
          precision={2}
          formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(v) => v?.replace(/[^\d.]/g, '')}
        />
      );
      break;
    case 'select':
      control = <Select {...lg} placeholder={placeholder} options={opts} />;
      break;
    case 'multiselect':
      control = <Select {...lg} mode="multiple" placeholder={placeholder} options={opts} />;
      break;
    case 'radio':
      control = <Radio.Group options={opts} />;
      break;
    case 'checkbox_group':
      control = <Checkbox.Group options={opts} />;
      break;
    case 'date':
      control = <DatePicker size="large" style={{ width: '100%' }} placeholder={placeholder} />;
      break;
    case 'rating':
      control = <Rate />;
      break;
    case 'country':
      control = (
        <Select
          {...lg}
          showSearch
          placeholder={placeholder || 'Select country'}
          options={COUNTRY_OPTIONS}
          filterOption={(input, opt) =>
            opt.label.toLowerCase().includes(input.toLowerCase())
          }
        />
      );
      break;
    case 'gender':
      control = (
        <Select {...lg} placeholder={placeholder || 'Select gender'} options={GENDER_OPTIONS} />
      );
      break;
    case 'otp':
      control = <Input.OTP length={6} />;
      break;
    default:
      control = <Input {...lg} placeholder={placeholder} />;
  }

  return (
    <Form.Item
      label={label}
      name={field_key}
      rules={rules}
      help={help_text || undefined}
      initialValue={initialValue}
    >
      {control}
    </Form.Item>
  );
}
