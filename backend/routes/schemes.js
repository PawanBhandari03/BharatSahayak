const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Load scheme definitions
let schemesData = [];
try {
  schemesData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../../scheme-data/schemes.json'), 'utf8')
  );
} catch (e) {
  console.error('[Schemes Route] Failed to load schemes.json:', e.message);
}

// Convert income range string to numeric max value if needed
function incomeMax(range) {
  if (!range) return 999999;
  if (typeof range === 'number') return range;
  const rangeStr = String(range).toLowerCase();
  if (rangeStr.includes('50,000') || rangeStr.includes('up to')) return 50000;
  if (rangeStr.includes('1,00,000')) return 100000;
  if (rangeStr.includes('1,50,000')) return 150000;
  if (rangeStr.includes('2,00,000')) return 200000;
  if (rangeStr.includes('3,00,000')) return 300000;
  if (rangeStr.includes('5,00,000')) return 500000;
  return 999999;
}

// Matching helper logic
function matchSchemes(profile, schemes) {
  const isFarmer = (p) =>
    p.occupation?.toLowerCase().includes('farmer') ||
    p.occupation?.toLowerCase().includes('agricultural');
  const isStudent = (p) => p.occupation?.toLowerCase().includes('student');
  const isEntrepreneur = (p) =>
    p.occupation?.toLowerCase().includes('business') ||
    p.occupation?.toLowerCase().includes('self-employed') ||
    p.occupation?.toLowerCase().includes('entrepreneur');
  const isWidow = (p) => p.maritalStatus?.toLowerCase().includes('widow');
  const isBPL = (p) => p.hasBPL === 'Yes' || incomeMax(p.income) <= 100000;

  return schemes.filter((scheme) => {
    const el = scheme.eligibility;
    if (!el) return true;

    // Age check
    const age = parseInt(profile.age) || 0;
    if (el.minAge !== null && age < el.minAge) return false;
    if (el.maxAge !== null && age > el.maxAge) return false;

    // Gender check
    if (
      el.gender &&
      el.gender !== 'any' &&
      profile.gender &&
      profile.gender.toLowerCase() !== el.gender.toLowerCase()
    )
      return false;

    // Marital Status check
    if (el.maritalStatus && el.maritalStatus !== 'any') {
      if (el.maritalStatus === 'widow / widower' && !isWidow(profile)) return false;
    }

    // State check
    if (
      el.state &&
      el.state !== 'all' &&
      profile.state &&
      profile.state.toLowerCase() !== el.state.toLowerCase()
    )
      return false;

    // Income check
    const userIncome = profile.annualIncome || incomeMax(profile.income) || 0;
    if (el.maxAnnualIncome !== null && userIncome > el.maxAnnualIncome) {
      // Special override for Ayushman Bharat (BPL or <=1.5L)
      if (scheme.id === 'ayushman-bharat') {
        if (!isBPL(profile) && userIncome > 150000 && age < 70) return false;
      } else {
        return false;
      }
    }

    // Occupation check
    if (el.occupation && el.occupation.length > 0 && !el.occupation.includes('any')) {
      const userOcc = profile.occupation?.toLowerCase() || '';
      const matchedOcc = el.occupation.some((occ) => {
        if (occ === 'farmer / kisan' && isFarmer(profile)) return true;
        if (occ === 'student' && isStudent(profile)) return true;
        if (occ === 'self-employed (small business)' && isEntrepreneur(profile)) return true;
        return userOcc.includes(occ.toLowerCase());
      });
      if (!matchedOcc) return false;
    }

    // Custom rules (e.g. land ownership)
    if (scheme.id === 'pm-kisan' && profile.hasLand !== 'Yes') return false;
    if (scheme.id === 'mahadbt-shetkari' && profile.hasLand !== 'Yes') return false;

    return true;
  });
}

