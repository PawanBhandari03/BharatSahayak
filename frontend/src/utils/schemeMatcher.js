// ============================================================
// Dynamic Scheme Eligibility Matcher
// Computes match score and eligibility for each scheme
// based on the user's actual registration profile
// ============================================================

import { SCHEMES_DATA } from './schemeService';

// Convert income range string → numeric max value
function incomeMax(range) {
  if (!range) return 999999;
  if (range.includes('50,000/year') || range.startsWith('Up to')) return 50000;
  if (range.includes('1,00,000')) return 100000;
  if (range.includes('1,50,000')) return 150000;
  if (range.includes('2,00,000')) return 200000;
  if (range.includes('3,00,000')) return 300000;
  if (range.includes('5,00,000')) return 500000;
  return 999999; // Above 5L
}

// Check if user is a widow
const isWidow = (p) =>
  p.maritalStatus?.toLowerCase().includes('widow');

// Check if user is a farmer
const isFarmer = (p) =>
  p.occupation?.toLowerCase().includes('farmer') ||
  p.occupation?.toLowerCase().includes('agricultural');

// Check if user is a student
const isStudent = (p) => p.occupation?.toLowerCase().includes('student');

// Check if user is BPL / low income
const isBPL = (p) =>
  p.hasBPL === 'Yes' || incomeMax(p.income) <= 100000;

// Check if user has land
const hasLand = (p) => p.hasLand === 'Yes';

// Is Maharashtra resident
const isMaharashtra = (p) => p.state === 'Maharashtra';

// Is J&K/Ladakh resident
const isJKLadakh = (p) =>
  p.state === 'Jammu & Kashmir' || p.state === 'Ladakh';

// Age check
const ageInRange = (p, min, max) => {
  const age = parseInt(p.age) || 0;
  return age >= min && age <= max;
};

// Is business/self-employed
const isEntrepreneur = (p) =>
  p.occupation?.toLowerCase().includes('business') ||
  p.occupation?.toLowerCase().includes('self-employed') ||
  p.occupation?.toLowerCase().includes('entrepreneur');

