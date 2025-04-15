const profileService = require('../services/profileService');

// Créer ou mettre à jour un profil
const createOrUpdateProfile = async (req, res) => {
  try {
    const userId = req.user._id; // Récupérer l'ID de l'utilisateur à partir du token JWT
    const profileData = req.body;
    
    const profile = await profileService.createOrUpdateProfile(userId, profileData);
    
    res.status(200).json({
      message: 'Profil créé/mis à jour avec succès',
      profile
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Récupérer le profil de l'utilisateur connecté
const getMyProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const profile = await profileService.getProfileByUserId(userId);
    
    res.status(200).json(profile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Récupérer un profil par ID utilisateur
const getProfileById = async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await profileService.getProfileByUserId(userId);
    
    res.status(200).json(profile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Récupérer tous les profils
const getAllProfiles = async (req, res) => {
  try {
    const profiles = await profileService.getAllProfiles();
    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Supprimer un profil
const deleteProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const result = await profileService.deleteProfile(userId);
    
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Rechercher des profils par compétences
const searchProfilesBySkills = async (req, res) => {
  try {
    const { skills } = req.query;
    const skillsArray = skills ? skills.split(',') : [];
    
    const profiles = await profileService.searchProfilesBySkills(skillsArray);
    res.status(200).json(profiles);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createOrUpdateProfile,
  getMyProfile,
  getProfileById,
  getAllProfiles,
  deleteProfile,
  searchProfilesBySkills
}; 