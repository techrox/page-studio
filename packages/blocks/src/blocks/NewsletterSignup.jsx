'use client';

// NewsletterSignup — single-field email capture. Submits through the
// existing leads endpoint with source='newsletter' so subscribers land in
// the same admin Leads list as contact-form submissions, but are filterable.

import { useState } from 'react';
import { Button, Input, Form, App as AntdApp } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

import { useStudio } from '../context';

function NewsletterSignupRender({
  eyebrow,
  heading,
  body,
  button_label,
  success_message,
  background,
}) {
  const [form] = Form.useForm();
  const { message } = AntdApp.useApp();
  const { subscribeNewsletter } = useStudio();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async ({ email }) => {
    setSubmitting(true);
    try {
      await subscribeNewsletter({ email, source: 'newsletter' });
      setSubmitted(true);
      form.resetFields();
    } catch (err) {
      message.error(err?.message || err?.response?.data?.error || 'Could not subscribe — please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const dark = background === 'dark';

  return (
    <section
      className={`tps-section ${background === 'soft' ? 'tps-section-soft' : ''}`}
      style={{
        paddingTop: 64,
        paddingBottom: 64,
        background: dark ? '#0F172A' : undefined,
        color: dark ? '#fff' : undefined,
      }}
    >
      <div className="tps-container" style={{ maxWidth: 640, textAlign: 'center' }}>
        {eyebrow && (
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 2,
              color: dark ? '#F59E0B' : 'var(--tps-accent-dark)',
              marginBottom: 12,
            }}
          >
            {eyebrow}
          </div>
        )}
        {heading && (
          <h2 className="tps-h2" style={{ color: dark ? '#fff' : undefined }}>
            {heading}
          </h2>
        )}
        {body && (
          <p
            className="tps-lede"
            style={{
              margin: '12px auto 28px',
              color: dark ? 'rgba(255,255,255,0.85)' : undefined,
            }}
          >
            {body}
          </p>
        )}
        {submitted ? (
          <div
            style={{
              padding: 20,
              borderRadius: 'var(--tps-radius)',
              background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(15,118,110,0.08)',
              color: dark ? '#fff' : 'var(--tps-primary)',
              fontWeight: 600,
            }}
          >
            ✓ {success_message || "You're subscribed."}
          </div>
        ) : (
          <Form
            form={form}
            onFinish={onSubmit}
            layout="inline"
            style={{ justifyContent: 'center', flexWrap: 'nowrap', gap: 8 }}
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Email required' },
                { type: 'email', message: 'Enter a valid email' },
              ]}
              style={{ flex: 1, maxWidth: 360, marginInlineEnd: 0 }}
            >
              <Input size="large" placeholder="you@company.com" />
            </Form.Item>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              loading={submitting}
              icon={<ArrowRightOutlined />}
            >
              {button_label || 'Subscribe'}
            </Button>
          </Form>
        )}
      </div>
    </section>
  );
}

export const NewsletterSignup = {
  label: 'Newsletter signup',
  fields: {
    eyebrow: { type: 'text', label: 'Eyebrow' },
    heading: { type: 'text', label: 'Heading' },
    body: { type: 'textarea', label: 'Body' },
    button_label: { type: 'text', label: 'Button label' },
    success_message: { type: 'text', label: 'Success message' },
    background: {
      type: 'radio',
      label: 'Background',
      options: [
        { label: 'White', value: 'white' },
        { label: 'Soft', value: 'soft' },
        { label: 'Dark', value: 'dark' },
      ],
    },
  },
  defaultProps: {
    eyebrow: 'STAY IN THE LOOP',
    heading: 'Get the good stuff in your inbox.',
    body:
      'A short, friendly pitch for the newsletter. One sentence on what subscribers get and how often.',
    button_label: 'Subscribe',
    success_message: "You're in. Talk soon.",
    background: 'soft',
  },
  render: (props) => <NewsletterSignupRender {...props} />,
};