// ─────────────────────────────────────────────────────────────
// Per-scheme eligibility rules
// Returns { eligible, score (0–100), reasons, missingDocs }
// ─────────────────────────────────────────────────────────────
const SCHEME_RULES = {
  'pm-kisan': (p) => {
    if (!isFarmer(p)) return { eligible: false, score: 0, reason: 'Only for farmers' };
    if (!hasLand(p)) return { eligible: false, score: 5, reason: 'Requires land ownership' };
    if (incomeMax(p.income) > 500000) return { eligible: false, score: 10, reason: 'Income too high (income tax payer excluded)' };
    let score = 85;
    if (incomeMax(p.income) <= 150000) score = 98;
    return { eligible: true, score };
  },

  'sanjay-gandhi-niradhar': (p) => {
    if (!isMaharashtra(p)) return { eligible: false, score: 0, reason: 'Maharashtra residents only' };
    if (!isWidow(p)) return { eligible: false, score: 0, reason: 'For widows/destitute women only' };
    if (incomeMax(p.income) > 21000 && p.hasBPL !== 'Yes')
      return { eligible: false, score: 20, reason: 'Family income must be ≤ ₹21,000/year or BPL card required' };
    if (!ageInRange(p, 18, 65)) return { eligible: false, score: 5, reason: 'Age must be 18–65' };
    return { eligible: true, score: 99 };
  },

  'ignwps': (p) => {
    if (!isWidow(p)) return { eligible: false, score: 0, reason: 'For widows only' };
    if (!isBPL(p)) return { eligible: false, score: 15, reason: 'BPL household required' };
    if (!ageInRange(p, 40, 79)) return { eligible: false, score: 10, reason: 'Age must be 40–79' };
    return { eligible: true, score: 97 };
  },

  'ayushman-bharat': (p) => {
    const age = parseInt(p.age) || 0;
    if (age >= 70) return { eligible: true, score: 100, reason: 'Senior citizen 70+ — automatically eligible' };
    if (isBPL(p)) return { eligible: true, score: 95 };
    if (incomeMax(p.income) <= 150000) return { eligible: true, score: 88 };
    return { eligible: false, score: 30, reason: 'SECC 2011 / BPL household required' };
  },

  'pmuy': (p) => {
    if (p.gender !== 'Female') return { eligible: false, score: 5, reason: 'Only for adult women' };
    if (!isBPL(p) && incomeMax(p.income) > 200000)
      return { eligible: false, score: 15, reason: 'BPL / low-income household required' };
    return { eligible: true, score: incomeMax(p.income) <= 100000 ? 96 : 80 };
  },

  'pmay-g': (p) => {
    if (incomeMax(p.income) > 200000) return { eligible: false, score: 20, reason: 'Low income required' };
    const score = (isWidow(p) ? 10 : 0) +
      (isBPL(p) ? 20 : 0) +
      ((['SC', 'ST'].includes(p.category)) ? 10 : 0) + 55;
    return { eligible: isBPL(p) || incomeMax(p.income) <= 100000, score: Math.min(score, 95) };
  },

  'pmjjby': (p) => {
    if (!ageInRange(p, 18, 50)) return { eligible: false, score: 0, reason: 'Age must be 18–50' };
    return { eligible: true, score: 90 };
  },

  'pmsby': (p) => {
    if (!ageInRange(p, 18, 70)) return { eligible: false, score: 0, reason: 'Age must be 18–70' };
    return { eligible: true, score: 95 };
  },

  'mahadbt-shetkari': (p) => {
    if (!isMaharashtra(p)) return { eligible: false, score: 0, reason: 'Maharashtra only' };
    if (!isFarmer(p)) return { eligible: false, score: 0, reason: 'For farmers only' };
    if (!hasLand(p)) return { eligible: false, score: 10, reason: 'Land ownership required' };
    return { eligible: true, score: ['SC', 'ST'].includes(p.category) ? 100 : 90 };
  },

  'mudra-loan': (p) => {
    if (!isEntrepreneur(p) && !isFarmer(p) && !p.occupation?.includes('Vendor') && !p.occupation?.includes('Artisan'))
      return { eligible: false, score: 20, reason: 'For business/self-employment only' };
    if (incomeMax(p.income) > 300000) return { eligible: true, score: 60 };
    return { eligible: true, score: 80 };
  },

  'pmkvy': (p) => {
    if (!ageInRange(p, 15, 45)) return { eligible: false, score: 0, reason: 'Age must be 15–45' };
    if (isStudent(p)) return { eligible: true, score: 90 };
    if (incomeMax(p.income) <= 200000) return { eligible: true, score: 80 };
    return { eligible: true, score: 65 };
  },

  'startup-india': (p) => {
    if (!isEntrepreneur(p)) return { eligible: false, score: 5, reason: 'For registered startups only' };
    return { eligible: true, score: 70 };
  },

  'pmsss': (p) => {
    if (!isJKLadakh(p)) return { eligible: false, score: 0, reason: 'J&K/Ladakh domicile required' };
    if (!isStudent(p)) return { eligible: false, score: 0, reason: 'For students only' };
    return { eligible: true, score: 95 };
  },

  'atal-pension': (p) => {
    if (!ageInRange(p, 18, 40)) return { eligible: false, score: 0, reason: 'Age must be 18–40' };
    if (incomeMax(p.income) > 500000) return { eligible: false, score: 10, reason: 'For unorganized sector workers' };
    return { eligible: true, score: incomeMax(p.income) <= 200000 ? 92 : 75 };
  },
};

// ─────────────────────────────────────────────────────────────
// Main matcher function — call this after registration
// ─────────────────────────────────────────────────────────────
export function matchSchemesForUser(profile) {
  return SCHEMES_DATA.map(scheme => {
    const ruleFn = SCHEME_RULES[scheme.id];
    let result = { eligible: false, score: 0 };

    if (ruleFn) {
      result = ruleFn(profile);
    } else {
      // Default: open to all
      result = { eligible: true, score: 60 };
    }

    return {
      ...scheme,
      isMatched: result.eligible,
      matchScore: result.score,
      ineligibleReason: result.reason || null,
    };
  }).sort((a, b) => b.matchScore - a.matchScore);
}

