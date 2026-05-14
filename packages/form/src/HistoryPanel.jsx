'use client';

// Edit-history viewer for a single page key. Pulls the revision list from
// the backend on mount, lets the admin select two snapshots to compare
// (current page vs. a revision, by default), shows a JSON-level side-by-side
// diff plus a per-field summary, and supports one-click restore.

import { useEffect, useMemo, useState, useTransition } from 'react';
import {
  Alert,
  Button,
  Card,
  Empty,
  List,
  Popconfirm,
  Segmented,
  Space,
  Spin,
  Tag,
  Tooltip,
  Typography,
  App as AntdApp,
} from 'antd';
import {
  ReloadOutlined,
  HistoryOutlined,
  RollbackOutlined,
  UserOutlined,
  ClockCircleOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { diffLines } from 'diff';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { Text, Paragraph } = Typography;

function notConfigured(name) {
  return () => {
    throw new Error(
      `@techrox/page-studio-form: HistoryPanel was used without a \`${name}\` adapter. ` +
        'Pass loadHistory + restoreRevision callbacks.',
    );
  };
}

export default function HistoryPanel({
  pageKey,
  currentPage,
  onRestored,
  loadHistory = notConfigured('loadHistory'),
  restoreRevision = notConfigured('restoreRevision'),
}) {
  const { message, modal } = AntdApp.useApp();
  const [pending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);
  const [revisions, setRevisions] = useState([]);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [view, setView] = useState('summary'); // 'summary' | 'json'

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const { revisions } = await loadHistory(pageKey);
      setRevisions(revisions || []);
      if (revisions?.length && !selectedId) {
        setSelectedId(revisions[0]._id);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageKey]);

  const selected = useMemo(
    () => revisions.find((r) => r._id === selectedId) || null,
    [revisions, selectedId],
  );

  const onRestore = (rev) => {
    modal.confirm({
      title: `Restore version ${rev.version}?`,
      content: (
        <span>
          The current page will be replaced with this snapshot from{' '}
          <Text strong>{dayjs(rev.created_at).format('YYYY-MM-DD HH:mm')}</Text>.
          A new revision is logged so you can undo this restore.
        </span>
      ),
      okText: 'Restore',
      okButtonProps: { danger: true },
      onOk: () =>
        new Promise((resolve, reject) => {
          startTransition(async () => {
            try {
              await restoreRevision(pageKey, rev._id);
              message.success(`Restored version ${rev.version}.`);
              onRestored?.();
              await load();
              resolve();
            } catch (e) {
              message.error(e.message || 'Restore failed.');
              reject(e);
            }
          });
        }),
    });
  };

  if (loading) {
    return (
      <Card size="small">
        <div style={{ textAlign: 'center', padding: 40 }}>
          <Spin />
          <div style={{ marginTop: 12, color: 'var(--tps-muted)', fontSize: 13 }}>
            Loading history…
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return <Alert type="error" showIcon message="Could not load history" description={error} />;
  }

  if (!revisions.length) {
    return (
      <Card size="small">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <Space direction="vertical" size={4}>
              <Text strong>No history yet</Text>
              <Text type="secondary" style={{ fontSize: 13 }}>
                Every save creates a revision. They&rsquo;ll appear here once you save changes.
              </Text>
            </Space>
          }
        />
      </Card>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(260px, 320px) minmax(0, 1fr)',
        gap: 16,
      }}
    >
      <Card
        size="small"
        title={
          <Space>
            <HistoryOutlined />
            <span>{revisions.length} revision{revisions.length === 1 ? '' : 's'}</span>
          </Space>
        }
        extra={
          <Tooltip title="Refresh">
            <Button size="small" type="text" icon={<ReloadOutlined />} onClick={load} />
          </Tooltip>
        }
        styles={{ body: { padding: 0, maxHeight: '70vh', overflowY: 'auto' } }}
      >
        <List
          dataSource={revisions}
          renderItem={(r, i) => {
            const isSelected = r._id === selectedId;
            return (
              <List.Item
                onClick={() => setSelectedId(r._id)}
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  background: isSelected ? 'rgba(15, 118, 110, 0.08)' : 'transparent',
                  borderLeft: isSelected
                    ? '3px solid var(--tps-primary)'
                    : '3px solid transparent',
                }}
              >
                <div style={{ width: '100%' }}>
                  <Space size={6} wrap>
                    <Tag color={r.action === 'restore' ? 'orange' : 'geekblue'}>
                      v{r.version}
                    </Tag>
                    {i === 0 && <Tag color="green">latest</Tag>}
                    {r.action === 'restore' && (
                      <Tag icon={<RollbackOutlined />} color="orange">
                        restore
                      </Tag>
                    )}
                    {r.snapshot?.published === false && <Tag>draft</Tag>}
                  </Space>
                  <div style={{ fontSize: 13, marginTop: 6, fontWeight: 500 }}>
                    {r.snapshot?.title || <Text type="secondary">(no title)</Text>}
                  </div>
                  <Space size={10} style={{ fontSize: 12, color: 'var(--tps-muted)', marginTop: 4 }} wrap>
                    <Tooltip title={dayjs(r.created_at).format('YYYY-MM-DD HH:mm:ss')}>
                      <span>
                        <ClockCircleOutlined /> {dayjs(r.created_at).fromNow()}
                      </span>
                    </Tooltip>
                    {r.created_by_email && (
                      <Tooltip title={r.created_by_email}>
                        <span>
                          <UserOutlined /> {abbreviateEmail(r.created_by_email)}
                        </span>
                      </Tooltip>
                    )}
                  </Space>
                </div>
              </List.Item>
            );
          }}
        />
      </Card>

      <div>
        {selected ? (
          <RevisionDetail
            revision={selected}
            currentPage={currentPage}
            view={view}
            setView={setView}
            onRestore={() => onRestore(selected)}
            restoring={pending}
          />
        ) : (
          <Card size="small">
            <Text type="secondary">Select a revision on the left to see its diff.</Text>
          </Card>
        )}
      </div>
    </div>
  );
}

