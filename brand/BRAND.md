# Page Studio — brand guidelines

A short, opinionated brand reference. Keep this file alongside `BLOCKS.md`
in the showcase repo.

## The logo

Three rounded rectangles stacked into a page composition: a wide hero
block over two column blocks. It is a literal picture of what authors
do in the editor — drop a hero, drop two columns, ship the page.

The mark works at 16 px (favicon) and reads cleanly inverted on dark
surfaces. The wordmark is `Page Studio` in Inter 500 with `−0.04em`
tracking, sitting beside or above the mark. The endorsement line
`by techrox` is set in Inter 400 at roughly 40% of the wordmark size,
in slate-500.

### Files

| File | Use |
|---|---|
| `page-studio-logo.svg` | Primary horizontal lockup. App header, README, marketing. |
| `page-studio-mark.svg` | Mark only, on light. Favicon, app icon, avatar. |
| `page-studio-mark-reverse.svg` | Mark only, on dark. Dark-theme headers, brand-blue surfaces. |

### Lockup rules

- **Clear space.** Maintain at least one X (block height) of empty
  space on all sides. Don't crowd the mark with other content.
- **Minimum size.** 40 px high for UI surfaces. 24 px for favicon.
  16 px is the absolute floor — below that the column blocks merge.
- **Orientation.** Always upright. Never rotate, mirror, or tilt.
- **Proportions.** Never stretch one axis. Scale the entire SVG
  uniformly.

## Color

Primary brand color is `#0b60d8` — Techrox blue. It is an **accent**,
not a surface. Use roughly 10% of any composition. Surfaces stay paper
white or cloud `#f8fafc`; type stays ink `#0f172a` or slate `#475569`.

### Tokens

```css
:root {
  /* Brand */
  --tps-primary:        #0b60d8;  /* Techrox blue — accent, links, buttons */
  --tps-primary-press:  #084aa8;  /* Active / pressed state */
  --tps-primary-hover:  #2778e0;  /* Hover state */
  --tps-primary-tint:   #bcd6f6;  /* Tinted blocks, secondary surfaces */
  --tps-primary-50:     #e7f0fc;  /* Subtle background tint */

  /* Ink ramp */
  --tps-ink:            #0f172a;  /* Body text, headings */
  --tps-slate:          #475569;  /* Secondary text */
  --tps-mute:           #94a3b8;  /* Captions, hints */

  /* Surfaces */
  --tps-paper:          #ffffff;  /* Default surface */
  --tps-cloud:          #f8fafc;  /* Inset / soft section */
  --tps-border:         #e2e8f0;  /* Hairlines, dividers */
}
```

### When to reach for primary blue

- Primary CTA buttons (`button_label` props)
- Links inside RichText and FAQ answers
- The `landing` Hero variant's gradient halo accent
- Selected / active states in the editor
- The active block in the mark — and nowhere else if the block is
  inactive

### When *not* to use primary blue

- Whole-section backgrounds (use cloud or dark ink instead)
- Body text — readability is worse than slate
- Surrounding a block that already has a strong color — it competes

## Typography

| Role | Family | Size / weight |
|---|---|---|
| Display | Inter | 36–48 / 500, tracking −1.1 |
| Heading | Inter | 22 / 500 |
| Body | Inter | 14–16 / 400, line-height 1.6 |
| Caption | Inter | 11–12 / 400 |
| Mono | JetBrains Mono | 12 / 400 (code, field names) |

Use sentence case everywhere except proper nouns. No ALL CAPS in
headings or eyebrows — set eyebrows in slate-500, 11 px, with a
small letter-spacing (`0.06em`).

Field names from the block library (`heading_html`, `image_position`,
`blockDefaults`) belong in monospace, not bold.

## Voice

Designer-friendly. Technical, not cold. Pragmatic.

Short sentences. Concrete examples. Show the field name. Skip the
marketing adjectives.

When describing a block, lead with what it is and what fields it has
— mirror the `BLOCKS.md` style. "Hero — eyebrow + heading + lede +
two CTAs" beats "A powerful hero section that captivates your
audience."

## Don'ts

1. **Don't stretch.** The mark is a fixed-ratio composition. Scale
   the SVG uniformly.
2. **Don't recolor.** Brand blue only. The columns are always the
   tint, never a different hue.
3. **Don't decorate.** No drop shadows, no glow, no gradients on the
   mark. The flatness is the brand.
4. **Don't rotate.** Always upright, always level.
5. **Don't crowd.** Respect the clear space rule. One X on every side.
6. **Don't put it on a busy photo.** Use a flat surface — paper,
   cloud, brand blue, or ink. If you need a photo, place the mark
   inside a paper-white plaque first.

## Endorsement line

`by techrox` is part of the primary lockup but optional in
constrained spaces (favicon, narrow nav bar). Drop it when the mark
sits next to other techrox branding that already makes the parent
relationship clear.
