const Profile = require('../models/ProfileModel');
const User = require('../models/UserModel');

// Créer ou mettre à jour un profil utilisateur
const createOrUpdateProfile = async (userId, profileData) => {
  try {
    // Vérifier si l'utilisateur existe
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    // Vérifier si le profil existe déjà
    let profile = await Profile.findOne({ userId });

    // Formater les compétences
    const formattedSkills = profileData.skills.map(skill => ({
      name: skill.name,
      proficiencyLevel: skill.proficiencyLevel || 0
    }));

    if (profile) {
      // Mettre à jour le profil existant
      profile = await Profile.findOneAndUpdate(
        { userId },
        {
          ...profileData,
          skills: formattedSkills
        },
        { new: true, runValidators: true }
      );
    } else {
      // Créer un nouveau profil
      profile = await Profile.create({
        userId,
        ...profileData,
        skills: formattedSkills
      });
    }

    return profile;
  } catch (error) {
    console.error('Erreur lors de la création/mise à jour du profil:', error);
    throw error;
  }
};

// Récupérer un profil par ID utilisateur
const getProfileByUserId = async (userId) => {
  try {
    const profile = await Profile.findOne({ userId });
    if (!profile) {
      throw new Error('Profil non trouvé');
    }
    return profile;
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    throw error;
  }
};

// Récupérer tous les profils
const getAllProfiles = async () => {
  try {
    const profiles = await Profile.find().populate('userId', 'username email');
    return profiles;
  } catch (error) {
    console.error('Erreur lors de la récupération des profils:', error);
    throw error;
  }
};

// Supprimer un profil
const deleteProfile = async (userId) => {
  try {
    const profile = await Profile.findOneAndDelete({ userId });
    if (!profile) {
      throw new Error('Profil non trouvé');
    }
    return { message: 'Profil supprimé avec succès' };
  } catch (error) {
    console.error('Erreur lors de la suppression du profil:', error);
    throw error;
  }
};

// Rechercher des profils par compétences
const searchProfilesBySkills = async (skills) => {
  try {
    const profiles = await Profile.find({
      'skills.name': { $in: skills }
    }).populate('userId', 'username email');
    return profiles;
  } catch (error) {
    console.error('Erreur lors de la recherche des profils:', error);
    throw error;
  }
};

module.exports = {
  createOrUpdateProfile,
  getProfileByUserId,
  getAllProfiles,
  deleteProfile,
  searchProfilesBySkills
}; 