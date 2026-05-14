'use client';

// Schema-driven page editor. Uses raw AntD `Form` + `Form.List` (rather than
// ProForm) because the editor renders heterogeneous field types from a
// per-key schema registry — that doesn't compose cleanly with ProFormList's
// typed item components.
//
// Host-agnostic: the consumer supplies the schema, default content, the Link
// component, and an adapter for save / delete / history / image upload.

import { createContext, useContext, useEffect, useRef, useState, useTransition } from 'react';
import {
  Form,
  Input,
  Switch,
  Button,
  Space,
  Tabs,
  Alert,
  App as AntdApp,
  Popconfirm,
  Typography,
  Card,
  Segmented,
} from 'antd';
import {
  ArrowLeftOutlined,
  SaveOutlined,
  DeleteOutlined,
  PlusOutlined,
  MinusCircleOutlined,
  EyeOutlined,
  HolderOutlined,
  ReloadOutlined,
  DesktopOutlined,
  MobileOutlined,
  TabletOutlined,
} from '@ant-design/icons';
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import RichText from './RichText';
import HistoryPanel from './HistoryPanel';

const { Text, Paragraph } = Typography;

function DefaultLink({ href, target, children, ...rest }) {
  return (
    <a
      href={href}
      target={target}
      rel={target === '_blank' ? 'noopener noreferrer' : undefined}
      {...rest}
    >
      {children}
    </a>
  );
}

function notConfigured(name) {
  return () => {
    throw new Error(
      `@techrox/page-studio-form: missing required adapter method \`${name}\`.`,
    );
  };
}

const FormCtx = createContext({ LinkComponent: DefaultLink, uploadMedia: undefined });
const useFormCtx = () => useContext(FormCtx);

