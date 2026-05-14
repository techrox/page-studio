import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.js'],
  format: ['esm', 'cjs'],
  dts: false,
  sourcemap: true,
  clean: true,
  target: 'es2020',
  external: [
    'react',
    'react-dom',
    'antd',
    '@ant-design/icons',
    /^@dnd-kit\//,
    /^@tiptap\//,
    'dayjs',
    'diff',
  ],
  esbuildOptions(options) {
    options.jsx = 'automatic';
    options.loader = { ...(options.loader || {}), '.js': 'jsx' };
  },
});
