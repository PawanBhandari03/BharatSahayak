const fs = require('fs');
const path = require('path');
const { Mistral } = require('@mistralai/mistralai');
const supabase = require('../config/supabase');
<<<<<<< HEAD
=======
const { randomUUID } = require('crypto');
>>>>>>> rahul/frontend

// Path to schemes.json
const schemesFilePath = path.join(__dirname, '../../scheme-data/schemes.json');

const mapProfileToDb = (p) => {
  // Convert empty strings to null for numeric columns
  const toNum = (v) => {
    if (v === '' || v === null || v === undefined) return null;
    const n = Number(v);
    return isNaN(n) ? null : n;
  };
  // Convert empty strings / undefined to null for boolean columns
  const toBool = (v) => {
    if (v === '' || v === null || v === undefined) return null;
    if (typeof v === 'boolean') return v;
    if (v === 'true' || v === '1') return true;
    if (v === 'false' || v === '0') return false;
    return null;
  };

  const allowed = { id: randomUUID() };

  if (p.name !== undefined) allowed.name = p.name || null;
  if (p.age !== undefined) allowed.age = toNum(p.age);
  if (p.gender !== undefined) allowed.gender = p.gender || null;
  if (p.category !== undefined) allowed.category = p.category || null;
  if (p.state !== undefined) allowed.state = p.state || null;
  if (p.district !== undefined) allowed.district = p.district || null;
  if (p.occupation !== undefined) allowed.occupation = p.occupation || null;
  if (p.mobile !== undefined) allowed.mobile = p.mobile || null;
  else if (p.phone !== undefined) allowed.mobile = p.phone || null;

  if (p.maritalStatus !== undefined) allowed.marital_status = p.maritalStatus || null;
  else if (p.marital_status !== undefined) allowed.marital_status = p.marital_status || null;

  if (p.aadhaarLast4 !== undefined) allowed.aadhaar_last_4 = p.aadhaarLast4 || null;
  else if (p.aadhaar_last_4 !== undefined) allowed.aadhaar_last_4 = p.aadhaar_last_4 || null;

  if (p.hasLand !== undefined) allowed.has_land = toBool(p.hasLand);
  else if (p.has_land !== undefined) allowed.has_land = toBool(p.has_land);

  if (p.landAcres !== undefined) allowed.land_acres = parseFloat(p.landAcres) || 0;
  else if (p.land_acres !== undefined) allowed.land_acres = parseFloat(p.land_acres) || 0;

  if (p.hasSmartphone !== undefined) allowed.has_smartphone = toBool(p.hasSmartphone);
  else if (p.has_smartphone !== undefined) allowed.has_smartphone = toBool(p.has_smartphone);

  if (p.incomeRange !== undefined) allowed.income_range = p.incomeRange || null;
  else if (p.income_range !== undefined) allowed.income_range = p.income_range || null;

  if (p.annualIncome !== undefined) allowed.annual_income = parseFloat(p.annualIncome) || 0;
  else if (p.annual_income !== undefined) allowed.annual_income = parseFloat(p.annual_income) || 0;

  if (p.familySize !== undefined) allowed.family_size = toNum(p.familySize);
  else if (p.family_size !== undefined) allowed.family_size = toNum(p.family_size);

  if (p.childrenCount !== undefined) allowed.children_count = toNum(p.childrenCount);
  else if (p.children !== undefined) allowed.children_count = toNum(p.children);
  else if (p.children_count !== undefined) allowed.children_count = toNum(p.children_count);

  if (p.hasBplCard !== undefined) allowed.has_bpl_card = toBool(p.hasBplCard);
  else if (p.has_bpl_card !== undefined) allowed.has_bpl_card = toBool(p.has_bpl_card);

  if (p.whatsappOptIn !== undefined) allowed.whatsapp_opt_in = toBool(p.whatsappOptIn);
  else if (p.whatsapp_opt_in !== undefined) allowed.whatsapp_opt_in = toBool(p.whatsapp_opt_in);

  if (p.pinHash !== undefined) allowed.pin_hash = p.pinHash || null;
  else if (p.pin_hash !== undefined) allowed.pin_hash = p.pin_hash || null;

  return allowed;
};

const saveToSupabase = async (profile, matchedSchemes, aiResponse) => {
  if (!supabase) return;
  try {
    const dbProfile = mapProfileToDb(profile);
    let profileId;

    if (dbProfile.mobile) {
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('mobile', dbProfile.mobile)
        .maybeSingle();
      
      if (existingProfile) {
        profileId = existingProfile.id;
        // Clean up the random UUID since we are using existing
        delete dbProfile.id;
        await supabase.from('profiles').update(dbProfile).eq('id', profileId);
      }
    }

    if (!profileId) {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert([dbProfile])
        .select();
      if (!profileError && profileData && profileData.length > 0) {
        profileId = profileData[0].id;
      } else if (profileError) {
        console.error('Supabase profile insert error:', profileError.message);
      }
    }

    if (profileId) {
      await supabase
        .from('user_recommendations')
        .insert([{
          profile_id: profileId,
          matched_schemes: matchedSchemes,
          ai_response: aiResponse
        }]);
    }
  } catch (dbError) {
    console.error('Silent DB Error:', dbError.message);
  }
};

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
<<<<<<< HEAD
      return res.status(500).json({ message: 'MISTRAL_API_KEY is not configured in .env' });
    }

    const mistral = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

=======
      console.warn('[WARNING] MISTRAL_API_KEY is not set in backend/.env. Falling back to dynamic mock recommendations.');
      const mockData = generateMockRecommendation(profile, matchedSchemes);

      // Save to Supabase (silently)
      await saveToSupabase(profile, matchedSchemes, mockData);

      return res.json(mockData);
    }

>>>>>>> rahul/frontend
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

    const mistral = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

<<<<<<< HEAD
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
=======
    const userMessage = `${systemPrompt}\n\nUser Profile:\n${JSON.stringify(profile, null, 2)}\n\nEligible Schemes:\n${JSON.stringify(matchedSchemes.map(s => ({ id: s.id, name: s.name, amount: s.amount, docs: s.documentsRequired })), null, 2)}`;

    const response = await mistral.chat.complete({
      model: 'mistral-large-latest',
      messages: [{ role: 'user', content: userMessage }],
      responseFormat: { type: 'json_object' }
    });

    const jsonText = response.choices[0].message.content;
    const parsedData = JSON.parse(jsonText);

    // Save to Supabase (silently)
    await saveToSupabase(profile, matchedSchemes, parsedData);

    res.json(parsedData);
  } catch (error) {
    console.error('Error generating AI recommendation, falling back to mock:', error.message);
    const mockData = generateMockRecommendation(profile, matchedSchemes);

    // Save to Supabase (silently) even on fallback
    await saveToSupabase(profile, matchedSchemes, mockData);

    res.json(mockData);
>>>>>>> rahul/frontend
  }
};

module.exports = {
  matchSchemes,
  aiRecommend
};
