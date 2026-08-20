import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/air-weather-dash/', // Nécessaire pour GitHub Pages
});