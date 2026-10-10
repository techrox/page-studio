// Small, dependency-free helpers for values that blocks put into HTML or
// URLs. Kept regex-light on purpose: author input can be arbitrarily long,
// and backtracking patterns on it are a slow-render risk.

// Escape text for use inside HTML element content or a quoted attribute.
export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Drop everything between `<` and `>` and return plain text. A character
// scan rather than a regex, so it can't be tricked by nested or unclosed
// tags and stays linear on long input. Output is for text nodes only.
export function stripTags(html) {
  const input = String(html ?? '');
  let out = '';
  let inTag = false;
  for (let i = 0; i < input.length; i += 1) {
    const ch = input[i];
    if (ch === '<') inTag = true;
    else if (ch === '>' && inTag) inTag = false;
    else if (!inTag) out += ch;
  }
  return out;
}

// Path comparison key for active-menu matching: drop query and hash, trim
// trailing slashes. '' for empty input, '/' for the root.
export function normalizePath(path) {
  if (!path) return '';
  let clean = String(path).split('?')[0].split('#')[0];
  let end = clean.length;
  while (end > 0 && clean[end - 1] === '/') end -= 1;
  clean = clean.slice(0, end);
  return clean || '/';
}

const DATA_IMAGE = ['data:image/png', 'data:image/jpeg', 'data:image/jpg', 'data:image/gif', 'data:image/webp', 'data:image/avif', 'data:image/bmp'];
const DATA_PDF = ['data:application/pdf'];

// Return `url` when it's safe for the given sink, otherwise ''.
//   'image' - <img src>: http(s), relative, blob:, raster data: images
//   'pdf'   - <iframe src> / download links: http(s), relative, blob:, data:application/pdf
//   'link'  - <a href>: http(s), relative, mailto:, tel:
// SVG data URLs are refused: they can carry script.
export function safeUrl(url, kind = 'link') {
  const value = String(url ?? '').trim();
  if (!value) return '';

  // Relative URLs (path, query, hash) have no scheme to abuse. Reject
  // protocol-relative `//host` so it can't smuggle another origin.
  if (value[0] === '/' && value[1] !== '/') return value;
  if (value[0] === '.' || value[0] === '?' || value[0] === '#') return value;

  const lower = value.toLowerCase();
  if (lower.startsWith('https://') || lower.startsWith('http://')) return value;

  if (kind === 'image') {
    if (lower.startsWith('blob:')) return value;
    if (DATA_IMAGE.some((prefix) => lower.startsWith(`${prefix};`) || lower.startsWith(`${prefix},`))) return value;
    return '';
  }
  if (kind === 'pdf') {
    if (lower.startsWith('blob:')) return value;
    if (DATA_PDF.some((prefix) => lower.startsWith(`${prefix};`) || lower.startsWith(`${prefix},`))) return value;
    return '';
  }
  if (lower.startsWith('mailto:') || lower.startsWith('tel:')) return value;

  // Bare relative paths like `about` or `docs/guide.pdf` (no scheme).
  const colon = value.indexOf(':');
  const slash = value.indexOf('/');
  if (colon === -1 || (slash !== -1 && slash < colon)) return value;
  return '';
}
