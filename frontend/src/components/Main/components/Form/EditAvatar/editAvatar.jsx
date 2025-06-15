import React, { useState, useEffect } from 'react';
import Popup from '../../Popup/popup';

export default function EditAvatar({ isOpen, onClose, onUpdateAvatar }) {
  const [avatarLink, setAvatarLink] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    const isLinkValid = avatarLink.trim().length > 0 && isValidUrl(avatarLink);
    setIsFormValid(isLinkValid);
  }, [avatarLink]);

  useEffect(() => {
    if (!isOpen) {
      setAvatarLink('');
      setIsFormValid(false);
      setIsTouched(false);
    }
  }, [isOpen]);

  const handleAvatarChange = (event) => {
    setAvatarLink(event.target.value);
    setIsTouched(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (event.target.checkValidity() && isFormValid) {
      onUpdateAvatar(avatarLink);
      setAvatarLink('');
      setIsFormValid(false);
    }
  };

  return (
    <Popup isOpen={isOpen} onClose={onClose} title="Editar Avatar">
      <h2 className="popup__title">Editar Avatar</h2>
      <form
        id="avatar-form"
        className="popup__form"
        name="avatar"
        noValidate
        onSubmit={handleSubmit}
      >
        <div className="popup__field">
          <input
            type="url"
            name="avatar"
            className="popup__input popup__input_avatar"
            placeholder="Link da imagem"
            required
            value={avatarLink}
            onChange={handleAvatarChange}
          />
          <span className="popup__error">
            {isTouched && (avatarLink.trim().length === 0
              ? 'Por favor, introduza uma URL válida'
              : !isValidUrl(avatarLink)
                ? 'Por favor, introduza uma URL válida'
                : '\u00A0')}
          </span>
        </div>

        <button
          type="submit"
          className={`popup__button ${!isFormValid ? 'popup__button_disabled' : ''}`}
          disabled={!isFormValid}
        >
          Salvar
        </button>
      </form>
    </Popup>
  );
}