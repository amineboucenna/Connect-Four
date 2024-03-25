import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// vite.config.js
import { qrcode } from 'vite-plugin-qrcode';


// vite.config.js
export default {
  plugins: [react(),qrcode()],
};
