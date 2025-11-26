// ----------------------------------------------------
// Componente de janela modal que informa ao usuário se
// ele foi registrado com sucesso ou não
// ----------------------------------------------------

import { useRef, useEffect } from 'react';

import rectangleTooltip from '@assets/tooltip-rectangle.png';
import unionTooltip from '@assets/tooltip-union.png';
import splitTooltip from '@assets/tooltip-split.png';

function InfoTooltip(props) {
  // Desestruturação do objeto passado como props
  const { tooltip, isSuccess, onClose } = props;

  // ref para encapsulamento do container do tooltip: para fechamento por clique na tela, fora do quadro em si
  const containerRef = useRef(null);

  // Efeito colateral para fechamento do quadro pela tecla 'Esc'
  useEffect(() => {
    const handleEscClose = (evt) => {
      const keyIsEsc = evt.code === 'Escape'; // valor de código para eventos de teclado (Windowns, Mac, Linux e Firefox para Android)

      if (tooltip && keyIsEsc) onClose(); // se o quadro estiver aberto e a tecla pressionada for a esc, o quadro fecha
    };

    document.addEventListener('keydown', handleEscClose); // adiciona o evento em document > escuta globalmente → essencial para capturar a tecla Esc mesmo sem foco

    // Wipe function: função de limpeza
    return () => {
      document.removeEventListener('keydown', handleEscClose);
      // remove o listener ao desmontar ou ao mudar dependências → evita múltiplas inscrições ou vazamentos
    };
  }, [tooltip, onClose]);

  // Handler: fechamento por clique fora
  const handleClickClose = (evt) => {
    const tooltipContent = containerRef.current;
    const clickedOutside =
      tooltipContent && !tooltipContent.contains(evt.target);

    if (clickedOutside) onClose();
  };

  return (
    <div className="tooltip" onClick={handleClickClose}>
      <div className="tooltip__contents" ref={containerRef}>
        {/* Condicional para verificar qual o tipo do tooltip, success ou fail */}
        {isSuccess ? (
          <div className="tooltip__success">
            <img
              className="tooltip__rectangle"
              src={rectangleTooltip}
              alt="Retângulo de fundo branco, quadro do popup de aviso de cadastro realizado com sucesso."
            />
            <img
              className="tooltip__symbol"
              src={unionTooltip}
              alt="Símbolo de check envolto em um círculo."
            />
            <p className="tooltip__text">
              Vitória! Você acabou de se registrar.
            </p>
          </div>
        ) : (
          <div className="tooltip__fail">
            <img
              className="tooltip__rectangle"
              src={rectangleTooltip}
              alt="Retângulo de fundo branco, quadro do popup de aviso de falha no cadastro."
            />
            <img
              className="tooltip__symbol"
              src={splitTooltip}
              alt="Símbolo de 'X' envolto em um círculo."
            />
            <p className="tooltip__text">
              Ops, algo deu erro! Por favor, tente novamente.
            </p>
          </div>
        )}
      </div>

      <button
        className="tooltip__icon-close-btn"
        type="button"
        onClick={onClose}
        aria-label="Botão de fechar"
      />
    </div>
  );
}

export default InfoTooltip;
