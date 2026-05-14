'use client';

// Full WYSIWYG rich-text editor — Medium / Notion / CKEditor 5 in feel.
// Persistent toolbar + selection bubble menu + Notion-style "+" on empty
// paragraphs. Custom blocks (columns, callout, share, subscribe), image
// alignment & width, table merge/align controls.
//
// Output is HTML. The host site renders it inside a `.tps-rich-body` element
// (or whichever container class it themes) so editor canvas and public render
// share styles. Image uploads are driven by the consumer via the `uploadMedia`
// prop — it receives a FormData with a single `file` field and must return
// `{ url }`.

import { useEffect, useMemo, useState } from 'react';
import {
  useEditor,
  EditorContent,
  BubbleMenu,
  FloatingMenu,
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import CharacterCount from '@tiptap/extension-character-count';
import Typography from '@tiptap/extension-typography';

import {
  Button,
  Divider,
  Dropdown,
  Form,
  Input,
  Modal,
  Popover,
  Space,
  Tabs,
  Tag,
  Tooltip,
  Typography as AntTypography,
  Upload,
  message as antdMessage,
} from 'antd';
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  StrikethroughOutlined,
  UnorderedListOutlined,
  OrderedListOutlined,
  CheckSquareOutlined,
  LinkOutlined,
  PictureOutlined,
  TableOutlined,
  ClearOutlined,
  UndoOutlined,
  RedoOutlined,
  AlignLeftOutlined,
  AlignCenterOutlined,
  AlignRightOutlined,
  CodeOutlined,
  BgColorsOutlined,
  HighlightOutlined,
  MinusOutlined,
  BlockOutlined,
  DownOutlined,
  PlusOutlined,
  UploadOutlined,
  LoadingOutlined,
  AppstoreOutlined,
  ColumnWidthOutlined,
  VerticalAlignTopOutlined,
  VerticalAlignMiddleOutlined,
  VerticalAlignBottomOutlined,
  EditOutlined,
  DeleteOutlined,
  ShareAltOutlined,
  MailOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';

import {
  CiqImage,
  CiqTableCell,
  CiqTableHeader,
  Columns,
  Column,
  Callout,
  ShareBlock,
  SubscribeBlock,
} from './CustomBlocks';

function defaultUploadMedia() {
  throw new Error(
    '@techrox/page-studio-form: RichText was used without an `uploadMedia` prop. ' +
      'Pass a function `(FormData) => Promise<{ url }>` to enable image uploads.',
  );
}

const { Text } = AntTypography;

const HEADING_OPTIONS = [
  { key: 'p', label: 'Paragraph' },
  { key: 'h1', label: 'Heading 1' },
  { key: 'h2', label: 'Heading 2' },
  { key: 'h3', label: 'Heading 3' },
  { key: 'h4', label: 'Heading 4' },
];

const TEXT_COLORS = [
  '#0F172A', '#475569', '#0F766E', '#0B5550', '#F59E0B',
  '#D97706', '#DC2626', '#2563EB', '#7C3AED', '#059669',
];

const HIGHLIGHT_COLORS = [
  '#FEF08A', '#FECACA', '#FED7AA', '#A7F3D0', '#BFDBFE',
  '#E9D5FF', '#FBCFE8', '#FDE68A',
];

const IMAGE_WIDTHS = [
  { value: 'small', label: 'Small (40%)' },
  { value: 'medium', label: 'Medium (60%)' },
  { value: 'large', label: 'Large (80%)' },
  { value: 'full', label: 'Full width' },
];

export default function RichText({
  value = '',
  onChange,
  placeholder = "Type '/' for blocks, or just start writing…",
  minHeight = 280,
  uploadMedia = defaultUploadMedia,
}) {
  const [imageOpen, setImageOpen] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const [editBlock, setEditBlock] = useState(null); // 'share' | 'subscribe' | null

  const editor = useEditor({
    extensions: useMemo(
      () => [
        StarterKit.configure({
          heading: { levels: [1, 2, 3, 4] },
          codeBlock: { HTMLAttributes: { class: 'tiptap-code' } },
        }),
        Underline,
        Link.configure({
          openOnClick: false,
          autolink: true,
          HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
        }),
        CiqImage.configure({ inline: false, allowBase64: false }),
        Placeholder.configure({
          placeholder: ({ node, editor }) => {
            if (node.type.name === 'paragraph' && editor.isEmpty) return placeholder;
            return '';
          },
          showOnlyWhenEditable: true,
        }),
        TextAlign.configure({ types: ['heading', 'paragraph'] }),
        TextStyle,
        Color,
        Highlight.configure({ multicolor: true }),
        Table.configure({ resizable: true, HTMLAttributes: { class: 'tps-rich-table' } }),
        TableRow,
        CiqTableHeader,
        CiqTableCell,
        TaskList,
        TaskItem.configure({ nested: true }),
        CharacterCount,
        Typography,
        Columns,
        Column,
        Callout,
        ShareBlock,
        SubscribeBlock,
      ],
      [placeholder],
    ),
    content: value || '',
    onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
    immediatelyRender: false,
    editorProps: {
      attributes: { class: 'tiptap', spellcheck: 'true' },
      handleDrop: (view, event) => {
        const files = Array.from(event.dataTransfer?.files || []).filter((f) =>
          f.type.startsWith('image/'),
        );
        if (!files.length) return false;
        event.preventDefault();
        files.forEach((f) => uploadAndInsert(f, view, event, uploadMedia));
        return true;
      },
      handlePaste: (view, event) => {
        const files = Array.from(event.clipboardData?.files || []).filter((f) =>
          f.type.startsWith('image/'),
        );
        if (!files.length) return false;
        event.preventDefault();
        files.forEach((f) => uploadAndInsert(f, view, null, uploadMedia));
        return true;
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    const next = value || '';
    if (current === next) return;
    if (current === '<p></p>' && next === '') return;
    editor.commands.setContent(next, false);
  }, [editor, value]);

  if (!editor) {
    return (
      <div
        style={{
          border: '1px solid var(--tps-line)',
          borderRadius: 'var(--tps-radius)',
          minHeight,
          background: '#fff',
        }}
      />
    );
  }

  return (
    <div
      style={{
        border: '1px solid var(--tps-line)',
        borderRadius: 'var(--tps-radius)',
        background: '#fff',
        overflow: 'hidden',
      }}
    >
      <Toolbar
        editor={editor}
        onOpenLink={() => setLinkOpen(true)}
        onOpenImage={() => setImageOpen(true)}
      />

      {/* Selection-based formatting bar (Medium-style). */}
      <BubbleMenu
        editor={editor}
        shouldShow={({ editor, from, to }) => {
          if (from === to) return false;
          if (
            editor.isActive('ciqImage') ||
            editor.isActive('table') ||
            editor.isActive('codeBlock') ||
            editor.isActive('shareBlock') ||
            editor.isActive('subscribeBlock')
          ) return false;
          return true;
        }}
        tippyOptions={{ duration: 100, placement: 'top' }}
        pluginKey="selectionBubble"
      >
        <SelectionFormatBar editor={editor} onLink={() => setLinkOpen(true)} />
      </BubbleMenu>

      {/* Image controls when an image is selected. */}
      <BubbleMenu
        editor={editor}
        shouldShow={({ editor }) => editor.isActive('ciqImage')}
        tippyOptions={{ duration: 100, placement: 'top' }}
        pluginKey="imageBubble"
      >
        <ImageBubble editor={editor} />
      </BubbleMenu>

      {/* Table ops bubble. */}
      <BubbleMenu
        editor={editor}
        shouldShow={({ editor }) => editor.isActive('table')}
        tippyOptions={{ duration: 100, placement: 'top' }}
        pluginKey="tableBubble"
      >
        <TableBubble editor={editor} />
      </BubbleMenu>

      {/* Share / Subscribe block: edit + delete. */}
      <BubbleMenu
        editor={editor}
        shouldShow={({ editor }) =>
          editor.isActive('shareBlock') || editor.isActive('subscribeBlock')
        }
        tippyOptions={{ duration: 100, placement: 'top' }}
        pluginKey="atomBlockBubble"
      >
        <AtomBlockBubble
          editor={editor}
          onEdit={(kind) => setEditBlock(kind)}
        />
      </BubbleMenu>

      {/* Notion-style "+" on empty paragraphs. */}
      <FloatingMenu
        editor={editor}
        shouldShow={({ editor, state }) => {
          const { $from } = state.selection;
          const isEmptyParagraph =
            $from.parent.type.name === 'paragraph' && $from.parent.content.size === 0;
          return editor.isFocused && isEmptyParagraph && !editor.isActive('table');
        }}
        tippyOptions={{ duration: 100, placement: 'left-start', offset: [0, 8] }}
      >
        <BlockInsertMenu editor={editor} onImage={() => setImageOpen(true)} />
      </FloatingMenu>

      <div style={{ padding: 16, minHeight }}>
        <EditorContent editor={editor} />
      </div>

      <div
        style={{
          padding: '6px 14px',
          borderTop: '1px solid var(--tps-line)',
          background: 'var(--tps-bg-soft)',
          fontSize: 12,
          color: 'var(--tps-muted)',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>
          {editor.storage.characterCount.words()} words ·{' '}
          {editor.storage.characterCount.characters()} characters
        </span>
        <span>HTML output · drop or paste images to upload</span>
      </div>

      <LinkModal open={linkOpen} onClose={() => setLinkOpen(false)} editor={editor} />
      <ImageModal
        open={imageOpen}
        onClose={() => setImageOpen(false)}
        editor={editor}
        uploadMedia={uploadMedia}
      />
      <BlockAttributeModal
        kind={editBlock}
        open={!!editBlock}
        onClose={() => setEditBlock(null)}
        editor={editor}
      />
      <EditorStyles />
    </div>
  );
}

async function uploadAndInsert(file, view, dropEvent, uploadMedia) {
  try {
    const fd = new FormData();
    fd.append('file', file);
    const { url } = await uploadMedia(fd);
    if (!url) throw new Error('No URL returned');
    const node = view.state.schema.nodes.ciqImage.create({
      src: url,
      alt: file.name,
      align: 'center',
      width: 'medium',
    });
    let pos;
    if (dropEvent) {
      const coords = view.posAtCoords({ left: dropEvent.clientX, top: dropEvent.clientY });
      pos = coords?.pos ?? view.state.selection.from;
    } else {
      pos = view.state.selection.from;
    }
    const tr = view.state.tr.insert(pos, node);
    view.dispatch(tr);
  } catch (err) {
    antdMessage.error(err.message || 'Upload failed');
  }
}

function Toolbar({ editor, onOpenLink, onOpenImage }) {
  const headingValue = (() => {
    if (editor.isActive('heading', { level: 1 })) return 'h1';
    if (editor.isActive('heading', { level: 2 })) return 'h2';
    if (editor.isActive('heading', { level: 3 })) return 'h3';
    if (editor.isActive('heading', { level: 4 })) return 'h4';
    return 'p';
  })();
  const setHeading = (key) => {
    if (key === 'p') editor.chain().focus().setParagraph().run();
    else editor.chain().focus().toggleHeading({ level: Number(key.slice(1)) }).run();
  };

  const insertBlockItems = [
    { key: 'image', label: 'Image', icon: <PictureOutlined />, run: onOpenImage },
    {
      key: 'table',
      label: 'Table (3×3)',
      icon: <TableOutlined />,
      run: () =>
        editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
    },
    {
      key: 'cols2',
      label: '2 columns',
      icon: <AppstoreOutlined />,
      run: () => editor.chain().focus().insertColumns(2).run(),
    },
    {
      key: 'cols3',
      label: '3 columns',
      icon: <AppstoreOutlined />,
      run: () => editor.chain().focus().insertColumns(3).run(),
    },
    {
      key: 'cols4',
      label: '4 columns',
      icon: <AppstoreOutlined />,
      run: () => editor.chain().focus().insertColumns(4).run(),
    },
    {
      key: 'callout-info',
      label: 'Callout (info)',
      icon: <ExclamationCircleOutlined />,
      run: () => editor.chain().focus().insertCallout('info').run(),
    },
    {
      key: 'callout-success',
      label: 'Callout (success)',
      icon: <ExclamationCircleOutlined style={{ color: '#059669' }} />,
      run: () => editor.chain().focus().insertCallout('success').run(),
    },
    {
      key: 'callout-warning',
      label: 'Callout (warning)',
      icon: <ExclamationCircleOutlined style={{ color: '#D97706' }} />,
      run: () => editor.chain().focus().insertCallout('warning').run(),
    },
    {
      key: 'share',
      label: 'Share buttons',
      icon: <ShareAltOutlined />,
      run: () => editor.chain().focus().insertShareBlock().run(),
    },
    {
      key: 'subscribe',
      label: 'Subscribe form',
      icon: <MailOutlined />,
      run: () => editor.chain().focus().insertSubscribeBlock().run(),
    },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 4,
        padding: 8,
        background: 'var(--tps-bg-soft)',
        borderBottom: '1px solid var(--tps-line)',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 5,
      }}
    >
      <ToolButton title="Undo (⌘Z)" icon={<UndoOutlined />}
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()} />
      <ToolButton title="Redo (⌘⇧Z)" icon={<RedoOutlined />}
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()} />
      <ToolbarDivider />

      <Dropdown
        trigger={['click']}
        menu={{
          items: HEADING_OPTIONS.map((o) => ({ key: o.key, label: o.label })),
          selectedKeys: [headingValue],
          onClick: ({ key }) => setHeading(key),
        }}
      >
        <Button size="small" type="text" style={{ minWidth: 110 }}>
          {HEADING_OPTIONS.find((o) => o.key === headingValue)?.label}
          <DownOutlined style={{ fontSize: 10, marginLeft: 4 }} />
        </Button>
      </Dropdown>
      <ToolbarDivider />

      <ToolButton title="Bold (⌘B)" icon={<BoldOutlined />}
        active={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()} />
      <ToolButton title="Italic (⌘I)" icon={<ItalicOutlined />}
        active={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()} />
      <ToolButton title="Underline (⌘U)" icon={<UnderlineOutlined />}
        active={editor.isActive('underline')}
        onClick={() => editor.chain().focus().toggleUnderline().run()} />
      <ToolButton title="Strikethrough" icon={<StrikethroughOutlined />}
        active={editor.isActive('strike')}
        onClick={() => editor.chain().focus().toggleStrike().run()} />
      <ToolbarDivider />

      <ColorSwatch title="Text color" icon={<BgColorsOutlined />}
        colors={TEXT_COLORS}
        onPick={(c) => editor.chain().focus().setColor(c).run()}
        onClear={() => editor.chain().focus().unsetColor().run()} />
      <ColorSwatch title="Highlight" icon={<HighlightOutlined />}
        colors={HIGHLIGHT_COLORS}
        onPick={(c) => editor.chain().focus().toggleHighlight({ color: c }).run()}
        onClear={() => editor.chain().focus().unsetHighlight().run()} />
      <ToolbarDivider />

      <ToolButton title="Align left" icon={<AlignLeftOutlined />}
        active={editor.isActive({ textAlign: 'left' })}
        onClick={() => editor.chain().focus().setTextAlign('left').run()} />
      <ToolButton title="Align center" icon={<AlignCenterOutlined />}
        active={editor.isActive({ textAlign: 'center' })}
        onClick={() => editor.chain().focus().setTextAlign('center').run()} />
      <ToolButton title="Align right" icon={<AlignRightOutlined />}
        active={editor.isActive({ textAlign: 'right' })}
        onClick={() => editor.chain().focus().setTextAlign('right').run()} />
      <ToolbarDivider />

      <ToolButton title="Bulleted list" icon={<UnorderedListOutlined />}
        active={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()} />
      <ToolButton title="Numbered list" icon={<OrderedListOutlined />}
        active={editor.isActive('orderedList')}
        onClick={() => editor.chain().focus().toggleOrderedList().run()} />
      <ToolButton title="Task list" icon={<CheckSquareOutlined />}
        active={editor.isActive('taskList')}
        onClick={() => editor.chain().focus().toggleTaskList().run()} />
      <ToolbarDivider />

      <ToolButton title="Quote" icon={<BlockOutlined />}
        active={editor.isActive('blockquote')}
        onClick={() => editor.chain().focus().toggleBlockquote().run()} />
      <ToolButton title="Code block" icon={<CodeOutlined />}
        active={editor.isActive('codeBlock')}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()} />
      <ToolButton title="Horizontal rule" icon={<MinusOutlined />}
        onClick={() => editor.chain().focus().setHorizontalRule().run()} />
      <ToolbarDivider />

      <ToolButton title="Insert / edit link" icon={<LinkOutlined />}
        active={editor.isActive('link')} onClick={onOpenLink} />

      <Dropdown
        trigger={['click']}
        placement="bottomLeft"
        menu={{
          items: insertBlockItems.map((i) => ({ key: i.key, label: i.label, icon: i.icon })),
          onClick: ({ key }) => insertBlockItems.find((i) => i.key === key)?.run(),
        }}
      >
        <Button size="small" type="text" icon={<PlusOutlined />} style={{ paddingInline: 8 }}>
          Insert <DownOutlined style={{ fontSize: 10 }} />
        </Button>
      </Dropdown>
      <ToolbarDivider />

      <Tooltip title="Clear formatting">
        <Button size="small" type="text" icon={<ClearOutlined />}
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} />
      </Tooltip>
    </div>
  );
}

