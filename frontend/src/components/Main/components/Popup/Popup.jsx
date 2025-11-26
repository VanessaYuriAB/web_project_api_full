import { useEffect, useRef } from 'react';

export default function Popup(props) {
  // Desestruturação do objeto passado como props (children é conteúdo de popup)
  const { children, onClose, popup, type } = props;

  // Ref para encapsulamento de children: para fechamento do popup por clique fora da caixa
  const childrenPopupRef = useRef(null);

  // Fechamento do popup pela tecla 'Esc', ativado sempre que o popup for aberto
  useEffect(() => {
    const handleEscClose = (evt) => {
      const keyIsEsc = evt.code === 'Escape'; // valor de código para eventos de teclado (Windowns, Mac, Linux e Firefox para Android)

      if (popup && keyIsEsc) onClose(); // se o popup estiver aberto e a tecla pressionada for a esc, o popup fecha
    };

    document.addEventListener('keydown', handleEscClose); // adiciona o evento em document > escuta globalmente → essencial para capturar a tecla Esc mesmo sem foco

    // Wipe function: função de limpeza
    return () => {
      document.removeEventListener('keydown', handleEscClose);
      // remove o listener ao desmontar ou ao mudar dependências → evita múltiplas inscrições ou vazamentos
    };
  }, [popup, onClose]);

  // Handler: fechamento por clique fora
  const handleClickClose = (evt) => {
    const childrenContent = childrenPopupRef.current;
    const clickedOutside =
      childrenContent && !childrenContent.contains(evt.target);

    if (clickedOutside) onClose();
  };

  return (
    <div className="popup" onClick={handleClickClose}>
      <div className="popup__content" ref={childrenPopupRef}>
        {children}
      </div>
      <button
        className={`popup__icon-close-btn ${
          type === 'image' ? 'popup__icon-close-btn_card' : ''
        } ${type === 'delete' ? 'popup__icon-close-btn_trash' : ''} ${
          type === 'avatar' ? 'popup__icon-close-btn_photo' : ''
        }`}
        type="button"
        onClick={onClose}
        aria-label="Botão de fechar"
      />
    </div>
  );
}
