import { createContext, useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL_LOCAL } from "@env";
import api from '../config/api.js'
import { date } from "yup";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [failure, setFailure] = useState(false);
  const [user, setUser] = useState(null);
  const [tokenOBj, setTokenOBj] = useState({});
  const [mensaje, setMensaje] = useState('');

  const TOKEN_KEY = "bearerToken";
  const TOKEN_ROLE = "userRole";
  const TOKEN_ID = "userId";
  const TOKEN_MAIL = "userEmail";

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
      return "";
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

  
  const saveUser = async (role,id,mail) => {
    try {
      await AsyncStorage.setItem(TOKEN_MAIL, mail);
      await AsyncStorage.setItem(TOKEN_ROLE, role);
      await AsyncStorage.setItem(TOKEN_ID, id.toString());
    } catch (error) {
      console.error("Error guardando datos del usuario:", error);
    }
  };

  const getUserRole = async () => {
    try {
      return await AsyncStorage.getItem(TOKEN_ROLE);
    } catch (error) {
      console.error("Error obteniendo el rol de usuario:", error);
      return "";
    }
  };

  const getUserId = async () => {
    try {
      const retrievedId = await AsyncStorage.getItem(TOKEN_ID);
      return Number(retrievedId);
    } catch (error) {
      console.error("Error obteniendo el id del usuario:", error);
      return "";
    }
  };

  const getUserEmail = async () => {
    try {
      return await AsyncStorage.getItem(TOKEN_MAIL);
    } catch (error) {
      console.error("Error obteniendo el correo de usuario:", error);
      return "";
    }
  };

  const removeUser = async () => {
    try {
      await AsyncStorage.removeItem(TOKEN_ROLE);
      await AsyncStorage.removeItem(TOKEN_ID);
      await AsyncStorage.removeItem(TOKEN_MAIL);
      console.log("Removiendo datos del usuario");
    } catch (error) {
      console.error("Error eliminando datos del usuario:", error);
    }
  };

  async function validate(username, pass) {
    setIsLoading(true);
    try {
      //const res = await axios.post(`http://192.168.1.69:8080/auth/login`, {
      const res = await api.post(`/auth/login`, {
        email: username,
        password: pass,
      
      });
      
      await saveToken(res.data.token);
      await saveUser(res.data.roles, res.data.id, res.data.correo)

      if (res.data.roles === "ROLE_DUENO") {
        setUser({ role: "dueno" });
      } else if (res.data.roles === "ROLE_ADMIN") {
        setUser({ role: "admin" });
      } else if (res.data.roles === "ROLE_ARBITRO") {
        setUser({ role: "arbitro" });
      }

      setFailure(false);
    } catch (err) {
      console.log(err, err.message, err.toJSON());
      if(err.response) {console.log(err.response.data.message); setMensaje(err.response.data.message)}
      setFailure(true);
    } finally {
      setIsLoading(false);
    }
  }

  function decodeToken(token) {
    try {
      console.log(token);

      if (token !== null) {
        const base64Url = token.split(".")[1]; // Extraer el payload (segunda parte del token)
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/"); // Corregir formato base64
        const decodedPayload = JSON.parse(atob(base64)); // Decodificar el payload

        // Convertir la fecha de expiración (exp) a formato legible
        const expirationDate = new Date(decodedPayload.exp * 1000);
        const currentDate = new Date();

        console.log("Expiración del token:", expirationDate);

        // Validar si el token ha expirado
        if (expirationDate < currentDate) {
          console.log("El token ha expirado.");
        } else {
          console.log("El token aún es válido.");
        }

        return expirationDate;
      }
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      
      return null;
    }
  }

  const login = (username, password) => {
    const formattedUsername = username.toLowerCase().trim();

    validate(formattedUsername, password);

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
        setFailure,
        saveToken,
        getToken,
        removeToken,
        decodeToken,
        tokenOBj,
        saveUser,
        getUserRole,
        getUserId,
        getUserEmail,
        removeUser,
        mensaje
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