export default function PageStudioForm({
  pageKey,
  initialPage,
  loadError,
  schema,
  contentDefaults = {},
  livePath,
  homeHref = '/admin/pages',
  homeLabel = 'All pages',
  LinkComponent = DefaultLink,
  adapter = {},
  onSaved,
  onDeleted,
  onRestored,
}) {
  const {
    savePage = notConfigured('savePage'),
    deletePage = notConfigured('deletePage'),
    loadHistory,
    restoreRevision,
    uploadMedia,
  } = adapter;
  const { message } = AntdApp.useApp();
  const [form] = Form.useForm();
  const [pending, startTransition] = useTransition();
  const [savedAt, setSavedAt] = useState(initialPage?.updated_at || null);
  const [previewKey, setPreviewKey] = useState(0);
  const defaults = contentDefaults;

  const initialValues = {
    title: initialPage?.title || '',
    published: initialPage?.published ?? true,
    seo_title: initialPage?.seo?.title || '',
    seo_description: initialPage?.seo?.description || '',
    seo_og_image: initialPage?.seo?.og_image || '',
    seo_noindex: initialPage?.seo?.noindex || false,
    content: { ...defaults, ...(initialPage?.content || {}) },
  };

  // Re-sync the form when the underlying page record changes (e.g. after the
  // host re-fetches following onSaved). Without this, AntD Form keeps the
  // stale initialValues from first mount and the editor "doesn't update".
  useEffect(() => {
    form.setFieldsValue(initialValues);
    setSavedAt(initialPage?.updated_at || null);
    setPreviewKey((k) => k + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPage?.updated_at]);

  const onFinish = (values) => {
    // Fall back to the saved value when a field's tab was never opened, so
    // submitting from the Content tab doesn't accidentally clobber SEO or
    // flip published off (Form.Items in unmounted tabs are absent from values).
    const fallback = (v, prev) => (v === undefined ? prev : v);
    const payload = {
      title: (fallback(values.title, initialPage?.title) || '').trim(),
      seo: {
        title: fallback(values.seo_title, initialPage?.seo?.title) || '',
        description:
          fallback(values.seo_description, initialPage?.seo?.description) || '',
        og_image: fallback(values.seo_og_image, initialPage?.seo?.og_image) || '',
        noindex: !!fallback(values.seo_noindex, initialPage?.seo?.noindex),
      },
      content: pruneContent(values.content || {}),
      published: !!fallback(values.published, initialPage?.published ?? true),
    };
    startTransition(async () => {
      try {
        const result = await savePage(pageKey, payload);
        const page = result?.page;
        message.success('Saved. Public page is being revalidated.');
        if (page?.updated_at) setSavedAt(page.updated_at);
        onSaved?.(page);
      } catch (err) {
        message.error(err.message || 'Failed to save.');
      }
    });
  };

  const onDelete = () => {
    startTransition(async () => {
      try {
        await deletePage(pageKey);
        message.success('Override removed. Public page now uses the static defaults.');
        onDeleted?.();
      } catch (err) {
        message.error(err.message || 'Failed to delete.');
      }
    });
  };

  return (
    <FormCtx.Provider value={{ LinkComponent, uploadMedia }}>
    <div style={{ padding: 24, maxWidth: 1280 }}>
      <LinkComponent
        href={homeHref}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 13,
          color: 'var(--tps-muted)',
          marginBottom: 16,
        }}
      >
        <ArrowLeftOutlined /> {homeLabel}
      </LinkComponent>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={initialValues}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          <div>
            <h1 className="tps-h3" style={{ marginBottom: 4 }}>
              {initialPage?.title || pageKey}
            </h1>
            <Space size={8} wrap>
              <Text type="secondary">
                <Text code>{pageKey}</Text>
              </Text>
              {savedAt && (
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Last saved {new Date(savedAt).toLocaleString()}
                </Text>
              )}
            </Space>
          </div>
          <Space wrap align="center">
            <Form.Item
              name="published"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <PublishToggle />
            </Form.Item>
            {livePath && (
              <LinkComponent href={livePath} target="_blank">
                <Button icon={<EyeOutlined />}>View live</Button>
              </LinkComponent>
            )}
            <Popconfirm
              title="Remove this override?"
              description="The public page will fall back to the static defaults."
              onConfirm={onDelete}
              okText="Remove"
              cancelText="Cancel"
            >
              <Button danger icon={<DeleteOutlined />} disabled={pending}>
                Remove override
              </Button>
            </Popconfirm>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              loading={pending}
              onClick={() => form.submit()}
            >
              Save
            </Button>
          </Space>
        </div>

        {loadError && (
          <Alert
            type="error"
            showIcon
            message="Could not load page"
            description={loadError}
            style={{ margin: '16px 0' }}
          />
        )}

        <Tabs
          defaultActiveKey="content"
          style={{ marginTop: 24 }}
          items={[
            {
              key: 'content',
              label: 'Content',
              forceRender: true,
              children: schema ? (
                <SchemaEditor schema={schema} defaults={defaults} />
              ) : (
                <Alert
                  type="info"
                  showIcon
                  message="No structured content for this page key."
                  description="SEO can still be edited on the SEO tab."
                />
              ),
            },
            {
              key: 'preview',
              label: 'Live preview',
              children: livePath ? (
                <LivePreview path={livePath} previewKey={previewKey} />
              ) : (
                <Alert type="info" message="No public path mapped for this key." />
              ),
            },
            {
              key: 'history',
              label: 'History',
              children: (
                <HistoryPanel
                  pageKey={pageKey}
                  currentPage={initialPage}
                  loadHistory={loadHistory}
                  restoreRevision={restoreRevision}
                  onRestored={onRestored}
                />
              ),
            },
            {
              key: 'seo',
              label: 'SEO',
              forceRender: true,
              children: <SeoFields />,
            },
          ]}
        />

        <Form.Item name="title" hidden>
          <Input />
        </Form.Item>
      </Form>
    </div>
    </FormCtx.Provider>
  );
}

// Toolbar publish switch. Wrapped so the label updates with the form value
// (Form.Item passes value/onChange via cloneElement). Lives in the always-
// visible toolbar so it can never end up unmounted in a hidden tab.
function PublishToggle({ value, onChange }) {
  return (
    <Space size={6}>
      <Switch checked={!!value} onChange={onChange} />
      <Text style={{ fontSize: 12, color: 'var(--tps-muted)' }}>
        {value ? 'Published' : 'Draft'}
      </Text>
    </Space>
  );
}

function pruneContent(content) {
  const out = {};
  for (const [k, v] of Object.entries(content)) {
    if (v === undefined || v === null) continue;
    if (typeof v === 'string' && v.trim() === '') continue;
    if (Array.isArray(v) && v.length === 0) continue;
    out[k] = v;
  }
  return out;
}

function SeoFields() {
  return (
    <Card size="small">
      <Form.Item
        label="SEO title"
        name="seo_title"
        extra="Used in <title> and Open Graph. Leave blank to use the static default."
      >
        <Input maxLength={70} showCount />
      </Form.Item>
      <Form.Item
        label="Meta description"
        name="seo_description"
        extra="Recommended 140–160 characters."
      >
        <Input.TextArea rows={3} maxLength={170} showCount />
      </Form.Item>
      <Form.Item label="Open Graph image URL" name="seo_og_image">
        <Input placeholder="https://cibusiq.com/og-image.png" />
      </Form.Item>
      <Form.Item label="Hide from search engines" name="seo_noindex" valuePropName="checked">
        <Switch />
      </Form.Item>
    </Card>
  );
}

