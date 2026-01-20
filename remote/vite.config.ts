import { federation } from '@module-federation/vite';
import react from '@vitejs/plugin-react';
import { writeFileSync } from 'fs';
import { defineConfig, loadEnv } from 'vite';
import { dependencies } from './package.json';
import { withZephyr } from 'vite-plugin-zephyr';

const mfConfig = {
  filename: 'remoteEntry.js',
  name: 'remote',
  exposes: {
    './remote-app': './src/App.tsx',
  },
  remotes: {},
  shared: {
    react: {
      requiredVersion: dependencies.react,
      singleton: true,
    },
  },
};

export default defineConfig(({ mode }) => {
  const selfEnv = loadEnv(mode, process.cwd());
  return {
    server: {
      fs: {
        allow: ['.', '../shared'],
      },
    },
    build: {
      target: 'chrome89',
    },
    plugins: [
      {
        name: 'generate-environment',
        options: function () {
          console.info('selfEnv', selfEnv);
          writeFileSync(
            './src/environment.ts',
            `export default ${JSON.stringify(selfEnv, null, 2)};`,
          );
        },
      },
      withZephyr({ mfConfig }),
      react(),
    ],
  };
});
