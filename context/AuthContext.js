import { createContext, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL_LOCAL } from "@env";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [failure, setFailure] = useState(false);
  const [user, setUser] = useState(null);
  const [tokenOBj, setTokenOBj] = useState({});

  const TOKEN_KEY = "bearerToken";

  const saveToken = async (token) => {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error("Error guardando token:", error);
    }
  };

  const getToken = async () => {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error("Error obteniendo token:", error);
      return '';
    }
  };

  const removeToken = async () => {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      console.log("Removiendo token");
    } catch (error) {
      console.error("Error eliminando token:", error);
    }
  };

  async function validate(username, pass) {
    setIsLoading(true);
    try {
      const res = await axios.post(`${API_URL_LOCAL}/auth/login`, {
        email: username,
        password: pass,
      });
  
      console.log(res.data);
      setTokenOBj(res.data);
      await saveToken(res.data.token);
      setFailure(false);
  
      // Verifica el rol inmediatamente después de recibir la respuesta
      if (res.data.roles === "ROLE_DUENO") {
        setUser({ role: "dueno" });
      } else if (res.data.roles === "ROLE_ADMIN") {
        setUser({ role: "admin" });
      } else if (res.data.roles === "ARBITRO") {
        setUser({ role: "arbitro" });
      }
    } catch (err) {
      console.log(err, err.message);
      setFailure(true);
    } finally {
      setIsLoading(false);
    }
  }  

  const login = (username, password) => {
    const formattedUsername = username.toLowerCase().trim();

    validate(formattedUsername, password);
    console.log(tokenOBj, "Objeto");

    if (tokenOBj.roles === "ROLE_DUENO") {
      ({ role: "dueno" });
    } else if (
      tokenOBj.roles === "ROLE_ADMIN"
    ) {
      setUser({ role: "admin" });
    } else if (
      tokenOBj.roles === "ARBITRO"
    ) {
      setUser({ role: "arbitro" });
    }

    console.log(username, password);
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoading,
        setIsLoading,
        failure,
        saveToken,
        getToken,
        removeToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