function ToolButton({ title, icon, active, onClick, disabled }) {
  return (
    <Tooltip title={title}>
      <Button
        size="small"
        type={active ? 'primary' : 'text'}
        icon={icon}
        disabled={disabled}
        onClick={onClick}
      />
    </Tooltip>
  );
}

function ToolbarDivider() {
  return (
    <Divider type="vertical" style={{ height: 22, margin: '0 2px', borderColor: 'var(--tps-line)' }} />
  );
}

function SelectionFormatBar({ editor, onLink }) {
  return (
    <Space
      size={2}
      style={{
        background: '#0F172A',
        padding: 4,
        borderRadius: 6,
        boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
      }}
    >
      <BubbleBtn title="Bold" icon={<BoldOutlined />}
        active={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()} />
      <BubbleBtn title="Italic" icon={<ItalicOutlined />}
        active={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()} />
      <BubbleBtn title="Underline" icon={<UnderlineOutlined />}
        active={editor.isActive('underline')}
        onClick={() => editor.chain().focus().toggleUnderline().run()} />
      <BubbleBtn title="Strike" icon={<StrikethroughOutlined />}
        active={editor.isActive('strike')}
        onClick={() => editor.chain().focus().toggleStrike().run()} />
      <Divider type="vertical" style={{ background: 'rgba(255,255,255,0.18)', height: 18, margin: '0 2px' }} />
      <BubbleBtn title="Inline code" icon={<CodeOutlined />}
        active={editor.isActive('code')}
        onClick={() => editor.chain().focus().toggleCode().run()} />
      <BubbleBtn title="Link" icon={<LinkOutlined />}
        active={editor.isActive('link')} onClick={onLink} />
    </Space>
  );
}

