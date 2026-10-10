// Designer-friendly metadata for every block: category, one-line summary,
// human-readable field list, "when to use" guidance, and optional tips.
//
// The summary comes from BLOCK_DESCRIPTIONS in @techrox/page-studio-blocks
// (re-exported here so BLOCKS.md can be regenerated from one place). The
// fields/tips are hand-written for designer audiences -- they intentionally
// don't dump source.

import { BLOCK_DESCRIPTIONS, defaultCategories } from '@techrox/page-studio-blocks'

// Walk defaultCategories to derive a flat name → category map.
export const BLOCK_CATEGORY = (() => {
  const map = {}
  for (const [cat, def] of Object.entries(defaultCategories)) {
    for (const name of def.components || []) map[name] = cat
  }
  return map
})()

// Per-block field manifests -- text labels + type hints, designer-friendly.
// Kept in this file (not derived from the source) so the docs stay
// human-readable when a block adds an obscure internal field.
export const BLOCK_FIELDS = {
  ContactNavigationHeader: [
    ['showTopBar', 'radio -- show the contact bar above the nav'],
    ['phones / emails', 'arrays shown in the top bar and the mobile drawer'],
    ['timing_text', 'text -- office hours or a short announcement badge'],
    ['topBarVariant / topBarBackgroundColor', 'select -- primary / dark / soft / light, or a custom colour'],
    ['logo_url / logo_alt / logo_text / logo_href / logo_height', 'logo image, alt text, brand text fallback, link, height'],
    ['menus', 'array of menu items with optional child dropdowns'],
    ['login_label / login_href', 'login button label and link'],
    ['cta_label / cta_href', 'optional CTA button label and link'],
    ['variant / backgroundColor', 'select -- nav bar theme, plus a custom background colour'],
    ['sticky', 'radio -- sticky header'],
  ],
  FooterNavigation: [
    ['fullWidth', 'radio -- run the footer edge to edge'],
    ['background / backgroundColor', 'select -- dark / white / soft / navy / gradient / custom, plus a custom value'],
    ['accentColor / textColor', 'colour overrides for link hover, icons and text'],
    ['logo_url / logo_alt / logo_text / logo_href / logo_height', 'logo image, alt text, brand text fallback, link, height'],
    ['legal_name / address / email / phone', 'organisation details; email and phone are clickable'],
    ['social_links', 'array of social profile links'],
    ['columns', 'array of link columns, each with a heading and links'],
    ['show_divider', 'radio -- line above the bottom bar'],
    ['copyright_text / bottom_links', 'copyright line and small legal links'],
  ],
  Notifications: [
    ['title / badge_text', 'card title and header pill (e.g. "Notice board")'],
    ['items', "array -- text, 'NEW' tag, order, date, optional action link"],
    ['direction / speed / pauseOnHover', 'auto-scroll up / down / left / right, seconds per cycle, pause on hover'],
    ['height / maxWidth', 'scroll area height and card width'],
    ['variant / showBorder / headerBackground', 'card theme, border, header colour'],
    ['viewAllLink / viewAllText', 'optional "View all" link'],
    ['backgroundColor / textColor', 'custom colours'],
  ],
  ImageCarousel: [
    ['layout', 'select -- carousel only, or split with side content left or right'],
    ['partition_type / partition_ratio', 'side content (content / image / both) and split ratio'],
    ['partition_eyebrow / partition_title / partition_description', 'side content copy'],
    ['partition_cta_* / partition_secondary_cta_*', 'side content buttons'],
    ['partition_image_url / partition_image_alt', 'side image'],
    ['eyebrow / heading / subheading', 'optional section header above the carousel'],
    ['items', 'array of slides -- image, caption, link'],
    ['height / autoplay / autoplaySpeed / effect', 'slide height, autoplay and its interval, slide or fade'],
    ['arrows / dots / overlay', 'navigation controls and image overlay'],
    ['fullWidth / maxWidth / borderRadius', 'width and corner radius'],
    ['background / background_image / background_overlay', 'section background'],
  ],
  ContactHeader: [
    ['phones', 'array of phone numbers (max 3)'],
    ['emails', 'array of email addresses (max 3)'],
    ['logo_url / logo_text / logo_href', 'image URL, brand text fallback, link'],
    ['isLoggedIn', 'radio -- logged in (profile icon) / logged out (login button)'],
    ['login_label / login_href', 'login button label and link'],
    ['enquiry_label / enquiry_href', 'enquiry button label and link'],
    ['variant', 'select -- light / soft / dark / transparent'],
    ['sticky', 'radio -- sticky header'],
  ],
  NavigationHeader: [
    ['logo_url / logo_text / logo_href', 'image URL, brand text fallback, link'],
    ['menus', 'array of menu items with optional child dropdowns'],
    ['isLoggedIn', 'radio -- logged in (profile icon) / logged out (login button)'],
    ['login_label / login_href', 'login button label and link'],
    ['cta_label / cta_href', 'optional secondary CTA button label and link'],
    ['variant', 'select -- light / soft / dark / transparent'],
    ['backgroundColor', 'custom background color hex/CSS'],
    ['sticky', 'radio -- sticky header'],
  ],
  MastheadHeader: [
    ['title / subtitle', 'primary (left) title and the line under it'],
    ['title_alt / subtitle_alt', 'secondary (right) title and subtitle, e.g. a translation'],
    ['crest_url / crest_alt / crest_href', 'centre crest image URL, alt text, link (monogram fallback when empty)'],
    ['crest_size', 'number -- crest diameter in px'],
    ['menus', 'array of menu items split either side of the crest, optional child dropdowns'],
    ['sticky', 'radio -- sticky header'],
    ['shrink_on_scroll / shrink_after', 'radio -- compact on scroll + scroll distance in px before it kicks in'],
    ['title_color / bar_color / bar_text_color', 'custom hex or CSS colors (empty = brand default)'],
    ['variant', 'select -- light / soft / transparent band background'],
    ['backgroundColor / maxWidth', 'custom band background color and content max width'],
  ],
  Marquee: [
    ['badge_text', 'text -- optional pill/badge at start of ticker'],
    ['items', 'array -- order (number), text (HTML with links), link_label, link_href'],
    ['speed', 'number -- seconds per cycle'],
    ['direction', 'select -- left / right'],
    ['pauseOnHover', 'radio -- pause ticker on hover'],
    ['separator', 'select -- bullet / pipe / star / slash / none'],
    ['variant', 'select -- primary / dark / soft / light / accent'],
    ['backgroundColor / textColor', 'custom hex or CSS colors'],
  ],
  PopupModal: [
    ['heading / eyebrow', 'text + subtitle'],
    ['body_html', 'textarea -- HTML body copy with links'],
    ['image_url / image_alt', 'image URL, alt text'],
    ['image_position', 'select -- top banner / left side / hidden'],
    ['primary_cta_label / primary_cta_href', 'primary action button'],
    ['secondary_cta_label / secondary_cta_href', 'optional secondary action button'],
    ['delay', 'number -- seconds before opening on page load'],
    ['show_frequency', 'select -- always / once_per_session / once_ever'],
    ['variant / backgroundColor', 'theme and custom colors'],
  ],
  Hero: [
    ['eyebrow', 'text'],
    ['heading_html', 'textarea -- HTML allowed'],
    ['lede', 'textarea'],
    ['primary_cta_label / primary_cta_href', 'text + URL'],
    ['secondary_cta_label / secondary_cta_href', 'text + URL'],
    ['align', 'radio -- left / center'],
    ['variant', 'radio -- landing (gradient halo) / simple'],
  ],
  SectionHeader: [
    ['eyebrow', 'text'],
    ['heading_html', 'textarea -- HTML allowed'],
    ['lede', 'textarea'],
    ['align', 'radio -- left / center'],
    ['background', 'radio -- white / soft'],
    ['spacing', 'radio -- compact / standard / generous'],
  ],
  CTABanner: [
    ['tagline', 'text -- small caps'],
    ['heading_html', 'textarea -- HTML allowed'],
    ['body', 'textarea'],
    ['button_label / button_href', 'text + URL'],
    ['background', 'radio -- soft / dark'],
  ],
  Banner: [
    ['variant', 'select -- info / success / warning / dark'],
    ['label', 'text -- small left tag'],
    ['title', 'text'],
    ['body', 'text -- one line'],
    ['link_label / link_href', 'optional CTA'],
  ],
  AnnouncementBar: [
    ['text', 'text'],
    ['link_label / link_href', 'optional inline link'],
    ['variant', 'select -- dark / primary / accent'],
  ],
  InlineCTA: [
    ['headline', 'text'],
    ['body', 'text -- one line'],
    ['button_label / button_href', 'text + URL'],
    ['background', 'radio -- soft / primary'],
  ],
  RichText: [
    ['html', 'textarea -- HTML body'],
    ['align', 'radio -- left / center'],
    ['maxWidth', 'number -- px'],
  ],
  PrinciplesList: [
    ['eyebrow', 'text'],
    ['heading_html', 'textarea -- HTML allowed'],
    ['lede', 'textarea'],
    ['label', 'text -- small caps list label'],
    ['items[]', 'array -- each: text'],
  ],
  TwoColumn: [
    ['left_heading / left_body', 'text + textarea'],
    ['right_heading / right_body', 'text + textarea'],
    ['background', 'radio -- white / soft'],
  ],
  ThreeColumn: [
    ['eyebrow / heading', 'text'],
    ['columns[]', 'array -- each: title (text), body (textarea)'],
  ],
  ImageText: [
    ['eyebrow / heading / body', 'text + textarea'],
    ['image_url / image_alt', 'text'],
    ['image_position', 'radio -- left / right'],
    ['cta_label / cta_href', 'optional CTA'],
  ],
  Quote: [
    ['text', 'textarea'],
    ['cite', 'text -- attribution'],
    ['align', 'radio -- left / center'],
  ],
  KeyValueList: [
    ['eyebrow / heading', 'text'],
    ['items[]', 'array -- each: key, value'],
  ],
  Container: [
    ['eyebrow / heading / body_html', 'text + textarea'],
    ['background', 'select -- soft / primary / dark / white'],
  ],
  CodeBlock: [
    ['title', 'text -- title bar'],
    ['language', 'text -- language label'],
    ['code', 'textarea -- raw code'],
  ],
  IconCards: [
    ['eyebrow / heading', 'text'],
    ['columns', 'radio -- 2 / 3 / 4'],
    ['items[]', 'array -- each: icon (name), title, body'],
    ['background', 'radio -- white / soft'],
  ],
  MetricCards: [
    ['eyebrow / heading', 'text'],
    ['items[]', 'array -- each: value, label, delta, trend (none/up/down)'],
    ['background', 'radio -- white / soft'],
  ],
  ImageOverlayCards: [
    ['eyebrow / heading', 'text'],
    ['columns', 'radio -- 2 / 3'],
    ['items[]', 'array -- each: image_url, tag, title, body, href'],
  ],
  PricingTable: [
    ['eyebrow / heading', 'text'],
    ['tiers[]', 'array -- name, price, period, description, features (one per line), cta_*, highlighted'],
  ],
  PricingComparison: [
    ['eyebrow / heading', 'text'],
    ['tiers[]', 'array -- each: name'],
    ['rows[]', 'array -- feature label + per-tier value (✓ / -- / text)'],
  ],
  StatsStrip: [
    ['items[]', 'array -- each: value (e.g. "120+"), label'],
    ['background', 'radio -- white / soft'],
  ],
  CountUpStats: [
    ['eyebrow / heading', 'text'],
    ['items[]', 'array -- each: value (numeric), prefix, suffix, label'],
    ['background', 'radio -- white / soft'],
  ],
  PillarsRow: [
    ['columns', 'radio -- 2 / 3 / 4'],
    ['items[]', 'array -- each: icon (name), title, text'],
    ['background', 'radio -- white / soft'],
  ],
  ApproachSteps: [
    ['items[]', 'array -- each: n (e.g. "01"), title, text'],
    ['background', 'radio -- white / soft'],
  ],
  StepsVertical: [
    ['eyebrow / heading', 'text'],
    ['items[]', 'array -- each: title, body'],
  ],
  ServicesGrid: [
    ['eyebrow / heading', 'text'],
    ['show', 'radio -- all / 4 / 6 / 8'],
    ['background', 'radio -- white / soft'],
    ['(content)', 'pulled from `services` in StudioContext'],
  ],
  TeamGrid: [
    ['eyebrow / heading', 'text'],
    ['columns', 'radio -- 2 / 3 / 4'],
    ['members[]', 'array -- each: name, role, bio, image_url, linkedin'],
  ],
  ArticleFeatured: [
    ['eyebrow / tag / headline / excerpt', 'text + textarea'],
    ['image_url / image_alt', 'text'],
    ['author / date / read_minutes', 'text'],
    ['link_label / link_href', 'text + URL'],
    ['image_position', 'radio -- left / right'],
  ],
  ArticleGrid: [
    ['eyebrow / heading', 'text'],
    ['columns', 'radio -- 2 / 3'],
    ['items[]', 'array -- image_url, tag, headline, excerpt, author, date, href'],
  ],
  ArticleList: [
    ['eyebrow / heading', 'text'],
    ['items[]', 'array -- date, tag, headline, excerpt, href'],
  ],
  LogoStrip: [
    ['heading', 'text -- small caps'],
    ['items[]', 'array -- name (text fallback), image_url, link'],
    ['background', 'radio -- white / soft'],
  ],
  PressMentions: [
    ['heading', 'text'],
    ['items[]', 'array -- name, image_url, link, quote'],
  ],
  AwardsBar: [
    ['heading', 'text'],
    ['items[]', 'array -- title, body, year'],
  ],
  TestimonialQuote: [
    ['quote', 'textarea'],
    ['author_name / author_role / author_company', 'text'],
    ['author_image', 'text -- photo URL'],
    ['background', 'radio -- soft / dark'],
  ],
  TestimonialGrid: [
    ['eyebrow / heading', 'text'],
    ['columns', 'radio -- 2 / 3'],
    ['items[]', 'array -- quote, author_name, author_role, author_company, author_image'],
  ],
  FAQ: [
    ['eyebrow / heading', 'text'],
    ['items[]', 'array -- question, answer_html (HTML)'],
  ],
  AccordionBlock: [
    ['eyebrow / heading', 'text'],
    ['items[]', 'array -- title, content_html (HTML)'],
  ],
  TabsBlock: [
    ['eyebrow / heading', 'text'],
    ['items[]', 'array -- label, content_html (HTML)'],
  ],
  Timeline: [
    ['eyebrow / heading', 'text'],
    ['items[]', 'array -- date, title, body'],
    ['background', 'radio -- white / soft'],
  ],
  EventsList: [
    ['eyebrow / heading', 'text'],
    ['items[]', 'array -- date_short, date_long, title, body, venue, cta_label, cta_href'],
  ],
  VideoEmbed: [
    ['video_url', 'text -- YouTube or Vimeo URL'],
    ['caption', 'text'],
    ['max_width', 'select -- 720 / 940 / 1080'],
    ['background', 'radio -- white / soft'],
  ],
  ImageGallery: [
    ['eyebrow / heading', 'text'],
    ['columns', 'radio -- 2 / 3 / 4'],
    ['items[]', 'array -- image_url, alt, caption'],
  ],
  ImageCaption: [
    ['image_url / alt', 'text'],
    ['caption / credit', 'text'],
    ['max_width', 'select -- 640 / 820 / 940 / full bleed'],
  ],
  MapEmbed: [
    ['embed_url', 'text -- Google Maps embed URL'],
    ['height', 'select -- 280 / 420 / 560'],
    ['caption', 'text'],
  ],
  ContactSection: [
    ['hero_eyebrow / hero_heading / hero_lede', 'text + textarea'],
    ['sidebar_heading / response_label / response_body', 'text + textarea'],
    ['form_submit_label / form_privacy_html', 'text + HTML'],
    ['success_heading / success_body', 'text + textarea'],
    ['stages[]', 'array -- each: text (interest dropdown options)'],
    ['contact_email', 'text -- fallback display email'],
  ],
  NewsletterSignup: [
    ['eyebrow / heading / body', 'text + textarea'],
    ['button_label / success_message', 'text'],
    ['background', 'radio -- white / soft / dark'],
  ],
  ContactInfo: [
    ['eyebrow / heading', 'text'],
    ['email / phone / hours', 'text'],
    ['address', 'textarea -- multi-line'],
    ['background', 'radio -- white / soft'],
  ],
  SocialLinks: [
    ['label', 'text -- caption (e.g. "Follow us")'],
    ['align', 'radio -- left / center'],
    ['links{}', 'object -- linkedin / twitter / youtube / instagram / facebook / github'],
  ],
  FormContact: [
    ['form_heading / form_lede', 'text + textarea -- optional header above the form'],
    ['form_submit_label', 'text'],
    ['form_privacy_html', 'textarea -- HTML privacy notice'],
    ['success_heading / success_body', 'text + textarea'],
    ['fields[]', 'array -- field_type, field_key, label, placeholder, required, width (full/half), options, default_value, help_text, validation'],
  ],
  FormLeadCapture: [
    ['form_heading / form_lede', 'text + textarea'],
    ['form_submit_label', 'text'],
    ['form_privacy_html', 'textarea -- HTML'],
    ['success_heading / success_body', 'text + textarea'],
    ['fields[]', 'array -- same schema as FormContact'],
  ],
  FormNewsletter: [
    ['form_heading / form_lede', 'text + textarea'],
    ['form_submit_label', 'text'],
    ['success_heading / success_body', 'text + textarea'],
    ['fields[]', 'array -- defaults: name, email, consent checkbox'],
  ],
  FormFeedback: [
    ['form_heading / form_lede', 'text + textarea'],
    ['form_submit_label', 'text'],
    ['success_heading / success_body', 'text + textarea'],
    ['fields[]', 'array -- defaults: rating (stars), category select, comments, optional name/email'],
  ],
  FormSurvey: [
    ['form_heading / form_lede', 'text + textarea'],
    ['form_submit_label', 'text'],
    ['success_heading / success_body', 'text + textarea'],
    ['fields[]', 'array -- fully configurable; defaults to NPS-style survey'],
  ],
  FormBooking: [
    ['form_heading / form_lede', 'text + textarea'],
    ['form_submit_label', 'text'],
    ['success_heading / success_body', 'text + textarea'],
    ['fields[]', 'array -- defaults: name, email, company, date picker, time slot select, notes'],
  ],
  FormRegistration: [
    ['form_heading / form_lede', 'text + textarea'],
    ['form_submit_label', 'text'],
    ['success_heading / success_body', 'text + textarea'],
    ['fields[]', 'array -- defaults: name, email, phone, company, role, t-shirt size, dietary select, notes'],
  ],
  FormQuoteRequest: [
    ['form_heading / form_lede', 'text + textarea'],
    ['form_submit_label', 'text'],
    ['success_heading / success_body', 'text + textarea'],
    ['fields[]', 'array -- defaults: company, name, email, phone, project type, budget, timeline, requirements'],
  ],
  FormApplication: [
    ['form_heading / form_lede', 'text + textarea'],
    ['form_submit_label', 'text'],
    ['success_heading / success_body', 'text + textarea'],
    ['fields[]', 'array -- defaults: name, email, phone, LinkedIn, portfolio URL, role select, cover note, CV upload'],
  ],
  FormSupport: [
    ['form_heading / form_lede', 'text + textarea'],
    ['form_submit_label', 'text'],
    ['success_heading / success_body', 'text + textarea'],
    ['fields[]', 'array -- defaults: name, email, category, priority, subject, description, attachment upload'],
  ],
  FormWaitlist: [
    ['form_heading / form_lede', 'text + textarea'],
    ['form_submit_label', 'text'],
    ['success_heading / success_body', 'text + textarea'],
    ['fields[]', 'array -- defaults: name, email, company, role select, use case textarea'],
  ],
  FormAddress: [
    ['form_heading / form_lede', 'text + textarea'],
    ['form_submit_label', 'text'],
    ['success_heading / success_body', 'text + textarea'],
    ['fields[]', 'array -- defaults: name, address line 1, address line 2, city, state, country select, postal code'],
  ],
  Spacer: [['height', 'select -- 16 / 32 / 56 / 96 / 140 px']],
  Divider: [
    ['label', 'text -- optional center label'],
    ['style', 'select -- hairline / dashed / thick / dot'],
  ],
  RawHtml: [
    ['html', 'textarea -- arbitrary HTML'],
    ['contained', 'radio -- inside container / full bleed'],
  ],
}

