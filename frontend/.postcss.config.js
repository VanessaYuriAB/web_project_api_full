export default {
  plugins: {
    // Adiciona prefixos automaticamente para maior compatibilidade entre navegadores
    autoprefixer: {},

    // Minifica o CSS no build para reduzir o tamanho final dos arquivos
    cssnano: {
      preset: 'default', // Usa as configurações padrão de otimização
    },
  },
};
