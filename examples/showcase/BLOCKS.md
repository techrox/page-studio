# Block reference

A designer-friendly tour of every block in `@techrox/page-studio-blocks`.
Grouped by sidebar category — same order the editor's components panel
uses. For each block: a one-line summary, the field list (admin labels +
types), when to reach for it, and short tips.

> **Heads-up.** Field labels here mirror what an author sees in the Puck
> sidebar. Internal prop names (e.g. `heading_html`, `image_position`)
> are what land on a Puck data object and what `blockDefaults` keys
> against in `createPuckConfig({ defaults })`.

## Categories at a glance

| Category | Blocks |
|---|---|
| **Page sections** | Hero · SectionHeader · CTABanner · Banner · AnnouncementBar · InlineCTA |
| **Content** | RichText · PrinciplesList · TwoColumn · ThreeColumn · ImageText · Quote · KeyValueList · Container · CodeBlock |
| **Cards** | IconCards · MetricCards · ImageOverlayCards |
| **Pricing** | PricingTable · PricingComparison |
| **Lists** | StatsStrip · CountUpStats · PillarsRow · ApproachSteps · StepsVertical · ServicesGrid · TeamGrid |
| **Articles** | ArticleFeatured · ArticleGrid · ArticleList |
| **Trust** | LogoStrip · PressMentions · AwardsBar · TestimonialQuote · TestimonialGrid |
| **Interactive** | FAQ · AccordionBlock · TabsBlock · Timeline · EventsList |
| **Media** | VideoEmbed · ImageGallery · ImageCaption · MapEmbed |
| **Forms** | ContactSection · NewsletterSignup · ContactInfo · SocialLinks |
| **Layout** | Spacer · Divider · RawHtml |

---

## Page sections

### Hero
> Eyebrow + large heading + lede + two CTAs. The opening section of any page.

**Category:** Page sections
**Fields:** `eyebrow` (text), `heading_html` (textarea — HTML allowed), `lede` (textarea), `primary_cta_label` / `primary_cta_href` (text + URL), `secondary_cta_label` / `secondary_cta_href` (text + URL), `align` (radio — left / center), `variant` (radio — landing / simple)

**When to use:** Top of a marketing/landing page. The `landing` variant has the radial-gradient halo background; use `simple` for sub-page heroes.

**Tips:**
- Keep `heading_html` to two lines max — use `<br />` for the line break.
- The `eyebrow` is your one-line positioning statement.
- Wrap a key word in `<em>…</em>` — the gradient treatment hits it nicely in landing variant.

### SectionHeader
> Eyebrow + heading + optional lede that introduces a major section.

**Category:** Page sections
**Fields:** `eyebrow` (text), `heading_html` (textarea — HTML allowed), `lede` (textarea), `align` (radio — left / center), `background` (radio — white / soft), `spacing` (radio — compact / standard / generous)

**When to use:** Introduces a major section below it. Pairs cleanly with PillarsRow, IconCards, ServicesGrid, TestimonialGrid.

**Tips:**
- Use `spacing: generous` to give the section room to breathe before the content block.

### CTABanner
> Full-width call-to-action with tagline, heading, body, and button.

**Category:** Page sections
**Fields:** `tagline` (text — small caps), `heading_html` (textarea — HTML allowed), `body` (textarea), `button_label` / `button_href` (text + URL), `background` (radio — soft / dark)

**When to use:** The conversion footer. Almost every page ends with one of these.

**Tips:**
- `background: dark` makes a strong visual full-stop. Use sparingly.

### Banner
> Full-width announcement strip — info / success / warning / dark variants. Optional CTA link.

**Category:** Page sections
**Fields:** `variant` (select — info / success / warning / dark), `label` (text — small left tag), `title` (text), `body` (text — one line), `link_label` / `link_href` (optional CTA)

**When to use:** A top-of-page or mid-page announcement strip. Hiring, event, launch.

### AnnouncementBar
> Slim full-width strip for announcements, beta access, event invites — dark / primary / accent variants.

