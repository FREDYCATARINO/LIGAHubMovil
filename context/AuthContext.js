import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (username, password) => {
    const formattedUsername = username.toLowerCase().trim();

    if (formattedUsername === "dueño@example.com" && password === "dueno123") {
      setUser({ role: "dueno" });
    } else if (formattedUsername === "user@example.com" && password === "user123") {
      setUser({role: "user"})
    } else if (formattedUsername === "admin@example.com" && password === "admin123") {
      setUser({role: "admin"})
    }else if (formattedUsername === "arbitro@example.com" && password === "arbit123") {
      setUser({role: "arbitro"})
    }

    console.log(username, password)
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
