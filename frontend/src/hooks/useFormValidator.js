import { useRef, useEffect } from 'react';

import FormValidator from '@utils/FormValidator';

/*

 Hook personalizado para inicializar e gerenciar a validação de formulários.

 {Object} config - Objeto de configuração da validação, contendo seletores e regras
 usados pela classe `FormValidator`.

 Retorna um objeto com:
 - {Object} formRef → referência do formulário no DOM (para atribuir via ref).
 - {Object} validatorRef → referência da instância de `FormValidator`.

 Exemplo de uso:
 const { formRef, validatorRef } = useFormValidator(configRegister);

 <form ref={formRef} onSubmit={handleSubmit}>
   <input type="text" name="email" required />
   <button type="submit">Cadastrar</button>
 </form>

*/

function useFormValidator(config) {
  // Cria uma referência para o elemento do formulário no DOM
  const formRef = useRef(null);

  // Cria uma referência para armazenar a instância do validador
  const validatorRef = useRef(null);

  // Efeito para inicializar a validação do formulário
  useEffect(() => {
    // Quando o formulário estiver montado
    if (formRef.current) {
      // Cria uma nova instância de validação com a configuração recebida
      validatorRef.current = new FormValidator(config, formRef.current);

      // Ativa a validação dos campos com o método da classe FormValidator
      validatorRef.current.enableValidation();
    }

    // Limpeza: remove a referência da instância ao desmontar o componente
    return () => {
      validatorRef.current = null;
    };
  }, [config]); // reexecuta se a configuração mudar

  // Retorna as referências para uso no componente
  return { formRef, validatorRef };
}

export default useFormValidator;
