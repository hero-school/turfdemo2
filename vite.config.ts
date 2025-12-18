import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '');

  return {
    // 🔑 Belangrijk: base path voor GitHub Pages
    base: '/turfdemo2/',

    // Vite dev server instellingen
    server: {
      port: 3000,
      host: '0.0.0.0',
    },

    // Plugins
    plugins: [react()],

    // Environment variables beschikbaar maken in de app
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },

    // Alias voor import paden
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});
