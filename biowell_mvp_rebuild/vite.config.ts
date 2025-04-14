import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

// Define plugins separately to handle conditional inclusion
const getPlugins = (mode: string) => {
  const plugins = [react()];
  
  if (mode === 'analyze') {
    plugins.push(
      visualizer({
        open: true,
        gzipSize: true,
        brotliSize: true,
        filename: 'bundle-analysis.html'
      }) as any // Type assertion needed due to plugin typing
    );
  }
  
  return plugins;
};

export default defineConfig(({ mode }) => ({
  plugins: getPlugins(mode),
  optimizeDeps: {
    exclude: ['lucide-react']
  },
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    hmr: {
      overlay: true
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['framer-motion', 'lucide-react', 'react-modal']
        }
      }
    }
  }
}));