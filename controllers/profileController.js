const Profile = require('../models/ProfileModel');
const User = require('../models/UserModel');

// Créer ou mettre à jour un profil
module.exports.createOrUpdateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const profileData = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Créer ou mettre à jour le profil
    const profile = await Profile.findOneAndUpdate(
      { userId },
      { ...profileData, userId },
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: "Profil créé/mis à jour avec succès",
      profile
    });
  } catch (error) {
    console.error('Erreur lors de la création/mise à jour du profil:', error);
    res.status(500).json({ message: "Erreur lors de la création/mise à jour du profil" });
  }
};

// Récupérer son propre profil
module.exports.getMyProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const profile = await Profile.findOne({ userId });
    
    if (!profile) {
      return res.status(404).json({ message: "Profil non trouvé" });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({ message: "Erreur lors de la récupération du profil" });
  }
};

// Récupérer un profil par ID
module.exports.getProfileById = async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await Profile.findOne({ userId });
    
    if (!profile) {
      return res.status(404).json({ message: "Profil non trouvé" });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({ message: "Erreur lors de la récupération du profil" });
  }
};

// Récupérer tous les profils
module.exports.getAllProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find();
    res.status(200).json(profiles);
  } catch (error) {
    console.error('Erreur lors de la récupération des profils:', error);
    res.status(500).json({ message: "Erreur lors de la récupération des profils" });
  }
};

// Supprimer un profil
module.exports.deleteProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const profile = await Profile.findOneAndDelete({ userId });
    
    if (!profile) {
      return res.status(404).json({ message: "Profil non trouvé" });
    }

    res.status(200).json({ message: "Profil supprimé avec succès" });
  } catch (error) {
    console.error('Erreur lors de la suppression du profil:', error);
    res.status(500).json({ message: "Erreur lors de la suppression du profil" });
  }
};

// Rechercher des profils par compétences
module.exports.searchProfilesBySkills = async (req, res) => {
  try {
    const { skills } = req.query;
    if (!skills) {
      return res.status(400).json({ message: "Les compétences sont requises" });
    }

    const skillsArray = skills.split(',').map(skill => skill.trim());
    const profiles = await Profile.find({
      'skills.name': { $in: skillsArray }
    });

    res.status(200).json(profiles);
  } catch (error) {
    console.error('Erreur lors de la recherche des profils:', error);
    res.status(500).json({ message: "Erreur lors de la recherche des profils" });
  }
}; 