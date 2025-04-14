const { registerUser, verifyUserOTP, loginUser } = require('../services/authService');

// Générer un code OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Route d'inscription
const register = async (req, res) => {
  try {
    const { username, email } = req.body;
    const result = await registerUser(username, email);
    
    res.status(201).json({ 
      message: 'Inscription réussie. Veuillez vérifier votre email pour le code OTP.',
      email: result.email
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Vérification OTP
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await verifyUserOTP(email, otp);

    res.status(200).json({ 
      message: 'Email vérifié avec succès',
      user
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Route de connexion
const login = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await loginUser(email);

    res.status(200).json({ 
      message: 'Code OTP envoyé à votre email',
      email: result.email
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Route de déconnexion
const logout = (req, res) => {
  res.status(200).json({ message: 'Déconnexion réussie' });
};

module.exports = {
  register,
  login,
  logout,
  verifyOTP
}; 