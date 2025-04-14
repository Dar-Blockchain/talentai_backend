const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'studyspheretn@gmail.com',
    pass: 'nycm jlpc kkgq hsib'
  }
});

const sendOTP = async (email, otp) => {
  const mailOptions = {
    from: 'studyspheretn@gmail.com',
    to: email,
    subject: 'Code OTP pour TalentIA',
    html: `
      <h1>Bienvenue sur TalentIA</h1>
      <p>Votre code OTP est : <strong>${otp}</strong></p>
      <p>Ce code expirera dans 5 minutes.</p>
      <p>Si vous n'avez pas demandé ce code, veuillez ignorer cet email.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return false;
  }
};

module.exports = {
  sendOTP
}; 