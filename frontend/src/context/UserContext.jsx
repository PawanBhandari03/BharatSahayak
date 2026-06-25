import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);       // registered profile
  const [matchedSchemes, setMatchedSchemes] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('bs_user_profile');
      const savedSchemes = localStorage.getItem('bs_matched_schemes');
      if (saved) setUser(JSON.parse(saved));
      if (savedSchemes) setMatchedSchemes(JSON.parse(savedSchemes));
    } catch { /* ignore */ }
  }, []);

  const saveUser = (profile, schemes) => {
    setUser(profile);
    setMatchedSchemes(schemes);
    try {
      localStorage.setItem('bs_user_profile', JSON.stringify(profile));
      localStorage.setItem('bs_matched_schemes', JSON.stringify(schemes));
    } catch { /* ignore */ }
  };

  const clearUser = () => {
    setUser(null);
    setMatchedSchemes([]);
    localStorage.removeItem('bs_user_profile');
    localStorage.removeItem('bs_matched_schemes');
  };

  return (
    <UserContext.Provider value={{ user, matchedSchemes, saveUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
