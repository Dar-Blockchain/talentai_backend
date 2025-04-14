const express = require('express');
const router = express.Router();
const { register, login, logout, verifyOTP } = require('../controllers/authController');

// Route d'inscription
router.post('/register', register);

// Route de vérification OTP
router.post('/verify-otp', verifyOTP);

// Route de connexion
router.post('/login', login);

// Route de déconnexion
router.post('/logout', logout);

module.exports = router; 