function SchemaEditor({ schema, defaults }) {
  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      {schema.map((section) => (
        <SectionBlock key={section.title} section={section} defaults={defaults} />
      ))}
    </Space>
  );
}

function SectionBlock({ section, defaults }) {
  return (
    <Card
      size="small"
      title={
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 1.5,
            color: 'var(--tps-accent-dark)',
          }}
        >
          {section.title.toUpperCase()}
        </span>
      }
    >
      {section.help && (
        <Paragraph type="secondary" style={{ fontSize: 13, marginTop: 0 }}>
          {section.help}
        </Paragraph>
      )}
      {section.fields.map((f) => (
        <FieldRenderer key={f.name} field={f} parent={['content']} defaults={defaults} />
      ))}
    </Card>
  );
}

function FieldRenderer({ field, parent, defaults }) {
  const namePath = [...parent, field.name];
  const placeholder = placeholderFor(field, defaults?.[field.name]);

  if (field.type === 'text') {
    return (
      <Form.Item label={field.label} name={namePath} extra={field.help}>
        <Input placeholder={placeholder} />
      </Form.Item>
    );
  }
  if (field.type === 'textarea' || field.type === 'html-text') {
    return (
      <Form.Item label={field.label} name={namePath} extra={field.help}>
        <Input.TextArea rows={field.rows || 3} placeholder={placeholder} />
      </Form.Item>
    );
  }
  if (field.type === 'richtext') {
    return (
      <Form.Item
        label={field.label || undefined}
        name={namePath}
        extra={field.help}
        valuePropName="value"
        trigger="onChange"
      >
        <RichTextField placeholder={placeholder} />
      </Form.Item>
    );
  }
  if (field.type === 'list') {
    return (
      <Form.Item
        label={field.label}
        name={namePath}
        extra={field.help}
        getValueFromEvent={(e) =>
          e.target.value.split('\n').map((s) => s.trim()).filter(Boolean)
        }
        getValueProps={(v) => ({ value: Array.isArray(v) ? v.join('\n') : v || '' })}
      >
        <Input.TextArea rows={field.rows || 4} placeholder={placeholder} />
      </Form.Item>
    );
  }
  if (field.type === 'list-csv') {
    return (
      <Form.Item
        label={field.label}
        name={namePath}
        extra={field.help}
        getValueFromEvent={(e) =>
          e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
        }
        getValueProps={(v) => ({ value: Array.isArray(v) ? v.join(', ') : v || '' })}
      >
        <Input placeholder={placeholder} />
      </Form.Item>
    );
  }
  if (field.type === 'repeater') {
    return <Repeater field={field} namePath={namePath} defaults={defaults?.[field.name]} />;
  }
  return (
    <Alert
      type="warning"
      showIcon
      message={`Unknown field type "${field.type}" for ${field.name}`}
      style={{ marginBottom: 12 }}
    />
  );
}

function Repeater({ field, namePath, defaults }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  return (
    <Form.List name={namePath}>
      {(fields, { add, remove, move }) => {
        const ids = fields.map((f) => f.key);
        const onDragEnd = (e) => {
          const { active, over } = e;
          if (!over || active.id === over.id) return;
          const from = ids.indexOf(active.id);
          const to = ids.indexOf(over.id);
          if (from < 0 || to < 0) return;
          // arrayMove + Form.List move are equivalent here — Form.List takes
          // care of re-indexing the underlying values.
          move(from, to);
        };
        return (
          <div>
            {field.label && (
              <Text strong style={{ display: 'block', marginBottom: 8 }}>
                {field.label}
              </Text>
            )}
            {field.help && (
              <Paragraph type="secondary" style={{ fontSize: 13, marginTop: 0 }}>
                {field.help}
              </Paragraph>
            )}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={onDragEnd}
            >
              <SortableContext items={ids} strategy={verticalListSortingStrategy}>
                <Space direction="vertical" size={12} style={{ width: '100%' }}>
                  {fields.map((row, idx) => (
                    <SortableRow
                      key={row.key}
                      id={row.key}
                      field={field}
                      row={row}
                      idx={idx}
                      namePath={namePath}
                      defaults={defaults?.[idx] || null}
                      onRemove={() => remove(idx)}
                    />
                  ))}
                </Space>
              </SortableContext>
            </DndContext>

            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={() => add(buildEmptyItem(field))}
              block
              style={{ marginTop: 12 }}
            >
              Add {field.itemLabel ? singular(field.itemLabel(fields.length)) : 'item'}
            </Button>
          </div>
        );
      }}
    </Form.List>
  );
}

