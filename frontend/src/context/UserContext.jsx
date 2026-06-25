import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);       // registered profile
  const [matchedSchemes, setMatchedSchemes] = useState([]);
  const [aiRecommendations, setAiRecommendations] = useState(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('bs_user_profile');
      const savedSchemes = localStorage.getItem('bs_matched_schemes');
      const savedAi = localStorage.getItem('bs_ai_recommendations');
      if (saved) setUser(JSON.parse(saved));
      if (savedSchemes) setMatchedSchemes(JSON.parse(savedSchemes));
      if (savedAi) setAiRecommendations(JSON.parse(savedAi));
    } catch { /* ignore */ }
  }, []);

  const saveUser = (profile, schemes, aiRecs = null) => {
    setUser(profile);
    setMatchedSchemes(schemes);
    setAiRecommendations(aiRecs);
    try {
      localStorage.setItem('bs_user_profile', JSON.stringify(profile));
      localStorage.setItem('bs_matched_schemes', JSON.stringify(schemes));
      if (aiRecs) {
        localStorage.setItem('bs_ai_recommendations', JSON.stringify(aiRecs));
      } else {
        localStorage.removeItem('bs_ai_recommendations');
      }
    } catch { /* ignore */ }
  };

  const clearUser = () => {
    setUser(null);
    setMatchedSchemes([]);
    setAiRecommendations(null);
    localStorage.removeItem('bs_user_profile');
    localStorage.removeItem('bs_matched_schemes');
    localStorage.removeItem('bs_ai_recommendations');
  };

  return (
    <UserContext.Provider value={{ user, matchedSchemes, aiRecommendations, saveUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
