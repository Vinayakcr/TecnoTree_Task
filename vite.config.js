import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,     
    strictPort: true,
    proxy: {
      "/wso2": {
        target: "https://localhost:9443",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/wso2/, ""),
      },
      "/api": {
        target: "http://localhost:8081",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
