// URL allow-list for editor inputs. Mirrors safeUrl in
// @techrox/page-studio-blocks/src/sanitize.js; the form package doesn't
// depend on blocks, so it keeps its own copy. Keep the two in sync.

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
