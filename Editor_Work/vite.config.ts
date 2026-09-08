import { defineConfig, type Plugin, type ViteDevServer } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

const ASSET_DIRS = ['Images', 'Editor_Work', 'Tech_Projects'];
const ASSET_FILES = ['Shashank_Resume.pdf', 'Editor_Shashank_Resume.pdf'];

const MIME: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
};

function isAllowedAsset(rel: string) {
  const normalized = rel.replace(/\\/g, '/');
  return (
    ASSET_DIRS.some((dir) => normalized === dir || normalized.startsWith(`${dir}/`)) ||
    ASSET_FILES.includes(normalized)
  );
}

/** Serve repo media in dev and copy it into dist on build (they live outside /public). */
function serveRepoAssets(): Plugin {
  const root = process.cwd();

  return {
    name: 'serve-repo-assets',
    configureServer(server: ViteDevServer) {
      server.middlewares.use((req, res, next) => {
        if (req.method !== 'GET' && req.method !== 'HEAD') {
          next();
          return;
        }
        const urlPath = decodeURIComponent((req.url ?? '').split('?')[0] ?? '');
        const rel = urlPath.replace(/^\/+/, '');
        if (!isAllowedAsset(rel)) {
          next();
          return;
        }
        const filePath = path.resolve(root, rel);
        const relToRoot = path.relative(root, filePath);
        if (
          relToRoot.startsWith('..') ||
          path.isAbsolute(relToRoot) ||
          !fs.existsSync(filePath) ||
          !fs.statSync(filePath).isFile()
        ) {
          next();
          return;
        }
        const ext = path.extname(filePath).toLowerCase();
        res.setHeader('Content-Type', MIME[ext] ?? 'application/octet-stream');
        res.setHeader('Cache-Control', 'no-cache');
        if (req.method === 'HEAD') {
          res.end();
          return;
        }
        fs.createReadStream(filePath).pipe(res);
      });
    },
    closeBundle() {
      const dist = path.resolve(root, 'dist');
      for (const dir of ASSET_DIRS) {
        const from = path.resolve(root, dir);
        if (fs.existsSync(from)) {
          fs.cpSync(from, path.join(dist, dir), {
            recursive: true,
            filter: (src) => path.basename(src) !== '.DS_Store',
          });
        }
      }
      for (const file of ASSET_FILES) {
        const from = path.resolve(root, file);
        if (fs.existsSync(from)) {
          fs.copyFileSync(from, path.join(dist, file));
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), serveRepoAssets()],
  server: {
    host: '0.0.0.0',
  },
});
