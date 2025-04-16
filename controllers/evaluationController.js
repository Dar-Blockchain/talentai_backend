const {  OpenAI } = require("openai");
require("dotenv").config();

// Configure the OpenAI client with your API key
let apikey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey:apikey});

exports.generateQuestions = async (req, res) => {
  try {
    const user = req.user;

    // Check if the user has an associated profile
    if (!user.profile) {
      return res.status(400).json({ error: "User profile not found." });
    }

    const { skills } = user.profile;

    // Check if the profile has skills defined
    if (!skills || skills.length === 0) {
      return res.status(400).json({ error: "No skills found in the user profile." });
    }

    // Build a readable list of skills with experience and proficiency levels
    const skillsList = skills
      .map(skill => `${skill.name} (Experience Level: ${skill.experienceLevel}, Proficiency: ${skill.proficiencyLevel}/5)`)
      .join(", ");

    // Create a detailed prompt based on user's skills
    const prompt = `You are an experienced technical interviewer. Based on the candidate's following skills: ${skillsList}, generate a list of 10 situational interview questions to thoroughly evaluate their technical profile. Format your response as a numbered list.`;

    // Generate questions using OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an experienced interviewer conducting a technical interview." },
        { role: "user", content: prompt }
      ],
      max_tokens: 500,
      temperature: 0.7,
      n: 1
    });

    const questions = response.choices[0].message.content;

    res.json({ questions });
  } catch (error) {
    console.error("Error generating questions:", error.message);
    res.status(500).json({ error: "Failed to generate questions" });
  }
};
