// Every block needs behaviour tests of its own, not just the shared smoke
// checks in allBlocks.test.jsx. A block counts as tested when a test file
// other than the shared ones imports it, calls Block.render/defaultProps,
// renders <BlockComponent>, or reads config.components.Block.
//
// UNTESTED is the backlog that predates this rule. It can only shrink:
// a new block missing from every test fails, and so does a listed block
// that has since gained tests (remove it from the list).

import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { defaultBlocks } from '../src/config.jsx';

const SHARED = new Set([
  'allBlocks.test.jsx',
  'allBlocks.ssr.test.jsx',
  'testCoverage.test.js',
  'config.test.jsx',
]);

const UNTESTED = new Set([
  'AccordionBlock',
  'AnnouncementBar',
  'ApproachSteps',
  'ArticleFeatured',
  'ArticleGrid',
  'ArticleList',
  'AwardsBar',
  'Banner',
  'CodeBlock',
  'ContactInfo',
  'ContactNavigationHeader',
  'Container',
  'CountUpStats',
  'Divider',
  'EventsList',
  'FAQ',
  'FormAddress',
  'FormBooking',
  'FormLeadCapture',
  'FormNewsletter',
  'FormQuoteRequest',
  'FormSupport',
  'FormSurvey',
  'FormWaitlist',
  'IconCards',
  'ImageCaption',
  'ImageOverlayCards',
  'KeyValueList',
  'LogoStrip',
  'MapEmbed',
  'MetricCards',
  'PillarsRow',
  'PressMentions',
  'PricingComparison',
  'PricingTable',
  'PrinciplesList',
  'Quote',
  'RawHtml',
  'SectionHeader',
  'SocialLinks',
  'StatsStrip',
  'StepsVertical',
  'TabsBlock',
  'TeamGrid',
  'TestimonialGrid',
  'ThreeColumn',
  'Timeline',
  'TwoColumn',
  'VideoEmbed',
]);

const testDir = __dirname;
const testSources = readdirSync(testDir)
  .filter((file) => /\.test\.jsx?$/.test(file) && !SHARED.has(file))
  .map((file) => readFileSync(join(testDir, file), 'utf8'));

function hasOwnTest(name) {
  const patterns = [
    new RegExp(`import\\s*\\{[^}]*\\b${name}\\b[^}]*\\}\\s*from`),
    new RegExp(`\\b${name}\\.(render|defaultProps|fields)\\b`),
    new RegExp(`<${name}Component\\b`),
    new RegExp(`components\\.${name}\\b`),
  ];
  return testSources.some((source) => patterns.some((p) => p.test(source)));
}

const names = Object.keys(defaultBlocks);

describe('block test coverage', () => {
  it('every block has its own tests (add a test/<Block>.test.jsx)', () => {
    const missing = names.filter((name) => !UNTESTED.has(name) && !hasOwnTest(name));
    expect(missing).toEqual([]);
  });

  it('the untested backlog only lists blocks that still lack tests', () => {
    const nowTested = [...UNTESTED].filter((name) => hasOwnTest(name));
    expect(nowTested, 'remove these from UNTESTED').toEqual([]);
  });

  it('the untested backlog only lists registered blocks', () => {
    const unknown = [...UNTESTED].filter((name) => !(name in defaultBlocks));
    expect(unknown).toEqual([]);
  });
});
