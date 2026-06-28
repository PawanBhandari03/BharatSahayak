const fs = require('fs');
const path = require('path');
const { Mistral } = require('@mistralai/mistralai');
const supabase = require('../config/supabase');
const { randomUUID } = require('crypto');

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
    const str = String(v).toLowerCase().trim();
    if (str === 'true' || str === '1' || str === 'yes') return true;
    if (str === 'false' || str === '0' || str === 'no') return false;
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
  else if (p.income !== undefined && typeof p.income === 'string') allowed.income_range = p.income || null;
  else if (p.income_range !== undefined) allowed.income_range = p.income_range || null;

  if (p.annualIncome !== undefined) allowed.annual_income = parseFloat(p.annualIncome) || 0;
  else if (p.annual_income !== undefined) allowed.annual_income = parseFloat(p.annual_income) || 0;

  if (p.familySize !== undefined) allowed.family_size = toNum(p.familySize);
  else if (p.family_size !== undefined) allowed.family_size = toNum(p.family_size);

  if (p.childrenCount !== undefined) allowed.children_count = toNum(p.childrenCount);
  else if (p.children !== undefined) allowed.children_count = toNum(p.children);
  else if (p.children_count !== undefined) allowed.children_count = toNum(p.children_count);

  if (p.hasBPL !== undefined) allowed.has_bpl_card = toBool(p.hasBPL);
  else if (p.hasBplCard !== undefined) allowed.has_bpl_card = toBool(p.hasBplCard);
  else if (p.has_bpl_card !== undefined) allowed.has_bpl_card = toBool(p.has_bpl_card);

  if (p.whatsappOptIn !== undefined) allowed.whatsapp_opt_in = toBool(p.whatsappOptIn);
  else if (p.whatsapp_opt_in !== undefined) allowed.whatsapp_opt_in = toBool(p.whatsapp_opt_in);

  if (p.pinHash !== undefined) allowed.pin_hash = p.pinHash || null;
  else if (p.pin_hash !== undefined) allowed.pin_hash = p.pin_hash || null;

  return allowed;
};

const saveToSupabase = async (profile, matchedSchemes, aiResponse) => {
  if (!supabase) {
    console.warn('⚠️ [saveToSupabase] Supabase client is null — skipping database save');
    return false;
  }
  try {
    const dbProfile = mapProfileToDb(profile);
    let profileId;

    console.log('📥 [saveToSupabase] Saving profile for mobile:', dbProfile.mobile || '(no mobile)');

    if (dbProfile.mobile) {
      const { data: existingProfile, error: fetchErr } = await supabase
        .from('profiles')
        .select('id')
        .eq('mobile', dbProfile.mobile)
        .maybeSingle();

      if (fetchErr) {
        console.error('❌ [saveToSupabase] Profile fetch error:', fetchErr.message);
      }

      if (existingProfile) {
        profileId = existingProfile.id;
        console.log('🔄 [saveToSupabase] Existing profile found, id:', profileId);
        delete dbProfile.id;
        const { error: updateErr } = await supabase.from('profiles').update(dbProfile).eq('id', profileId);
        if (updateErr) {
          console.error('❌ [saveToSupabase] Profile update failed:', updateErr.message, updateErr.details || '');
        } else {
          console.log('✅ [saveToSupabase] Profile updated successfully! ID:', profileId);
        }
      }
    }

    if (!profileId) {
      console.log('➕ [saveToSupabase] Inserting new profile...');
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert([dbProfile])
        .select();
      if (!profileError && profileData && profileData.length > 0) {
        profileId = profileData[0].id;
        console.log('✅ [saveToSupabase] New profile inserted successfully! ID:', profileId);
      } else if (profileError) {
        console.error('❌ [saveToSupabase] Profile insert failed:', profileError.message, profileError.details || '');
      }
    }

    if (profileId) {
      console.log('📤 [saveToSupabase] Inserting recommendation for profile_id:', profileId);
      const { error: recErr } = await supabase
        .from('user_recommendations')
        .insert([{
          profile_id: profileId,
          matched_schemes: matchedSchemes,
          ai_response: aiResponse
        }]);
      if (recErr) {
        console.error('❌ [saveToSupabase] Recommendation insert failed:', recErr.message, recErr.details || '');
        return false;
      } else {
        console.log('✅ [saveToSupabase] Recommendation saved successfully for profile_id:', profileId);
        return true;
      }
    } else {
      console.warn('⚠️ [saveToSupabase] No profileId resolved — recommendation not saved');
      return false;
    }
  } catch (dbError) {
    console.error('❌ [saveToSupabase] Caught exception during save:', dbError.message, dbError);
    return false;
  }
};

