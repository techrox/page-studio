import { mergeConfig } from 'vitest/config';
import shared, { coverageFloor } from '../../vitest.shared.js';

export default mergeConfig(shared, coverageFloor({ statements: 55, branches: 63, functions: 33, lines: 55 }));
