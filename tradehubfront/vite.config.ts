import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import fg from 'fast-glob'

/** Dev-only plugin: POST /__save-css to update @theme variables in style.css */
function cssEditorPlugin(): Plugin {
    return {
        name: 'css-editor',
        apply: 'serve',
        configureServer(server) {
            server.middlewares.use('/__save-css', (req, res) => {
                if (req.method !== 'POST') { res.statusCode = 405; res.end(); return; }
                let body = '';
                req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
                req.on('end', () => {
                    try {
                        const updates: Record<string, string> = JSON.parse(body);
                        const cssPath = resolve(__dirname, 'src/style.css');
                        let css = readFileSync(cssPath, 'utf-8');

                        // Handle Google Fonts import updates
                        const fontImportUrl = updates['__google_font_imports__'];
                        delete updates['__google_font_imports__'];

                        for (const [varName, value] of Object.entries(updates)) {
                            // Match the variable declaration inside @theme { ... }
                            const escaped = varName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                            const re = new RegExp(`(${escaped}:\\s*)([^;]+)(;)`, 'g');
                            css = css.replace(re, `$1${value}$3`);
                        }

                        // Update Google Fonts @import if font changed
                        if (fontImportUrl) {
                            const importRe = /@import\s+url\(['"]?https:\/\/fonts\.googleapis\.com\/css2\?[^)]+\);\s*/g;
                            css = css.replace(importRe, '');
                            // Insert new import after the comment header, before @import "tailwindcss"
                            const twImport = '@import "tailwindcss"';
                            css = css.replace(twImport, `${fontImportUrl}\n\n${twImport}`);
                        }

                        writeFileSync(cssPath, css, 'utf-8');
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ ok: true, count: Object.keys(updates).length }));
                    } catch (e) {
                        res.statusCode = 500;
                        res.end(JSON.stringify({ error: String(e) }));
                    }
                });
            });
        },
    };
}

/** Dev-only plugin: serve 404.html for unknown routes */
function notFoundFallbackPlugin(): Plugin {
    return {
        name: 'not-found-fallback',
        apply: 'serve',
        configureServer(server) {
            // Return handler runs AFTER Vite's built-in middleware
            return () => {
                server.middlewares.use((req, _res, next) => {
                    const url = req.url?.split('?')[0] ?? '/';
                    // Skip internal Vite paths, assets, and node_modules
                    if (url.startsWith('/@') || url.startsWith('/src/') || url.startsWith('/node_modules/') || url.includes('.')) {
                        return next();
                    }
                    // Check if an .html file exists for this path
                    const htmlPath = resolve(__dirname, url.endsWith('/') ? `${url.slice(1)}index.html` : `${url.slice(1)}.html`);
                    const directPath = resolve(__dirname, url.slice(1));
                    if (existsSync(htmlPath) || existsSync(directPath)) {
                        return next();
                    }
                    // Serve 404.html
                    req.url = '/404.html';
                    next();
                });
            };
        },
    };
}

export default defineConfig({
    base: process.env.GITHUB_PAGES === 'true' ? '/tradehubfront/' : '/',
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:8000',
                changeOrigin: true,
            },
            '/files': {
                target: 'http://localhost:8000',
                changeOrigin: true,
            },
            '/private/files': {
                target: 'http://localhost:8000',
                changeOrigin: true,
            },
        },
    },
    plugins: [
        tailwindcss(),
        cssEditorPlugin(),
        notFoundFallbackPlugin(),
    ],
    build: {
        copyPublicDir: true,
        rollupOptions: {
            input: Object.fromEntries(
                fg.sync('**/*.html', {
                    ignore: ['node_modules/**', 'dist/**', '**/style-test.html', '**/test-*.html'],
                }).map(file => [
                    file.replace(/\.html$/, '').replace(/\//g, '-'),
                    resolve(__dirname, file),
                ])
            ),
            output: {
                manualChunks(id) {
                    // Vendor: Alpine.js
                    if (id.includes('node_modules/alpinejs')) return 'vendor-alpine';
                    // Vendor: Flowbite
                    if (id.includes('node_modules/flowbite')) return 'vendor-flowbite';
                    // Vendor: Swiper
                    if (id.includes('node_modules/swiper')) return 'vendor-swiper';
                    // Vendor: i18next
                    if (id.includes('node_modules/i18next')) return 'vendor-i18next';
                    // Vendor: DOMPurify
                    if (id.includes('node_modules/dompurify')) return 'vendor-dompurify';
                    // App: i18n locale files (large)
                    if (id.includes('src/i18n/locales/')) return 'locales';
                    // App: Alpine data modules
                    if (id.includes('src/alpine/')) return 'alpine';
                },
            },
        },
    },
})
