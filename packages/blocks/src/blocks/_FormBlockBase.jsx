import { useState } from 'react';
import { Form, Row, Col, Button, App as AntdApp } from 'antd';
import { SendOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useStudio } from '../context';
import { DynamicFormField } from './_DynamicFormField';

// Puck array-field definition shared by every form block.
// Authors configure form fields in the Puck sidebar — add, remove, reorder,
// and edit each field's type, label, validation preset, and layout width.
export const FORM_FIELD_ARRAY_DEF = {
  type: 'array',
  label: 'Form fields',
  arrayFields: {
    field_type: {
      type: 'select',
      label: 'Field type',
      options: [
        { value: 'text', label: 'Text' },
        { value: 'email', label: 'Email' },
        { value: 'tel', label: 'Phone' },
        { value: 'textarea', label: 'Long text' },
        { value: 'number', label: 'Number' },
        { value: 'currency', label: 'Currency' },
        { value: 'select', label: 'Dropdown (single)' },
        { value: 'multiselect', label: 'Dropdown (multiple)' },
        { value: 'radio', label: 'Radio buttons' },
        { value: 'checkbox', label: 'Checkbox / agree' },
        { value: 'checkbox_group', label: 'Checkbox group' },
        { value: 'date', label: 'Date picker' },
        { value: 'rating', label: 'Star rating' },
        { value: 'upload', label: 'File upload' },
        { value: 'country', label: 'Country select' },
        { value: 'gender', label: 'Gender select' },
        { value: 'otp', label: 'OTP code' },
      ],
    },
    field_key: { type: 'text', label: 'Field key (unique identifier)' },
    label: { type: 'text', label: 'Label' },
    placeholder: { type: 'text', label: 'Placeholder text' },
    required: {
      type: 'radio',
      label: 'Required',
      options: [
        { value: 'no', label: 'No' },
        { value: 'yes', label: 'Yes' },
      ],
    },
    width: {
      type: 'radio',
      label: 'Width',
      options: [
        { value: 'full', label: 'Full width' },
        { value: 'half', label: 'Half width' },
      ],
    },
    options: {
      type: 'textarea',
      label: 'Options — one per line (dropdown, radio, checkboxes)',
    },
    default_value: { type: 'text', label: 'Default value' },
    help_text: { type: 'text', label: 'Help / hint text' },
    validation: {
      type: 'select',
      label: 'Validation preset',
      options: [
        { value: 'none', label: 'None' },
        { value: 'email', label: 'Email format' },
        { value: 'phone', label: 'Phone format' },
        { value: 'url', label: 'URL / website' },
        { value: 'number_positive', label: 'Positive number' },
        { value: 'min6', label: 'Min. 6 characters' },
        { value: 'min8', label: 'Min. 8 characters' },
      ],
    },
  },
  getItemSummary: (item, i) =>
    `${item?.label || item?.field_key || `Field ${i + 1}`} (${item?.field_type || 'text'})`,
  defaultItemProps: {
    field_type: 'text',
    field_key: '',
    label: 'New field',
    placeholder: '',
    required: 'no',
    width: 'full',
    options: '',
    default_value: '',
    help_text: '',
    validation: 'none',
  },
};

// Puck block fields shared by every form block (heading, submit, success state).
export const COMMON_FORM_FIELDS = {
  form_heading: { type: 'text', label: 'Heading' },
  form_lede: { type: 'textarea', label: 'Lede' },
  form_submit_label: { type: 'text', label: 'Submit button label' },
  form_privacy_html: { type: 'textarea', label: 'Privacy footer (HTML allowed)' },
  success_heading: { type: 'text', label: 'Success heading' },
  success_body: { type: 'textarea', label: 'Success body' },
  background: {
    type: 'radio',
    label: 'Background',
    options: [
      { label: 'White', value: 'white' },
      { label: 'Soft', value: 'soft' },
      { label: 'Dark', value: 'dark' },
    ],
  },
  fields: FORM_FIELD_ARRAY_DEF,
};

export const COMMON_FORM_DEFAULTS = {
  form_heading: '',
  form_lede: '',
  form_submit_label: 'Submit',
  form_privacy_html:
    'We respect your privacy. Your information is kept secure and never sold.',
  success_heading: 'Thank you.',
  success_body: "We've received your submission and will be in touch shortly.",
  background: 'white',
};

