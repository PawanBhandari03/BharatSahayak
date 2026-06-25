// WhatsApp conversation simulation with real scheme data
// All benefit amounts and schemes verified from official portals

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: 'user',
    text: 'Main Savitribai hoon. 52 saal. Vidhwa kisan. Osmanabad MH. Salana aay ₹48,000.',
    time: '10:42 AM',
    status: 'read',
  },
];

const AI_RESPONSE = {
  id: 2,
  sender: 'ai',
  text: `Namaste Savitribai Ji! 🙏

Aapke liye *9 sarkari yojanaen* mili hain:

1. 🟣 Sanjay Gandhi Niradhar — *₹1,500/month* ✅
2. 🌾 PM-KISAN Samman Nidhi — *₹6,000/year* ✅
3. 🔥 PMUY Free LPG — *₹300/cylinder subsidy* ✅
4. 💰 MahaDBT Shetkari Grant — *40–50% subsidy* ✅
5. 🏥 Ayushman Bharat PM-JAY — *₹5 lakh health cover* ✅
6. 🛡️ PMSBY Accident Cover — *₹2 lakh @ ₹20/year* ✅
7. 🏠 IGNWPS Widow Pension — *₹300–₹500/month* ✅
8. 🌱 Soil Health Card — *Free soil test + advice* ✅
9. 📋 MGNREGA Work Rights — *100 days paid work* ✅

Kul faayda: *₹1,37,000+*

Kya main documents ki list bhejun?
Reply karo: *HAAN*`,
  time: '10:44 AM',
  status: 'delivered',
};

const HAAN_RESPONSE = {
  id: 4,
  sender: 'ai',
  text: `Bilkul Savitribai Ji! 📋

*Yeh documents tayar rakho:*

✅ Aadhaar Card (original + photocopy)
✅ Pati ka Death Certificate
✅ 7/12 Utara (zameen ka record)
✅ Bank Passbook (Bank of Maharashtra)
✅ Income Certificate — Tehsildar se (₹21,000 limit)
✅ Maharashtra Domicile Certificate
✅ Ration Card / BPL Card

📍 *CSC Centre Osmanabad* mein Mangalwar, 10 baje aana.
📞 Apply se pehle mera call aayega — Marathi mein!

💡 MahaDBT deadline: *31 July 2026* — urgent hai!
Portal: *mahadbt.maharashtra.gov.in*`,
  time: '10:45 AM',
  status: 'delivered',
};