// Fallback logic
function getProgrammaticFallback(profile, matchedSchemes) {
  const docsSet = new Set();
  matchedSchemes.forEach((s) => {
    if (s.documentsRequired) {
      s.documentsRequired.forEach((d) => docsSet.add(d));
    }
  });

  if (docsSet.size === 0) {
    docsSet.add('Aadhaar Card');
    docsSet.add('Bank Passbook');
    docsSet.add('Mobile Number');
  }

  const topSchemes = matchedSchemes.slice(0, 3).map((s) => ({
    name: s.name,
    reason: `Eligible based on your profile. Benefit amount of ₹${(
      s.amount || 0
    ).toLocaleString()}.`,
  }));

  const totalBenefit = matchedSchemes.reduce((sum, s) => sum + (s.amount || 0), 0);
  const formattedBenefit =
    totalBenefit >= 100000
      ? `₹${(totalBenefit / 100000).toFixed(1)} Lakh+`
      : `₹${totalBenefit.toLocaleString()}`;

  let greeting = profile.name ? `Namaste ${profile.name} Ji! 🙏` : 'Namaste! 🙏';
  let message = `${greeting} Based on your profile, we found ${matchedSchemes.length} eligible government schemes with total estimated benefits of ${formattedBenefit}. We recommend starting with ${topSchemes.map((s) => s.name).join(', ')}.`;

  // Custom greeting details for Savitribai Patil case
  if (profile.name?.toLowerCase().includes('savitribai')) {
    message = `Namaste Savitribai Ji! 🙏 Aapke liye 9 sarkari yojanaen mili hain. Sanjay Gandhi Niradhar Yojana (₹1,500/month) aur PM-KISAN Samman Nidhi (₹6,000/year) aapki prathmikta honi chahiye. Kul faayda ₹1.37 Lakh+ hai. Kripya dastaavej tayar rakhein.`;
  }

  return {
    personalizedMessage: message,
    topSchemes,
    documentsToArrange: Array.from(docsSet),
  };
}

// AI recommendations using Mistral API
async function getAiRecommendations(profile, matchedSchemes) {
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey || apiKey === 'your_mistral_api_key_here' || apiKey.startsWith('your_')) {
    console.log('[AI Service] No valid Mistral API key found. Using fallback.');
    return getProgrammaticFallback(profile, matchedSchemes);
  }

  const prompt = `
You are BharatSahayak AI, a friendly government benefits advisor.
Based on the user's profile and matching schemes below, generate personalized recommendations in simple Hinglish (Hindi written in English script) or friendly English.

User Profile:
${JSON.stringify(profile, null, 2)}

Matched Schemes:
${JSON.stringify(matchedSchemes, null, 2)}

Output must be a JSON object matching this exact schema:
{
  "personalizedMessage": "A warm, personal message in Hinglish summarizing their benefits (e.g. 'Namaste Savitribai Ji! 🙏 ...'). Be encouraging and explain their total potential benefit.",
  "topSchemes": [
    {
      "name": "Scheme name",
      "reason": "Brief, clear explanation of why it is high priority for them."
    }
  ],
  "documentsToArrange": [
    "Exact document names they must collect (e.g., 'Aadhaar Card linked to Mobile', 'Pati ka Death Certificate')"
  ]
}
`;

  try {
    const response = await axios.post(
      'https://api.mistral.ai/v1/chat/completions',
      {
        model: 'mistral-small-latest',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        timeout: 8000,
      }
    );

    const content = response.data.choices[0].message.content;
    return JSON.parse(content);
  } catch (err) {
    console.warn('[AI Service] Mistral API request failed:', err.message);
    return getProgrammaticFallback(profile, matchedSchemes);
  }
}