**Category:** Page sections
**Fields:** `text` (text), `link_label` / `link_href` (optional inline link), `variant` (select — dark / primary / accent)

**When to use:** Site-wide promotional strip — usually pinned above the main nav.

### InlineCTA
> Compact one-line CTA strip — sits between content sections without dominating.

**Category:** Page sections
**Fields:** `headline` (text), `body` (text — one line), `button_label` / `button_href` (text + URL), `background` (radio — soft / primary)

**When to use:** Between content sections to nudge conversion without dominating like CTABanner does.

---

## Content

### RichText
> Body copy with HTML formatting — paragraphs, lists, links, headings.

**Category:** Content
**Fields:** `html` (textarea — HTML body), `align` (radio — left / center), `maxWidth` (number — px)

**When to use:** Anywhere you need paragraph copy with links, lists, or inline emphasis.

**Tips:**
- Use `align: center` and a narrow `maxWidth` (~640) for editorial sections.

### PrinciplesList
> Two-column layout: heading on the left, checkmark bullet list on the right.

**Category:** Content
**Fields:** `eyebrow` (text), `heading_html` (textarea — HTML allowed), `lede` (textarea), `label` (text — small caps list label), `items[]` (array — each: `text`)

**When to use:** A "what we believe" / "our commitments" section. Two-column layout pairs a heading + lede with a checkmark list.

### TwoColumn
> Generic side-by-side text columns with editable headings + body.

**Category:** Content
**Fields:** `left_heading` / `left_body` (text + textarea), `right_heading` / `right_body` (text + textarea), `background` (radio — white / soft)

**When to use:** Side-by-side text comparison — past/future, problem/solution, etc.

### ThreeColumn
> Generic 3-col text layout. Lighter than PillarsRow.

**Category:** Content
**Fields:** `eyebrow` / `heading` (text), `columns[]` (array — each: `title` (text), `body` (textarea))

**When to use:** Three parallel text columns. Lighter than PillarsRow (no icons).

### ImageText
> Image on one side, eyebrow + heading + body + CTA on the other.

**Category:** Content
**Fields:** `eyebrow` / `heading` / `body` (text + textarea), `image_url` / `image_alt` (text), `image_position` (radio — left / right), `cta_label` / `cta_href` (optional CTA)

**When to use:** Alternating feature sections. Flip the image side per section for rhythm.

### Quote
> Editorial pull-quote with optional attribution. Left-bordered or centered.

**Category:** Content
**Fields:** `text` (textarea), `cite` (text — attribution), `align` (radio — left / center)

**When to use:** An editorial pull-quote inside long-form content. Lighter than TestimonialQuote.

### KeyValueList
> Definition list / specs table.

**Category:** Content
**Fields:** `eyebrow` / `heading` (text), `items[]` (array — each: `key`, `value`)

**When to use:** Specs, deal terms, "what's included" lists.

### Container
> Decorative box wrapping a single titled callout (soft / primary tint / dark / white-with-border).

**Category:** Content
**Fields:** `eyebrow` / `heading` / `body_html` (text + textarea), `background` (select — soft / primary / dark / white)

**When to use:** A single titled callout against a background. Use it to break visual rhythm or highlight a paragraph.

### CodeBlock
> Monospace code snippet with title bar and language label.

**Category:** Content
**Fields:** `title` (text — title bar), `language` (text — language label), `code` (textarea — raw code)

**When to use:** Plain monospace code or a config snippet. No syntax highlighting — keep it short.

---

## Cards

### IconCards
> Compact icon + title + 1-line body cards. 2/3/4-col layouts.

**Category:** Cards
**Fields:** `eyebrow` / `heading` (text), `columns` (radio — 2 / 3 / 4), `items[]` (array — each: `icon` (name), `title`, `body`), `background` (radio — white / soft)

**When to use:** Compact "what you get" rundown. Lighter than PillarsRow.

### MetricCards
> Big-number cards with optional trend arrow + delta.

**Category:** Cards
**Fields:** `eyebrow` / `heading` (text), `items[]` (array — each: `value`, `label`, `delta`, `trend` (none/up/down)), `background` (radio — white / soft)

