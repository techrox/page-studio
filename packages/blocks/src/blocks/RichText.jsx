// RichText - paragraph(s) of body copy with custom interactive field editor.
// Supports:
//   - HTML Content vs Rich Text Editor switching
//   - Full-Screen editor mode
//   - Image & PDF file uploads (delegated to host via useStudio with zero AWS keys in PS)
//   - Drag & drop and paste image/PDF support
//   - Built-in PDF preview drawer

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Button,
  Divider,
  Drawer,
  Dropdown,
  Input,
  Modal,
  Popover,
  Segmented,
  Select,
  Slider,
  Space,
  Tabs,
  Tag,
  Tooltip,
  Typography,
  Upload,
  message,
} from 'antd';
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  StrikethroughOutlined,
  UnorderedListOutlined,
  OrderedListOutlined,
  LinkOutlined,
  PictureOutlined,
  CodeOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  FilePdfOutlined,
  UndoOutlined,
  RedoOutlined,
  ClearOutlined,
  EditOutlined,
  UploadOutlined,
  LoadingOutlined,
  EyeOutlined,
  DownloadOutlined,
  AlignLeftOutlined,
  AlignCenterOutlined,
  AlignRightOutlined,
  BgColorsOutlined,
  HighlightOutlined,
  MinusOutlined,
  DownOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  VerticalAlignTopOutlined,
  VerticalAlignBottomOutlined,
  DeleteOutlined,
  ScissorOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useStudio } from '../context';

const { Text } = Typography;

const TEXT_COLORS = [
  '#0F172A', '#475569', '#0F766E', '#0B5550', '#F59E0B',
  '#D97706', '#DC2626', '#2563EB', '#7C3AED', '#059669',
];

const HIGHLIGHT_COLORS = [
  '#FEF08A', '#FECACA', '#FED7AA', '#A7F3D0', '#BFDBFE',
  '#E9D5FF', '#FBCFE8', '#FDE68A',
];