const matchSchemes = async (req, res) => {
  try {
    const profile = req.body;
    const { age, gender, category, occupation, annualIncome, maritalStatus, state } = profile;

    const userAge = age !== undefined ? Number(age) : null;
    const userIncome = annualIncome !== undefined ? Number(annualIncome) : 0;

    const schemesData = fs.readFileSync(schemesFilePath, 'utf8');
    const schemes = JSON.parse(schemesData);

    const matchedSchemes = schemes.filter(scheme => {
      const el = scheme.eligibility;
      if (!el) return true;

      // Check age
      if (userAge !== null) {
        if (el.minAge !== null && userAge < el.minAge) return false;
        if (el.maxAge !== null && userAge > el.maxAge) return false;
      }

      // Check gender
      if (gender && el.gender && el.gender !== 'any' && el.gender.toLowerCase() !== gender.toLowerCase()) return false;

      // Check category
      if (category && el.category && !el.category.includes('any')) {
        const userCategory = category.toLowerCase();
        if (!el.category.map(c => c.toLowerCase()).includes(userCategory)) return false;
      }

      // Check occupation
      if (occupation && el.occupation && !el.occupation.includes('any')) {
        const userOccupation = occupation.toLowerCase();
        if (!el.occupation.map(o => o.toLowerCase()).includes(userOccupation)) return false;
      }

      // Check income
      if (el.maxAnnualIncome !== null && userIncome > el.maxAnnualIncome) return false;

      // Check state
      if (state && el.state && el.state.toLowerCase() !== 'all' && el.state.toLowerCase() !== state.toLowerCase()) return false;

      // Check marital status
      if (maritalStatus && el.maritalStatus && el.maritalStatus !== 'any' && el.maritalStatus.toLowerCase() !== maritalStatus.toLowerCase()) return false;

      return true;
    });

    // ── Save to Supabase when /api/match-schemes is called ──
    saveToSupabase(profile, matchedSchemes, null).catch((e) =>
      console.error('❌ [schemeController:matchSchemes] Supabase save error:', e.message)
    );

    res.json(matchedSchemes);
  } catch (error) {
    console.error('❌ [schemeController:matchSchemes] Error matching schemes:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const aiRecommend = async (req, res) => {
  const { profile, matchedSchemes } = req.body;

  if (!profile || !matchedSchemes) {
    return res.status(400).json({ message: 'Missing profile or matchedSchemes' });
  }

  // ── Always persist profile + matched schemes to Supabase, regardless of AI outcome ──
  saveToSupabase(profile, matchedSchemes, null).catch((e) =>
    console.error('❌ [schemeController:aiRecommend] Supabase pre-save error:', e.message)
  );

  // ── If no Mistral key configured, return a structured fallback immediately ──
  if (!process.env.MISTRAL_API_KEY) {
    console.warn('⚠️ [schemeController:aiRecommend] MISTRAL_API_KEY not set — returning fallback recommendation');
    return res.json(buildFallback(matchedSchemes));
  }

  try {
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

    // Update the Supabase record with the actual AI response
    await saveToSupabase(profile, matchedSchemes, parsedData);

    res.json(parsedData);
  } catch (error) {
    console.error('❌ [schemeController:aiRecommend] Error generating AI recommendation — returning fallback:', error.message);
    // Still return valid data to the frontend using the fallback
    res.json(buildFallback(matchedSchemes));
  }
};

/**
 * Builds a structured fallback recommendation from the matched schemes list
 * so the frontend always gets a valid response even when Mistral is unavailable.
 */
const buildFallback = (matchedSchemes) => {
  const top = (matchedSchemes || []).slice(0, 3);
  return {
    topSchemes: top.map((s) => ({
      id: s.id,
      name: s.name,
      reason: 'Recommended based on your profile eligibility.',
    })),
    personalizedMessage:
      'Aapke profile ke aadhar par yeh yojanayen aapke liye sabse upyogi hain. In yojanaon ka labh zaroor uthayein! (Based on your profile, these schemes are most beneficial for you. Do avail them!)',
    documentsToArrange: [
      ...new Set(top.flatMap((s) => s.documentsRequired || [])),
    ].slice(0, 8),
  };
};

module.exports = {
  saveToSupabase,
  matchSchemes,
  aiRecommend
};
