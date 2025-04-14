const express = require('express');
const router = express.Router();
const { register, login, logout } = require('../controllers/authController');

// Route d'inscription
router.post('/register', register);

// Route de connexion
router.post('/login', login);

// Route de déconnexion
router.post('/logout', logout);

module.exports = router; 