function BubbleBtn({ title, icon, active, onClick }) {
  return (
    <Tooltip title={title}>
      <Button
        size="small"
        type="text"
        icon={icon}
        onClick={onClick}
        style={{ color: active ? '#F59E0B' : '#fff' }}
      />
    </Tooltip>
  );
}

function ImageBubble({ editor }) {
  const attrs = editor.getAttributes('ciqImage');
  const setAlign = (align) =>
    editor.chain().focus().updateAttributes('ciqImage', { align }).run();
  const setWidth = (width) =>
    editor.chain().focus().updateAttributes('ciqImage', { width }).run();
  const remove = () => editor.chain().focus().deleteSelection().run();

  return (
    <Space
      size={2}
      style={{
        background: '#fff',
        padding: 4,
        border: '1px solid var(--tps-line)',
        borderRadius: 6,
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
      }}
    >
      <Tooltip title="Align left">
        <Button size="small" type={attrs.align === 'left' ? 'primary' : 'text'}
          icon={<AlignLeftOutlined />} onClick={() => setAlign('left')} />
      </Tooltip>
      <Tooltip title="Align center">
        <Button size="small" type={attrs.align === 'center' ? 'primary' : 'text'}
          icon={<AlignCenterOutlined />} onClick={() => setAlign('center')} />
      </Tooltip>
      <Tooltip title="Align right">
        <Button size="small" type={attrs.align === 'right' ? 'primary' : 'text'}
          icon={<AlignRightOutlined />} onClick={() => setAlign('right')} />
      </Tooltip>
      <Divider type="vertical" />
      <Dropdown
        trigger={['click']}
        menu={{
          items: IMAGE_WIDTHS.map((w) => ({ key: w.value, label: w.label })),
          selectedKeys: [attrs.width || 'medium'],
          onClick: ({ key }) => setWidth(key),
        }}
      >
        <Button size="small" type="text" icon={<ColumnWidthOutlined />}>
          {IMAGE_WIDTHS.find((w) => w.value === (attrs.width || 'medium'))?.label}
          <DownOutlined style={{ fontSize: 10, marginLeft: 4 }} />
        </Button>
      </Dropdown>
      <Divider type="vertical" />
      <Tooltip title="Edit alt text">
        <Button
          size="small"
          type="text"
          icon={<EditOutlined />}
          onClick={() => {
            const alt = window.prompt('Alt text', attrs.alt || '');
            if (alt !== null) {
              editor.chain().focus().updateAttributes('ciqImage', { alt }).run();
            }
          }}
        />
      </Tooltip>
      <Tooltip title="Delete image">
        <Button size="small" type="text" danger icon={<DeleteOutlined />} onClick={remove} />
      </Tooltip>
    </Space>
  );
}

