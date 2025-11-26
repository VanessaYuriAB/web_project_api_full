// Importa a função para definir a configuração do Vite
import { defineConfig } from 'vite';

// Plugin oficial do React para Vite (suporte a JSX, Fast Refresh, etc.)
import react from '@vitejs/plugin-react';

// Node.js path para resolver caminhos absolutos
import path from 'path';

// Exporta a configuração do Vite
// Recebe o "mode" (desenvolvimento ou produção) como parâmetro
export default defineConfig({
  // Plugins usados no projeto
  plugins: [react()],

  // Resolução de caminhos e aliases
  resolve: {
    alias: {
      /*global __dirname*/
      /*eslint no-undef: "error"*/
      '@contexts': path.resolve(__dirname, 'src/contexts'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@assets': path.resolve(__dirname, 'src/assets'),
    },
  },

  // Configuração do servidor de desenvolvimento
  server: {
    port: 3001, // porta do dev server para o front, já que o back usa a 3000
    open: true, // abre o navegador automaticamente ao iniciar o servidor
  },

  // Configuração do build (geração de arquivos finais para deploy)
  build: {
    outDir: 'dist', // onde o Vite colocará os arquivos após o build (padrão é "dist")
    assetsDir: 'assets', // subpasta para arquivos estáticos (JS, CSS, imagens, etc.)
  },
});
