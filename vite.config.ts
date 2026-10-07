import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    // The preview is served from a per-workspace <port>-<workspace-id>.e2b.app
    // host, and Vite 5.4 rejects any Host header that is not allow-listed.
    // A leading dot matches the domain and every subdomain, so the preview
    // keeps working when the workspace id or port changes. IPv4, localhost and
    // *.localhost are allowed by Vite already.
    allowedHosts: ['.e2b.app'],
  },
});
