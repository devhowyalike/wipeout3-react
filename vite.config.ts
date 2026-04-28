import { defineConfig, loadEnv, Plugin } from 'vite';
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import sitemap from 'vite-plugin-sitemap';
import path from 'path';
import { readFileSync } from 'node:fs';
import { visualizer } from 'rollup-plugin-visualizer';
import reactCompiler from 'babel-plugin-react-compiler';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  // Extract page paths from routeDefinitions.ts at config time.
  // Direct import isn't possible because the module uses @/ aliases
  // that aren't resolved until the config is returned.
  const routeDefsContent = readFileSync(
    path.resolve(__dirname, 'src/routes/routeDefinitions.ts'), 'utf-8'
  );
  const dynamicRoutes = [...routeDefsContent.matchAll(/path:\s*"([^"]+)"/g)]
    .map(m => m[1])
    .filter(p => p !== '/');
  // Reads --color-page-bg per theme from the CSS source and DEFAULT_THEME from
  // constants, then injects a critical <style> block into index.html at
  // transform time (dev + build). Single source of truth; nothing hard-coded.
  function injectCriticalThemeCSS(): Plugin {
    const cssPath = path.resolve(__dirname, 'src/styles/index.css');
    const constantsPath = path.resolve(__dirname, 'src/config/constants.ts');

    return {
      name: 'inject-critical-theme-css',
      transformIndexHtml: {
        order: 'pre',
        handler() {
          const cssContent = readFileSync(cssPath, 'utf-8');
          const constantsContent = readFileSync(constantsPath, 'utf-8');

          const defaultThemeMatch = constantsContent.match(/DEFAULT_THEME\s*=\s*["']([\w]+)["']/);
          const defaultTheme = defaultThemeMatch?.[1] ?? 'sandTheme';

          const themeColorMap = new Map<string, string>();
          const themeRegex = /html\[data-theme="([\w]+)"\][^{]*\{[^}]*--color-page-bg:\s*([^;]+);/g;
          let match;
          while ((match = themeRegex.exec(cssContent)) !== null) {
            themeColorMap.set(match[1], match[2].trim());
          }

          const defaultColor = themeColorMap.get(defaultTheme) ?? '#fff';
          const themeRules = [...themeColorMap.entries()]
            .map(([theme, color]) => `      html[data-theme="${theme}"] { --color-page-bg: ${color}; }`)
            .join('\n');

          const criticalCSS = [
            `      :root { --color-page-bg: ${defaultColor}; }`,
            themeRules,
            `      body { background-color: var(--color-page-bg); }`,
            `      #root { visibility: hidden; }`,
            `      @font-face {`,
            `        font-family: "Wipeout3";`,
            `        src: url("/fonts/F500-Ang-ular.woff2") format("woff2");`,
            `        font-weight: 100 900;`,
            `        font-style: normal;`,
            `        font-display: swap;`,
            `      }`,
            `      @font-face {`,
            `        font-family: "VT323";`,
            `        src: url("/fonts/VT323.woff2") format("woff2");`,
            `        font-weight: 400;`,
            `        font-style: normal;`,
            `        font-display: swap;`,
            `      }`,
          ].join('\n');

          return [
            {
              tag: 'style',
              children: `\n${criticalCSS}\n    `,
              injectTo: 'head-prepend',
            },
          ];
        },
      },
    };
  }

  // Remove empty CSS variables from final bundled CSS.
  // Only runs in production to avoid dev-server overhead.
  function removeEmptyCSSVars(): Plugin {
    return {
      name: 'remove-empty-css-vars',
      apply: 'build',
      generateBundle(_options, bundle) {
        for (const key of Object.keys(bundle)) {
          const chunk = bundle[key];
          if (chunk.type === 'asset' && typeof chunk.source === 'string' && key.endsWith('.css')) {
            chunk.source = chunk.source.replace(/--[\w-]+:\s*;/g, '');
          }
        }
      }
    }
  }

  return {
    build: {
      minify: true,
      // Prevent small assets (GIFs, images) from being base64-inlined.
      // Setting to 0 forces all assets to separate files.
      // Inlining inflates bundle size and prevents per-asset caching.
      assetsInlineLimit: 0,
      rollupOptions: {
        treeshake: true,
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    plugins: [
      injectCriticalThemeCSS(),
      tailwindcss(),
      react({
        babel: {
          plugins: [reactCompiler],
        },
      }),
      removeEmptyCSSVars(),
      ...(env.VITE_SITE_URL
        ? [sitemap({ hostname: env.VITE_SITE_URL, dynamicRoutes, readable: true })]
        : []),
      visualizer({
        open: false,
        filename: 'stats.html',
        gzipSize: true,
        brotliSize: true,
      })
    ]
  };
});