const express = require('express');
const { getCurrentUser, updateProfile, updateAvatar } = require('../controllers/users');

const router = express.Router();

// Retorna as informações do usuário logado
router.get('/me', getCurrentUser);

// Atualiza perfil (name, about) - apenas o próprio usuário pode editar
router.patch('/me', updateProfile);

// Atualiza avatar - apenas o próprio usuário pode editar
router.patch('/me/avatar', updateAvatar);

module.exports = router;