function TableBubble({ editor }) {
  const cellAttrs = editor.getAttributes('tableCell');
  const setVAlign = (verticalAlign) => {
    // Apply to both header and body cells.
    editor.chain().focus().updateAttributes('tableCell', { verticalAlign }).run();
    editor.chain().focus().updateAttributes('tableHeader', { verticalAlign }).run();
  };

  return (
    <Space
      size={4}
      wrap
      style={{
        background: '#fff',
        padding: 4,
        border: '1px solid var(--tps-line)',
        borderRadius: 6,
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        maxWidth: 720,
      }}
    >
      <Button size="small" onClick={() => editor.chain().focus().addColumnBefore().run()}>+ col ←</Button>
      <Button size="small" onClick={() => editor.chain().focus().addColumnAfter().run()}>+ col →</Button>
      <Button size="small" onClick={() => editor.chain().focus().deleteColumn().run()}>− col</Button>
      <Divider type="vertical" />
      <Button size="small" onClick={() => editor.chain().focus().addRowBefore().run()}>+ row ↑</Button>
      <Button size="small" onClick={() => editor.chain().focus().addRowAfter().run()}>+ row ↓</Button>
      <Button size="small" onClick={() => editor.chain().focus().deleteRow().run()}>− row</Button>
      <Divider type="vertical" />
      <Button size="small" onClick={() => editor.chain().focus().mergeCells().run()}>Merge</Button>
      <Button size="small" onClick={() => editor.chain().focus().splitCell().run()}>Split</Button>
      <Divider type="vertical" />
      <Tooltip title="Top">
        <Button size="small"
          type={cellAttrs.verticalAlign === 'top' ? 'primary' : 'default'}
          icon={<VerticalAlignTopOutlined />} onClick={() => setVAlign('top')} />
      </Tooltip>
      <Tooltip title="Middle">
        <Button size="small"
          type={cellAttrs.verticalAlign === 'middle' ? 'primary' : 'default'}
          icon={<VerticalAlignMiddleOutlined />} onClick={() => setVAlign('middle')} />
      </Tooltip>
      <Tooltip title="Bottom">
        <Button size="small"
          type={cellAttrs.verticalAlign === 'bottom' ? 'primary' : 'default'}
          icon={<VerticalAlignBottomOutlined />} onClick={() => setVAlign('bottom')} />
      </Tooltip>
      <Divider type="vertical" />
      <Button size="small" onClick={() => editor.chain().focus().toggleHeaderRow().run()}>Header row</Button>
      <Button size="small" onClick={() => editor.chain().focus().toggleHeaderColumn().run()}>Header col</Button>
      <Divider type="vertical" />
      <Button size="small" danger onClick={() => editor.chain().focus().deleteTable().run()}>Delete</Button>
    </Space>
  );
}

