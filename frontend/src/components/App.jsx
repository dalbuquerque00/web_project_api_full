// src/components/App.jsx
import { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Header from './Header/header';
import Main from './Main/main';
import Footer from './Footer/footer';
import Register from './Register/Register';
import Login from './Login/Login';
import ProtectedRoute from './ProtectedRoute/ProtectedRoute';
import InfoTooltip from './InfoTooltip/InfoTooltip';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import * as auth from '../utils/auth';
import api from '../utils/api';
import EditProfile from './Main/components/Form/EditProfile/editProfile';
import EditAvatar from './Main/components/Form/EditAvatar/editAvatar';
import Popup from './Main/components/Popup/popup';
import NewCard from './Main/components/Form/NewCard/newCard';
import ImagePopup from "./Main/components/ImagePopup/imagePopup";

function App() {
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [tooltipStatus, setTooltipStatus] = useState({
    isSuccess: false,
    message: ''
  });

  const [selectedCard, setSelectedCard] = useState(null);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  };

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  };

  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setSelectedCard(null);
    setIsInfoTooltipOpen(false);
  };

  const navigate = useNavigate();

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      auth.checkToken(jwt)
        .then((res) => {
          if (res.data) {
            setLoggedIn(true);
            setCurrentUser(prevState => ({
              ...prevState,
              email: res.data.email
            }));
            navigate('/');
          }
        })
        .catch((err) => {
          console.log(err);
          localStorage.removeItem('jwt');
        });
    }
  }, []);

  useEffect(() => {
    if (loggedIn) {
      Promise.all([api.getUserInfo(), api.getCardList()])
        .then(([userData, cardsData]) => {
          setCurrentUser(prevState => ({
            ...prevState,
            ...userData
          }));
          setCards(cardsData);
        })
        .catch((err) => console.log(err));
    }
  }, [loggedIn]);

  const handleLogin = async (email, password) => {
    try {
      const data = await auth.authorize(email, password);
      if (data.token) {
        localStorage.setItem('jwt', data.token);
        setLoggedIn(true);
        navigate('/');
      }
    } catch (err) {
      setTooltipStatus({
        isSuccess: false,
        message: "Erro ao iniciar sessão"
      });
      setIsInfoTooltipOpen(true);
    }
  };

  const handleRegister = async (email, password) => {
    try {
      await auth.register(email, password);
      setTooltipStatus({
        isSuccess: true,
        message: "Registro efetuado com susesso!"
      });
      navigate('/signin');
    } catch (err) {
      setTooltipStatus({
        isSuccess: false,
        message: "Erro ao cadastrar"
      });
    } finally {
      setIsInfoTooltipOpen(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    setLoggedIn(false);
    navigate('/signin');
  };

  const handleCardLike = async (card) => {
    const isLiked = Array.isArray(card.likes) && card.likes.some((i) => i._id === currentUser._id);
    try {
      const newCard = await api.changeLikeCardStatus(card._id, !isLiked);
      setCards((prevCards) =>
        prevCards.map((c) => (c._id === card._id ? newCard : c))
      );
    } catch (err) {
      setTooltipStatus({
        isSuccess: false,
        message: "Erro ao curtir/descurtir card"
      });
      setIsInfoTooltipOpen(true);
    }
  };

  const handleCardDelete = async (cardId) => {
    try {
      await api.deleteCard(cardId);
      setCards((prevCards) => prevCards.filter((c) => c._id !== cardId));
      closeAllPopups();
    } catch (err) {
      setTooltipStatus({
        isSuccess: false,
        message: "Erro ao excluir card"
      });
      setIsInfoTooltipOpen(true);
    }
  };

  const handleUpdateUser = async (userData) => {
    try {
      const updatedUser = await api.setUserInfo(userData);
      setCurrentUser((prevState) => ({
        ...prevState,
        ...updatedUser
      }));
      closeAllPopups();
    } catch (err) {
      setTooltipStatus({
        isSuccess: false,
        message: "Erro ao atualizar perfil"
      });
      setIsInfoTooltipOpen(true);
    }
  };

  const handleUpdateAvatar = async (avatarLink) => {
    try {
      const updatedUser = await api.setUserAvatar(avatarLink);
      setCurrentUser((prevState) => ({
        ...prevState,
        ...updatedUser
      }));
      closeAllPopups();
    } catch (err) {
      setTooltipStatus({
        isSuccess: false,
        message: "Erro ao atualizar avatar"
      });
      setIsInfoTooltipOpen(true);
    }
  };

  const handleAddPlaceSubmit = async ({ name, link }) => {
    try {
      const newCard = await api.addCard({ name, link });
      setCards((prevCards) => [newCard, ...prevCards]);
      closeAllPopups();
    } catch (err) {
      setTooltipStatus({
        isSuccess: false,
        message: "Erro ao adicionar novo card"
      });
      setIsInfoTooltipOpen(true);
    }
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <div className="page__content">
          <Header 
            loggedIn={loggedIn} 
            userEmail={currentUser.email} 
            onLogout={handleLogout} 
          />
          
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute loggedIn={loggedIn}>
                  <Main
                    cards={cards}
                    onEditAvatar={handleEditAvatarClick}
                    onEditProfile={handleEditProfileClick}
                    onAddPlace={handleAddPlaceClick}
                    onCardClick={handleCardClick}
                    onCardLike={handleCardLike}
                    onCardDelete={handleCardDelete}
                  />
                </ProtectedRoute>
              }
            />
            <Route path="/signup" element={<Register onRegister={handleRegister} />} />
            <Route path="/signin" element={<Login onLogin={handleLogin} />} />
          </Routes>

          {loggedIn && <Footer />}

          <InfoTooltip
            isOpen={isInfoTooltipOpen}
            onClose={closeAllPopups}
            isSuccess={tooltipStatus.isSuccess}
            message={tooltipStatus.message}
          />
          <EditProfile
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
          />

          <EditAvatar
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
          />

          <Popup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
          >
            <NewCard handleAddPlaceSubmit={handleAddPlaceSubmit} />
          </Popup>

          <ImagePopup
            card={selectedCard}
            isOpen={!!selectedCard}
            onClose={closeAllPopups}
          />
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;