const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      enum: ["Candidate", "Recruiter", "Company"],
    },
    skills: [
      {
        name: String,
        proficiencyLevel: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);