function RevisionDetail({ revision, currentPage, view, setView, onRestore, restoring }) {
  const left = currentPage || {};
  const right = revision.snapshot || {};

  const summary = useMemo(() => fieldChangeSummary(left, right), [left, right]);
  const jsonDiff = useMemo(() => makeJsonDiff(left, right), [left, right]);

  return (
    <Card
      size="small"
      title={
        <Space>
          <Tag color={revision.action === 'restore' ? 'orange' : 'geekblue'}>
            Version {revision.version}
          </Tag>
          <Text type="secondary" style={{ fontSize: 13 }}>
            {dayjs(revision.created_at).format('YYYY-MM-DD HH:mm:ss')}
          </Text>
          {revision.created_by_email && (
            <Text type="secondary" style={{ fontSize: 13 }}>
              by {revision.created_by_email}
            </Text>
          )}
        </Space>
      }
      extra={
        <Space>
          <Segmented
            size="small"
            value={view}
            onChange={setView}
            options={[
              { label: 'Summary', value: 'summary' },
              { label: 'JSON diff', value: 'json' },
            ]}
          />
          <Popconfirm
            title="Restore this version?"
            description="A new revision will be logged so you can undo."
            onConfirm={onRestore}
            okText="Restore"
            okButtonProps={{ danger: true }}
          >
            <Button danger icon={<RollbackOutlined />} loading={restoring}>
              Restore
            </Button>
          </Popconfirm>
        </Space>
      }
    >
      <Paragraph type="secondary" style={{ fontSize: 12, marginBottom: 12 }}>
        Comparing <Text strong>current</Text> (left) → <Text strong>this revision</Text> (right).
        Restore replaces the current page with the right side.
      </Paragraph>

      {view === 'summary' ? (
        <SummaryView summary={summary} />
      ) : (
        <JsonDiffView diff={jsonDiff} />
      )}
    </Card>
  );
}

function SummaryView({ summary }) {
  if (!summary.length) {
    return <Alert type="info" showIcon message="No differences — this revision matches the current page." />;
  }
  return (
    <Space direction="vertical" size={10} style={{ width: '100%' }}>
      {summary.map((row) => (
        <Card key={row.path} size="small" styles={{ body: { padding: 12 } }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <Space>
              <EditOutlined style={{ color: 'var(--tps-primary)' }} />
              <Text code style={{ fontSize: 12 }}>{row.path}</Text>
            </Space>
            <Tag color={row.kind === 'changed' ? 'gold' : row.kind === 'added' ? 'green' : 'red'}>
              {row.kind}
            </Tag>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
              gap: 10,
            }}
          >
            <DiffCell label="Current" value={row.current} kind="current" />
            <DiffCell label="This revision" value={row.next} kind="next" />
          </div>
        </Card>
      ))}
    </Space>
  );
}

