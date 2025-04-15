const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  proficiencyLevel: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  }
});

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['Candidate', 'Recruiter', 'Company'],
    required: true
  },
  skills: [skillSchema],
  bio: {
    type: String,
    default: ''
  },
  experience: {
    type: Number,
    default: 0
  },
  education: [{
    institution: String,
    degree: String,
    field: String,
    startDate: Date,
    endDate: Date,
    description: String
  }],
  projects: [{
    title: String,
    description: String,
    technologies: [String],
    link: String,
    startDate: Date,
    endDate: Date
  }],
  certifications: [{
    name: String,
    issuer: String,
    date: Date,
    link: String
  }],
  socialLinks: {
    github: String,
    linkedin: String,
    twitter: String,
    portfolio: String
  },
  location: {
    country: String,
    city: String,
    address: String
  },
  languages: [{
    name: String,
    proficiency: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Native']
    }
  }],
  availability: {
    type: String,
    enum: ['Available', 'Not Available', 'Open to Offers'],
    default: 'Available'
  },
  hourlyRate: {
    type: Number,
    default: 0
  },
  preferredWorkType: {
    type: [String],
    enum: ['Remote', 'On-site', 'Hybrid'],
    default: []
  }
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema); 