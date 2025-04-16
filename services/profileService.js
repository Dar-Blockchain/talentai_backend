const Profile = require('../models/ProfileModel');
const User = require('../models/UserModel');

// Créer ou mettre à jour un profil utilisateur
module.exports.createOrUpdateProfile = async (userId, profileData) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    // Mise à jour du rôle utilisateur
    if (profileData.type) {
      const userRole = profileData.type === 'Company' ? 'Company' : 'Candidat';
      await User.findByIdAndUpdate(userId, { role: userRole });
    }

    // Rechercher un profil existant
    let profile = await Profile.findOne({ userId });

    if (!profile) {
      // Créer un nouveau profil s'il n'existe pas encore
      profile = await Profile.create({
        userId,
        type: profileData.type,
        skills: profileData.skills || []
      });
    } else {
      // Mise à jour des compétences existantes ou ajout de nouvelles compétences
      if (profileData.skills && Array.isArray(profileData.skills)) {
        profileData.skills.forEach((newSkill) => {
          const existingSkill = profile.skills.find(skill => skill.name === newSkill.name);
          if (existingSkill) {
            // Modifier les compétences existantes
            existingSkill.proficiencyLevel = newSkill.proficiencyLevel;
            existingSkill.experienceLevel = newSkill.experienceLevel;
          } else {
            // Ajouter une nouvelle compétence au profil
            profile.skills.push(newSkill);
          }
        });
      }

      // Mettre à jour le type du profil si fourni
      profile.type = profileData.type || profile.type;

      // Enregistrer les modifications
      await profile.save();
    }

    // Mise à jour référence du profil dans User
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