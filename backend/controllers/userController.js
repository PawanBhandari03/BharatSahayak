const supabase = require('../config/supabase');
const bcrypt = require('bcryptjs');

/**
 * POST /api/users/register
 * Saves a new user profile to Supabase after hashing the PIN.
 */
const registerUser = async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({ message: 'Database not configured. Set SUPABASE_URL and SUPABASE_SERVICE_KEY in .env' });
    }

    const {
      name,
      age,
      gender,
      maritalStatus,
      category,
      aadhaarLast4,
      state,
      district,
      occupation,
      hasLand,
      landAcres,
      hasSmartphone,
      income,          // income range string e.g. "Up to ₹50,000/year"
      annualIncome,    // computed number
      familySize,
      children,
      hasBPL,
      mobile,
      whatsappOptIn,
      pin,
    } = req.body;

    // Required field validation
    if (!name || !mobile || !pin) {
      return res.status(400).json({ message: 'name, mobile, and pin are required' });
    }

    // Check if mobile already exists
    const { data: existing, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('mobile', mobile)
      .maybeSingle();

    if (checkError) throw checkError;

    if (existing) {
      return res.status(409).json({ message: 'A user with this mobile number already exists' });
    }

    // Hash the PIN securely
    const pinHash = await bcrypt.hash(String(pin), 10);

    // Map camelCase form data to snake_case DB columns
    const newUser = {
      name,
      age: Number(age) || null,
      gender,
      marital_status: maritalStatus || null,
      category: category || null,
      aadhaar_last_4: aadhaarLast4 || null,
      state,
      district,
      occupation: occupation || null,
      has_land: Boolean(hasLand),
      land_acres: Number(landAcres) || 0,
      has_smartphone: Boolean(hasSmartphone),
      income_range: income || null,
      annual_income: Number(annualIncome) || null,
      family_size: Number(familySize) || 1,
      children_count: Number(children) || 0,
      has_bpl_card: Boolean(hasBPL),
      mobile,
      whatsapp_opt_in: Boolean(whatsappOptIn !== false),
      pin_hash: pinHash,
    };

    const { data: user, error: insertError } = await supabase
      .from('profiles')
      .insert(newUser)
      .select('id, name, mobile, state, created_at')
      .single();

    if (insertError) throw insertError;

    res.status(201).json({
      message: 'User registered successfully',
      user,
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Failed to register user', error: error.message });
  }
};

/**
 * GET /api/users/profile/:mobile
 * Fetches a user's profile by mobile number.
 */
const getUserProfile = async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({ message: 'Database not configured.' });
    }

    const { mobile } = req.params;

    const { data: user, error } = await supabase
      .from('profiles')
      .select('id, name, age, gender, marital_status, category, state, district, occupation, income_range, annual_income, family_size, has_bpl_card, mobile, whatsapp_opt_in, created_at')
      .eq('mobile', mobile)
      .maybeSingle();

    if (error) throw error;
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Failed to fetch user profile', error: error.message });
  }
};

/**
 * POST /api/users/verify-pin
 * Verifies a user's PIN for login.
 */
const verifyPin = async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({ message: 'Database not configured.' });
    }

    const { mobile, pin } = req.body;

    if (!mobile || !pin) {
      return res.status(400).json({ message: 'mobile and pin are required' });
    }

    const { data: user, error } = await supabase
      .from('profiles')
      .select('id, name, mobile, pin_hash')
      .eq('mobile', mobile)
      .maybeSingle();

    if (error) throw error;
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isValid = await bcrypt.compare(String(pin), user.pin_hash);
    if (!isValid) return res.status(401).json({ message: 'Invalid PIN' });

    res.json({
      message: 'PIN verified',
      user: { id: user.id, name: user.name, mobile: user.mobile },
    });
  } catch (error) {
    console.error('Error verifying PIN:', error);
    res.status(500).json({ message: 'Failed to verify PIN', error: error.message });
  }
};

module.exports = { registerUser, getUserProfile, verifyPin };
