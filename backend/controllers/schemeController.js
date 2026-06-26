const fs = require('fs');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');

// Path to schemes.json
const schemesFilePath = path.join(__dirname, '../../scheme-data/schemes.json');

const matchSchemes = (req, res) => {
  try {
    const { age, gender, category, occupation, annualIncome, maritalStatus, state } = req.body;

    // Optional: basic validation
    if (age === undefined || !gender || !category || !occupation || annualIncome === undefined || !maritalStatus || !state) {
        return res.status(400).json({ message: 'Missing one or more required profile fields' });
    }

    const schemesData = fs.readFileSync(schemesFilePath, 'utf8');
    const schemes = JSON.parse(schemesData);

    const matchedSchemes = schemes.filter(scheme => {
      const el = scheme.eligibility;

      // Check age
      if (age < el.minAge) return false;
      if (el.maxAge !== null && age > el.maxAge) return false;

      // Check gender
      if (el.gender !== 'any' && el.gender.toLowerCase() !== gender.toLowerCase()) return false;

      // Check category
      const userCategory = category.toLowerCase();
      if (!el.category.includes('any') && !el.category.map(c => c.toLowerCase()).includes(userCategory)) return false;

      // Check occupation
      const userOccupation = occupation.toLowerCase();
      if (!el.occupation.includes('any') && !el.occupation.map(o => o.toLowerCase()).includes(userOccupation)) return false;

      // Check income
      if (el.maxAnnualIncome !== null && annualIncome > el.maxAnnualIncome) return false;

      // Check state
      if (el.state.toLowerCase() !== 'all' && el.state.toLowerCase() !== state.toLowerCase()) return false;

      // Check marital status
      if (el.maritalStatus !== 'any' && el.maritalStatus.toLowerCase() !== maritalStatus.toLowerCase()) return false;

      return true;
    });

    res.json(matchedSchemes);
  } catch (error) {
    console.error('Error matching schemes:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const aiRecommend = async (req, res) => {
  try {
    const { profile, matchedSchemes } = req.body;

    if (!profile || !matchedSchemes) {
      return res.status(400).json({ message: 'Missing profile or matchedSchemes' });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({ message: 'ANTHROPIC_API_KEY is not configured in .env' });
    }

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const systemPrompt = `You are BharatSahayak AI, an expert advisor for Indian government schemes.
Given a user profile and a list of schemes they are eligible for, you must provide:
1. The top 3 priority schemes (from the provided list) that give the highest impact/value to this user, along with a short reason why.
2. A single personalized, encouraging message in a mix of simple Hindi (transliterated or Devanagari) and English.
3. A consolidated list of missing documents they should arrange based on the top 3 schemes.

You must respond ONLY with a valid JSON object in the following exact format without any markdown wrappers or extra text:
{
  "topSchemes": [
    { "id": "scheme-id", "name": "Scheme Name", "reason": "Why this is recommended" }
  ],
  "personalizedMessage": "Your personalized message here",
  "documentsToArrange": ["Document 1", "Document 2"]
}`;

    const userMessage = `User Profile:\n${JSON.stringify(profile, null, 2)}\n\nEligible Schemes:\n${JSON.stringify(matchedSchemes.map(s => ({ id: s.id, name: s.name, amount: s.amount, docs: s.documentsRequired })), null, 2)}`;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6", // Requested model
      max_tokens: 1000,
      system: systemPrompt,
      messages: [
        { role: "user", content: userMessage }
      ]
    });

    const jsonText = response.content[0].text;
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse AI response as JSON");
    }

    const parsedData = JSON.parse(jsonMatch[0]);
    res.json(parsedData);
  } catch (error) {
    console.error('Error generating AI recommendation:', error);
    res.status(500).json({ message: 'Error generating AI recommendation', error: error.message });
  }
};

module.exports = {
  matchSchemes,
  aiRecommend
};
