const express = require('express');
const router = express.Router();
const authController  = require('../controllers/authController');

// Route d'inscription
router.post('/register', authController.register);

// Route de vérification OTP
router.post('/verify-otp', authController.verifyOTP);


// Route de déconnexion
router.post('/logout', authController.logout);

module.exports = router; 