import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("haci_user");
    return stored ? JSON.parse(stored) : null;
  });

  function login(userData, token) {
    localStorage.setItem("haci_user", JSON.stringify(userData));
    localStorage.setItem("haci_token", token);
    setUser(userData);
  }

  function logout() {
    localStorage.removeItem("haci_user");
    localStorage.removeItem("haci_token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
