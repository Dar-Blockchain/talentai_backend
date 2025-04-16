const Profile = require('../models/ProfileModel');
const User = require('../models/UserModel');

// Créer ou mettre à jour un profil utilisateur
module.exports.createOrUpdateProfile = async (userId, profileData) => {
  try {
    // Vérifier si l'utilisateur existe
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    // Mettre à jour le rôle utilisateur
    if (profileData.type) {
      let userRole;
      switch (profileData.type) {
        case 'Candidate':
          userRole = 'Candidat';
          break;
        case 'Company':
          userRole = 'Company';
          break;
        default:
          userRole = 'Candidat';
      }
      await User.findByIdAndUpdate(userId, { role: userRole });
    }

    // Vérifier si le profil existe déjà
    let profile = await Profile.findOne({ userId });

    // Préparer les données de profil à sauvegarder
    const profileDataToSave = {
      userId,
      type: profileData.type,
    };

    if (profileData.skills && Array.isArray(profileData.skills)) {
      // Ajouter ou remplacer les skills existants
      profileDataToSave.skills = profileData.skills;
    }

    if (profile) {
      // Mettre à jour en ajoutant les nouvelles skills aux existantes
      profile = await Profile.findOneAndUpdate(
        { userId },
        {
          ...profileDataToSave,
          $push: {
            skills: { $each: profileDataToSave.skills || [] },
          },
        },
        { new: true, runValidators: true }
      );
    } else {
      // Créer un nouveau profil
      profile = await Profile.create(profileDataToSave);
    }

    // Mettre à jour la référence du profil dans l'utilisateur
    await User.findByIdAndUpdate(userId, { profile: profile._id });

    return profile;
  } catch (error) {
    console.error('Erreur lors de la création/mise à jour du profil:', error);
    throw error;
  }
};


// Récupérer un profil par ID utilisateur
module.exports.getProfileByUserId = async (userId) => {
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
module.exports.getAllProfiles = async () => {
  try {
    const profiles = await Profile.find().populate('userId', 'username email');
    return profiles;
  } catch (error) {
    console.error('Erreur lors de la récupération des profils:', error);
    throw error;
  }
};

// Supprimer un profil
module.exports.deleteProfile = async (userId) => {
  try {
    const profile = await Profile.findOneAndDelete({ userId });
    if (!profile) {
      throw new Error('Profil non trouvé');
    }
    
    // Mettre à jour l'utilisateur pour supprimer la référence au profil
    await User.findByIdAndUpdate(userId, { $unset: { profile: 1 } });
    
    return { message: 'Profil supprimé avec succès' };
  } catch (error) {
    console.error('Erreur lors de la suppression du profil:', error);
    throw error;
  }
};

// Rechercher des profils par compétences
module.exports.searchProfilesBySkills = async (skills) => {
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