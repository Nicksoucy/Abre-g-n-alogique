import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'save-data-middleware',
      configureServer(server) {
        server.middlewares.use('/api/save', (req, res, next) => {
          if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
              body += chunk.toString();
            });
            req.on('end', () => {
              try {
                const filePath = path.resolve(__dirname, 'src/family_data.json');
                // Validate JSON before writing
                JSON.parse(body);
                fs.writeFileSync(filePath, body);
                res.statusCode = 200;
                res.end(JSON.stringify({ success: true }));
              } catch (e) {
                console.error('Error saving file:', e);
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Failed to save file' }));
              }
            });
          } else {
            next();
          }
        });
      }
    }
  ],
})
