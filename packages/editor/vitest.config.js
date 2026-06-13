import { mergeConfig } from 'vitest/config';
import shared from '../../vitest.shared.js';

// The editor tests mount the full Puck editor. Puck's mount schedules async
// work (measuring, dnd-kit setup) that stays pending for a few seconds in
// happy-dom. Vitest 3 *awaits* that pending work before resolving a test —
// vitest 1.x didn't — so a test whose body finishes in milliseconds still
// sits idle past the 5s default. Give these integration tests room; the wait
// is idle, not real test time. Unit-light packages keep the shared default.
export default mergeConfig(shared, {
  test: {
    testTimeout: 15000,
    hookTimeout: 15000,
  },
});
