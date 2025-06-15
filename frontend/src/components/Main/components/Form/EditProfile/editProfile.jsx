import { useContext, useEffect, useState } from 'react';
import { CurrentUserContext } from '../../../../../contexts/CurrentUserContext';
import Popup from '../../Popup/popup';

function EditProfile({ isOpen, onClose, onUpdateUser }) {
  const currentUser = useContext(CurrentUserContext);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isNameTouched, setIsNameTouched] = useState(false);
  const [isDescriptionTouched, setIsDescriptionTouched] = useState(false);

  useEffect(() => {
    if (currentUser?.name && currentUser?.about) {
      setName(currentUser.name);
      setDescription(currentUser.about);
    }
    if (!isOpen) {
      setIsNameTouched(false);
      setIsDescriptionTouched(false);
    }
  }, [currentUser, isOpen]);

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateUser({
      name,
      about: description,
    });
  }

  function handleNameChange(e) {
    setName(e.target.value);
    setIsNameTouched(true);
  }

  function handleDescriptionChange(e) {
    setDescription(e.target.value);
    setIsDescriptionTouched(true);
  }

  return (
    <Popup
      name="edit-profile"
      title="Editar perfil"
      isOpen={isOpen}
      onClose={onClose}
    >
      <h2 className="popup__title">Editar Perfil</h2>
      <form className="popup__form" name="edit-profile" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          className="popup__input popup__input_type_name"
          placeholder="Nome"
          required
          minLength="2"
          maxLength="40"
          value={name || ''}
          onChange={handleNameChange}
        />
        <span className="popup__error" id="name-error">
          {isNameTouched && name.trim().length < 2
            ? 'O nome deve ter pelo menos 2 caracteres'
            : ''}
        </span>
        <input
          type="text"
          name="description"
          className="popup__input popup__input_type_about"
          placeholder="Sobre mim"
          required
          minLength="2"
          maxLength="200"
          value={description || ''}
          onChange={handleDescriptionChange}
        />
        <span className="popup__error" id="description-error">
          {isDescriptionTouched && description.trim().length < 2
            ? 'A descrição deve ter pelo menos 2 caracteres'
            : ''}
        </span>
        <button type="submit" className="popup__button">
          Salvar
        </button>
      </form>
    </Popup>
  );
}

export default EditProfile;