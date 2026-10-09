'use client';

// NewsletterSignup — single-field email capture. Submits through the
// existing leads endpoint with source='newsletter' so subscribers land in
// the same admin Leads list as contact-form submissions, but are filterable.

import { useState } from 'react';
import { Button, Input, Form, message as antdMessage, App as AntdApp } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

import { useStudio } from '../context';

function NewsletterSignupRender({
  eyebrow,
  heading,
  body,
  button_label,
  success_message,
  background,
  background_image,
  background_overlay = 'gradient',
  button_style = 'solid',
}) {
  const [form] = Form.useForm();
  const { message: appMessage } = AntdApp.useApp() || {};
  const message = appMessage?.error ? appMessage : antdMessage;
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
  const bgUrl = String(background_image || '').trim();
  const hasBgImage = Boolean(bgUrl);

  let overlayBg = '';
  if (hasBgImage) {
    if (background_overlay === 'gradient') {
      overlayBg = dark
        ? 'linear-gradient(180deg, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%)'
        : 'linear-gradient(180deg, rgba(255, 255, 255, 0.88) 0%, rgba(255, 255, 255, 0.96) 100%)';
    } else if (background_overlay === 'dark') {
      overlayBg = 'linear-gradient(rgba(15, 23, 42, 0.65), rgba(15, 23, 42, 0.65))';
    } else if (background_overlay === 'subtle') {
      overlayBg = 'linear-gradient(rgba(15, 23, 42, 0.2), rgba(15, 23, 42, 0.2))';
    }
  }

  const buttonClass =
    button_style === 'gradient'
      ? 'tps-btn--gradient'
      : button_style === 'gradient-cyan'
      ? 'tps-btn--gradient-cyan'
      : button_style === 'gradient-purple'
      ? 'tps-btn--gradient-purple'
      : 'tps-btn--solid';

  const isLightText = dark || (hasBgImage && (background_overlay === 'dark' || (background_overlay === 'gradient' && dark)));

  return (
    <section
      className={`tps-section ${background === 'soft' && !hasBgImage ? 'tps-section-soft' : ''}`}
      style={{
        paddingTop: 64,
        paddingBottom: 64,
        background: dark && !hasBgImage ? '#0F172A' : undefined,
        ...(hasBgImage
          ? {
              backgroundImage: overlayBg ? `${overlayBg}, url("${bgUrl}")` : `url("${bgUrl}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }
          : {}),
        color: isLightText ? '#fff' : undefined,
      }}
    >
      <div className="tps-container" style={{ maxWidth: 640, textAlign: 'center' }}>
        {eyebrow && (
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 2,
              color: isLightText ? '#F59E0B' : 'var(--tps-accent-dark)',
              marginBottom: 12,
            }}
          >
            {eyebrow}
          </div>
        )}
        {heading && (
          <h2 className="tps-h2" style={{ color: isLightText ? '#fff' : undefined }}>
            {heading}
          </h2>
        )}
        {body && (
          <p
            className="tps-lede"
            style={{
              margin: '12px auto 28px',
              color: isLightText ? 'rgba(255,255,255,0.85)' : undefined,
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
              background: isLightText ? 'rgba(255,255,255,0.05)' : 'rgba(15,118,110,0.08)',
              color: isLightText ? '#fff' : 'var(--tps-primary)',
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
              className={buttonClass}
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
    background_image: { type: 'text', label: 'Background image URL (optional)' },
    background_overlay: {
      type: 'select',
      label: 'Image overlay effect',
      options: [
        { label: 'Gradient overlay (Recommended)', value: 'gradient' },
        { label: 'Dark tint (50%)', value: 'dark' },
        { label: 'Subtle tint (20%)', value: 'subtle' },
        { label: 'No overlay', value: 'none' },
      ],
    },
    button_style: {
      type: 'select',
      label: 'Button style',
      options: [
        { label: 'Brand primary (Solid)', value: 'solid' },
        { label: 'Gradient (Primary to Accent)', value: 'gradient' },
        { label: 'Gradient (Cyan to Blue)', value: 'gradient-cyan' },
        { label: 'Gradient (Purple to Pink)', value: 'gradient-purple' },
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
    background_image: '',
    background_overlay: 'gradient',
    button_style: 'solid',
  },
  render: (props) => <NewsletterSignupRender {...props} />,
};