// "When to use" + tips. Designer-audience, written in our own voice.
export const BLOCK_GUIDANCE = {
  ContactNavigationHeader: {
    when: 'Header with a contact strip (phones, emails, hours) above the main nav. Use it when visitors call or email more than they browse.',
    tips: [
      'Turn `showTopBar` off on small sites -- the nav stands on its own.',
      'Keep `timing_text` short; it sits in a badge.',
    ],
  },
  FooterNavigation: {
    when: 'Site-wide footer -- logo, contact details, link columns, social links and a copyright bar. Put it last on every page.',
    tips: [
      'Three or four `columns` read best on desktop; they stack on mobile.',
      'Use `background: custom` with `backgroundColor` for a tenant colour.',
    ],
  },
  Notifications: {
    when: 'Auto-scrolling notice board for circulars, admissions dates or alerts. Common on school and government sites.',
    tips: [
      'Use `order` to pin the most important notice to the top.',
      "Tag fresh items with the 'NEW' badge and clear it after a week or two.",
    ],
  },
  ImageCarousel: {
    when: 'Rotating image slider, alone or split with a content panel beside it. Good for campus photos, product shots or event highlights.',
    tips: [
      'Keep slides the same aspect ratio so the height does not jump.',
      'Use a split `layout` when the slides need a headline and CTA beside them.',
    ],
  },
  ContactHeader: {
    when: 'Top-of-site header displaying contact phone numbers, emails, brand logo, and authentication/action buttons.',
    tips: [
      'Pass up to 3 phone numbers and 3 email addresses dynamically.',
      'Logo is mathematically centered between contact details and action buttons.',
      'Toggle isLoggedIn to switch between the Login button and user profile icon/menu.',
    ],
  },
  NavigationHeader: {
    when: 'Primary navigation bar with brand logo, dynamic hierarchical menus, and responsive mobile drawer.',
    tips: [
      'Supports nested child menus rendered automatically as accessible dropdowns.',
      'Includes active state highlighting and custom navigation callbacks.',
    ],
  },
  MastheadHeader: {
    when: 'Institutional masthead -- two titles (often a translated pair) flanking a crest that straddles the nav bar. Use it as the first block on a university, government, or association site.',
    tips: [
      'Set `shrink_on_scroll` so the titles and crest compact once the visitor scrolls, keeping the nav reachable.',
      'Leave `crest_url` empty to get the ringed monogram built from the title initials; paste a URL to use a real seal.',
      'The menu list is split evenly either side of the crest -- add items in pairs for a balanced bar.',
      'Recolour the bar per tenant with `bar_color` / `bar_text_color`, or override `--tps-masthead-bar` in the host.',
    ],
  },
  Hero: {
    when: 'Top of a marketing/landing page. The `landing` variant has the radial-gradient halo background; use `simple` for sub-page heroes.',
    tips: [
      'Keep `heading_html` to two lines max -- use `<br />` for the line break.',
      'The `eyebrow` is your one-line positioning statement.',
      'Wrap a key word in `<em>…</em>` -- the gradient treatment hits it nicely in landing variant.',
    ],
  },
  SectionHeader: {
    when: 'Introduces a major section below it. Pairs cleanly with PillarsRow, IconCards, ServicesGrid, TestimonialGrid.',
    tips: ['Use `spacing: generous` to give the section room to breathe before the content block.'],
  },
  CTABanner: {
    when: 'The conversion footer. Almost every page ends with one of these.',
    tips: ['`background: dark` makes a strong visual full-stop. Use sparingly.'],
  },
  Banner: {
    when: 'A top-of-page or mid-page announcement strip. Hiring, event, launch.',
  },
  AnnouncementBar: {
    when: 'Site-wide promotional strip -- usually pinned above the main nav.',
  },
  InlineCTA: {
    when: 'Between content sections to nudge conversion without dominating like CTABanner does.',
  },
  RichText: {
    when: 'Anywhere you need paragraph copy with links, lists, or inline emphasis.',
    tips: ['Use `align: center` and a narrow `maxWidth` (~640) for editorial sections.'],
  },
  PrinciplesList: {
    when: 'A "what we believe" / "our commitments" section. Two-column layout pairs a heading + lede with a checkmark list.',
  },
  TwoColumn: {
    when: 'Side-by-side text comparison -- past/future, problem/solution, etc.',
  },
  ThreeColumn: {
    when: 'Three parallel text columns. Lighter than PillarsRow (no icons).',
  },
  ImageText: {
    when: 'Alternating feature sections. Flip the image side per section for rhythm.',
  },
  Quote: {
    when: 'An editorial pull-quote inside long-form content. Lighter than TestimonialQuote.',
  },
  KeyValueList: {
    when: 'Specs, deal terms, "what’s included" lists.',
  },
  Container: {
    when: 'A single titled callout against a background. Use it to break visual rhythm or highlight a paragraph.',
  },
  CodeBlock: {
    when: 'Plain monospace code or a config snippet. No syntax highlighting -- keep it short.',
  },
  IconCards: {
    when: 'Compact "what you get" rundown. Lighter than PillarsRow.',
  },
  MetricCards: {
    when: 'A "by the numbers" section. Big values with optional trend arrows.',
  },
  ImageOverlayCards: {
    when: 'Category / "explore" cards with text over a tinted image. Click-through pattern.',
  },
  PricingTable: {
    when: 'Three-tier pricing display with feature lists and CTAs.',
    tips: ['Set `highlighted: true` on exactly one tier -- the "popular" one.'],
  },
  PricingComparison: {
    when: 'Feature × tier matrix. Use after PricingTable when buyers need more detail.',
  },
  StatsStrip: {
    when: '3–5 small stats below a hero. Faster than CountUpStats; no animation.',
  },
  CountUpStats: {
    when: 'A dramatic "by the numbers" hero strip. Numbers tick into view.',
  },
  PillarsRow: {
    when: 'The classic "three things that matter" section. Icon + title + body.',
    tips: ['Use AntD icon names as strings (e.g. `"ToolOutlined"`). The block resolves them on render.'],
  },
  ApproachSteps: {
    when: 'A "how we work" / "our process" section. Numbered, horizontal.',
  },
  StepsVertical: {
    when: 'A heavier "how it works" -- stacked, larger numbers, more body copy per step.',
  },
  ServicesGrid: {
    when: 'Auto-rendered service catalogue. Needs `services` in StudioContext.',
    tips: ['Use `show: 6` on a landing page; full list on a /services index.'],
  },
  TeamGrid: {
    when: 'The team / leadership section.',
  },
  ArticleFeatured: {
    when: 'The "lead story" of a blog or news index.',
  },
  ArticleGrid: {
    when: 'A blog index -- image cards with tag, headline, excerpt.',
  },
  ArticleList: {
    when: 'An archive page. Date + tag + headline + one-line excerpt. No images.',
  },
  LogoStrip: {
    when: '"Trusted by" row of client logos. Falls back to text when no image is set.',
  },
  PressMentions: {
    when: '"As featured in" press logos. Italic serif text fallback.',
  },
  AwardsBar: {
    when: 'A row of certifications or awards with year + body. Trust signals.',
  },
  TestimonialQuote: {
    when: 'One large pull-quote with attribution. Use for your strongest testimonial.',
  },
  TestimonialGrid: {
    when: 'Multi-voice social proof -- 2 or 3 testimonials side by side.',
  },
  FAQ: {
    when: 'Standard question/answer accordion. Most pages benefit from a 4–6 question FAQ.',
  },
  AccordionBlock: {
    when: 'A generic accordion for product features, multi-section content.',
  },
  TabsBlock: {
    when: 'Tabbed content panel -- switch between named sections.',
  },
  Timeline: {
    when: 'Vertical chronological story -- company history, project milestones, "what happens next".',
  },
  EventsList: {
    when: 'Upcoming events with date pill, venue, RSVP CTA.',
  },
  VideoEmbed: {
    when: 'A product demo, customer-story video, or recorded talk.',
  },
  ImageGallery: {
    when: 'Photo grid with click-to-enlarge lightbox.',
  },
  ImageCaption: {
    when: 'A single editorial image with caption and optional credit.',
  },
  MapEmbed: {
    when: 'Show your office location. Paste the Maps "embed a map > HTML" iframe src.',
  },
  ContactSection: {
    when: 'The all-in-one contact page block. Hero + sidebar + lead-capture form.',
    tips: ['Wire `submitLead` in your StudioContext or the form will throw on submit.'],
  },
  NewsletterSignup: {
    when: 'A single-field email capture. Submits via `subscribeNewsletter` in StudioContext.',
  },
  ContactInfo: {
    when: 'Address + email + phone + hours. No form, just info.',
  },
  SocialLinks: {
    when: 'Ad-hoc social icon row. Different from the site-wide footer social.',
  },
  Spacer: {
    when: 'Explicit vertical whitespace between blocks when section padding isn’t enough.',
  },
  Divider: {
    when: 'A horizontal divider with an optional centered label. Use to break long pages.',
  },
  RawHtml: {
    when: 'Escape hatch for embeds the library doesn\'t cover -- Calendly, Tally, custom HTML.',
  },
  FormContact: {
    when: 'A composable contact form -- drop it below a Hero or SectionHeader. For the all-in-one hero + sidebar + form use ContactSection instead.',
    tips: [
      'Every field is configurable in the Puck sidebar -- change field_type to any of: text, email, tel, textarea, select, multiselect, radio, checkbox, date, rating, upload, country, gender, otp.',
      'Two consecutive fields set to `width: half` automatically share a row.',
      'Wire `submitLead` in PageStudioProvider to handle form submissions.',
    ],
  },
  FormLeadCapture: {
    when: 'Lead generation -- pair with a services or pricing section to convert visitors into leads.',
    tips: [
      'The stage select and interests multiselect use the `options` field (one option per line).',
      'Customize the stage options to match your sales funnel language.',
    ],
  },
  FormNewsletter: {
    when: 'Email capture with a consent checkbox. More flexible than NewsletterSignup (uses the same configurable fields system).',
    tips: ['Wire `submitLead` (not `subscribeNewsletter`) -- the form posts to the leads endpoint.'],
  },
  FormFeedback: {
    when: 'Customer feedback after a purchase, onboarding, or event. The star rating field stores a number 1–5.',
    tips: ['Make name and email optional to maximize completion rate.'],
  },
  FormSurvey: {
    when: 'A short research survey -- NPS, product feedback, post-event. Swap the default fields for your own questions.',
    tips: [
      'Use `field_type: radio` for single-answer questions with 2–6 options.',
      'Use `field_type: rating` for scale questions (stored as 1–5).',
    ],
  },
  FormBooking: {
    when: 'Demo or appointment requests. The date picker stores a dayjs object -- format it in your `submitLead` handler.',
    tips: ['Add a Calendly RawHtml block as an alternative if you prefer direct scheduling.'],
  },
  FormRegistration: {
    when: 'Conference, workshop, or webinar signups. Remove the t-shirt size field for virtual events.',
  },
  FormQuoteRequest: {
    when: 'Professional services or agency quote requests. Budget and timeline selects help qualify leads before first contact.',
  },
  FormApplication: {
    when: 'Job applications, grant submissions, or programme applications. The CV upload uses `beforeUpload={() => false}` -- handle the file in `submitLead`.',
    tips: ['The upload field stores a fileList array in the form values.'],
  },
  FormSupport: {
    when: 'A lightweight help-desk ticket form. Wire `submitLead` to forward to your support system.',
    tips: ['The priority field highlighted with an accent tint in the thumbnail -- change its `options` to match your SLA tiers.'],
  },
  FormWaitlist: {
    when: 'Product waitlists, beta access, or invite-only launches. The use-case textarea helps you qualify and prioritize signups.',
  },
  FormAddress: {
    when: 'Shipping, billing, or office location capture. The country field uses a built-in searchable select with 46 countries.',
    tips: ['Add a `tel` field for delivery contact if needed.'],
  },
}

// Flat catalog entries -- the source of truth for both the gallery + BLOCKS.md.
export function getCatalog() {
  const names = Object.keys(BLOCK_FIELDS)
  return names.map((name) => ({
    name,
    category: BLOCK_CATEGORY[name] || 'Other',
    summary: BLOCK_DESCRIPTIONS[name] || '',
    fields: BLOCK_FIELDS[name] || [],
    when: BLOCK_GUIDANCE[name]?.when || '',
    tips: BLOCK_GUIDANCE[name]?.tips || [],
  }))
}

// Category order for display -- matches defaultCategories key order.
export const CATEGORY_ORDER = Object.keys(defaultCategories)
