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
  // host: true listens on all interfaces, so phones/PCs on the same Wi-Fi can open the "Network:" URL
  server: { port: 5174, host: true },
  preview: { port: 4174, host: true },
});