// ─────────────────────────────────────────────────────────────
// Compute benefit wallet totals from matched schemes
// ─────────────────────────────────────────────────────────────
export function computeWallet(matchedSchemes) {
  const eligible = matchedSchemes.filter(s => s.isMatched);

  // Simulated distribution: received 40%, available 30%, pending 20%, future 10%
  const totalEligible = eligible.reduce((sum, s) => sum + (s.benefitAmount || 0), 0);
  const received   = Math.round(totalEligible * 0.40);
  const available  = Math.round(totalEligible * 0.30);
  const pending    = Math.round(totalEligible * 0.20);
  const future     = Math.round(totalEligible * 0.10);

  return {
    total: totalEligible,
    received,
    available,
    pending,
    future,
    count: eligible.length,
    chartData: [
      { name: 'Received',  value: received,  color: '#1D9E75' },
      { name: 'Available', value: available, color: '#6B3FA0' },
      { name: 'Pending',   value: pending,   color: '#E65100' },
      { name: 'Future',    value: future,    color: '#2196F3' },
    ],
  };
}

// ─────────────────────────────────────────────────────────────
// Get avatar emoji based on occupation
// ─────────────────────────────────────────────────────────────
export function getAvatar(profile) {
  const occ = profile.occupation?.toLowerCase() || '';
  if (occ.includes('farmer')) return '👨‍🌾';
  if (occ.includes('student')) return '👨‍🎓';
  if (occ.includes('business')) return '👨‍💼';
  if (occ.includes('domestic')) return '🏠';
  if (occ.includes('construct')) return '👷';
  if (occ.includes('fisherman')) return '🎣';
  if (occ.includes('artisan')) return '🧑‍🎨';
  if (occ.includes('vendor')) return '🏪';
  if (occ.includes('widow')) return '🙏';
  if (profile.gender === 'Female') return '👩';
  return '👤';
}

// ─────────────────────────────────────────────────────────────
// Generate life timeline milestones dynamically
// ─────────────────────────────────────────────────────────────
export function generateTimeline(profile, matchedSchemes) {
  const age = parseInt(profile.age) || 30;
  const currentYear = new Date().getFullYear();
  const milestones = [];

  // Current active matched schemes
  const active = matchedSchemes.filter(s => s.isMatched).slice(0, 4);
  active.forEach(s => {
    milestones.push({
      year: currentYear,
      age,
      event: `${s.name} — ${s.benefitLabel}`,
      type: 'current',
      color: s.categoryColor || '#6B3FA0',
      source: s.officialPortal?.replace('https://', '') || '',
    });
  });

  // Future milestones based on age
  if (age < 40) {
    milestones.push({
      year: currentYear + (40 - age),
      age: 40,
      event: 'Atal Pension Yojana — Last age to enroll (guaranteed pension at 60)',
      type: 'upcoming',
      color: '#9C27B0',
      source: 'npscra.nsdl.co.in',
    });
  }
  if (age < 50) {
    milestones.push({
      year: currentYear + (50 - age),
      age: 50,
      event: 'PMJJBY last enrollment age — ₹2 lakh life cover @ ₹436/year',
      type: 'upcoming',
      color: '#FF9800',
      source: 'jansuraksha.gov.in',
    });
  }
  if (age < 60) {
    milestones.push({
      year: currentYear + (60 - age),
      age: 60,
      event: 'Senior Citizen benefits begin — IGNOAPS pension + enhanced discounts',
      type: 'future',
      color: '#2196F3',
      source: 'nsap.nic.in',
    });
  }
  if (age < 70) {
    milestones.push({
      year: currentYear + (70 - age),
      age: 70,
      event: 'Ayushman Bharat 70+ — Extra ₹5 lakh health cover automatically',
      type: 'future',
      color: '#2196F3',
      source: 'pmjay.gov.in',
    });
  }

  return milestones;
}
