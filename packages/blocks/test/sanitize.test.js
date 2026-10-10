import { describe, it, expect } from 'vitest';

import { escapeHtml, stripTags, normalizePath, safeUrl } from '../src/sanitize.js';
import { Marquee } from '../src/blocks/Marquee.jsx';
import { Notifications } from '../src/blocks/Notifications.jsx';

describe('escapeHtml', () => {
  it('escapes markup and both quote styles', () => {
    expect(escapeHtml(`a" onerror="x" <b>'&`)).toBe(
      'a&quot; onerror=&quot;x&quot; &lt;b&gt;&#39;&amp;',
    );
  });

  it('treats null and undefined as empty', () => {
    expect(escapeHtml(null)).toBe('');
    expect(escapeHtml(undefined)).toBe('');
  });
});

describe('stripTags', () => {
  it('removes tags and keeps text', () => {
    expect(stripTags('New <strong>update</strong> <a href="/x">here</a>')).toBe('New update here');
  });

  it('drops an unclosed tag instead of leaking it', () => {
    expect(stripTags('safe <script')).toBe('safe ');
    expect(stripTags('<<script>script>alert(1)')).toBe('script>alert(1)');
    expect(stripTags('<<script>script>alert(1)')).not.toContain('<');
  });

  it('stays fast on long runs of "<"', () => {
    const start = Date.now();
    stripTags('<'.repeat(200000));
    expect(Date.now() - start).toBeLessThan(500);
  });
});

describe('normalizePath', () => {
  it('drops query, hash and trailing slashes', () => {
    expect(normalizePath('/about/?a=1#top')).toBe('/about');
    expect(normalizePath('/docs///')).toBe('/docs');
  });

  it('keeps the root and handles empty input', () => {
    expect(normalizePath('/')).toBe('/');
    expect(normalizePath('///')).toBe('/');
    expect(normalizePath('')).toBe('');
  });

  it('stays fast on long runs of "/"', () => {
    const start = Date.now();
    normalizePath(`/a${'/'.repeat(100000)}x`);
    expect(Date.now() - start).toBeLessThan(500);
  });
});

describe('safeUrl', () => {
  it('allows http(s) and relative URLs for every kind', () => {
    for (const kind of ['image', 'pdf', 'link']) {
      expect(safeUrl('https://cdn.example.com/a.png', kind)).toBe('https://cdn.example.com/a.png');
      expect(safeUrl('http://example.com/a', kind)).toBe('http://example.com/a');
      expect(safeUrl('/files/a.pdf', kind)).toBe('/files/a.pdf');
      expect(safeUrl('./a.png', kind)).toBe('./a.png');
      expect(safeUrl('#section', kind)).toBe('#section');
    }
  });

  it('blocks script URLs, whatever the case or padding', () => {
    for (const kind of ['image', 'pdf', 'link']) {
      expect(safeUrl('javascript:alert(1)', kind)).toBe('');
      expect(safeUrl('  JavaScript:alert(1)', kind)).toBe('');
      expect(safeUrl('vbscript:msgbox(1)', kind)).toBe('');
    }
  });

  it('blocks protocol-relative URLs', () => {
    expect(safeUrl('//evil.example.com/x.png', 'image')).toBe('');
  });

  it('allows raster data images but not SVG', () => {
    expect(safeUrl('data:image/png;base64,AAAA', 'image')).toBe('data:image/png;base64,AAAA');
    expect(safeUrl('data:image/svg+xml;base64,AAAA', 'image')).toBe('');
    expect(safeUrl('data:text/html,<script>1</script>', 'image')).toBe('');
  });

  it('allows blob: and PDF data URLs for PDFs only', () => {
    expect(safeUrl('blob:https://example.com/1234', 'pdf')).toBe('blob:https://example.com/1234');
    expect(safeUrl('data:application/pdf;base64,AAAA', 'pdf')).toBe('data:application/pdf;base64,AAAA');
    expect(safeUrl('data:application/pdf;base64,AAAA', 'image')).toBe('');
    expect(safeUrl('data:text/html,hi', 'pdf')).toBe('');
  });

  it('allows mailto: and tel: for links only', () => {
    expect(safeUrl('mailto:contact@example.com', 'link')).toBe('mailto:contact@example.com');
    expect(safeUrl('tel:+15552345678', 'link')).toBe('tel:+15552345678');
    expect(safeUrl('mailto:contact@example.com', 'image')).toBe('');
  });

  it('allows bare relative paths for links', () => {
    expect(safeUrl('about', 'link')).toBe('about');
    expect(safeUrl('docs/a:b', 'link')).toBe('docs/a:b');
  });

  it('returns empty for empty input', () => {
    expect(safeUrl('', 'image')).toBe('');
    expect(safeUrl(null, 'link')).toBe('');
  });
});

describe('editor item summaries use stripTags', () => {
  it('Marquee summary shows plain text', () => {
    const summary = Marquee.fields.items.getItemSummary({ order: 2, text: 'Read <a href="/x">the notes</a>' }, 0);
    expect(summary).toBe('[#2] Read the notes...');
  });

  it('Notifications summary shows plain text', () => {
    const summary = Notifications.fields.items.getItemSummary({ order: 1, is_new: true, text: '<strong>Upgrade</strong> tonight' }, 0);
    expect(summary).toBe('[NEW] [#1] Upgrade tonight...');
  });
});