// Groups consecutive half-width fields into pairs; full-width fields get
// their own row. Any trailing unpaired half-width field becomes full-width.
function groupIntoRows(fields) {
  const rows = [];
  let buffer = [];
  for (const f of fields) {
    if (!f?.field_key) continue;
    if (f.width === 'half') {
      buffer.push(f);
      if (buffer.length === 2) {
        rows.push(buffer);
        buffer = [];
      }
    } else {
      if (buffer.length > 0) {
        rows.push(buffer);
        buffer = [];
      }
      rows.push([f]);
    }
  }
  if (buffer.length > 0) rows.push(buffer);
  return rows;
}

function SuccessState({ heading, body, onReset }) {
  return (
    <div style={{ textAlign: 'center', padding: '48px 24px' }}>
      <CheckCircleOutlined
        style={{ fontSize: 48, color: 'var(--tps-primary, #0b60d8)', marginBottom: 20 }}
      />
      {heading && (
        <h3 className="tps-h3" style={{ marginBottom: 12 }}>
          {heading}
        </h3>
      )}
      {body && (
        <p className="tps-lede" style={{ margin: '0 auto 24px', maxWidth: 480 }}>
          {body}
        </p>
      )}
      <Button type="link" onClick={onReset} style={{ padding: 0 }}>
        Submit another response
      </Button>
    </div>
  );
}

// The shared render component used by every form block.
// Each block passes its props here; the fields array drives the form layout.
export function FormBlockBase({
  form_heading,
  form_lede,
  form_submit_label,
  form_privacy_html,
  success_heading,
  success_body,
  background = 'white',
  fields = [],
}) {
  const [form] = Form.useForm();
  const { message } = AntdApp.useApp();
  const { submitLead, track } = useStudio();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [started, setStarted] = useState(false);

  const validFields = Array.isArray(fields)
    ? fields.filter((f) => f?.field_key && f?.field_type)
    : [];
  const rows = groupIntoRows(validFields);

  const onFinish = async (values) => {
    setSubmitting(true);
    try {
      await submitLead({ ...values, source: 'form_block' });
      track('form_submit');
      form.resetFields();
      setSubmitted(true);
    } catch (err) {
      message.error(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const onValuesChange = () => {
    if (!started) {
      setStarted(true);
      track('form_start');
    }
  };

  return (
    <section
      className={`tps-section ${background === 'soft' ? 'tps-section-soft' : ''}${
        background === 'dark' ? ' tps-section-dark' : ''
      }`}
    >
      <div className="tps-container">
        {(form_heading || form_lede) && (
          <div style={{ marginBottom: 40, maxWidth: 640 }}>
            {form_heading && <h2 className="tps-h2">{form_heading}</h2>}
            {form_lede && (
              <p className="tps-lede" style={{ marginBottom: 0 }}>
                {form_lede}
              </p>
            )}
          </div>
        )}

        <div className="tps-form-card" style={{ maxWidth: 720 }}>
          {submitted ? (
            <SuccessState
              heading={success_heading}
              body={success_body}
              onReset={() => setSubmitted(false)}
            />
          ) : (
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              onValuesChange={onValuesChange}
              requiredMark={false}
            >
              {rows.map((row, ri) => (
                <Row key={ri} gutter={16}>
                  {row.map((field) => (
                    <Col key={field.field_key} xs={24} sm={row.length > 1 ? 12 : 24}>
                      <DynamicFormField field={field} />
                    </Col>
                  ))}
                </Row>
              ))}

              <Form.Item style={{ marginTop: 8, marginBottom: 0 }}>
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  loading={submitting}
                  icon={<SendOutlined />}
                  style={{ minWidth: 180, height: 48, fontWeight: 600 }}
                >
                  {form_submit_label || 'Submit'}
                </Button>
              </Form.Item>

              {form_privacy_html && (
                <p
                  style={{
                    fontSize: 13,
                    color: 'var(--tps-muted)',
                    marginTop: 16,
                    marginBottom: 0,
                  }}
                  dangerouslySetInnerHTML={{ __html: form_privacy_html }}
                />
              )}
            </Form>
          )}
        </div>
      </div>
    </section>
  );
}