function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes === 0) return '';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function RichTextCustomField({ value = '', onChange, readOnly }) {
  const [viewMode, setViewMode] = useState('rich'); // 'rich' | 'html'
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const [pdfOpen, setPdfOpen] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const [previewPdf, setPreviewPdf] = useState(null); // { url, title }
  const [selectedImgEl, setSelectedImgEl] = useState(null); // DOM element of selected image
  const [selectedPdfEl, setSelectedPdfEl] = useState(null); // DOM element of selected PDF card

  const editorRef = useRef(null);
  const editorWrapperRef = useRef(null);
  const savedRangeRef = useRef(null);
  const draggedImgRef = useRef(null);

  const {
    uploadFile,
    onFileUpload,
    uploadMedia,
    onFilePreview,
    renderPdfPreview,
  } = useStudio();

  // Generic upload handler adapter that delegates to host (TP)
  const executeUpload = useCallback(
    async (file, fileType = 'image') => {
      if (uploadFile) {
        return await uploadFile(file, { type: fileType });
      }
      if (onFileUpload) {
        return await onFileUpload(file, { type: fileType });
      }
      if (uploadMedia) {
        const fd = new FormData();
        fd.append('file', file);
        const res = await uploadMedia(fd);
        return {
          url: res?.url || (typeof res === 'string' ? res : ''),
          name: file.name,
          size: formatBytes(file.size),
        };
      }
      // Fallback if host did not provide an upload handler
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            url: e.target?.result,
            name: file.name,
            size: formatBytes(file.size),
          });
        };
        reader.readAsDataURL(file);
      });
    },
    [uploadFile, onFileUpload, uploadMedia],
  );

  // Sync contentEditable innerHTML ONLY when editor is NOT actively focused
  useEffect(() => {
    if (!editorRef.current) return;
    const isFocused =
      document.activeElement === editorRef.current ||
      editorRef.current.contains(document.activeElement);
    if (!isFocused && editorRef.current.innerHTML !== (value || '')) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value, viewMode, isFullScreen]);

  // Set default paragraph separator on mount
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== (value || '')) {
      editorRef.current.innerHTML = value || '';
    }
    try {
      document.execCommand('defaultParagraphSeparator', false, 'p');
    } catch (e) {}
  }, [viewMode, isFullScreen]);

  // Handle ESC and Backspace/Delete key for image/PDF selection & fullscreen
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (selectedImgEl) {
          setSelectedImgEl(null);
        } else if (selectedPdfEl) {
          setSelectedPdfEl(null);
        } else if (isFullScreen) {
          setIsFullScreen(false);
        }
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        if (selectedImgEl) {
          e.preventDefault();
          handleDeleteSelectedImage();
        } else if (selectedPdfEl) {
          e.preventDefault();
          handleDeleteSelectedPdf();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullScreen, selectedImgEl, selectedPdfEl]);

  // Click outside listener to deselect image & PDF
  useEffect(() => {
    const handleDocClick = (e) => {
      if (selectedImgEl) {
        if (
          e.target === selectedImgEl ||
          e.target.closest('.tps-image-resizer-overlay') ||
          e.target.closest('.tps-image-floating-toolbar') ||
          e.target.closest('.ant-dropdown') ||
          e.target.closest('.ant-popover')
        ) {
          // Keep selection
        } else {
          setSelectedImgEl(null);
        }
      }

      if (selectedPdfEl) {
        if (
          e.target === selectedPdfEl ||
          selectedPdfEl.contains(e.target) ||
          e.target.closest('.tps-pdf-selected-overlay') ||
          e.target.closest('.tps-pdf-floating-toolbar') ||
          e.target.closest('.ant-dropdown') ||
          e.target.closest('.ant-popover')
        ) {
          // Keep selection
        } else {
          setSelectedPdfEl(null);
        }
      }
    };
    document.addEventListener('mousedown', handleDocClick);
    return () => document.removeEventListener('mousedown', handleDocClick);
  }, [selectedImgEl, selectedPdfEl]);

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      if (editorRef.current && editorRef.current.contains(range.commonAncestorContainer)) {
        savedRangeRef.current = range.cloneRange();
      }
    }
  };

  const handleInput = () => {
    if (!editorRef.current) return;
    saveSelection();
    const nextHtml = editorRef.current.innerHTML;
    onChange(nextHtml);
  };

  const exec = (cmd, val = null) => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(cmd, false, val);
    handleInput();
  };

  const handleModeChange = (mode) => {
    if (mode === viewMode) return;
    setSelectedImgEl(null);
    setSelectedPdfEl(null);
    setViewMode(mode);
  };

  // Safe HTML insertion preserving paragraph integrity and splitting paragraphs cleanly
  const insertHtmlAtSelection = (htmlToInsert) => {
    if (viewMode === 'html') {
      onChange((value || '') + '\n' + htmlToInsert);
      return;
    }

    if (!editorRef.current) return;
    editorRef.current.focus();

    const sel = window.getSelection();
    let range = savedRangeRef.current;

    if (!range || !editorRef.current.contains(range.commonAncestorContainer)) {
      range = document.createRange();
      range.selectNodeContents(editorRef.current);
      range.collapse(false);
    }

    sel.removeAllRanges();
    sel.addRange(range);

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlToInsert;
    const isBlockInsert = htmlToInsert.includes('tps-block-pdf-card') || htmlToInsert.includes('<img');

    // Find top-level container inside editorRef
    let containerP = range.commonAncestorContainer;
    while (containerP && containerP.nodeType !== 1) {
      containerP = containerP.parentElement;
    }
    while (containerP && containerP.parentElement && containerP.parentElement !== editorRef.current && containerP !== editorRef.current) {
      containerP = containerP.parentElement;
    }

    if (isBlockInsert && containerP && containerP !== editorRef.current && containerP.parentElement === editorRef.current) {
      // Split container paragraph cleanly
      const beforeRange = document.createRange();
      beforeRange.setStart(containerP, 0);
      beforeRange.setEnd(range.startContainer, range.startOffset);
      const beforeFrag = beforeRange.cloneContents();

      const afterRange = document.createRange();
      afterRange.setStart(range.endContainer, range.endOffset);
      afterRange.setEnd(containerP, containerP.childNodes.length);
      const afterFrag = afterRange.cloneContents();

      const frag = document.createDocumentFragment();

      // Text before
      if (beforeFrag.textContent?.trim() || beforeFrag.querySelector('img, button, a')) {
        const pBefore = document.createElement('p');
        pBefore.appendChild(beforeFrag);
        frag.appendChild(pBefore);
      }

      // Block element(s)
      while (tempDiv.firstChild) {
        frag.appendChild(tempDiv.firstChild);
      }

      // Text after
      if (afterFrag.textContent?.trim() || afterFrag.querySelector('img, button, a')) {
        const pAfter = document.createElement('p');
        pAfter.appendChild(afterFrag);
        frag.appendChild(pAfter);
      } else {
        const pEmpty = document.createElement('p');
        pEmpty.innerHTML = '<br>';
        frag.appendChild(pEmpty);
      }

      editorRef.current.replaceChild(frag, containerP);
    } else {
      const frag = document.createDocumentFragment();
      let node, lastNode;
      while ((node = tempDiv.firstChild)) {
        lastNode = frag.appendChild(node);
      }
      range.deleteContents();
      range.insertNode(frag);

      if (lastNode) {
        const newRange = document.createRange();
        newRange.setStartAfter(lastNode);
        newRange.collapse(true);
        sel.removeAllRanges();
        sel.addRange(newRange);
        savedRangeRef.current = newRange;
      }
    }

    handleInput();
  };

  // Drag & drop file handler directly on editable area
  const handleDrop = async (e) => {
    // Check if dragging an existing image inside the editor for repositioning
    if (draggedImgRef.current) {
      e.preventDefault();
      e.stopPropagation();
      const draggedEl = draggedImgRef.current;
      draggedImgRef.current = null;

      let range = null;
      if (document.caretRangeFromPoint) {
        range = document.caretRangeFromPoint(e.clientX, e.clientY);
      } else if (e.rangeParent) {
        range = document.createRange();
        range.setStart(e.rangeParent, e.rangeOffset);
        range.collapse(true);
      }

      if (range && editorRef.current?.contains(range.commonAncestorContainer)) {
        // Clean up old parent if it was an empty wrapper
        const oldParent = draggedEl.parentElement;
        draggedEl.remove();
        if (
          oldParent &&
          oldParent !== editorRef.current &&
          oldParent.childNodes.length === 0
        ) {
          oldParent.remove();
        }

        const p = document.createElement('p');
        p.appendChild(draggedEl);
        range.insertNode(p);

        handleInput();
        setSelectedImgEl(draggedEl);
        message.success('Image re-positioned');
      }
      return;
    }

    const files = Array.from(e.dataTransfer?.files || []);
    if (!files.length) return;
    e.preventDefault();
    e.stopPropagation();

    for (const file of files) {
      if (file.type.startsWith('image/')) {
        try {
          message.loading({ content: `Uploading ${file.name}…`, key: 'dropUpload' });
          const res = await executeUpload(file, 'image');
          if (res?.url) {
            insertHtmlAtSelection(
              `<p><img src="${res.url}" alt="${res.name || file.name}" style="max-width: 100%; height: auto; border-radius: 8px; margin: 16px auto; display: block;" /></p>`,
            );
            message.success({ content: 'Image uploaded', key: 'dropUpload' });
          }
        } catch (err) {
          message.error({ content: err?.message || 'Upload failed', key: 'dropUpload' });
        }
      } else if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        try {
          message.loading({ content: `Uploading ${file.name}…`, key: 'dropUpload' });
          const res = await executeUpload(file, 'pdf');
          if (res?.url) {
            insertHtmlAtSelection(createPdfCardHtml(res.url, res.name || file.name, res.size || formatBytes(file.size), res.fid || ''));
            message.success({ content: 'PDF uploaded', key: 'dropUpload' });
          }
        } catch (err) {
          message.error({ content: err?.message || 'Upload failed', key: 'dropUpload' });
        }
      }
    }
  };

  // Paste handler for images directly in editor
  const handlePaste = async (e) => {
    const files = Array.from(e.clipboardData?.files || []).filter((f) => f.type.startsWith('image/'));
    if (!files.length) return;
    e.preventDefault();

    for (const file of files) {
      try {
        message.loading({ content: `Uploading image…`, key: 'pasteUpload' });
        const res = await executeUpload(file, 'image');
        if (res?.url) {
          insertHtmlAtSelection(
            `<p><img src="${res.url}" alt="${res.name || 'Pasted image'}" style="max-width: 100%; height: auto; border-radius: 8px; margin: 16px auto; display: block;" /></p>`,
          );
          message.success({ content: 'Image uploaded', key: 'pasteUpload' });
        }
      } catch (err) {
        message.error({ content: err?.message || 'Upload failed', key: 'pasteUpload' });
      }
    }
  };

  // Helper to ensure an element is a clean standalone block in editorRef without splitting surrounding sentences
  const ensureStandaloneBlock = (el, editorEl) => {
    if (!el || !editorEl) return el;
    let topEl = el;
    while (topEl.parentElement && topEl.parentElement !== editorEl) {
      const parent = topEl.parentElement;
      if (parent.tagName === 'P' || parent.tagName === 'DIV' || parent.tagName === 'FIGURE') {
        const childNodes = Array.from(parent.childNodes);
        const idx = childNodes.indexOf(topEl);

        const beforeNodes = childNodes.slice(0, idx).filter((n) => n.textContent?.trim() || n.nodeType === 1);
        const afterNodes = childNodes.slice(idx + 1).filter((n) => n.textContent?.trim() || n.nodeType === 1);

        if (beforeNodes.length > 0) {
          const beforeP = document.createElement('p');
          beforeNodes.forEach((n) => beforeP.appendChild(n));
          editorEl.insertBefore(beforeP, parent);
        }

        if (afterNodes.length > 0) {
          const afterP = document.createElement('p');
          afterNodes.forEach((n) => afterP.appendChild(n));
          editorEl.insertBefore(afterP, parent.nextSibling);
        }

        editorEl.insertBefore(topEl, parent);
        if (parent.childNodes.length === 0 || !parent.textContent?.trim()) {
          parent.remove();
        }
        return topEl;
      }
      topEl = parent;
    }
    return topEl;
  };

  // Helper to move block-level elements anywhere in document preserving full paragraphs
  const moveElement = (element, direction) => {
    if (!element || !editorRef.current) return;
    const target = ensureStandaloneBlock(element, editorRef.current);

    if (direction === 'up') {
      const prev = target.previousElementSibling;
      if (prev) {
        editorRef.current.insertBefore(target, prev);
      }
    } else if (direction === 'down') {
      const next = target.nextElementSibling;
      if (next) {
        editorRef.current.insertBefore(target, next.nextElementSibling);
      }
    } else if (direction === 'top' || direction === 'first') {
      editorRef.current.insertBefore(target, editorRef.current.firstElementChild);
    } else if (direction === 'bottom' || direction === 'last') {
      editorRef.current.appendChild(target);
    }
    handleInput();
  };

  const handleDeleteSelectedImage = () => {
    if (!selectedImgEl) return;
    let target = selectedImgEl;
    if (
      target.parentElement &&
      target.parentElement !== editorRef.current &&
      target.parentElement.children.length === 1
    ) {
      target = target.parentElement;
    }
    target.remove();
    setSelectedImgEl(null);
    handleInput();
    message.success('Image removed');
  };

  const handleDeleteSelectedPdf = () => {
    if (!selectedPdfEl) return;
    selectedPdfEl.remove();
    setSelectedPdfEl(null);
    handleInput();
    message.success('PDF removed');
  };

  // Dragstart handler on contentEditable for dragging images
  const handleDragStart = (e) => {
    if (e.target.tagName === 'IMG') {
      draggedImgRef.current = e.target;
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', '');
    }
  };

  // Intercept click on images, PDF cards, preview & download buttons inside editor
  const handleEditorClick = async (e) => {
    saveSelection();

    // 1. Preview button click
    const previewBtn = e.target.closest('.tps-pdf-preview-btn');
    if (previewBtn) {
      e.preventDefault();
      e.stopPropagation();
      const fid = previewBtn.getAttribute('data-pdf-fid') || '';
      let url = previewBtn.getAttribute('data-pdf-url') || '';
      const title = previewBtn.getAttribute('data-pdf-title') || 'Document.pdf';
      if (onFilePreview) {
        try {
          const fresh = await onFilePreview({ fid, url, title });
          if (typeof fresh === 'string' && fresh) url = fresh;
        } catch (err) {
          console.error('Failed to resolve preview URL:', err);
        }
      }
      setPreviewPdf({ fid, url, title });
      return;
    }

    // 2. Download button click
    const downloadBtn = e.target.closest('.tps-pdf-download-btn');
    if (downloadBtn) {
      const fid = downloadBtn.getAttribute('data-pdf-fid');
      const href = downloadBtn.getAttribute('href');
      if (fid && (!href || href === '#' || !href.startsWith('http'))) {
        e.preventDefault();
        e.stopPropagation();
        if (onFilePreview) {
          try {
            const fresh = await onFilePreview({ fid, url: href, title: downloadBtn.getAttribute('download') });
            if (typeof fresh === 'string' && fresh.startsWith('http')) {
              window.open(fresh, '_blank');
            }
          } catch (err) {
            console.error('Failed to resolve download URL:', err);
          }
        }
      }
      return;
    }

    // 3. Image click -> Select Image with outline and diagonal resize handles (NO modal popup)
    const img = e.target.closest('img');
    if (img && editorRef.current?.contains(img)) {
      e.preventDefault();
      e.stopPropagation();
      setSelectedPdfEl(null);
      setSelectedImgEl(img);
      return;
    }

    // 4. PDF Card Click -> Select PDF Card with floating toolbar (NO modal popup)
    const pdfCard = e.target.closest('.tps-block-pdf-card');
    if (pdfCard && editorRef.current?.contains(pdfCard)) {
      e.preventDefault();
      e.stopPropagation();
      setSelectedImgEl(null);
      setSelectedPdfEl(pdfCard);
      return;
    }

    // If clicking elsewhere in the editor canvas, deselect
    if (!e.target.closest('.tps-image-resizer-overlay') && !e.target.closest('.tps-pdf-selected-overlay')) {
      if (selectedImgEl) setSelectedImgEl(null);
      if (selectedPdfEl) setSelectedPdfEl(null);
    }
  };

  const renderEditorBody = (height = 220) => {
    return viewMode === 'rich' ? (
      <div ref={editorWrapperRef} style={{ position: 'relative', width: '100%' }}>
        <div
          ref={(el) => {
            editorRef.current = el;
            if (el) {
              const isFocused = document.activeElement === el || el.contains(document.activeElement);
              if (!isFocused && el.innerHTML !== (value || '')) {
                el.innerHTML = value || '';
              }
            }
          }}
          contentEditable={!readOnly}
          onInput={handleInput}
          onBlur={handleInput}
          onKeyUp={saveSelection}
          onMouseUp={saveSelection}
          onTouchEnd={saveSelection}
          onClick={handleEditorClick}
          onDragStart={handleDragStart}
          onDragEnter={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (e.dataTransfer) {
              e.dataTransfer.dropEffect = 'move';
            }
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDrop={handleDrop}
          onPaste={handlePaste}
          className="tps-field-rich-canvas"
          style={{
            minHeight: height,
            maxHeight: isFullScreen ? 'calc(100vh - 180px)' : 340,
            overflowY: 'auto',
            padding: '12px 14px',
            outline: 'none',
            fontSize: 14,
            lineHeight: 1.65,
            color: '#1e293b',
            background: '#fff',
          }}
        />

        {/* Inline Image Selection Overlay with Diagonal Resize Handles and Quick Toolbar */}
        {selectedImgEl && (
          <ImageResizerOverlay
            targetEl={selectedImgEl}
            editorEl={editorRef.current}
            wrapperEl={editorWrapperRef.current}
            onUpdate={handleInput}
            onMove={moveElement}
            onDelete={handleDeleteSelectedImage}
            onDeselect={() => setSelectedImgEl(null)}
          />
        )}

        {/* Inline PDF Selection Overlay with Quick Actions (No Modal) */}
        {selectedPdfEl && (
          <PdfActionBarOverlay
            targetEl={selectedPdfEl}
            editorEl={editorRef.current}
            wrapperEl={editorWrapperRef.current}
            onUpdate={handleInput}
            onMove={moveElement}
            onDelete={handleDeleteSelectedPdf}
            onPreview={async (card) => {
              const fid = card.getAttribute('data-pdf-fid') || '';
              let url = card.getAttribute('data-pdf-url') || '';
              const title = card.getAttribute('data-pdf-title') || 'Document.pdf';
              if (onFilePreview) {
                try {
                  const fresh = await onFilePreview({ fid, url, title });
                  if (typeof fresh === 'string' && fresh) url = fresh;
                } catch (err) {
                  console.error('Failed to resolve preview URL:', err);
                }
              }
              setPreviewPdf({ fid, url, title });
            }}
            onDeselect={() => setSelectedPdfEl(null)}
          />
        )}
      </div>
    ) : (
      <Input.TextArea
        rows={isFullScreen ? 24 : 10}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={readOnly}
        placeholder="<!-- Write or paste raw HTML markup here -->"
        style={{
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          fontSize: 12.5,
          lineHeight: 1.6,
          background: '#0f172a',
          color: '#f8fafc',
          border: 'none',
          borderRadius: 0,
          minHeight: height,
          resize: 'vertical',
        }}
      />
    );
  };

  const renderToolbar = (compact = false) => {
    const headingItems = [
      { key: 'p', label: 'Paragraph' },
      { key: 'h1', label: 'Heading 1' },
      { key: 'h2', label: 'Heading 2' },
      { key: 'h3', label: 'Heading 3' },
      { key: 'h4', label: 'Heading 4' },
    ];

    const setHeading = (key) => {
      exec('formatBlock', `<${key}>`);
    };

    return (
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 4,
          padding: '6px 8px',
          background: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
          <Tooltip title="Undo">
            <Button size="small" type="text" icon={<UndoOutlined />} onClick={() => exec('undo')} disabled={viewMode === 'html'} />
          </Tooltip>
          <Tooltip title="Redo">
            <Button size="small" type="text" icon={<RedoOutlined />} onClick={() => exec('redo')} disabled={viewMode === 'html'} />
          </Tooltip>
          <Divider type="vertical" style={{ height: 16, margin: '0 2px' }} />

          <Dropdown
            disabled={viewMode === 'html'}
            trigger={['click']}
            menu={{
              items: headingItems,
              onClick: ({ key }) => setHeading(key),
            }}
          >
            <Button size="small" type="text" disabled={viewMode === 'html'} style={{ fontSize: 12 }}>
              Heading <DownOutlined style={{ fontSize: 9 }} />
            </Button>
          </Dropdown>
          <Divider type="vertical" style={{ height: 16, margin: '0 2px' }} />

          <Tooltip title="Bold">
            <Button size="small" type="text" icon={<BoldOutlined />} onClick={() => exec('bold')} disabled={viewMode === 'html'} />
          </Tooltip>
          <Tooltip title="Italic">
            <Button size="small" type="text" icon={<ItalicOutlined />} onClick={() => exec('italic')} disabled={viewMode === 'html'} />
          </Tooltip>
          <Tooltip title="Underline">
            <Button size="small" type="text" icon={<UnderlineOutlined />} onClick={() => exec('underline')} disabled={viewMode === 'html'} />
          </Tooltip>
          <Tooltip title="Strikethrough">
            <Button size="small" type="text" icon={<StrikethroughOutlined />} onClick={() => exec('strikeThrough')} disabled={viewMode === 'html'} />
          </Tooltip>
          <Divider type="vertical" style={{ height: 16, margin: '0 2px' }} />

          <Popover
            trigger="click"
            disabled={viewMode === 'html'}
            content={
              <Space direction="vertical" size={6} style={{ width: 150 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4 }}>
                  {TEXT_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => exec('foreColor', c)}
                      style={{ width: 22, height: 22, background: c, border: '1px solid #ccc', borderRadius: 3, cursor: 'pointer' }}
                    />
                  ))}
                </div>
              </Space>
            }
          >
            <Tooltip title="Text color">
              <Button size="small" type="text" icon={<BgColorsOutlined />} disabled={viewMode === 'html'} />
            </Tooltip>
          </Popover>

          <Popover
            trigger="click"
            disabled={viewMode === 'html'}
            content={
              <Space direction="vertical" size={6} style={{ width: 150 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4 }}>
                  {HIGHLIGHT_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => exec('hiliteColor', c)}
                      style={{ width: 24, height: 22, background: c, border: '1px solid #ccc', borderRadius: 3, cursor: 'pointer' }}
                    />
                  ))}
                </div>
              </Space>
            }
          >
            <Tooltip title="Highlight">
              <Button size="small" type="text" icon={<HighlightOutlined />} disabled={viewMode === 'html'} />
            </Tooltip>
          </Popover>
          <Divider type="vertical" style={{ height: 16, margin: '0 2px' }} />

          <Tooltip title="Align left">
            <Button size="small" type="text" icon={<AlignLeftOutlined />} onClick={() => exec('justifyLeft')} disabled={viewMode === 'html'} />
          </Tooltip>
          <Tooltip title="Align center">
            <Button size="small" type="text" icon={<AlignCenterOutlined />} onClick={() => exec('justifyCenter')} disabled={viewMode === 'html'} />
          </Tooltip>
          <Tooltip title="Align right">
            <Button size="small" type="text" icon={<AlignRightOutlined />} onClick={() => exec('justifyRight')} disabled={viewMode === 'html'} />
          </Tooltip>
          <Divider type="vertical" style={{ height: 16, margin: '0 2px' }} />

          <Tooltip title="Bulleted list">
            <Button size="small" type="text" icon={<UnorderedListOutlined />} onClick={() => exec('insertUnorderedList')} disabled={viewMode === 'html'} />
          </Tooltip>
          <Tooltip title="Numbered list">
            <Button size="small" type="text" icon={<OrderedListOutlined />} onClick={() => exec('insertOrderedList')} disabled={viewMode === 'html'} />
          </Tooltip>
          <Divider type="vertical" style={{ height: 16, margin: '0 2px' }} />

          <Tooltip title="Insert link">
            <Button size="small" type="text" icon={<LinkOutlined />} onClick={() => setLinkOpen(true)} disabled={viewMode === 'html'} />
          </Tooltip>
          <Tooltip title="Insert image">
            <Button size="small" type="text" icon={<PictureOutlined />} onClick={() => { saveSelection(); setImageOpen(true); }} />
          </Tooltip>
          <Tooltip title="Insert PDF document">
            <Button size="small" type="text" icon={<FilePdfOutlined style={{ color: '#dc2626' }} />} onClick={() => { saveSelection(); setPdfOpen(true); }} />
          </Tooltip>
          <Tooltip title="Horizontal divider">
            <Button size="small" type="text" icon={<MinusOutlined />} onClick={() => exec('insertHorizontalRule')} disabled={viewMode === 'html'} />
          </Tooltip>
          <Tooltip title="Clear formatting">
            <Button size="small" type="text" icon={<ClearOutlined />} onClick={() => exec('removeFormat')} disabled={viewMode === 'html'} />
          </Tooltip>
        </div>

        {/* Right Switch & Fullscreen */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Segmented
            size="small"
            value={viewMode}
            onChange={handleModeChange}
            options={[
              { value: 'rich', label: 'Rich Text', icon: <EditOutlined /> },
              { value: 'html', label: 'HTML', icon: <CodeOutlined /> },
            ]}
          />
          <Tooltip title={isFullScreen ? 'Exit full screen (Esc)' : 'Full screen'}>
            <Button
              size="small"
              type={isFullScreen ? 'primary' : 'text'}
              icon={isFullScreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
              onClick={() => setIsFullScreen((prev) => !prev)}
            />
          </Tooltip>
        </div>
      </div>
    );
  };

  return (
    <div
      className="tps-richtext-field-wrapper"
      style={{
        border: '1px solid #d9d9d9',
        borderRadius: 6,
        background: '#fff',
        overflow: 'hidden',
      }}
    >
      {/* Sidebar Compact Toolbar */}
      {renderToolbar(true)}

      {/* Sidebar Editor Viewport */}
      {!isFullScreen ? (
        renderEditorBody(200)
      ) : (
        <div
          style={{
            padding: '24px 16px',
            textAlign: 'center',
            background: '#f8fafc',
            color: '#64748b',
            fontSize: 13,
            minHeight: 120,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Space direction="vertical" size={8}>
            <span style={{ fontWeight: 500 }}>Editing in full-screen window</span>
            <Button size="small" type="primary" onClick={() => setIsFullScreen(true)}>
              Return to Full Screen
            </Button>
          </Space>
        </div>
      )}

      {/* Full Screen Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: 32 }}>
            <Space>
              <EditOutlined style={{ color: '#0f766e' }} />
              <span style={{ fontWeight: 600 }}>Rich Text Editor</span>
              <Tag color={viewMode === 'rich' ? 'processing' : 'warning'}>
                {viewMode === 'rich' ? 'Rich Text Mode' : 'HTML Mode'}
              </Tag>
            </Space>
          </div>
        }
        open={isFullScreen}
        onCancel={() => setIsFullScreen(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setIsFullScreen(false)}>
            Done Editing
          </Button>,
        ]}
        width="92vw"
        style={{ top: 20 }}
        styles={{
          body: {
            height: 'calc(85vh - 60px)',
            display: 'flex',
            flexDirection: 'column',
            padding: 0,
            overflow: 'hidden',
          },
        }}
        destroyOnClose={false}
      >
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {renderToolbar(false)}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            {renderEditorBody('100%')}
          </div>
        </div>
      </Modal>

      {/* Insert Link Modal */}
      <Modal
        title="Insert link"
        open={linkOpen}
        onCancel={() => setLinkOpen(false)}
        onOk={() => {
          const url = (document.getElementById('tps_link_input'))?.value;
          if (url) exec('createLink', url);
          setLinkOpen(false);
        }}
        okText="Insert Link"
        destroyOnClose
      >
        <Input id="tps_link_input" placeholder="https://example.com" autoFocus />
      </Modal>

      {/* Insert Image Modal */}
      <ImageModal
        open={imageOpen}
        onClose={() => setImageOpen(false)}
        onInsert={(imgHtml) => {
          insertHtmlAtSelection(imgHtml);
          setImageOpen(false);
        }}
        onUpload={executeUpload}
      />

      {/* Insert PDF Modal */}
      <PdfModal
        open={pdfOpen}
        onClose={() => setPdfOpen(false)}
        onInsert={(pdfHtml) => {
          insertHtmlAtSelection(pdfHtml);
          setPdfOpen(false);
        }}
        onUpload={executeUpload}
      />

      {/* Built-in PDF Preview Drawer */}
      <Drawer
        title={
          <Space>
            <FilePdfOutlined style={{ color: '#dc2626' }} />
            <span>{previewPdf?.title || 'PDF Preview'}</span>
          </Space>
        }
        placement="right"
        width="65vw"
        open={Boolean(previewPdf)}
        onClose={() => setPreviewPdf(null)}
        destroyOnClose
        extra={
          previewPdf?.url ? (
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              href={previewPdf.url}
              target="_blank"
              rel="noopener noreferrer"
              download={previewPdf.title}
            >
              Download
            </Button>
          ) : null
        }
      >
        {previewPdf && (
          renderPdfPreview ? (
            renderPdfPreview(previewPdf)
          ) : (
            <div style={{ width: '100%', height: '100%', minHeight: 500, background: '#f8fafc' }}>
              <iframe
                src={previewPdf.url}
                title={previewPdf.title}
                style={{ width: '100%', height: '100%', minHeight: 'calc(100vh - 120px)', border: 'none' }}
              />
            </div>
          )
        )}
      </Drawer>

      <style jsx global>{`
        .tps-field-rich-canvas {
          font-family: inherit;
        }
        .tps-field-rich-canvas p { margin: 0 0 0.75em; min-height: 1.2em; }
        .tps-field-rich-canvas h1 { font-size: 24px; font-weight: 700; margin: 0.8em 0 0.4em; }
        .tps-field-rich-canvas h2 { font-size: 20px; font-weight: 700; margin: 0.8em 0 0.4em; }
        .tps-field-rich-canvas h3 { font-size: 17px; font-weight: 600; margin: 0.8em 0 0.4em; }
        .tps-field-rich-canvas h4 { font-size: 15px; font-weight: 600; margin: 0.8em 0 0.4em; }
        .tps-field-rich-canvas blockquote {
          border-left: 3px solid #0f766e; padding-left: 12px; margin: 1em 0; color: #64748b; font-style: italic;
        }
        .tps-field-rich-canvas ul, .tps-field-rich-canvas ol { padding-left: 20px; margin: 0 0 0.75em; }
        
        .tps-field-rich-canvas img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          cursor: pointer;
          user-select: none;
          transition: none;
        }

        .tps-field-rich-canvas img:hover {
          outline: 2px dashed #0f766e;
          outline-offset: 2px;
        }

        .tps-rich-body img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
        }

        .tps-block-pdf-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 10px 14px;
          margin: 14px 0;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          cursor: pointer;
          user-select: none;
        }
        .tps-block-pdf-card:hover {
          outline: 2px dashed #0f766e;
          outline-offset: 2px;
        }
        .tps-pdf-preview-btn {
          padding: 4px 10px;
          background: #0f766e;
          color: #fff;
          border: none;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
        }
        .tps-pdf-download-btn {
          padding: 4px 10px;
          background: #fff;
          color: #334155;
          border: 1px solid #cbd5e1;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          text-decoration: none;
        }
      `}</style>
    </div>
  );
}

function createPdfCardHtml(url, title, size, fid = '') {
  const docTitle = title || 'Document.pdf';
  const fidAttr = fid ? ` data-pdf-fid="${fid}"` : '';
  return `<div class="tps-block-pdf-card"${fidAttr} data-pdf-url="${url || ''}" data-pdf-title="${docTitle}" data-pdf-size="${size || ''}" style="display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 16px; margin: 16px 0; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
  <div style="display: flex; align-items: center; gap: 12px; min-width: 0;">
    <span style="display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; background: #fee2e2; color: #dc2626; border-radius: 6px; font-weight: 700; font-size: 11px;">PDF</span>
    <div style="display: flex; flex-direction: column; min-width: 0;">
      <span class="tps-pdf-title" style="font-weight: 600; font-size: 14px; color: #1e293b; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${docTitle}</span>
      ${size ? `<span style="font-size: 12px; color: #64748b;">${size}</span>` : ''}
    </div>
  </div>
  <div style="display: flex; align-items: center; gap: 8px;">
    <button type="button" class="tps-pdf-preview-btn"${fidAttr} data-pdf-url="${url || ''}" data-pdf-title="${docTitle}" style="padding: 4px 10px; background: #0f766e; color: #fff; border: none; border-radius: 4px; font-size: 12px; font-weight: 500; cursor: pointer;">Preview</button>
    <a class="tps-pdf-download-btn"${fidAttr} data-pdf-url="${url || ''}" href="${url || '#'}" target="_blank" rel="noopener noreferrer" download="${docTitle}" style="padding: 4px 10px; background: #fff; color: #334155; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 12px; font-weight: 500; text-decoration: none;">Download</a>
  </div>
</div><p><br></p>`;
}

// ---------------------------------------------------------------------------
// Inline Image Resizer Overlay & Floating Toolbar
// ---------------------------------------------------------------------------
function ImageResizerOverlay({
  targetEl,
  editorEl,
  wrapperEl,
  onUpdate,
  onMove,
  onDelete,
  onDeselect,
}) {
  const [rect, setRect] = useState(null);
  const [isResizing, setIsResizing] = useState(false);
  const [widthPct, setWidthPct] = useState(100);

  const overlayRef = useRef(null);
  const badgeRef = useRef(null);

  const updateRect = useCallback(() => {
    if (!targetEl || !editorEl || !wrapperEl) return;
    if (!editorEl.contains(targetEl)) {
      onDeselect();
      return;
    }
    const tRect = targetEl.getBoundingClientRect();
    const wRect = wrapperEl.getBoundingClientRect();

    setRect({
      top: tRect.top - wRect.top,
      left: tRect.left - wRect.left,
      width: tRect.width,
      height: tRect.height,
    });

    const edWidth = editorEl.clientWidth - 28 || 500;
    const computedPct = Math.round((tRect.width / edWidth) * 100);
    setWidthPct(Math.min(100, Math.max(10, computedPct)));
  }, [targetEl, editorEl, wrapperEl, onDeselect]);

  useEffect(() => {
    updateRect();
    const scroller = editorEl;
    scroller.addEventListener('scroll', updateRect);
    window.addEventListener('resize', updateRect);

    const observer = new ResizeObserver(updateRect);
    observer.observe(targetEl);
    observer.observe(editorEl);

    return () => {
      scroller.removeEventListener('scroll', updateRect);
      window.removeEventListener('resize', updateRect);
      observer.disconnect();
    };
  }, [targetEl, editorEl, updateRect]);

  const handleResizeStart = (e, handlePos) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    document.body.style.userSelect = 'none';

    const startX = e.clientX;
    const startWidth = targetEl.offsetWidth;
    const editorWidth = editorEl.clientWidth - 28 || 500;

    const onMouseMove = (moveEvent) => {
      let diffX = moveEvent.clientX - startX;
      if (handlePos.includes('left')) {
        diffX = -diffX;
      }
      const newPx = Math.max(50, Math.min(editorWidth, startWidth + diffX));
      const newPct = Math.round((newPx / editorWidth) * 100);

      // Direct DOM style updates for 120fps buttery smooth dragging
      targetEl.style.width = `${newPct}%`;
      targetEl.style.maxWidth = '100%';
      targetEl.style.height = 'auto';

      if (overlayRef.current) {
        const tRect = targetEl.getBoundingClientRect();
        const wRect = wrapperEl.getBoundingClientRect();
        overlayRef.current.style.top = `${tRect.top - wRect.top}px`;
        overlayRef.current.style.left = `${tRect.left - wRect.left}px`;
        overlayRef.current.style.width = `${tRect.width}px`;
        overlayRef.current.style.height = `${tRect.height}px`;
      }
      if (badgeRef.current) {
        badgeRef.current.textContent = `${newPct}% (${newPx}px)`;
      }
    };

    const onMouseUp = () => {
      document.body.style.userSelect = '';
      setIsResizing(false);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      updateRect();
      onUpdate();
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handleAlign = (align) => {
    if (align === 'left') {
      targetEl.style.float = 'left';
      targetEl.style.margin = '0 18px 14px 0';
      targetEl.style.display = 'inline-block';
      targetEl.style.clear = 'none';
      if (targetEl.parentElement && targetEl.parentElement !== editorEl) {
        targetEl.parentElement.style.textAlign = 'left';
      }
    } else if (align === 'right') {
      targetEl.style.float = 'right';
      targetEl.style.margin = '0 0 14px 18px';
      targetEl.style.display = 'inline-block';
      targetEl.style.clear = 'none';
      if (targetEl.parentElement && targetEl.parentElement !== editorEl) {
        targetEl.parentElement.style.textAlign = 'left';
      }
    } else if (align === 'full') {
      targetEl.style.float = 'none';
      targetEl.style.width = '100%';
      targetEl.style.marginLeft = '0';
      targetEl.style.marginRight = '0';
      targetEl.style.marginTop = '16px';
      targetEl.style.marginBottom = '16px';
      targetEl.style.display = 'block';
      targetEl.style.clear = 'both';
      if (targetEl.parentElement && targetEl.parentElement !== editorEl) {
        targetEl.parentElement.style.textAlign = 'center';
      }
    } else {
      // Center
      targetEl.style.float = 'none';
      targetEl.style.marginLeft = 'auto';
      targetEl.style.marginRight = 'auto';
      targetEl.style.marginTop = '16px';
      targetEl.style.marginBottom = '16px';
      targetEl.style.display = 'block';
      targetEl.style.clear = 'both';
      if (targetEl.parentElement && targetEl.parentElement !== editorEl) {
        targetEl.parentElement.style.textAlign = 'center';
      }
    }
    updateRect();
    onUpdate();
  };

  const handleWidthPreset = (preset) => {
    targetEl.style.width = preset;
    targetEl.style.maxWidth = '100%';
    targetEl.style.height = 'auto';
    updateRect();
    onUpdate();
  };

  const handleAspect = (ratio) => {
    if (ratio === 'auto') {
      targetEl.style.aspectRatio = 'auto';
      targetEl.style.objectFit = 'initial';
      targetEl.style.borderRadius = '8px';
    } else if (ratio === 'circle') {
      targetEl.style.aspectRatio = '1 / 1';
      targetEl.style.objectFit = 'cover';
      targetEl.style.borderRadius = '50%';
    } else {
      targetEl.style.aspectRatio = ratio;
      targetEl.style.objectFit = 'cover';
      targetEl.style.borderRadius = '8px';
    }
    updateRect();
    onUpdate();
  };

  if (!rect) return null;

  // Determine toolbar placement (above or below if close to top edge)
  const toolbarTop = rect.top > 50 ? rect.top - 44 : rect.top + rect.height + 8;
  const toolbarLeft = Math.max(8, Math.min(rect.left, (wrapperEl?.clientWidth || 500) - 420));

  const handleStyle = {
    position: 'absolute',
    width: 11,
    height: 11,
    background: '#ffffff',
    border: '2px solid #0f766e',
    borderRadius: 2,
    boxShadow: '0 1px 4px rgba(0,0,0,0.35)',
    zIndex: 20,
    pointerEvents: 'auto',
  };

  const aspectItems = [
    { key: 'auto', label: 'Original (Auto)' },
    { key: '1 / 1', label: '1:1 Square' },
    { key: '16 / 9', label: '16:9 Landscape' },
    { key: '4 / 3', label: '4:3 Standard' },
    { key: 'circle', label: 'Circle / Avatar' },
  ];

  return (
    <>
      {/* Selection Border Box */}
      <div
        ref={overlayRef}
        className="tps-image-resizer-overlay"
        style={{
          position: 'absolute',
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          border: '2px solid #0f766e',
          borderRadius: targetEl.style.borderRadius || '8px',
          boxShadow: '0 0 0 1px rgba(255,255,255,0.8), 0 2px 8px rgba(15,118,110,0.25)',
          pointerEvents: 'none',
          zIndex: 15,
          transition: isResizing ? 'none' : 'all 0.1s ease',
        }}
      >
        {/* Top-Left Handle */}
        <div
          style={{ ...handleStyle, top: -6, left: -6, cursor: 'nwse-resize' }}
          onMouseDown={(e) => handleResizeStart(e, 'top-left')}
        />

        {/* Top-Right Handle */}
        <div
          style={{ ...handleStyle, top: -6, right: -6, cursor: 'nesw-resize' }}
          onMouseDown={(e) => handleResizeStart(e, 'top-right')}
        />

        {/* Bottom-Left Handle */}
        <div
          style={{ ...handleStyle, bottom: -6, left: -6, cursor: 'nesw-resize' }}
          onMouseDown={(e) => handleResizeStart(e, 'bottom-left')}
        />

        {/* Bottom-Right Diagonal Resize Handle (Primary) */}
        <div
          style={{
            ...handleStyle,
            bottom: -6,
            right: -6,
            width: 13,
            height: 13,
            background: '#0f766e',
            border: '2px solid #ffffff',
            cursor: 'nwse-resize',
          }}
          onMouseDown={(e) => handleResizeStart(e, 'bottom-right')}
        />

        {/* Size Badge */}
        <div
          ref={badgeRef}
          style={{
            position: 'absolute',
            bottom: -24,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(15,23,42,0.88)',
            color: '#fff',
            padding: '2px 8px',
            borderRadius: 4,
            fontSize: 11,
            fontWeight: 600,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            zIndex: 25,
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          }}
        >
          {widthPct}% ({Math.round(rect.width)}px)
        </div>
      </div>

      {/* Floating Quick Action Toolbar */}
      <div
        className="tps-image-floating-toolbar"
        style={{
          position: 'absolute',
          top: toolbarTop,
          left: toolbarLeft,
          background: '#ffffff',
          border: '1px solid #cbd5e1',
          borderRadius: 8,
          padding: '3px 6px',
          boxShadow: '0 8px 24px -4px rgba(15,23,42,0.18), 0 2px 6px rgba(0,0,0,0.06)',
          display: 'flex',
          alignItems: 'center',
          gap: 3,
          zIndex: 40,
          pointerEvents: 'auto',
        }}
      >
        {/* Alignment Options */}
        <Tooltip title="Float Left (Text wraps on right)">
          <Button size="small" type="text" icon={<AlignLeftOutlined />} onClick={() => handleAlign('left')} />
        </Tooltip>
        <Tooltip title="Center Block">
          <Button size="small" type="text" icon={<AlignCenterOutlined />} onClick={() => handleAlign('center')} />
        </Tooltip>
        <Tooltip title="Float Right (Text wraps on left)">
          <Button size="small" type="text" icon={<AlignRightOutlined />} onClick={() => handleAlign('right')} />
        </Tooltip>
        <Tooltip title="Full Width Block">
          <Button size="small" type="text" icon={<FullscreenOutlined />} onClick={() => handleAlign('full')} />
        </Tooltip>

        <Divider type="vertical" style={{ height: 16, margin: '0 3px' }} />

        {/* Width Presets */}
        <Button size="small" type="text" style={{ fontSize: 11, padding: '0 5px' }} onClick={() => handleWidthPreset('25%')}>25%</Button>
        <Button size="small" type="text" style={{ fontSize: 11, padding: '0 5px' }} onClick={() => handleWidthPreset('50%')}>50%</Button>
        <Button size="small" type="text" style={{ fontSize: 11, padding: '0 5px' }} onClick={() => handleWidthPreset('75%')}>75%</Button>
        <Button size="small" type="text" style={{ fontSize: 11, padding: '0 5px' }} onClick={() => handleWidthPreset('100%')}>100%</Button>

        <Divider type="vertical" style={{ height: 16, margin: '0 3px' }} />

        {/* Aspect Ratio / Crop */}
        <Dropdown
          trigger={['click']}
          menu={{
            items: aspectItems,
            onClick: ({ key }) => handleAspect(key),
          }}
        >
          <Button size="small" type="text" style={{ fontSize: 11, padding: '0 5px' }}>
            Crop <DownOutlined style={{ fontSize: 9 }} />
          </Button>
        </Dropdown>

        <Divider type="vertical" style={{ height: 16, margin: '0 3px' }} />

        {/* Move in Document */}
        <Tooltip title="Move before previous paragraph">
          <Button size="small" type="text" icon={<ArrowUpOutlined />} onClick={() => { onMove(targetEl, 'up'); updateRect(); }} />
        </Tooltip>
        <Tooltip title="Move after next paragraph">
          <Button size="small" type="text" icon={<ArrowDownOutlined />} onClick={() => { onMove(targetEl, 'down'); updateRect(); }} />
        </Tooltip>

        <Divider type="vertical" style={{ height: 16, margin: '0 3px' }} />

        {/* Delete Image */}
        <Tooltip title="Remove Image (or press Delete)">
          <Button size="small" type="text" danger icon={<DeleteOutlined />} onClick={onDelete} />
        </Tooltip>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Inline PDF Selection Overlay & Floating Toolbar (No Modal)
// ---------------------------------------------------------------------------
function PdfActionBarOverlay({
  targetEl,
  editorEl,
  wrapperEl,
  onUpdate,
  onMove,
  onDelete,
  onPreview,
  onDeselect,
}) {
  const [rect, setRect] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [size, setSize] = useState('');

  const updateRect = useCallback(() => {
    if (!targetEl || !editorEl || !wrapperEl) return;
    if (!editorEl.contains(targetEl)) {
      onDeselect();
      return;
    }
    const tRect = targetEl.getBoundingClientRect();
    const wRect = wrapperEl.getBoundingClientRect();

    setRect({
      top: tRect.top - wRect.top,
      left: tRect.left - wRect.left,
      width: tRect.width,
      height: tRect.height,
    });
    setTitle(targetEl.getAttribute('data-pdf-title') || 'Document.pdf');
    setSize(targetEl.getAttribute('data-pdf-size') || '');
  }, [targetEl, editorEl, wrapperEl, onDeselect]);

  useEffect(() => {
    updateRect();
    const scroller = editorEl;
    scroller.addEventListener('scroll', updateRect);
    window.addEventListener('resize', updateRect);

    const observer = new ResizeObserver(updateRect);
    observer.observe(targetEl);
    observer.observe(editorEl);

    return () => {
      scroller.removeEventListener('scroll', updateRect);
      window.removeEventListener('resize', updateRect);
      observer.disconnect();
    };
  }, [targetEl, editorEl, updateRect]);

  const handleSaveInfo = () => {
    if (title) {
      targetEl.setAttribute('data-pdf-title', title);
      const titleEl = targetEl.querySelector('.tps-pdf-title');
      if (titleEl) titleEl.textContent = title;
      const previewBtn = targetEl.querySelector('.tps-pdf-preview-btn');
      if (previewBtn) previewBtn.setAttribute('data-pdf-title', title);
      const downloadBtn = targetEl.querySelector('.tps-pdf-download-btn');
      if (downloadBtn) {
        downloadBtn.setAttribute('download', title);
        downloadBtn.setAttribute('data-pdf-title', title);
      }
    }
    if (size !== undefined) {
      targetEl.setAttribute('data-pdf-size', size);
      const sizeEl = targetEl.querySelector('.tps-pdf-size');
      if (sizeEl) sizeEl.textContent = size;
    }
    setEditOpen(false);
    updateRect();
    onUpdate();
  };

  if (!rect) return null;

  const toolbarTop = rect.top > 50 ? rect.top - 44 : rect.top + rect.height + 8;
  const toolbarLeft = Math.max(8, Math.min(rect.left, (wrapperEl?.clientWidth || 500) - 440));

  return (
    <>
      {/* PDF Selection Outline */}
      <div
        className="tps-pdf-selected-overlay"
        style={{
          position: 'absolute',
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          border: '2px solid #0f766e',
          borderRadius: 8,
          boxShadow: '0 0 0 1px rgba(255,255,255,0.8), 0 2px 8px rgba(15,118,110,0.25)',
          pointerEvents: 'none',
          zIndex: 15,
        }}
      />

      {/* Floating Action Bar */}
      <div
        className="tps-pdf-floating-toolbar"
        style={{
          position: 'absolute',
          top: toolbarTop,
          left: toolbarLeft,
          background: '#ffffff',
          border: '1px solid #cbd5e1',
          borderRadius: 8,
          padding: '3px 6px',
          boxShadow: '0 8px 24px -4px rgba(15,23,42,0.18), 0 2px 6px rgba(0,0,0,0.06)',
          display: 'flex',
          alignItems: 'center',
          gap: 3,
          zIndex: 40,
          pointerEvents: 'auto',
        }}
      >
        <Tooltip title="Move before previous paragraph">
          <Button size="small" type="text" icon={<ArrowUpOutlined />} onClick={() => { onMove(targetEl, 'up'); updateRect(); }}>
            Move Up
          </Button>
        </Tooltip>
        <Tooltip title="Move after next paragraph">
          <Button size="small" type="text" icon={<ArrowDownOutlined />} onClick={() => { onMove(targetEl, 'down'); updateRect(); }}>
            Move Down
          </Button>
        </Tooltip>
        <Tooltip title="Move to the very beginning">
          <Button size="small" type="text" icon={<VerticalAlignTopOutlined />} onClick={() => { onMove(targetEl, 'top'); updateRect(); }}>
            Move First
          </Button>
        </Tooltip>
        <Tooltip title="Move to the very end">
          <Button size="small" type="text" icon={<VerticalAlignBottomOutlined />} onClick={() => { onMove(targetEl, 'bottom'); updateRect(); }}>
            Move Last
          </Button>
        </Tooltip>

        <Divider type="vertical" style={{ height: 16, margin: '0 3px' }} />

        <Tooltip title="Preview PDF Document">
          <Button size="small" type="text" icon={<EyeOutlined />} onClick={() => onPreview(targetEl)} />
        </Tooltip>

        <Popover
          trigger="click"
          open={editOpen}
          onOpenChange={setEditOpen}
          content={
            <Space direction="vertical" size={8} style={{ width: 220 }}>
              <span style={{ fontWeight: 600, fontSize: 12 }}>Document Title</span>
              <Input size="small" value={title} onChange={(e) => setTitle(e.target.value)} />
              <span style={{ fontWeight: 600, fontSize: 12 }}>File Size</span>
              <Input size="small" value={size} onChange={(e) => setSize(e.target.value)} />
              <Button size="small" type="primary" onClick={handleSaveInfo} style={{ width: '100%', marginTop: 4 }}>
                Save
              </Button>
            </Space>
          }
        >
          <Tooltip title="Edit Title & Size">
            <Button size="small" type="text" icon={<EditOutlined />} />
          </Tooltip>
        </Popover>

        <Divider type="vertical" style={{ height: 16, margin: '0 3px' }} />

        <Tooltip title="Remove PDF (or press Delete)">
          <Button size="small" type="text" danger icon={<DeleteOutlined />} onClick={onDelete} />
        </Tooltip>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Image Modal
// ---------------------------------------------------------------------------
function ImageModal({ open, onClose, onInsert, onUpload }) {
  const [tab, setTab] = useState('upload');
  const [src, setSrc] = useState('');
  const [alt, setAlt] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (open) {
      setTab('upload');
      setSrc('');
      setAlt('');
      setUploading(false);
    }
  }, [open]);

  const apply = () => {
    if (!src) return;
    const imgHtml = `<p><img src="${src}" alt="${alt || 'Image'}" style="max-width: 100%; height: auto; border-radius: 8px; margin: 12px 0; display: block;" /></p>`;
    onInsert(imgHtml);
  };

  const handleCustomRequest = async ({ file, onSuccess, onError }) => {
    const isImage = file.type?.startsWith('image/') || /\.(jpe?g|png|gif|webp|svg|avif)$/i.test(file.name);
    if (!isImage) {
      message.error('Only image files (JPG, PNG, WEBP, GIF, SVG) are supported.');
      onError?.(new Error('Invalid image file type'));
      return;
    }
    setUploading(true);
    try {
      const res = await onUpload(file, 'image');
      const url = res?.url;
      if (!url) throw new Error('No image URL returned from upload handler');
      setSrc(url);
      if (!alt) setAlt(res?.name || file.name.replace(/\.[^.]+$/, ''));
      message.success('Image uploaded successfully');
      onSuccess?.(res);
    } catch (err) {
      message.error(err.message || 'Upload failed');
      onError?.(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal
      title="Insert image"
      open={open}
      onCancel={onClose}
      onOk={apply}
      okText="Insert Image"
      okButtonProps={{ disabled: !src || uploading }}
      destroyOnClose
      width={540}
    >
      <Tabs
        activeKey={tab}
        onChange={setTab}
        items={[
          {
            key: 'upload',
            label: 'Upload Image',
            children: (
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                <Upload.Dragger
                  multiple={false}
                  customRequest={handleCustomRequest}
                  showUploadList={false}
                  disabled={uploading}
                  accept="image/*"
                >
                  <p style={{ fontSize: 28, margin: 0, color: '#0f766e' }}>
                    {uploading ? <LoadingOutlined /> : <PictureOutlined />}
                  </p>
                  <p style={{ marginTop: 6, fontWeight: 500, fontSize: 14 }}>
                    {uploading ? 'Uploading image…' : 'Click or drag an image here to upload'}
                  </p>
                  <p style={{ color: '#64748b', fontSize: 12, margin: 0 }}>
                    JPG, PNG, WEBP, GIF, SVG
                  </p>
                </Upload.Dragger>
                <Input
                  placeholder="Alt text (for accessibility)"
                  value={alt}
                  onChange={(e) => setAlt(e.target.value)}
                />
                {src && (
                  <div style={{ marginTop: 8, padding: 12, border: '1px solid #e2e8f0', borderRadius: 8, background: '#f8fafc', textAlign: 'center' }}>
                    <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Tag color="green">Ready to insert</Tag>
                      <Text type="secondary" ellipsis style={{ maxWidth: 300, fontSize: 12 }}>{src}</Text>
                    </div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={alt || 'Preview'}
                      style={{
                        maxWidth: '100%',
                        maxHeight: 200,
                        objectFit: 'contain',
                        borderRadius: 6,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        display: 'inline-block',
                      }}
                    />
                  </div>
                )}
              </Space>
            ),
          },
          {
            key: 'url',
            label: 'From URL',
            children: (
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                <Input
                  placeholder="https://example.com/image.jpg"
                  value={src}
                  onChange={(e) => setSrc(e.target.value)}
                  autoFocus
                />
                <Input
                  placeholder="Alt text (optional)"
                  value={alt}
                  onChange={(e) => setAlt(e.target.value)}
                />
                {src && (
                  <div style={{ marginTop: 8, padding: 12, border: '1px solid #e2e8f0', borderRadius: 8, background: '#f8fafc', textAlign: 'center' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={alt || 'Preview'}
                      style={{
                        maxWidth: '100%',
                        maxHeight: 200,
                        objectFit: 'contain',
                        borderRadius: 6,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        display: 'inline-block',
                      }}
                    />
                  </div>
                )}
              </Space>
            ),
          },
        ]}
      />
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// PDF Modal
// ---------------------------------------------------------------------------
function PdfModal({ open, onClose, onInsert, onUpload }) {
  const [tab, setTab] = useState('upload');
  const [url, setUrl] = useState('');
  const [fid, setFid] = useState('');
  const [title, setTitle] = useState('');
  const [size, setSize] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (open) {
      setTab('upload');
      setUrl('');
      setFid('');
      setTitle('');
      setSize('');
      setUploading(false);
    }
  }, [open]);

  const apply = () => {
    if (!url && !fid) return;
    const docTitle = title || 'Document.pdf';
    const pdfHtml = createPdfCardHtml(url, docTitle, size, fid);
    onInsert(pdfHtml);
  };

  const handleCustomRequest = async ({ file, onSuccess, onError }) => {
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      message.error('Only PDF documents are supported.');
      onError?.(new Error('Invalid PDF file type'));
      return;
    }
    setUploading(true);
    try {
      const res = await onUpload(file, 'pdf');
      const fileUrl = res?.url;
      const fileFid = res?.fid;
      if (!fileUrl && !fileFid) throw new Error('No PDF URL or FID returned from upload handler');
      setUrl(fileUrl || '');
      setFid(fileFid || '');
      setTitle(res?.name || file.name);
      setSize(res?.size || formatBytes(file.size));
      message.success('PDF uploaded successfully');
      onSuccess?.(res);
    } catch (err) {
      message.error(err.message || 'PDF upload failed');
      onError?.(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal
      title={
        <Space>
          <FilePdfOutlined style={{ color: '#dc2626' }} />
          <span>Insert PDF Document</span>
        </Space>
      }
      open={open}
      onCancel={onClose}
      onOk={apply}
      okText="Insert PDF"
      okButtonProps={{ disabled: (!url && !fid) || uploading }}
      destroyOnClose
      width={540}
    >
      <Tabs
        activeKey={tab}
        onChange={setTab}
        items={[
          {
            key: 'upload',
            label: 'Upload PDF',
            children: (
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                <Upload.Dragger
                  multiple={false}
                  customRequest={handleCustomRequest}
                  showUploadList={false}
                  disabled={uploading}
                  accept=".pdf,application/pdf"
                >
                  <p style={{ fontSize: 28, margin: 0, color: '#dc2626' }}>
                    {uploading ? <LoadingOutlined /> : <FilePdfOutlined />}
                  </p>
                  <p style={{ marginTop: 6, fontWeight: 500, fontSize: 14 }}>
                    {uploading ? 'Uploading PDF…' : 'Click or drag a PDF document to upload'}
                  </p>
                  <p style={{ color: '#64748b', fontSize: 12, margin: 0 }}>
                    Adobe PDF (.pdf) · up to 50MB
                  </p>
                </Upload.Dragger>
                <Input
                  placeholder="Document Title (e.g. Annual Report.pdf)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                {(url || fid) && (
                  <div style={{ marginTop: 8, padding: 12, border: '1px solid #e2e8f0', borderRadius: 8, background: '#f8fafc' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Space>
                        <Tag color="green">Ready to insert</Tag>
                        <span style={{ fontWeight: 600, fontSize: 13 }}>{title}</span>
                      </Space>
                      {size && <Text type="secondary" style={{ fontSize: 12 }}>{size}</Text>}
                    </div>
                  </div>
                )}
              </Space>
            ),
          },
          {
            key: 'url',
            label: 'From URL',
            children: (
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                <Input
                  placeholder="https://example.com/document.pdf"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  autoFocus
                />
                <Input
                  placeholder="Document Title (e.g. Whitepaper.pdf)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Input
                  placeholder="File size (optional, e.g. 2.4 MB)"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                />
              </Space>
            ),
          },
        ]}
      />
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// Puck Block Configuration
// ---------------------------------------------------------------------------
export const RichText = {
  label: 'Rich text',
  fields: {
    html: {
      type: 'custom',
      label: 'HTML content',
      render: ({ name, value, onChange, readOnly }) => (
        <RichTextCustomField value={value} onChange={onChange} readOnly={readOnly} />
      ),
    },
    align: {
      type: 'radio',
      label: 'Alignment',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
      ],
    },
    maxWidth: {
      type: 'select',
      label: 'Max width',
      options: [
        { label: 'Narrow (680px)', value: 680 },
        { label: 'Comfortable (820px)', value: 820 },
        { label: 'Wide (940px)', value: 940 },
        { label: 'Full', value: 0 },
      ],
    },
  },
  defaultProps: {
    html: '<p>Body copy goes here. You can include <strong>bold</strong>, <em>italics</em>, <a href="#">links</a>, and <code>inline</code> styles.</p>',
    align: 'left',
    maxWidth: 820,
  },
  render: function RichTextRender({ html, align, maxWidth }) {
    const [previewPdf, setPreviewPdf] = useState(null);
    const { onFilePreview, renderPdfPreview } = useStudio();

    const handleClick = async (e) => {
      const btn = e.target.closest('.tps-pdf-preview-btn');
      if (btn) {
        e.preventDefault();
        e.stopPropagation();
        const fid = btn.getAttribute('data-pdf-fid') || '';
        let url = btn.getAttribute('data-pdf-url') || '';
        const title = btn.getAttribute('data-pdf-title') || 'Document.pdf';
        if (onFilePreview) {
          try {
            const fresh = await onFilePreview({ fid, url, title });
            if (typeof fresh === 'string' && fresh) url = fresh;
          } catch (err) {
            console.error('Failed to resolve preview URL in block:', err);
          }
        }
        setPreviewPdf({ fid, url, title });
        return;
      }

      const downloadBtn = e.target.closest('.tps-pdf-download-btn');
      if (downloadBtn) {
        const fid = downloadBtn.getAttribute('data-pdf-fid');
        const href = downloadBtn.getAttribute('href');
        if (fid && (!href || href === '#' || !href.startsWith('http'))) {
          e.preventDefault();
          e.stopPropagation();
          if (onFilePreview) {
            try {
              const fresh = await onFilePreview({ fid, url: href, title: downloadBtn.getAttribute('download') });
              if (typeof fresh === 'string' && fresh.startsWith('http')) {
                window.open(fresh, '_blank');
              }
            } catch (err) {
              console.error('Failed to resolve download URL in block:', err);
            }
          }
        }
      }
    };

    return (
      <section className="tps-section" style={{ paddingTop: 32, paddingBottom: 32 }}>
        <div
          className="tps-container tps-rich-body"
          style={{
            maxWidth: maxWidth || undefined,
            textAlign: align,
            color: 'var(--tps-ink-2)',
            lineHeight: 1.75,
            fontSize: 16.5,
          }}
          onClick={handleClick}
          dangerouslySetInnerHTML={{ __html: html }}
        />
        {previewPdf && (
          <Drawer
            title={
              <Space>
                <FilePdfOutlined style={{ color: '#dc2626' }} />
                <span>{previewPdf.title}</span>
              </Space>
            }
            placement="right"
            width="65vw"
            open={Boolean(previewPdf)}
            onClose={() => setPreviewPdf(null)}
            destroyOnClose
            extra={
              previewPdf.url ? (
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  href={previewPdf.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={previewPdf.title}
                >
                  Download
                </Button>
              ) : null
            }
          >
            {renderPdfPreview ? (
              renderPdfPreview(previewPdf)
            ) : (
              <div style={{ width: '100%', height: '100%', minHeight: 500, background: '#f8fafc' }}>
                <iframe
                  src={previewPdf.url}
                  title={previewPdf.title}
                  style={{ width: '100%', height: '100%', minHeight: 'calc(100vh - 120px)', border: 'none' }}
                />
              </div>
            )}
          </Drawer>
        )}
      </section>
    );
  },
};

