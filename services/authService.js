const User = require('../models/User');
const { sendOTP } = require('./emailService');

// Générer un code OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Service d'inscription
const registerUser = async (username, email) => {
  // Vérifier si l'utilisateur existe déjà
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw new Error('Email ou nom d\'utilisateur déjà utilisé');
  }

  // Générer OTP
  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 5 * 60000); // 5 minutes

  // Créer l'utilisateur
  const user = new User({
    username,
    email,
    otp: {
      code: otp,
      expiresAt: otpExpiry
    }
  });

  await user.save();

  // Envoyer l'OTP par email
  const emailSent = await sendOTP(email, otp);
  if (!emailSent) {
    throw new Error('Erreur lors de l\'envoi de l\'OTP');
  }

  return { email };
};

// Service de vérification OTP
const verifyUserOTP = async (email, otp) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Utilisateur non trouvé');
  }

  if (!user.otp || !user.otp.code || !user.otp.expiresAt) {
    throw new Error('Aucun OTP trouvé');
  }

  if (user.otp.code !== otp) {
    throw new Error('Code OTP incorrect');
  }

  if (new Date() > user.otp.expiresAt) {
    throw new Error('Code OTP expiré');
  }

  user.isVerified = true;
  user.otp = undefined;
  user.lastLogin = new Date();
  await user.save();

  return {
    id: user._id,
    username: user.username,
    email: user.email
  };
};

// Service de connexion
const loginUser = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Utilisateur non trouvé');
  }

  // Générer un nouveau OTP pour la connexion
  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 5 * 60000); // 5 minutes

  user.otp = {
    code: otp,
    expiresAt: otpExpiry
  };
  await user.save();

  // Envoyer l'OTP par email
  const emailSent = await sendOTP(email, otp);
  if (!emailSent) {
    throw new Error('Erreur lors de l\'envoi de l\'OTP');
  }

  return { email };
};

module.exports = {
  registerUser,
  verifyUserOTP,
  loginUser
}; 