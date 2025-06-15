import Popup from '../../components/Main/components/Popup/popup';
import successIcon from '../../images/success-icon.svg';
import errorIcon from '../../images/error-icon.svg';
import '../../blocks/popup.css';

function InfoTooltip({ isOpen, onClose, isSuccess, message }) {
  return (
    <Popup
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="info-tooltip">
        <img
          className="info-tooltip__icon"
          src={isSuccess ? successIcon : errorIcon}
          alt={isSuccess ? "Sucesso" : "Erro"}
        />
        <p className="info-tooltip__message">
          {message || (isSuccess 
            ? "Registro concluído" 
            : "Algo deu errado. Por favor, tente novamente."
          )}
        </p>
      </div>
    </Popup>
  );
}

export default InfoTooltip;