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

const generateMockRecommendation = (profile, matchedSchemes) => {
  const topSchemes = matchedSchemes.slice(0, 3).map(s => {
    let reason = `Based on your profile as a ${profile.occupation || 'citizen'} in ${profile.state || 'India'}, this scheme offers significant benefits.`;
    const id = s.id || '';
    if (id === 'pm-kisan') {
      reason = `Since you are a farmer, this provides direct income support of ₹6,000/year to support your agricultural activities.`;
    } else if (id === 'sanjay-gandhi-niradhar') {
      reason = `As a widow residing in Maharashtra, this provides crucial monthly financial support of ₹1,500 for your daily livelihood.`;
    } else if (id === 'ignwps') {
      reason = `As a widow, this provides essential monthly pension benefits from the central government.`;
    } else if (id === 'ayushman-bharat') {
      reason = `This offers vital free cashless health insurance cover up to ₹5 Lakh per year for you and your family.`;
    } else if (id === 'pmuy') {
      reason = `This provides a free LPG connection and cylinder subsidy, helping you transition to clean cooking.`;
    } else if (id === 'pmjjby') {
      reason = `Provides highly affordable life insurance cover of ₹2 Lakh to secure your family's future.`;
    } else if (id === 'pmsby') {
      reason = `Provides accidental death and disability insurance cover of ₹2 Lakh at an extremely low annual premium.`;
    }
    return {
      id: s.id,
      name: s.name,
      reason
    };
  });

  const languageMix = profile.gender === 'Female' ? 'Behen' : 'Bhai';
  const nameLabel = profile.name ? `${profile.name} ji` : 'Aap';
  const personalizedMessage = `Namaste ${nameLabel}! Sarkaari schemes ke saare laabh aap tak pahunchane ke liye BharatSahayak taiyaar hai. Aapke profile ke mutabiq, humne sabse behtareen schemes chuni hain jinme aap aasaani se aavedan kar sakte hain. Please checklist ke anusar apne documents taiyaar rakhein.`;

  const documentsToArrange = Array.from(new Set(
    matchedSchemes.slice(0, 3).flatMap(s => s.documentsRequired || s.documents || [])
  ));

  return {
    topSchemes,
    personalizedMessage,
    documentsToArrange: documentsToArrange.length > 0 ? documentsToArrange : ["Aadhaar Card", "Bank Account Passbook", "Mobile Number"]
  };
};

const aiRecommend = async (req, res) => {
  const { profile, matchedSchemes } = req.body;

  try {
    if (!profile || !matchedSchemes) {
      return res.status(400).json({ message: 'Missing profile or matchedSchemes' });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      console.warn('[WARNING] ANTHROPIC_API_KEY is not set in backend/.env. Falling back to dynamic mock recommendations.');
      const mockData = generateMockRecommendation(profile, matchedSchemes);
      return res.json(mockData);
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
      model: "claude-opus-4-7", // Standard Opus model
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
    console.error('Error generating AI recommendation, falling back to mock:', error.message);
    const mockData = generateMockRecommendation(profile, matchedSchemes);
    res.json(mockData);
  }
};

module.exports = {
  matchSchemes,
  aiRecommend
};