**When to use:** A "by the numbers" section. Big values with optional trend arrows.

### ImageOverlayCards
> Full-bleed image cards with text overlay. Click-through "category" / "explore" pattern.

**Category:** Cards
**Fields:** `eyebrow` / `heading` (text), `columns` (radio — 2 / 3), `items[]` (array — each: `image_url`, `tag`, `title`, `body`, `href`)

**When to use:** Category / "explore" cards with text over a tinted image. Click-through pattern.

---

## Pricing

### PricingTable
> 3-tier pricing cards with feature lists and per-tier CTAs.

**Category:** Pricing
**Fields:** `eyebrow` / `heading` (text), `tiers[]` (array — `name`, `price`, `period`, `description`, `features` (one per line), `cta_label` / `cta_href`, `highlighted` (radio))

**When to use:** Three-tier pricing display with feature lists and CTAs.

**Tips:**
- Set `highlighted: true` on exactly one tier — the "popular" one.

### PricingComparison
> Feature × tier comparison table — checkmarks/Xs or values per cell.

**Category:** Pricing
**Fields:** `eyebrow` / `heading` (text), `tiers[]` (array — each: `name`), `rows[]` (array — feature label + per-tier value (✓ / — / text))

**When to use:** Feature × tier matrix. Use after PricingTable when buyers need more detail.

---

## Lists

### StatsStrip
> Horizontal row of 3–5 stat cards (number + label).

**Category:** Lists
**Fields:** `items[]` (array — each: `value` (e.g. "120+"), `label`), `background` (radio — white / soft)

**When to use:** 3–5 small stats below a hero. Faster than CountUpStats; no animation.

### CountUpStats
> Animated stat counters that tick from 0 to value when scrolled into view.

**Category:** Lists
**Fields:** `eyebrow` / `heading` (text), `items[]` (array — each: `value` (numeric), `prefix`, `suffix`, `label`), `background` (radio — white / soft)

**When to use:** A dramatic "by the numbers" hero strip. Numbers tick into view.

### PillarsRow
> 2–4 column grid of icon + title + body cards.

**Category:** Lists
**Fields:** `columns` (radio — 2 / 3 / 4), `items[]` (array — each: `icon` (name), `title`, `text`), `background` (radio — white / soft)

**When to use:** The classic "three things that matter" section. Icon + title + body.

**Tips:**
- Use AntD icon names as strings (e.g. `"ToolOutlined"`). The block resolves them on render.

### ApproachSteps
> Numbered step-by-step breakdown (e.g. 01 Diagnose / 02 Design).

**Category:** Lists
**Fields:** `items[]` (array — each: `n` (e.g. "01"), `title`, `text`), `background` (radio — white / soft)

**When to use:** A "how we work" / "our process" section. Numbered, horizontal.

### StepsVertical
> Large vertical numbered steps with title + body.

**Category:** Lists
**Fields:** `eyebrow` / `heading` (text), `items[]` (array — each: `title`, `body`)

**When to use:** A heavier "how it works" — stacked, larger numbers, more body copy per step.

### ServicesGrid
> Auto-rendered grid of all (or first N) service capability cards.

**Category:** Lists
**Fields:** `eyebrow` / `heading` (text), `show` (radio — all / 4 / 6 / 8), `background` (radio — white / soft), *(content)* pulled from `services` in `StudioContext`

**When to use:** Auto-rendered service catalogue. Needs `services` in `StudioContext`.

**Tips:**
- Use `show: 6` on a landing page; full list on a /services index.

### TeamGrid
> 2/3/4-column team cards with photo, role, short bio, and LinkedIn link.

**Category:** Lists
**Fields:** `eyebrow` / `heading` (text), `columns` (radio — 2 / 3 / 4), `members[]` (array — each: `name`, `role`, `bio`, `image_url`, `linkedin`)

**When to use:** The team / leadership section.

---

## Articles

### ArticleFeatured
> Hero-style featured article — large image + tag + headline + excerpt + byline + CTA.