function AtomBlockBubble({ editor, onEdit }) {
  const kind = editor.isActive('shareBlock')
    ? 'share'
    : editor.isActive('subscribeBlock')
      ? 'subscribe'
      : null;
  if (!kind) return null;
  return (
    <Space
      size={4}
      style={{
        background: '#fff',
        padding: 4,
        border: '1px solid var(--tps-line)',
        borderRadius: 6,
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
      }}
    >
      <Tag color={kind === 'share' ? 'cyan' : 'gold'} style={{ margin: 0 }}>
        {kind === 'share' ? 'Share block' : 'Subscribe block'}
      </Tag>
      <Button size="small" icon={<EditOutlined />} onClick={() => onEdit(kind)}>
        Edit
      </Button>
      <Button size="small" type="text" danger icon={<DeleteOutlined />}
        onClick={() => editor.chain().focus().deleteSelection().run()} />
    </Space>
  );
}

function BlockInsertMenu({ editor, onImage }) {
  const items = [
    { key: 'h1', label: 'Heading 1', run: () => editor.chain().focus().toggleHeading({ level: 1 }).run() },
    { key: 'h2', label: 'Heading 2', run: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
    { key: 'h3', label: 'Heading 3', run: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
    { key: 'ul', label: 'Bulleted list', run: () => editor.chain().focus().toggleBulletList().run() },
    { key: 'ol', label: 'Numbered list', run: () => editor.chain().focus().toggleOrderedList().run() },
    { key: 'task', label: 'Task list', run: () => editor.chain().focus().toggleTaskList().run() },
    { key: 'quote', label: 'Quote', run: () => editor.chain().focus().toggleBlockquote().run() },
    { key: 'code', label: 'Code block', run: () => editor.chain().focus().toggleCodeBlock().run() },
    { key: 'hr', label: 'Divider', run: () => editor.chain().focus().setHorizontalRule().run() },
    { type: 'divider' },
    { key: 'image', label: 'Image', run: () => onImage() },
    { key: 'table', label: 'Table', run: () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run() },
    { key: 'cols2', label: '2 columns', run: () => editor.chain().focus().insertColumns(2).run() },
    { key: 'cols3', label: '3 columns', run: () => editor.chain().focus().insertColumns(3).run() },
    { key: 'callout', label: 'Callout', run: () => editor.chain().focus().insertCallout('info').run() },
    { key: 'share', label: 'Share buttons', run: () => editor.chain().focus().insertShareBlock().run() },
    { key: 'subscribe', label: 'Subscribe form', run: () => editor.chain().focus().insertSubscribeBlock().run() },
  ];
  return (
    <Dropdown
      trigger={['click']}
      placement="bottomLeft"
      menu={{
        items: items.map((i, idx) =>
          i.type === 'divider' ? { type: 'divider', key: `d${idx}` } : { key: i.key, label: i.label },
        ),
        onClick: ({ key }) => items.find((i) => i.key === key)?.run(),
      }}
    >
      <Tooltip title="Insert block">
        <Button
          size="small"
          shape="circle"
          icon={<PlusOutlined />}
          style={{
            background: '#fff',
            borderColor: 'var(--tps-line)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          }}
        />
      </Tooltip>
    </Dropdown>
  );
}

function ColorSwatch({ title, icon, colors, onPick, onClear }) {
  const [open, setOpen] = useState(false);
  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      trigger="click"
      placement="bottomLeft"
      content={
        <Space direction="vertical" size={8} style={{ width: 200 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => {
                  onPick(c);
                  setOpen(false);
                }}
                style={{
                  width: 28,
                  height: 28,
                  background: c,
                  border: '1px solid var(--tps-line)',
                  borderRadius: 4,
                  cursor: 'pointer',
                }}
                title={c}
              />
            ))}
          </div>
          <Button size="small" block onClick={() => { onClear(); setOpen(false); }}>
            Clear
          </Button>
        </Space>
      }
    >
      <Tooltip title={title}>
        <Button size="small" type="text" icon={icon} />
      </Tooltip>
    </Popover>
  );
}

function LinkModal({ open, onClose, editor }) {
  const [href, setHref] = useState('');
  useEffect(() => {
    if (open) setHref(editor.getAttributes('link').href || '');
  }, [open, editor]);
  const apply = () => {
    if (!href) editor.chain().focus().unsetLink().run();
    else editor.chain().focus().extendMarkRange('link').setLink({ href }).run();
    onClose();
  };
  return (
    <Modal title="Link" open={open} onCancel={onClose} onOk={apply} okText="Apply"
      okButtonProps={{ disabled: !href && !editor.isActive('link') }} destroyOnClose>
      <Input placeholder="https://example.com" value={href}
        onChange={(e) => setHref(e.target.value)} onPressEnter={apply} autoFocus />
      <Text type="secondary" style={{ fontSize: 12 }}>
        Leave blank and Apply to remove the link.
      </Text>
    </Modal>
  );
}

function ImageModal({ open, onClose, editor, uploadMedia }) {
  const [tab, setTab] = useState('upload');
  const [src, setSrc] = useState('');
  const [alt, setAlt] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (open) { setTab('upload'); setSrc(''); setAlt(''); }
  }, [open]);

  const apply = () => {
    if (!src) return;
    editor.chain().focus().insertContent({
      type: 'ciqImage',
      attrs: { src, alt, align: 'center', width: 'medium' },
    }).run();
    onClose();
  };

  const beforeUpload = async (file) => {
    if (!file.type.startsWith('image/')) {
      antdMessage.error('Only image files are supported.');
      return Upload.LIST_IGNORE;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const { url } = await uploadMedia(fd);
      setSrc(url);
      if (!alt) setAlt(file.name.replace(/\.[^.]+$/, ''));
    } catch (err) {
      antdMessage.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
    return Upload.LIST_IGNORE;
  };

  return (
    <Modal title="Insert image" open={open} onCancel={onClose} onOk={apply} okText="Insert"
      okButtonProps={{ disabled: !src }} destroyOnClose width={560}>
      <Tabs activeKey={tab} onChange={setTab}
        items={[
          {
            key: 'upload',
            label: 'Upload',
            children: (
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                <Upload.Dragger multiple={false} beforeUpload={beforeUpload}
                  showUploadList={false} disabled={uploading} accept="image/*">
                  <p style={{ fontSize: 28, margin: 0 }}>
                    {uploading ? <LoadingOutlined /> : <UploadOutlined />}
                  </p>
                  <p style={{ marginTop: 4 }}>
                    {uploading ? 'Uploading…' : 'Click or drag an image'}
                  </p>
                  <p style={{ color: 'var(--tps-muted)', fontSize: 12 }}>
                    JPG / PNG / WEBP / GIF / SVG · max 10MB
                  </p>
                </Upload.Dragger>
                <Input placeholder="Alt text (for accessibility & SEO)"
                  value={alt} onChange={(e) => setAlt(e.target.value)} />
                {src && <Tag color="green" style={{ width: 'fit-content' }}>Uploaded</Tag>}
              </Space>
            ),
          },
          {
            key: 'url',
            label: 'From URL',
            children: (
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                <Input placeholder="https://…" value={src}
                  onChange={(e) => setSrc(e.target.value)} autoFocus />
                <Input placeholder="Alt text (for accessibility & SEO)"
                  value={alt} onChange={(e) => setAlt(e.target.value)} />
              </Space>
            ),
          },
        ]} />
      {src && (
        <div style={{ marginTop: 12, border: '1px solid var(--tps-line)', padding: 8, borderRadius: 6 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} style={{ maxWidth: '100%', display: 'block' }} />
        </div>
      )}
    </Modal>
  );
}

// Edit attributes for atom blocks (share, subscribe).
function BlockAttributeModal({ kind, open, onClose, editor }) {
  const [form] = Form.useForm();
  const isShare = kind === 'share';
  const nodeName = isShare ? 'shareBlock' : 'subscribeBlock';

  useEffect(() => {
    if (!open) return;
    const attrs = editor.getAttributes(nodeName);
    form.setFieldsValue(attrs);
  }, [open, editor, nodeName, form]);

  const apply = async () => {
    const values = await form.validateFields();
    editor.chain().focus().updateAttributes(nodeName, values).run();
    onClose();
  };

  if (!kind) return null;
  return (
    <Modal
      title={isShare ? 'Share block' : 'Subscribe block'}
      open={open}
      onCancel={onClose}
      onOk={apply}
      okText="Apply"
      destroyOnClose
    >
      <Form form={form} layout="vertical" preserve={false}>
        {isShare ? (
          <Form.Item label="Label" name="label">
            <Input placeholder="Share this page" />
          </Form.Item>
        ) : (
          <>
            <Form.Item label="Heading" name="heading">
              <Input placeholder="Stay in the loop" />
            </Form.Item>
            <Form.Item label="Body" name="body">
              <Input.TextArea rows={2} placeholder="One short email when we publish — never more." />
            </Form.Item>
            <Form.Item label="Button label" name="button">
              <Input placeholder="Subscribe" />
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
}

function EditorStyles() {
  return (
    <style jsx global>{`
      .tiptap {
        outline: none;
        font-size: 15px;
        line-height: 1.65;
        color: var(--tps-ink);
        min-height: 100%;
      }
      .tiptap > * + * { margin-top: 0.75em; }
      .tiptap p.is-editor-empty:first-child::before {
        content: attr(data-placeholder);
        float: left;
        color: var(--tps-muted);
        pointer-events: none;
        height: 0;
      }
      .tiptap h1 { font-size: 28px; font-weight: 800; line-height: 1.2; margin: 1em 0 0.5em; }
      .tiptap h2 { font-size: 22px; font-weight: 700; line-height: 1.25; margin: 1em 0 0.5em; }
      .tiptap h3 { font-size: 18px; font-weight: 700; line-height: 1.3; margin: 1em 0 0.4em; }
      .tiptap h4 { font-size: 16px; font-weight: 700; line-height: 1.35; margin: 1em 0 0.4em; }
      .tiptap p { margin: 0; }
      .tiptap ul, .tiptap ol { padding-left: 22px; }
      .tiptap ul[data-type='taskList'] { list-style: none; padding-left: 0; }
      .tiptap ul[data-type='taskList'] li { display: flex; gap: 8px; align-items: flex-start; }
      .tiptap a { color: var(--tps-primary); text-decoration: underline; }
      .tiptap blockquote {
        border-left: 3px solid var(--tps-primary);
        padding-left: 14px;
        color: var(--tps-muted);
        font-style: italic;
      }
      .tiptap pre.tiptap-code, .tiptap pre {
        background: #0f172a; color: #e2e8f0; padding: 12px 14px; border-radius: 6px;
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 13px;
        overflow-x: auto;
      }
      .tiptap code {
        background: var(--tps-bg-soft); padding: 2px 6px; border-radius: 4px; font-size: 0.9em;
      }
      .tiptap hr { border: none; border-top: 1px solid var(--tps-line); margin: 1.5em 0; }
      .tiptap mark { padding: 0 2px; border-radius: 3px; }

      /* Image block with align + width. */
      .tiptap .tps-block-image { margin: 1em 0; display: flex; }
      .tiptap .tps-block-image[data-align='left'] { justify-content: flex-start; }
      .tiptap .tps-block-image[data-align='center'] { justify-content: center; }
      .tiptap .tps-block-image[data-align='right'] { justify-content: flex-end; }
      .tiptap .tps-block-image img { max-width: 100%; height: auto; border-radius: 8px; display: block; }
      .tiptap .tps-block-image.tps-img-small img { width: 40%; }
      .tiptap .tps-block-image.tps-img-medium img { width: 60%; }
      .tiptap .tps-block-image.tps-img-large img { width: 80%; }
      .tiptap .tps-block-image.tps-img-full img { width: 100%; }
      .tiptap .tps-block-image.ProseMirror-selectednode img,
      .tiptap .tps-block-image:has(img.ProseMirror-selectednode) img {
        outline: 2px solid var(--tps-primary); outline-offset: 2px;
      }

      /* Tables — alternating rows + resize handles. */
      .tiptap table.tps-rich-table, .tiptap table {
        border-collapse: collapse; width: 100%; margin: 1em 0; table-layout: fixed;
      }
      .tiptap table td, .tiptap table th {
        border: 1px solid var(--tps-line); padding: 8px 10px; vertical-align: top;
        position: relative; min-width: 40px;
      }
      .tiptap table th { background: var(--tps-bg-soft); font-weight: 700; text-align: left; }
      .tiptap table tbody tr:nth-child(even) td { background: rgba(15, 118, 110, 0.025); }
      .tiptap table .selectedCell::after {
        content: ''; position: absolute; inset: 0;
        background: rgba(15, 118, 110, 0.12); pointer-events: none;
      }
      .tiptap table .column-resize-handle {
        position: absolute; right: -2px; top: 0; bottom: -2px; width: 4px;
        background-color: var(--tps-primary); pointer-events: none;
      }
      .tiptap table p { margin: 0; }

      /* Columns. */
      .tiptap .tps-block-columns {
        display: grid; gap: 16px; margin: 1em 0;
        border: 1px dashed var(--tps-line); padding: 12px; border-radius: 8px;
      }
      .tiptap .tps-block-columns.tps-cols-2 { grid-template-columns: 1fr 1fr; }
      .tiptap .tps-block-columns.tps-cols-3 { grid-template-columns: repeat(3, 1fr); }
      .tiptap .tps-block-columns.tps-cols-4 { grid-template-columns: repeat(4, 1fr); }
      .tiptap .tps-block-column { padding: 8px; min-height: 40px; border-radius: 6px; }
      .tiptap .tps-block-column:hover { background: var(--tps-bg-soft); }

      /* Callout. */
      .tiptap .tps-block-callout {
        border-left: 4px solid var(--tps-primary);
        background: rgba(15, 118, 110, 0.05);
        padding: 12px 16px; border-radius: 6px; margin: 1em 0;
      }
      .tiptap .tps-block-callout.tps-callout-success {
        border-color: #059669; background: rgba(5, 150, 105, 0.06);
      }
      .tiptap .tps-block-callout.tps-callout-warning {
        border-color: #D97706; background: rgba(217, 119, 6, 0.07);
      }
      .tiptap .tps-block-callout.tps-callout-danger {
        border-color: #DC2626; background: rgba(220, 38, 38, 0.06);
      }

      /* Atom blocks (share, subscribe) — show as cards in the canvas. */
      .tiptap .tps-block-share, .tiptap .tps-block-subscribe {
        border: 1px solid var(--tps-line); border-radius: 8px;
        padding: 16px; margin: 1em 0; background: var(--tps-bg-soft);
      }
      .tiptap .tps-block-share-label, .tiptap .tps-block-subscribe-heading {
        font-weight: 700; margin-bottom: 8px; color: var(--tps-ink);
      }
      .tiptap .tps-block-share-row { display: flex; gap: 8px; flex-wrap: wrap; }
      .tiptap .tps-block-share-btn {
        padding: 6px 12px; background: #fff; border: 1px solid var(--tps-line);
        border-radius: 6px; text-decoration: none; color: var(--tps-ink);
        font-size: 13px; font-weight: 600;
      }
      .tiptap .tps-block-share-btn:hover { border-color: var(--tps-primary); color: var(--tps-primary); }
      .tiptap .tps-block-subscribe-form { display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap; }
      .tiptap .tps-block-subscribe-input {
        flex: 1; min-width: 200px; padding: 8px 12px;
        border: 1px solid var(--tps-line); border-radius: 6px; font-size: 14px;
      }
      .tiptap .tps-block-subscribe-button {
        padding: 8px 16px; background: var(--tps-primary); color: #fff;
        border: 0; border-radius: 6px; font-weight: 600; cursor: pointer;
      }
      .tiptap .tps-block-subscribe-button:hover { background: var(--tps-primary-dark); }
      .tiptap .tps-block-subscribe-body { color: var(--tps-muted); margin: 4px 0 8px; }

      /* Selected atom block highlight. */
      .tiptap .ProseMirror-selectednode.tps-block-share,
      .tiptap .ProseMirror-selectednode.tps-block-subscribe {
        outline: 2px solid var(--tps-primary); outline-offset: 2px;
      }
    `}</style>
  );
}