function SortableRow({ id, field, row, idx, namePath, defaults, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 5 : 'auto',
  };
  return (
    <div ref={setNodeRef} style={style}>
      <Card
        size="small"
        style={{
          background: 'var(--tps-bg-soft)',
          boxShadow: isDragging ? '0 8px 24px rgba(0,0,0,0.12)' : undefined,
        }}
        title={
          <Space>
            <Button
              size="small"
              type="text"
              icon={<HolderOutlined />}
              style={{ cursor: 'grab', touchAction: 'none' }}
              {...attributes}
              {...listeners}
            />
            <Text strong style={{ fontSize: 13 }}>
              <RepeaterItemLabel field={field} index={idx} listPath={namePath} />
            </Text>
          </Space>
        }
        extra={
          <Button
            size="small"
            type="text"
            danger
            icon={<MinusCircleOutlined />}
            onClick={onRemove}
          >
            Remove
          </Button>
        }
      >
        {field.itemFields.map((sub) => (
          <FieldRenderer
            key={sub.name}
            field={sub}
            parent={[...namePath, row.name]}
            defaults={defaults}
          />
        ))}
      </Card>
    </div>
  );
}

function RepeaterItemLabel({ field, index, listPath }) {
  const item = Form.useWatch([...listPath, index]);
  const text = field.itemLabel ? field.itemLabel(index, item) : `Item ${index + 1}`;
  return <span>{text}</span>;
}

function buildEmptyItem(field) {
  const empty = {};
  for (const sub of field.itemFields) {
    if (sub.type === 'list' || sub.type === 'list-csv') empty[sub.name] = [];
    else empty[sub.name] = '';
  }
  return empty;
}

function singular(label) {
  return String(label).replace(/\s+\d+$/, '').toLowerCase() || 'item';
}

function placeholderFor(field, defaultValue) {
  if (defaultValue == null) return undefined;
  if (Array.isArray(defaultValue)) {
    if (field.type === 'list-csv') return defaultValue.join(', ');
    return defaultValue.join('\n');
  }
  if (typeof defaultValue === 'string') {
    return defaultValue.length > 100 ? defaultValue.slice(0, 100) + '…' : defaultValue;
  }
  return undefined;
}

// ---------------------------------------------------------------------------
// Live preview
// ---------------------------------------------------------------------------

const VIEWPORTS = {
  desktop: { width: '100%', label: 'Desktop' },
  tablet: { width: 820, label: 'Tablet' },
  mobile: { width: 390, label: 'Mobile' },
};

function LivePreview({ path, previewKey }) {
  const [device, setDevice] = useState('desktop');
  const [version, setVersion] = useState(0);
  const iframeRef = useRef(null);

  // Bump the iframe key whenever the page re-syncs after a save so we render
  // the freshly revalidated copy.
  useEffect(() => {
    setVersion((v) => v + 1);
  }, [previewKey]);

  const reload = () => setVersion((v) => v + 1);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, gap: 12 }}>
        <Segmented
          value={device}
          onChange={setDevice}
          options={[
            { value: 'desktop', icon: <DesktopOutlined />, label: 'Desktop' },
            { value: 'tablet', icon: <TabletOutlined />, label: 'Tablet' },
            { value: 'mobile', icon: <MobileOutlined />, label: 'Mobile' },
          ]}
        />
        <Space>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Showing <Text code>{path}</Text>
          </Text>
          <Button size="small" icon={<ReloadOutlined />} onClick={reload}>
            Reload
          </Button>
          <PreviewLink href={path} />
        </Space>
      </div>
      <div
        style={{
          background: '#0F172A',
          borderRadius: 'var(--tps-radius)',
          padding: 12,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: VIEWPORTS[device].width,
            maxWidth: '100%',
            transition: 'width 200ms ease',
            background: '#fff',
            borderRadius: 8,
            overflow: 'hidden',
            boxShadow: '0 12px 36px -8px rgba(0,0,0,0.45)',
          }}
        >
          <iframe
            ref={iframeRef}
            key={version}
            src={`${path}?_preview=${version}`}
            title="Live preview"
            style={{
              width: '100%',
              height: '70vh',
              border: 0,
              display: 'block',
            }}
          />
        </div>
      </div>
    </div>
  );
}

// Pulls uploadMedia from form context so the deeply-nested RichText doesn't
// require prop-drilling through SchemaEditor → SectionBlock → FieldRenderer.
function RichTextField({ value, onChange, placeholder }) {
  const { uploadMedia } = useFormCtx();
  return (
    <RichText
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      uploadMedia={uploadMedia}
    />
  );
}

function PreviewLink({ href }) {
  const { LinkComponent } = useFormCtx();
  return (
    <LinkComponent href={href} target="_blank">
      <Button size="small" icon={<EyeOutlined />}>
        Open in new tab
      </Button>
    </LinkComponent>
  );
}
