// Node's built-in utility for converting a file:// URL into a regular filesystem path. URL is also imported here to construct a new URL relative to this config file.

// core imports an plugins:
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import Vue from '@vitejs/plugin-vue'
import Fonts from 'unplugin-fonts/vite'
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'



// Main Vite configuration object. Everything Vite needs to build/serve this project lives here: plugins, path resolution, dev server settings, etc.

// main vite configuration: plugins, path resolution, and dev server settings
export default defineConfig({
  plugins: [
    tailwindcss(), // scans project files for tailwind class names and generates the corresponding css

    Vue({
      template: { transformAssetUrls }, // runs template asset urls (like img src) through vuetify's transformer so vuetify components resolve assets correctly
    }),

    Vuetify({
      autoImport: true, // auto-imports components/directives on use, no manual registration needed
      styles: {
        configFile: 'src/styles/settings.scss', // custom sass file for overriding vuetify's default theme variables
      },
    }),

    // fontsource-based font loading: self-hosts the listed families/weights/styles instead of pulling from an external cdn
    Fonts({
      fontsource: {
        families: [
          {
            name: 'Roboto Mono',
            weights: [400, 700], // regular and bold only
          },
          {
            name: 'Roboto',
            weights: [100, 300, 400, 500, 700, 900], // thin through black
            styles: ['normal', 'italic'],
          },
        ],
      },
    }),
  ],

  define: { 'process.env': {} }, // stubs process.env as an empty object so node-oriented libraries don't crash in the browser

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('src', import.meta.url)), // '@' aliases to the src folder for cleaner imports
    },
    extensions: [ // extensions tried in order for extension-less imports
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ],
  },

  server: {
    port: 3000, // dev server port
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // backend server address
        changeOrigin: true, // rewrites the origin header so the backend accepts the request
      },
    },
  },
})
