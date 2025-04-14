const authService= require('../services/authService');

// Route d'inscription
module.exports.register = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await authService.registerUser(email);
    
    res.status(201).json({
      message: result.message,
      email: result.email,
      username: result.username
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Vérification OTP
module.exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const result = await authService.verifyUserOTP(email, otp);

    // Créer la session avec le token
    res.status(200).json({ 
      message: 'Email vérifié avec succès',
      user: {
        id: result.id,
        username: result.username,
        email: result.email
      },
      token: result.token
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Route de connexion
module.exports.login = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await authService.loginUser(email);

    res.status(200).json({ 
      message: 'Code OTP envoyé à votre email',
      email: result.email,
      username: result.username
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Route de déconnexion
module.exports.logout = (req, res) => {
  res.status(200).json({ message: 'Déconnexion réussie' });
};