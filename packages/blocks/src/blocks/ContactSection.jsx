'use client';

// ContactSection — a self-contained contact-page block. Renders the hero,
// the sidebar (email + LinkedIn + response card) and the lead-capture form
// as one editable unit. Authors get fields for every visible label and
// dropdown option; the form wiring (validation, submit, tracking) stays
// internal so it works the same way on the public site as the legacy
// schema-rendered contact page.

import { useState } from 'react';
import { Row, Col, Form, Input, Button, Select, Space, App as AntdApp } from 'antd';
import { SendOutlined, MailOutlined, LinkedinFilled } from '@ant-design/icons';

import { useStudio } from '../context';

function ContactSectionRender({
  hero_eyebrow,
  hero_heading,
  hero_lede,
  sidebar_heading,
  response_label,
  response_body,
  form_submit_label,
  form_privacy_html,
  success_heading,
  success_body,
  stages,
  contact_email,
}) {
  const [form] = Form.useForm();
  const { message } = AntdApp.useApp();
  const { services, site, submitLead, track } = useStudio();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [started, setStarted] = useState(false);

  const stagesList = Array.isArray(stages) ? stages.filter(Boolean) : [];
  const email = contact_email || site.email;

  const onFirstInteraction = () => {
    if (started) return;
    setStarted(true);
    track('contact_form_start', { surface: 'contact_page' });
  };

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      await submitLead({
        ...values,
        message: [
          values.stage ? `Stage: ${values.stage}` : null,
          values.interest ? `Interest: ${values.interest}` : null,
          values.message,
        ]
          .filter(Boolean)
          .join('\n\n'),
        source: 'contact_page',
      });
      track('contact_submit', { surface: 'contact_page' });
      message.success("Thank you — we'll reach out within one business day.");
      form.resetFields();
      setSubmitted(true);
    } catch (err) {
      track('contact_error', { surface: 'contact_page', field: 'submit' });
      message.error(
        err?.message ||
          err?.response?.data?.error ||
          'Something went wrong. Please try again or email us directly.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const onFinishFailed = ({ errorFields }) => {
    const firstField = errorFields?.[0]?.name?.[0];
    track('contact_error', { surface: 'contact_page', field: firstField || 'validation' });
  };

  return (
    <>
      <section className="tps-service-hero">
        <div className="tps-container">
          {hero_eyebrow && <span className="tps-eyebrow">{hero_eyebrow}</span>}
          {hero_heading && (
            <h1 className="tps-h1" style={{ maxWidth: 880 }}>
              {hero_heading}
            </h1>
          )}
          {hero_lede && <p className="tps-lede">{hero_lede}</p>}
        </div>
      </section>

      <section className="tps-section">
        <div className="tps-container">
          <Row gutter={[48, 48]}>
            <Col xs={24} md={9}>
              {sidebar_heading && <h2 className="tps-h3">{sidebar_heading}</h2>}
              <Space direction="vertical" size={20} style={{ width: '100%', marginTop: 24 }}>
                <a
                  href={`mailto:${email}`}
                  style={{
                    display: 'flex',
                    gap: 14,
                    padding: 16,
                    border: '1px solid var(--tps-line)',
                    borderRadius: 'var(--tps-radius)',
                    textDecoration: 'none',
                    color: 'var(--tps-ink)',
                  }}
                >
                  <MailOutlined style={{ fontSize: 22, color: 'var(--tps-primary)' }} />
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--tps-muted)' }}>Email</div>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>{email}</div>
                  </div>
                </a>
                <a
                  href={site.social?.linkedin || '#'}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'flex',
                    gap: 14,
                    padding: 16,
                    border: '1px solid var(--tps-line)',
                    borderRadius: 'var(--tps-radius)',
                    textDecoration: 'none',
                    color: 'var(--tps-ink)',
                  }}
                >
                  <LinkedinFilled style={{ fontSize: 22, color: 'var(--tps-primary)' }} />
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--tps-muted)' }}>LinkedIn</div>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>Page Studio</div>
                  </div>
                </a>
              </Space>

              {(response_label || response_body) && (
                <div
                  style={{
                    marginTop: 32,
                    padding: 20,
                    background: 'var(--tps-bg-soft)',
                    borderRadius: 'var(--tps-radius)',
                    border: '1px solid var(--tps-line)',
                  }}
                >
                  {response_label && (
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: 1.5,
                        color: 'var(--tps-accent-dark)',
                        marginBottom: 8,
                      }}
                    >
                      {response_label}
                    </div>
                  )}
                  {response_body && (
                    <p style={{ margin: 0, color: 'var(--tps-ink-2)', lineHeight: 1.6 }}>
                      {response_body}
                    </p>
                  )}
                </div>
              )}
            </Col>

            <Col xs={24} md={15}>
              <div className="tps-form-card">
                {submitted ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <div
                      style={{
                        width: 72,
                        height: 72,
                        borderRadius: '50%',
                        background: 'rgba(15, 118, 110, 0.1)',
                        color: 'var(--tps-primary)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 32,
                        marginBottom: 24,
                      }}
                    >
                      ✓
                    </div>
                    {success_heading && <h2 className="tps-h3">{success_heading}</h2>}
                    {success_body && (
                      <p className="tps-lede" style={{ margin: '0 auto', maxWidth: 480 }}>
                        {success_body}
                      </p>
                    )}
                    <Button
                      type="link"
                      onClick={() => setSubmitted(false)}
                      style={{ marginTop: 16 }}
                    >
                      Send another message
                    </Button>
                  </div>
                ) : (
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={onSubmit}
                    onFinishFailed={onFinishFailed}
                    onValuesChange={onFirstInteraction}
                    requiredMark={false}
                  >
                    <Row gutter={16}>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          label="Full name"
                          name="full_name"
                          rules={[{ required: true, message: 'Please enter your name' }]}
                        >
                          <Input size="large" placeholder="Your name" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          label="Work email"
                          name="email"
                          rules={[
                            { required: true, message: 'Email is required' },
                            { type: 'email', message: 'Enter a valid email' },
                          ]}
                        >
                          <Input size="large" placeholder="you@company.com" />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col xs={24} sm={12}>
                        <Form.Item label="Phone" name="phone">
                          <Input size="large" placeholder="Optional" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          label="Organization"
                          name="organization"
                          rules={[{ required: true, message: 'Organization is required' }]}
                        >
                          <Input size="large" placeholder="Your company" />
                        </Form.Item>
                      </Col>
                    </Row>

                    {stagesList.length > 0 && (
                      <Form.Item label="Where are you in your journey?" name="stage">
                        <Select
                          size="large"
                          placeholder="Select the stage that best describes you"
                          options={stagesList.map((s) => ({ value: s, label: s }))}
                        />
                      </Form.Item>
                    )}

                    <Form.Item label="Which capabilities interest you?" name="interest">
                      <Select
                        size="large"
                        mode="multiple"
                        placeholder="Pick one or more (optional)"
                        options={services.map((s) => ({ value: s.short || s.label || s.slug, label: s.short || s.label || s.slug }))}
                      />
                    </Form.Item>

                    <Form.Item
                      label="Tell us more"
                      name="message"
                      rules={[{ required: true, message: 'A short message helps us prepare' }]}
                    >
                      <Input.TextArea
                        rows={5}
                        placeholder="Your products, current systems, target markets, or specific challenges you'd like to discuss…"
                      />
                    </Form.Item>

                    <Button
                      type="primary"
                      size="large"
                      htmlType="submit"
                      loading={submitting}
                      icon={<SendOutlined />}
                      style={{ minWidth: 200, height: 48, fontWeight: 600 }}
                    >
                      {form_submit_label || 'Send message'}
                    </Button>

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
            </Col>
          </Row>
        </div>
      </section>
    </>
  );
}

