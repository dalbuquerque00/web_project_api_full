// imagePopup.jsx
export default function ImagePopup({ card, isOpen, onClose }) {
  return (
    <div className={`popup popup_type_image ${isOpen ? 'popup_opened' : ''}`}>
      <div className="popup__container">
        <button
          type="button"
          className="popup__close"
          onClick={onClose}
          aria-label="Sair"
        />
        <figure className="popup__figure">
          {card && (
            <>
              <img 
                src={card.link} 
                alt={card.name} 
                className="popup__image" 
              />
              <figcaption className="popup__caption">{card.name}</figcaption>
            </>
          )}
        </figure>
      </div>
    </div>
  );
}