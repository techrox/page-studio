import { mergeConfig } from 'vitest/config';
import shared, { coverageFloor } from '../../vitest.shared.js';

export default mergeConfig(shared, coverageFloor({ statements: 70, branches: 63, functions: 48, lines: 70 }));