export const ContactSection = {
  label: 'Contact section',
  fields: {
    hero_eyebrow: { type: 'text', label: 'Eyebrow' },
    hero_heading: { type: 'text', label: 'Heading' },
    hero_lede: { type: 'textarea', label: 'Lede' },
    sidebar_heading: { type: 'text', label: 'Sidebar heading' },
    response_label: { type: 'text', label: 'Response card label' },
    response_body: { type: 'textarea', label: 'Response card body' },
    form_submit_label: { type: 'text', label: 'Submit button label' },
    form_privacy_html: {
      type: 'textarea',
      label: 'Privacy footer (HTML allowed)',
    },
    success_heading: { type: 'text', label: 'Success heading' },
    success_body: { type: 'textarea', label: 'Success body' },
    stages: {
      type: 'array',
      label: 'Stage dropdown options',
      arrayFields: {
        text: { type: 'text', label: 'Stage' },
      },
      defaultItemProps: { text: 'New stage' },
      getItemSummary: (item, i) => item?.text || `Stage ${i + 1}`,
    },
    contact_email: { type: 'text', label: 'Public email' },
  },
  defaultProps: {
    hero_eyebrow: 'Contact',
    hero_heading: 'Say hello.',
    hero_lede:
      "A short, friendly intro for the contact page. Tell visitors what kind of message you're hoping to get, and how soon you'll reply.",
    sidebar_heading: 'Get in touch',
    response_label: 'RESPONSE TIME',
    response_body:
      "We aim to reply within one business day. Replace this with your own promise.",
    form_submit_label: 'Send message',
    form_privacy_html:
      'We respect your privacy. See our <a href="/privacy">privacy policy</a> for how we handle the information you share.',
    success_heading: 'Thank you.',
    success_body:
      "We've received your message and will be in touch shortly.",
    stages: [
      { text: 'Just exploring' },
      { text: 'Starting a new project' },
      { text: 'Improving an existing process' },
      { text: 'Need help with strategy' },
      { text: 'Other' },
    ],
    contact_email: '',
  },
  render: (props) => <ContactSectionRender {...props} />,
};
