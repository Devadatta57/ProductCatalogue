import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // localhost only: no "Network:" URL, not reachable from other devices on Wi-Fi
  server: { port: 5174 },
  preview: { port: 4174 },
});
