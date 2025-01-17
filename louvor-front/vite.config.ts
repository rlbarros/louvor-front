import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from "vite-plugin-mkcert";
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    mkcert({
      savePath: "./certs", // save the generated certificate into certs directory
      force: true, // force generation of certs even without setting https property in the vite config
    }),
  ],
  server: {
    port: 4200
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

});
