// Importa o preset base do ESLint para JS
import js from '@eslint/js';

// Importa variáveis globais comuns (ex: window, document)
import globals from 'globals';

// Plugin para garantir boas práticas com Hooks do React
import reactHooks from 'eslint-plugin-react-hooks';

// Plugin para suporte ao React Refresh (hot reload do Vite)
import reactRefresh from 'eslint-plugin-react-refresh';

// Funções do ESLint moderno para definir configuração e ignorar pastas globais
import { defineConfig, globalIgnores } from 'eslint/config';

// Plugin oficial do React
import react from 'eslint-plugin-react';

// Plugin que integra Prettier com ESLint
import eslintPluginPrettier from 'eslint-plugin-prettier';

// Define a configuração principal do ESLint
export default defineConfig([
  // Ignora pastas globais de build
  globalIgnores(['dist']),
  {
    // Arquivos aos quais essa configuração se aplica
    files: ['**/*.{js,jsx}'],

    // Plugins utilizados neste projeto
    plugins: {
      prettier: eslintPluginPrettier, // integração Prettier
      react, // regras específicas do React
    },

    // Presets e configurações estendidas
    extends: [
      js.configs.recommended, // recomendações básicas de JS
      reactHooks.configs['recommended-latest'], // boas práticas de hooks
      reactRefresh.configs.vite, // integração com React Refresh e Vite
      // react.configs.recommended,
      // estava causando erro no npm run lint, removido e
      // adicionadas regras principais manualmente abaixo
    ],

    // Configurações de linguagem e parser
    languageOptions: {
      ecmaVersion: 'latest', // usa a versão mais recente do JS
      globals: globals.browser, // variáveis globais do browser
      parserOptions: {
        ecmaVersion: 'latest', // versão do JS
        ecmaFeatures: { jsx: true }, // habilita JSX
        sourceType: 'module', // permite import/export
      },
    },

    // Pastas/arquivos ignorados pelo ESLint
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'vendor/**',
      'public/**',
    ],

    // Regras específicas do projeto
    rules: {
      // Regras React principais (react/recommended):
      'react/display-name': 'off', // desativa aviso de componentes sem nome
      'react/jsx-boolean-value': ['error', 'never'], // booleanos devem ser implícitos
      'react/jsx-key': 'warn', // alerta ao esquecer 'key' em listas
      'react/jsx-no-comment-textnodes': 'warn', // alerta sobre comentários mal interpretados
      'react/jsx-no-duplicate-props': 'error', // evita props duplicadas

      'react/jsx-no-target-blank': 'off', // permite usar target="_blank" sem rel
      'react-hooks/rules-of-hooks': 'error', // garante uso correto de hooks
      'react-hooks/exhaustive-deps': 'warn', // avisa se dependências de hooks estão incompletas

      // Configuração do Prettier: usePrettierrc: habilita o carregamento do arquivo
      // de configuração do Prettier (padrão: true). Pode ser útil se você estiver usando
      // várias ferramentas que entram em conflito entre si ou não quiser misturar suas
      // configurações do ESLint com a configuração do Prettier
      'prettier/prettier': [
        'error',
        {},
        {
          usePrettierrc: true, // usa as regras do .prettierrc
        },
      ], // aponta erro se o código não seguir as regras do Prettier (ex: indentação, aspas, vírgulas finais)

      // Variáveis não usadas
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }], /// ignora constantes globais

      // Sugere auto-fechamento de elementos sem filhos
      'react/self-closing-comp': [
        'warn',
        {
          component: true, // aplica a componentes React
          html: true, // aplica a elementos HTML
        },
      ],

      // Outras regras específicas de React Refresh e Props
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }, // permite exportar componentes constantes
      ],

      'react/prop-types': 'off', // desativa validação de prop-types
    },
  },
]);
