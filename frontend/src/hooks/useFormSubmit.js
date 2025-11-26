import { useState } from 'react';

/*

 Hook personalizado para gerenciar o envio de formulários com controle de estado e callbacks.

 onSubmit - Função principal de envio (geralmente uma requisição à API).

 onSuccess - Função opcional executada após o envio bem-sucedido.
 Exemplo: fechar popup, limpar campos, exibir tooltip de sucesso.

 onError - Função opcional executada em caso de erro no envio.
 Exemplo: exibir tooltip de falha ou mensagem de erro.

 Retorna um objeto com:
 - {Function} handleSubmit → manipulador de envio de formulário.
 - {boolean} isLoading → estado que indica se o envio está em andamento.

 Exemplo de uso:
 const { handleSubmit, isLoading } = useFormSubmit(
  () => api.registerUser(data),
  () => setTooltipSuccess(true),
  (error) => setTooltipError(true)
 );

 <form onSubmit={handleSubmit}>
   <button disabled={isLoading}>Enviar</button>
 </form>

*/

function useFormSubmit(onSubmit, onSuccess, onError) {
  // Estado de carregamento para indicar envio em andamento
  const [isLoading, setIsLoading] = useState(false);

  // Função principal de envio do formulário
  const handleSubmit = async (event) => {
    event.preventDefault(); // evita o recarregamento da página padrão do formulário
    setIsLoading(true); // ativa o estado de carregamento

    try {
      // Executa a função de envio (geralmente uma requisição à API)
      await onSubmit();

      // Se houver uma função de sucesso, executa-a
      // Exemplo: fechar popup ou mostrar tooltip de sucesso
      if (onSuccess) onSuccess();
    } catch (error) {
      // Se houver uma função de erro, executa-a passando o erro capturado
      // Exemplo: exibir tooltip de erro ou mensagem de falha
      if (onError) {
        onError(error);
      } else {
        // Caso não exista callback de erro, registra no console
        console.error(error);
      }
    } finally {
      // Finaliza o estado de carregamento, independentemente do resultado
      setIsLoading(false);
    }
  };

  // Retorna o manipulador de envio e o estado de carregamento
  return { handleSubmit, isLoading };
}

export default useFormSubmit;
