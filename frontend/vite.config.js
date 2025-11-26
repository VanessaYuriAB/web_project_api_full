// Importa a função para definir a configuração do Vite
import { defineConfig } from 'vite';

// Plugin oficial do React para Vite (suporte a JSX, Fast Refresh, etc.)
import react from '@vitejs/plugin-react';

// Node.js path para resolver caminhos absolutos
import path from 'path';

// Exporta a configuração do Vite
// Recebe o "mode" (desenvolvimento ou produção) como parâmetro
export default defineConfig(({ mode }) => ({
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
    port: 3000, // porta do dev server
    open: true, // abre o navegador automaticamente ao iniciar o servidor
  },

  // Base path do projeto
  base:
    mode === 'production'
      ? '/web_project_around_auth/' // para produção, ex: GitHub Pages, ou npm run build/preview > nome exato do repositório no GitHub
      : '/', // para desenvolvimento local (no npm run dev)

  // Configuração do build (geração de arquivos finais)
  build: {
    outDir: 'docs', // onde o Vite colocará os arquivos após o build (padrão é "dist",
    // mas para rodar no GitHub Pages sem deploy, há a opção de gerar a partir de docs,
    // no próprio GitHub)
    assetsDir: 'assets', // subpasta para arquivos estáticos (JS, CSS, imagens, etc.)
  },
}));
