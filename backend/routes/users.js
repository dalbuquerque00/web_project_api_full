const { celebrate, Joi } = require('celebrate');
const { validateUrl } = require('../utils/validators');
const express = require('express');
const { getCurrentUser, updateProfile, updateAvatar } = require('../controllers/users');

const router = express.Router();

// Retorna as informações do usuário logado
router.get('/me', getCurrentUser);

// Atualiza perfil (name, about) - apenas o próprio usuário pode editar
router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateProfile
);

// Atualiza avatar - apenas o próprio usuário pode editar
router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().custom(validateUrl),
    }),
  }),
  updateAvatar
);

module.exports = router;