**Category:** Articles
**Fields:** `eyebrow` / `tag` / `headline` / `excerpt` (text + textarea), `image_url` / `image_alt` (text), `author` / `date` / `read_minutes` (text), `link_label` / `link_href` (text + URL), `image_position` (radio — left / right)

**When to use:** The "lead story" of a blog or news index.

### ArticleGrid
> 2- or 3-column article cards (cover + tag + headline + excerpt + byline).

**Category:** Articles
**Fields:** `eyebrow` / `heading` (text), `columns` (radio — 2 / 3), `items[]` (array — `image_url`, `tag`, `headline`, `excerpt`, `author`, `date`, `href`)

**When to use:** A blog index — image cards with tag, headline, excerpt.

### ArticleList
> Text-heavy article list (date + tag + headline + excerpt). Best for archives.

**Category:** Articles
**Fields:** `eyebrow` / `heading` (text), `items[]` (array — `date`, `tag`, `headline`, `excerpt`, `href`)

**When to use:** An archive page. Date + tag + headline + one-line excerpt. No images.

---

## Trust

### LogoStrip
> "Trusted by" row of client/partner logos. Falls back to brand-name text when no image is set.

**Category:** Trust
**Fields:** `heading` (text — small caps), `items[]` (array — `name` (text fallback), `image_url`, `link`), `background` (radio — white / soft)

**When to use:** "Trusted by" row of client logos. Falls back to text when no image is set.

### PressMentions
> "As featured in" press logos. Italic serif text fallback when no logos.

**Category:** Trust
**Fields:** `heading` (text), `items[]` (array — `name`, `image_url`, `link`, `quote`)

**When to use:** "As featured in" press logos. Italic serif text fallback.

### AwardsBar
> Row of certifications/awards with title + body + year.

**Category:** Trust
**Fields:** `heading` (text), `items[]` (array — `title`, `body`, `year`)

**When to use:** A row of certifications or awards with year + body. Trust signals.

### TestimonialQuote
> One large pull-quote with author photo, name, role, and company.

**Category:** Trust
**Fields:** `quote` (textarea), `author_name` / `author_role` / `author_company` (text), `author_image` (text — photo URL), `background` (radio — soft / dark)

**When to use:** One large pull-quote with attribution. Use for your strongest testimonial.

### TestimonialGrid
> 2- or 3-column grid of testimonial cards. Use for multi-voice social proof.

**Category:** Trust
**Fields:** `eyebrow` / `heading` (text), `columns` (radio — 2 / 3), `items[]` (array — `quote`, `author_name`, `author_role`, `author_company`, `author_image`)

**When to use:** Multi-voice social proof — 2 or 3 testimonials side by side.

---

## Interactive

### FAQ
> Accordion of question / answer items. HTML allowed in answers; one open at a time.

**Category:** Interactive
**Fields:** `eyebrow` / `heading` (text), `items[]` (array — `question`, `answer_html` (HTML))

**When to use:** Standard question/answer accordion. Most pages benefit from a 4–6 question FAQ.

### AccordionBlock
> Generic accordion (one or many open). For multi-section content beyond strict FAQ.

**Category:** Interactive
**Fields:** `eyebrow` / `heading` (text), `items[]` (array — `title`, `content_html` (HTML))

**When to use:** A generic accordion for product features, multi-section content.

### TabsBlock
> Tabbed content panel — switch between named sections of HTML content.

**Category:** Interactive
**Fields:** `eyebrow` / `heading` (text), `items[]` (array — `label`, `content_html` (HTML))

**When to use:** Tabbed content panel — switch between named sections.

### Timeline
> Vertical chronological list — date + title + body.

**Category:** Interactive
**Fields:** `eyebrow` / `heading` (text), `items[]` (array — `date`, `title`, `body`), `background` (radio — white / soft)

**When to use:** Vertical chronological story — company history, project milestones, "what happens next".

### EventsList
> Upcoming events with date pill + title + venue + RSVP CTA.