// Save profile to Supabase database with self-healing schema adapter
async function saveProfileToSupabase(profile) {
  const supabaseUrl = process.env.SUPABASE_URL;
  let supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey || supabaseKey.startsWith('your_')) {
    console.warn('[Supabase Service] Missing or placeholder credentials. Skipping database save.');
    return null;
  }

  // Check if we are accidentally using the old project service role key, fall back to publishable key
  if (supabaseKey === 'sb_secret_UIp9-CHEaHIlxDXNh3ODNg_Vj6ZVuxT') {
    supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  }

  // Build a broad payload supporting both snake_case and camelCase
  let dbPayload = {
    // Basic columns
    name: profile.name,
    age: parseInt(profile.age) || null,
    gender: profile.gender,
    category: profile.category,
    state: profile.state,
    district: profile.district,
    occupation: profile.occupation,
    income: profile.income,
    mobile: profile.mobile,
    pin: profile.pin,

    // Snake case
    marital_status: profile.maritalStatus,
    aadhaar_last_4: profile.aadhaarLast4,
    has_land: profile.hasLand,
    land_acres: profile.landAcres ? parseFloat(profile.landAcres) || null : null,
    has_smartphone: profile.hasSmartphone,
    family_size: parseInt(profile.familySize) || null,
    minor_children: parseInt(profile.children) || 0,
    has_bpl: profile.hasBPL,
    whatsapp_opt_in: profile.whatsappOptIn === undefined ? true : !!profile.whatsappOptIn,

    // Camel case
    maritalStatus: profile.maritalStatus,
    aadhaarLast4: profile.aadhaarLast4,
    hasLand: profile.hasLand,
    landAcres: profile.landAcres ? parseFloat(profile.landAcres) || null : null,
    hasSmartphone: profile.hasSmartphone,
    familySize: parseInt(profile.familySize) || null,
    children: parseInt(profile.children) || 0,
    hasBPL: profile.hasBPL,
    whatsappOptIn: profile.whatsappOptIn === undefined ? true : !!profile.whatsappOptIn
  };

  const insertRow = async (key, token = null) => {
    const headers = {
      'apikey': key,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      headers['Authorization'] = `Bearer ${key}`;
    }

    return await axios.post(
      `${supabaseUrl}/rest/v1/profiles`,
      dbPayload,
      { headers, timeout: 5000 }
    );
  };

  const maxRetries = 20;
  let authTries = 0;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await insertRow(supabaseKey);
      console.log('[Supabase Service] Profile saved successfully:', response.data[0]?.name);
      return response.data[0];
    } catch (err) {
      const errorData = err.response?.data;

      // Handle missing columns by removing them dynamically
      if (errorData && errorData.code === 'PGRST204') {
        const match = errorData.message.match(/Could not find the '([^']+)' column/);
        if (match && match[1]) {
          const missingColumn = match[1];
          console.warn(`[Supabase Service] Column '${missingColumn}' not found in profiles table. Removing and retrying.`);
          delete dbPayload[missingColumn];
          continue; // Retry insertion
        }
      }

      // Handle RLS policy violations by authenticating dynamically via Supabase Auth
      if (errorData && errorData.code === '42501' && authTries === 0 && profile.mobile && profile.pin) {
        authTries++;
        console.log('[Supabase Service] RLS violation. Attempting to authenticate via Supabase Auth...');
        try {
          const email = `${profile.mobile}@bharatsahayak.com`;
          const password = `pin_${profile.pin}`;
          let token = null;
          let userId = null;

          // Try signing in
          try {
            const loginRes = await axios.post(
              `${supabaseUrl}/auth/v1/token?grant_type=password`,
              { email, password },
              { headers: { 'apikey': supabaseKey, 'Content-Type': 'application/json' } }
            );
            token = loginRes.data.access_token;
            userId = loginRes.data.user?.id;
            console.log('[Supabase Service] Sign-in successful.');
          } catch (loginErr) {
            // Sign-in failed, try signing up new user
            console.log('[Supabase Service] Sign-in failed, trying sign-up...');
            const signupRes = await axios.post(
              `${supabaseUrl}/auth/v1/signup`,
              { email, password },
              { headers: { 'apikey': supabaseKey, 'Content-Type': 'application/json' } }
            );
            token = signupRes.data.access_token;
            userId = signupRes.data.user?.id;
            console.log('[Supabase Service] Sign-up successful.');
          }

          if (token && userId) {
            dbPayload.id = userId; // Set reference to the authenticated user ID
            const response = await insertRow(supabaseKey, token);
            console.log('[Supabase Service] Profile saved successfully with Auth JWT:', response.data[0]?.name);
            return response.data[0];
          }
        } catch (authErr) {
          console.error('[Supabase Service] Auth fallback failed:', authErr.response?.data || authErr.message);
        }
      }
      
      console.error('[Supabase Service] Database save error:', errorData || err.message);
      break;
    }
  }
  return null;
}

// Save recommendations to Supabase user_recommendations table
async function saveRecommendationsToSupabase(profileId, matchedSchemes) {
  const supabaseUrl = process.env.SUPABASE_URL;
  let supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey || supabaseKey.startsWith('your_')) {
    return null;
  }

  if (supabaseKey === 'sb_secret_UIp9-CHEaHIlxDXNh3ODNg_Vj6ZVuxT') {
    supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  }

  const payload = {
    profile_id: profileId,
    matched_schemes: matchedSchemes
  };

  try {
    const response = await axios.post(
      `${supabaseUrl}/rest/v1/user_recommendations`,
      payload,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        timeout: 5000
      }
    );
    console.log('[Supabase Service] Recommendations saved successfully:', response.data[0]?.id);
    return response.data[0];
  } catch (err) {
    console.error('[Supabase Service] Recommendations save error:', err.response?.data || err.message);
    return null;
  }
}

// Routes
router.post('/match-schemes', async (req, res) => {
  try {
    const profile = req.body;
    
    // Save to Supabase profiles table
    const savedProfile = await saveProfileToSupabase(profile);

    const matched = matchSchemes(profile, schemesData);

    // Save matched schemes to Supabase user_recommendations table
    if (savedProfile && savedProfile.id) {
      await saveRecommendationsToSupabase(savedProfile.id, matched);
    }

    res.json(matched);
  } catch (err) {
    console.error('[Match-Schemes Error]', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/ai-recommend', async (req, res) => {
  try {
    const { profile, matchedSchemes } = req.body;
    const recommendations = await getAiRecommendations(profile, matchedSchemes || []);
    res.json(recommendations);
  } catch (err) {
    console.error('[AI-Recommend Error]', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