function DiffCell({ label, value, kind }) {
  return (
    <div
      style={{
        background: kind === 'current' ? 'rgba(220,38,38,0.06)' : 'rgba(5,150,105,0.06)',
        border: '1px solid var(--tps-line)',
        borderRadius: 6,
        padding: 8,
      }}
    >
      <div style={{ fontSize: 11, color: 'var(--tps-muted)', marginBottom: 4 }}>{label}</div>
      <pre
        style={{
          margin: 0,
          fontSize: 12,
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          color: 'var(--tps-ink)',
        }}
      >
        {formatScalar(value)}
      </pre>
    </div>
  );
}

function JsonDiffView({ diff }) {
  return (
    <div
      style={{
        background: '#0F172A',
        borderRadius: 6,
        fontSize: 12,
        lineHeight: 1.6,
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        maxHeight: '60vh',
        overflow: 'auto',
        padding: 14,
        // Constrain to parent so long lines wrap instead of forcing the
        // History tab horizontally (prior bug: the diff blew past the card).
        maxWidth: '100%',
      }}
    >
      {diff.map((part, i) => {
        const bg = part.added
          ? 'rgba(16,185,129,0.18)'
          : part.removed
            ? 'rgba(239,68,68,0.20)'
            : 'transparent';
        const color = part.added ? '#86efac' : part.removed ? '#fca5a5' : '#cbd5e1';
        const prefix = part.added ? '+ ' : part.removed ? '- ' : '  ';
        return (
          <div key={i} style={{ background: bg, color }}>
            {part.value
              .split('\n')
              .filter((l, idx, arr) => !(l === '' && idx === arr.length - 1))
              .map((line, j) => (
                <div
                  key={j}
                  style={{
                    padding: '0 6px',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    overflowWrap: 'anywhere',
                  }}
                >
                  {prefix}
                  {line}
                </div>
              ))}
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Diff helpers
// ---------------------------------------------------------------------------

function makeJsonDiff(left, right) {
  const a = JSON.stringify(snapshot(left), null, 2);
  const b = JSON.stringify(snapshot(right), null, 2);
  return diffLines(a, b);
}

function snapshot(p) {
  return {
    title: p?.title || '',
    published: p?.published !== false,
    seo: p?.seo || {},
    content: p?.content || {},
  };
}

// Compute a flat list of field-level differences between left and right
// snapshots. We walk seo + content keys and report adds/removes/changes.
function fieldChangeSummary(left, right) {
  const out = [];
  const a = snapshot(left);
  const b = snapshot(right);

  if (a.title !== b.title) {
    out.push({ path: 'title', kind: classify(a.title, b.title), current: a.title, next: b.title });
  }
  if (a.published !== b.published) {
    out.push({
      path: 'published',
      kind: 'changed',
      current: a.published,
      next: b.published,
    });
  }
  for (const k of unionKeys(a.seo, b.seo)) {
    const av = a.seo[k];
    const bv = b.seo[k];
    if (!equal(av, bv)) {
      out.push({ path: `seo.${k}`, kind: classify(av, bv), current: av, next: bv });
    }
  }
  for (const k of unionKeys(a.content, b.content)) {
    const av = a.content[k];
    const bv = b.content[k];
    if (!equal(av, bv)) {
      out.push({ path: `content.${k}`, kind: classify(av, bv), current: av, next: bv });
    }
  }
  return out;
}

function unionKeys(a, b) {
  const s = new Set([...Object.keys(a || {}), ...Object.keys(b || {})]);
  return Array.from(s).sort();
}

function classify(a, b) {
  const aEmpty = isEmpty(a);
  const bEmpty = isEmpty(b);
  if (aEmpty && !bEmpty) return 'added';
  if (!aEmpty && bEmpty) return 'removed';
  return 'changed';
}

function isEmpty(v) {
  if (v == null) return true;
  if (typeof v === 'string') return v.trim() === '';
  if (Array.isArray(v)) return v.length === 0;
  if (typeof v === 'object') return Object.keys(v).length === 0;
  return false;
}

function equal(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return a === b;
  if (typeof a !== typeof b) return false;
  if (Array.isArray(a) || Array.isArray(b) || typeof a === 'object') {
    return JSON.stringify(a) === JSON.stringify(b);
  }
  return false;
}

function formatScalar(v) {
  if (v === undefined || v === null) return '—';
  if (typeof v === 'string') return v || '—';
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  if (Array.isArray(v) && v.every((x) => typeof x === 'string')) {
    return v.length ? v.join('\n') : '—';
  }
  return JSON.stringify(v, null, 2);
}

function abbreviateEmail(email) {
  if (!email) return '';
  const [name, domain] = email.split('@');
  if (!domain) return email;
  return `${name}@${domain.split('.')[0]}`;
}
