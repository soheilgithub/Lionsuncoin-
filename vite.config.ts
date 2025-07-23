import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react({
      // Enable React optimization features
      babel: {
        plugins: [
          // Add babel plugins for better tree shaking
          ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }]
        ]
      }
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Lionsuncoin Gaming Platform',
        short_name: 'Lionsuncoin',
        description: 'Revolutionary cross-platform gaming ecosystem powered by cryptocurrency rewards',
        theme_color: '#ffd700',
        background_color: '#1a1a2e',
        display: 'standalone',
        orientation: 'any',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable any'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable any'
          }
        ],
        categories: ['games', 'entertainment'],
        screenshots: [
          {
            src: 'screenshot-wide.png',
            sizes: '1280x720',
            type: 'image/png',
            form_factor: 'wide'
          },
          {
            src: 'screenshot-narrow.png',
            sizes: '414x896',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        maximumFileSizeToCacheInBytes: 10485760, // 10MB
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\./,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              }
            }
          },
          {
            urlPattern: /\.(png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          },
          {
            urlPattern: /\.(woff|woff2|eot|ttf|otf)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'fonts',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          }
        ]
      }
    }),
    // Bundle analyzer for production builds
    visualizer({
      filename: 'dist/bundle-analysis.html',
      open: false,
      gzipSize: true,
      brotliSize: true
    })
  ],
  build: {
    outDir: 'dist/client',
    emptyOutDir: true, // Allow emptying output directory
    rollupOptions: {
      input: {
        main: './index.html' // Use the root index.html as entry
      },
      output: {
        // Optimized chunk splitting strategy
        manualChunks: {
          // Core React libraries
          'react-vendor': ['react', 'react-dom'],
          'react-router': ['react-router-dom'],
          
          // UI Libraries (split by usage pattern)
          'ui-core': ['@mui/material', '@mui/icons-material'],
          'ui-animation': ['framer-motion', 'react-spring'],
          'ui-charts': ['chart.js', 'react-chartjs-2'],
          'ui-feedback': ['react-hot-toast', 'react-confetti'],
          
          // Gaming libraries (heaviest - separate chunks)
          'game-3d': ['three', '@react-three/fiber', '@react-three/drei'],
          'game-2d': ['phaser'],
          'game-physics': ['matter-js'],
          'game-audio': ['howler', 'use-sound'],
          
          // State management and networking
          'state': ['@reduxjs/toolkit', 'react-redux'],
          'network': ['axios', 'socket.io-client'],
          'web3': ['web3'],
          
          // Utilities and helpers
          'utils': ['uuid', 'web-vitals']
        },
        // Optimize chunk file names
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/').pop()?.replace('.tsx', '').replace('.jsx', '')
            : 'chunk';
          return `js/${facadeModuleId}-[hash].js`;
        },
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const extType = assetInfo.name?.split('.').pop() || '';
          if (['png', 'jpg', 'jpeg', 'svg', 'gif', 'webp', 'ico'].includes(extType)) {
            return 'images/[name]-[hash][extname]';
          }
          if (['woff', 'woff2', 'eot', 'ttf', 'otf'].includes(extType)) {
            return 'fonts/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      },
      // Optimize external dependencies
      external: (id) => {
        // Don't bundle Node.js modules in client
        return id.startsWith('node:');
      }
    },
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console logs in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'], // Remove specific console calls
        passes: 2 // Multiple compression passes
      },
      mangle: {
        safari10: true
      },
      format: {
        comments: false // Remove comments
      }
    },
    sourcemap: false, // Disable sourcemaps in production for smaller builds
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1000, // Warn for chunks larger than 1MB
    assetsInlineLimit: 4096 // Inline assets smaller than 4KB
  },
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      },
      '/socket.io': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        ws: true
      }
    }
  },
  preview: {
    port: 4173,
    host: true
  },
  optimizeDeps: {
    // Pre-bundle dependencies for faster dev server startup
    include: [
      'react', 
      'react-dom', 
      'react-router-dom', 
      '@mui/material',
      '@reduxjs/toolkit',
      'react-redux'
    ],
    // Exclude heavy gaming libraries from pre-bundling
    exclude: ['three', 'phaser', 'matter-js']
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    // Remove development-only code in production
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development')
  },
  // CSS optimization
  css: {
    devSourcemap: false,
    preprocessorOptions: {
      scss: {
        // Add any SCSS optimizations if needed
      }
    }
  }
});