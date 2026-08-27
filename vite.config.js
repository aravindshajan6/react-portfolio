import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { execSync } from 'node:child_process';

const sh = (cmd, fallback) => {
  try {
    return execSync(cmd, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    return fallback;
  }
};

// https://vitejs.dev/config/
export default defineConfig({
  base: '/react-portfolio/',
  plugins: [react()],
  define: {
    // surfaced in the footer as a fake `git rev-parse --short HEAD`
    __BUILD_HASH__: JSON.stringify(sh('git rev-parse --short HEAD', 'dev')),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString().slice(0, 10)),
  },
  server: {
    host: true,
    port: 8000,
  },
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks: {
          // three + r3f only load with the lazy hero scene
          three: ['three', '@react-three/fiber', '@react-three/drei'],
        },
      },
    },
  },
});
