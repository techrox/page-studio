import {
  PageStudioProvider,
  useStudio,
  createPuckConfig,
  defaultBlocks,
  defaultCategories,
  defaultOverrides,
  emptyPuckData,
  normalizePuckData,
  applyConfigDefaults,
} from '@techrox/page-studio-blocks';

export { default as PageStudio } from './PageStudio.jsx';
export { default as BuilderEnhancements } from './BuilderEnhancements.jsx';
export { default as BuilderTopBar } from './BuilderTopBar.jsx';

// Re-export blocks package helpers and emptyPuckData
export {
  PageStudioProvider,
  useStudio,
  createPuckConfig,
  defaultBlocks,
  defaultCategories,
  defaultOverrides,
  emptyPuckData,
  normalizePuckData,
  applyConfigDefaults,
};

