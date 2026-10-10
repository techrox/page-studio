import { mergeConfig } from 'vitest/config';
import shared, { coverageFloor } from '../../vitest.shared.js';

export default mergeConfig(shared, coverageFloor({ statements: 57, branches: 58, functions: 21, lines: 57 }));
