export { default as PageStudio } from './PageStudio.jsx';
export { default as BuilderEnhancements } from './BuilderEnhancements.jsx';
export { default as BuilderTopBar } from './BuilderTopBar.jsx';

// Re-export the blocks package's context so consumers don't need a separate
// import to wrap their public-site renderer with the same studio config.
export {
  PageStudioProvider,
  useStudio,
  createPuckConfig,
  defaultBlocks,
  defaultCategories,
  defaultOverrides,
  emptyPuckData,
} from '@techrox/page-studio-blocks';