**Category:** Interactive
**Fields:** `eyebrow` / `heading` (text), `items[]` (array — `date_short`, `date_long`, `title`, `body`, `venue`, `cta_label`, `cta_href`)

**When to use:** Upcoming events with date pill, venue, RSVP CTA.

---

## Media

### VideoEmbed
> Responsive YouTube or Vimeo embed with optional caption.

**Category:** Media
**Fields:** `video_url` (text — YouTube or Vimeo URL), `caption` (text), `max_width` (select — 720 / 940 / 1080), `background` (radio — white / soft)

**When to use:** A product demo, customer-story video, or recorded talk.

### ImageGallery
> Photo grid with click-to-enlarge lightbox.

**Category:** Media
**Fields:** `eyebrow` / `heading` (text), `columns` (radio — 2 / 3 / 4), `items[]` (array — `image_url`, `alt`, `caption`)

**When to use:** Photo grid with click-to-enlarge lightbox.

### ImageCaption
> Single image with caption and optional photo credit.

**Category:** Media
**Fields:** `image_url` / `alt` (text), `caption` / `credit` (text), `max_width` (select — 640 / 820 / 940 / full bleed)

**When to use:** A single editorial image with caption and optional credit.

### MapEmbed
> Google Maps iframe embed with caption.

**Category:** Media
**Fields:** `embed_url` (text — Google Maps embed URL), `height` (select — 280 / 420 / 560), `caption` (text)

**When to use:** Show your office location. Paste the Maps "embed a map > HTML" iframe src.

---

## Forms

### ContactSection
> Hero + sidebar info cards + lead-capture form.

**Category:** Forms
**Fields:** `hero_eyebrow` / `hero_heading` / `hero_lede` (text + textarea), `sidebar_heading` / `response_label` / `response_body` (text + textarea), `form_submit_label` / `form_privacy_html` (text + HTML), `success_heading` / `success_body` (text + textarea), `stages[]` (array — each: `text` (interest dropdown options)), `contact_email` (text — fallback display email)

**When to use:** The all-in-one contact page block. Hero + sidebar + lead-capture form.

**Tips:**
- Wire `submitLead` in your `StudioContext` or the form will throw on submit.

### NewsletterSignup
> Single-field email capture.

**Category:** Forms
**Fields:** `eyebrow` / `heading` / `body` (text + textarea), `button_label` / `success_message` (text), `background` (radio — white / soft / dark)

**When to use:** A single-field email capture. Submits via `subscribeNewsletter` in `StudioContext`.

### ContactInfo
> Office address + email + phone + hours card. No form, just info.

**Category:** Forms
**Fields:** `eyebrow` / `heading` (text), `email` / `phone` / `hours` (text), `address` (textarea — multi-line), `background` (radio — white / soft)

**When to use:** Address + email + phone + hours. No form, just info.

### SocialLinks
> Row of social-network icon links — LinkedIn, X, YouTube, etc.

**Category:** Forms
**Fields:** `label` (text — caption, e.g. "Follow us"), `align` (radio — left / center), `links{}` (object — `linkedin` / `twitter` / `youtube` / `instagram` / `facebook` / `github`)

**When to use:** Ad-hoc social icon row. Different from the site-wide footer social.

---

## Layout

### Spacer
> Pure vertical whitespace between blocks.

**Category:** Layout
**Fields:** `height` (select — 16 / 32 / 56 / 96 / 140 px)

**When to use:** Explicit vertical whitespace between blocks when section padding isn't enough.

### Divider
> Horizontal divider with optional centered label.

**Category:** Layout
**Fields:** `label` (text — optional center label), `style` (select — hairline / dashed / thick / dot)

**When to use:** A horizontal divider with an optional centered label. Use to break long pages.

### RawHtml
> Escape hatch — paste in any HTML when you need something the library doesn't cover.

**Category:** Layout
**Fields:** `html` (textarea — arbitrary HTML), `contained` (radio — inside container / full bleed)

**When to use:** Escape hatch for embeds the library doesn't cover — Calendly, Tally, custom HTML.
