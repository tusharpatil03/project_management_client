import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default ({ mode }: { mode: string }) => {
  // load .env files
  const env = loadEnv(mode, process.cwd(), '');

  const port = Number(env.VITE_APP_PORT || 3000);
  const publicPath = env.VITE_PUBLIC_PATH || '/';

  return defineConfig({
    base: publicPath,
    plugins: [react()],
    server: {
      port,
    },
    define: {
      'process.env': env,
    },
  });
};
