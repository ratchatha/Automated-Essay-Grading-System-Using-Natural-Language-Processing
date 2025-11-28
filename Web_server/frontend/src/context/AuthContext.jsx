import { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const { role } = jwtDecode(token);
      return { token, role };
    } catch {
      localStorage.removeItem("token");
      return null;
    }
  });

  const login = (token) => { 
    try {
      const { role } = jwtDecode(token);
      setAuth({ token, role });
      localStorage.setItem("token", token);
    } catch (error) {
      console.error("Invalid token:", error.message);
    }
  };

const logout = () => {
  setAuth(null);
  const selectedExamId = localStorage.getItem("selectedExamId");

  localStorage.clear();

  if (selectedExamId) {
    localStorage.setItem("selectedExamId", selectedExamId);
  }
};

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