// Real scheme-based AI responses
const SIMULATOR_RESPONSES = {
  'kisan': `PM-KISAN Samman Nidhi ke baare mein:

🌾 *Yojana:* Pradhan Mantri Kisan Samman Nidhi
💰 *Benefit:* ₹6,000/year (₹2,000 × 3 installments)
📋 *Eligibility:* Zameen apne naam ho, e-KYC zaroori, income tax na bharte ho

*Documents chahiye:*
• Aadhaar Card
• 7/12 Utara (land record)
• Bank account (Aadhaar-linked)

🌐 Apply: *pmkisan.gov.in*
📞 Helpline: *155261*

Kya aap eligible hain? Reply: *HAAN KISAN*`,

  'pension': `Widow Pension ke baare mein:

🟣 *Yojana:* Sanjay Gandhi Niradhar Anudan Yojana (Maharashtra)
💰 *Benefit:* ₹1,500/month (₹18,000/year)
📋 *Eligibility:*
  • Maharashtra resident 15+ years
  • Age 18–65 years, vidhwa ho
  • Family income ≤ ₹21,000/year

*Documents:*
• Aadhaar
• Pati ka Death Certificate
• Income Certificate (Tehsildar se)
• Bank passbook

🌐 Apply: *sas.mahait.org*
📅 Deadline: July 15, 2026

IGNWPS (National) bhi mili hai: ₹300–500/month extra.`,

  'lpg': `PM Ujjwala Yojana (PMUY 2.0) ke baare mein:

🔥 *Benefit:*
• Free LPG connection + gas stove
• Pehla refill free
• ₹300/cylinder subsidy (4 refills/year tak)
• DBT ke through bank mein aata hai

📋 *Eligibility:*
• 18+ saal ki mahila
• Ghar mein pehle se LPG connection na ho
• BPL / SECC / AAY list mein ho

*Documents:*
• Aadhaar Card
• Ration Card
• Bank passbook
• Deprivation declaration form

🌐 Portal: *pmuy.gov.in*
📞 Helpline: *1906*`,

  'ayushman': `Ayushman Bharat PM-JAY ke baare mein:

🏥 *Yojana:* Pradhan Mantri Jan Arogya Yojana
💰 *Benefit:* ₹5 lakh health cover PER YEAR per family
🏨 *Cashless treatment:* Govt + empanelled private hospitals mein

📋 *Eligibility:*
• SECC 2011 list mein ho (BPL)
• Ya 70+ saal ke senior citizen

*Documents:*
• Aadhaar Card
• Ration Card / PM letter

🌐 Check: *mera.pmjay.gov.in*
📞 Helpline: *14555* (24×7, FREE)

Aapke nearest CSC mein Ayushman card free banta hai.`,

  'mahadbt': `MahaDBT Shetkari Yojana ke baare mein:

💰 *Benefit:* 40–50% subsidy on:
• Farm equipment (tractor, power tiller)
• Micro-irrigation
• Seeds & fertilizers

📋 *Eligibility:*
• Maharashtra resident farmer
• 7/12 apne naam ho
• Farmer ID mandatory (2025-26 se)
• FCFS — First Come First Served basis

*Documents:*
• Aadhaar + 7/12 + 8-A
• Farmer ID
• Supplier quotation

🌐 Portal: *mahadbt.maharashtra.gov.in/Farmer*
📞 Helpline: *022-61316429*
⚠️ Deadline: *31 July 2026*`,

  'help': `Namaste! Main BharatSahayak AI hoon. 🙏

Main aapko Maharashtra aur All-India sarkari yojanaon ki jaankari deta hoon.

Kuch useful keywords:
• *kisan* — PM-KISAN farming benefit
• *pension* — Widow pension scheme
• *ayushman* — Free health insurance
• *lpg* — Free LPG connection
• *mahadbt* — Maharashtra farm subsidies
• *mudra* — Business loan upto ₹10 lakh
• *housing* — Free house scheme

Apna naam, umra aur kaam batao — main sahi yojana dhundhta hoon!`,

  'housing': `PMAY-Gramin (Free Housing) ke baare mein:

🏠 *Benefit:*
• ₹1,20,000 grant (plain areas)
• + ₹12,000 toilet (SBM)
• + 90 days MGNREGA wages
• + ₹70,000 optional loan

📋 *Eligibility:*
• SECC 2011 list mein ho
• Pucca ghar na ho
• Widows/SC-ST ko priority

⚠️ *Important:* Direct apply nahi hota. Gram Panchayat mein naam check karein.

🌐 Status: *pmayg.nic.in*
📞 Helpline: *1800-11-6446* (free)`,

  'mudra': `PM Mudra Loan ke baare mein:

💼 *3 Categories:*
• Shishu: Up to ₹50,000
• Kishor: ₹50,000 – ₹5 lakh
• Tarun: ₹5 lakh – ₹10 lakh
• Tarun Plus (new): ₹10–20 lakh

✅ *No collateral required!*
✅ *Any bank, NBFC, or MFI se milta hai*

📋 *Eligibility:*
• 18+ Indian citizen
• Business plan hona chahiye

*Documents:*
• Aadhaar + PAN
• Business plan
• Bank statements (6 months)

🌐 Apply: *udyamimitra.in*
📞 Helpline: *1800-180-1111*`,

  'default': `Namaste! 🙏

Aapke sawal ke liye shukriya. Main samajh gaya.

Aapke profile ke hisaab se main check karta hoon:
• Widow pension eligibility
• Farm scheme benefits  
• Health insurance coverage

*Apna profile share karo:*
Naam, umra, kaam, aay, zameen, location — aur main exactly bataunga kaunsi yojana milegi!

Example: "Main [naam] hoon. [umra] saal. [kaam]. [location]. Aay ₹[amount]."`,
};

const whatsappService = {
  getInitialMessages: () => INITIAL_MESSAGES,
  getAIResponse: () => AI_RESPONSE,
  getHaanResponse: () => HAAN_RESPONSE,

  getSimulatorResponse: (userMessage) => {
    const msg = userMessage.toLowerCase().trim();

    // Check HAAN
    if (msg === 'haan' || msg === 'haan kisan' || msg.includes('हाँ') || msg.includes('हां')) {
      return HAAN_RESPONSE.text;
    }

    // Keyword matching
    for (const [key, response] of Object.entries(SIMULATOR_RESPONSES)) {
      if (key !== 'default' && msg.includes(key)) {
        return response;
      }
    }

    // Profile matching (name + age + occupation pattern)
    if (msg.includes('hoon') || msg.includes('hun') || msg.includes('saal') || msg.includes('year')) {
      return AI_RESPONSE.text;
    }

    return SIMULATOR_RESPONSES.default;
  },

  getTypingDelay: () => 1800 + Math.random() * 600,

  getChatHistory: () => {
    try {
      const saved = localStorage.getItem('bs_chat_history');
      return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
    } catch {
      return INITIAL_MESSAGES;
    }
  },

  saveChatHistory: (messages) => {
    try {
      localStorage.setItem('bs_chat_history', JSON.stringify(messages));
    } catch { /* ignore */ }
  },

  clearHistory: () => localStorage.removeItem('bs_chat_history'),
};

export default whatsappService;
