import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { dependencies } from './package.json';
import { withZephyr } from 'vite-plugin-zephyr';

const mfConfig = {
  name: 'host',
  remotes: {
    remote: {
      type: 'module',
      name: 'remote',
      entry: 'http://localhost:4174/remoteEntry.js',
      entryGlobalName: 'remote',
      shareScope: 'default',
    },
  },
  exposes: {},
  filename: 'remoteEntry.js',
  shared: {
    react: {
      requiredVersion: dependencies.react,
      singleton: true,
    },
  },
};

export default defineConfig(() => ({
  server: { fs: { allow: ['.', '../shared'] } },
  build: {
    target: 'chrome89',
  },
  plugins: [withZephyr({ mfConfig }), react()],
}));
