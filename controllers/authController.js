// Contrôleur d'authentification
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // TODO: Ajouter la logique d'inscription
    res.status(201).json({ message: 'Inscription réussie' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // TODO: Ajouter la logique de connexion
    res.status(200).json({ message: 'Connexion réussie' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const logout = (req, res) => {
  // TODO: Ajouter la logique de déconnexion
  res.status(200).json({ message: 'Déconnexion réussie' });
};

module.exports = {
  register,
  login,
  logout
}; 