const fs = require('fs');
const path = require('path');
const { Mistral } = require('@mistralai/mistralai');
const supabase = require('../config/supabase');

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

    if (!process.env.MISTRAL_API_KEY) {
      return res.status(500).json({ message: 'MISTRAL_API_KEY is not configured in .env' });
    }

    const mistral = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

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

    const response = await mistral.chat.complete({
      model: 'mistral-large-latest',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      responseFormat: { type: 'json_object' },
      maxTokens: 1000,
    });

    const jsonText = response.choices[0].message.content;
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response as JSON');
    }

    const parsedData = JSON.parse(jsonMatch[0]);

    // ── Supabase persistence (non-blocking – errors are logged but never break response) ──
    try {
      if (supabase) {
        // 1. Upsert user profile by mobile to avoid duplicates
        const profilePayload = {
          name:           profile.name          || null,
          age:            profile.age !== undefined ? Number(profile.age) : null,
          gender:         profile.gender         || null,
          marital_status: profile.maritalStatus  || profile.marital_status  || null,
          category:       profile.category       || null,
          state:          profile.state          || null,
          district:       profile.district       || null,
          occupation:     profile.occupation     || null,
          annual_income:  profile.annualIncome !== undefined
                            ? Number(profile.annualIncome)
                            : (profile.annual_income !== undefined ? Number(profile.annual_income) : null),
          mobile:         profile.mobile         || null,
        };

        const { data: upsertedProfile, error: profileError } = await supabase
          .from('profiles')
          .upsert(profilePayload, { onConflict: 'mobile', ignoreDuplicates: false })
          .select('id')
          .single();

        if (profileError) {
          console.error('⚠️  Supabase profile upsert error:', profileError.message);
        } else {
          const profileId = upsertedProfile?.id;

          // 2. Insert recommendation linked to profile
          const { error: recError } = await supabase
            .from('user_recommendations')
            .insert({
              profile_id:         profileId,
              matched_schemes:    matchedSchemes,
              ai_recommendation:  parsedData,
            });

          if (recError) {
            console.error('⚠️  Supabase recommendation insert error:', recError.message);
          } else {
            console.log(`✅  Saved profile (id: ${profileId}) & recommendation to Supabase`);
          }
        }
      } else {
        console.warn('⚠️  Supabase client is null – skipping DB save');
      }
    } catch (dbErr) {
      // DB errors must never break the API response
      console.error('⚠️  Supabase persistence error (non-fatal):', dbErr.message);
    }
    // ── End Supabase persistence ──

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
