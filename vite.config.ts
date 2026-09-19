import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: '/',
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || ''),
      'process.env.VITE_GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY || ''),
      'process.env.VITE_PAYSTACK_PUBLIC_KEY': JSON.stringify(env.VITE_PAYSTACK_PUBLIC_KEY || ''),
    },
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), '.'),
        'react': path.resolve(process.cwd(), 'node_modules/react'),
        'react-dom': path.resolve(process.cwd(), 'node_modules/react-dom'),
        'react-dom/client': path.resolve(process.cwd(), 'node_modules/react-dom/client.js'),
        'react/jsx-runtime': path.resolve(process.cwd(), 'node_modules/react/jsx-runtime.js'),
        'react/jsx-dev-runtime': path.resolve(process.cwd(), 'node_modules/react/jsx-dev-runtime.js'),
        'react-router': path.resolve(process.cwd(), 'node_modules/react-router'),
      },
      dedupe: [
        'react',
        'react-dom',
        'react-router',
        'motion',
        'framer-motion',
        'react-hot-toast',
        'lucide-react',
        'react-markdown'
      ],
    },
    esbuild: {
      target: 'esnext',
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-dom/client',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        'react-router',
        'motion/react',
        'framer-motion',
        'react-hot-toast',
        'lucide-react',
        'react-markdown',
        'clsx',
        'tailwind-merge',
        'date-fns',
        'axios',
        'firebase/app',
        'firebase/auth',
        'firebase/firestore'
      ],
      esbuildOptions: {
        target: 'esnext',
      },
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      target: 'esnext',
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('jspdf') || id.includes('jspdf-autotable') || id.includes('html2canvas')) {
                return 'vendor-pdf';
              }
              if (id.includes('docx') || id.includes('exceljs')) {
                return 'vendor-office';
              }
              if (id.includes('firebase')) {
                return 'vendor-firebase';
              }
              if (id.includes('lucide-react')) {
                return 'vendor-icons';
              }
              if (
                id.includes('react') || 
                id.includes('react-dom') || 
                id.includes('react-router') || 
                id.includes('motion') || 
                id.includes('framer-motion') || 
                id.includes('react-hot-toast')
              ) {
                return 'vendor-react';
              }
            }
            if (id.includes('src/constants') || id.includes('src/data/') || id.includes('src/lib/curriculumDatabase')) {
              return 'curriculum-database';
            }
          },
        },
      },
    },
    server: {
      hmr: false,
    },
  };
});
