const {  OpenAI } = require("openai");
require("dotenv").config();

// Configure the OpenAI client with your API key
let apikey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey:apikey});

exports.generateQuestions = async (req, res) => {
  const { skills, experience } = req.body;
  console.log(skills, experience);
  
  if (!skills || !experience) {
    return res.status(400).json({ error: 'Missing required parameters: skills and experience' });
  }
  
  try {
    const prompt = `You are an interviewer. Considering the skills: ${skills} and experience: ${experience}, generate a list of 10 situational interview questions to evaluate the candidate's profile. Format your response as a numbered list.`;

    // Generate completion using the OpenAI SDK
    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: "You are an interviewer" },
            { role: "user", content: prompt }
          ],
      max_tokens: 300,
      temperature: 0.7,
      n: 1
    });

    const questions =  response.choices[0].message.content;
    res.json({ questions });
  } catch (error) {
    console.error("Error from OpenAI API: ", error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to generate questions' });
  }
};
