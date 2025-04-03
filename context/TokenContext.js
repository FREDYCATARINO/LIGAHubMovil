import React, { createContext, useState, useEffect } from "react";
import { AsyncStorage } from "react-native";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

// Crear el contexto
const TokenContext = createContext();

const TokenProvider = ({ children }) => {
  const [token, setToken] = useState('');
  const [tokenId, setTokenId] = useState(null);
  const [tokenRole, setTokenRole] = useState(null);

  const { getToken, getUserRole, getUserId } = useContext(AuthContext);

  useEffect(() => {
    const fetchId = async () => {
      try {
        const id = await getUserId(); // Esperamos a que getToken devuelva el valor
        if (typeof id === "number") {
          setTokenId(id);
          console.log(id, "obtenido");
        } else {
          console.log("Id no encontrado o está vacío.");
        }
      } catch (error) {
        console.log("Error al obtener el Id:", error);
      }
    };

    const fetchRole = async () => {
      try {
        const role = await getUserRole();
        if (role && role !== "") {
          setTokenRole(role);
          console.log(role, "obtenido");
        } else {
          console.log("Rol no encontrado o está vacío.");
        }
      } catch (error) {
        console.log("Error al obtener el rol:", error);
      }
    };

    const fetchToken = async () => {
      try {
        const role = await getToken();
        if (role && role !== "") {
          console.log(role, "obtenido");
        } else {
          console.log("Rol no encontrado o está vacío.");
        }
      } catch (error) {
        console.log("Error al obtener el rol:", error);
      }
    };

    fetchId();
    fetchRole();
    //fetchToken();
  }, []);

  return (
    <TokenContext.Provider
      value={{
        token,
        setToken,
        tokenId,
        setTokenId,
        tokenRole,
        setTokenRole,
      }}
    >
      {children}
    </TokenContext.Provider>
  );
};

export { TokenProvider, TokenContext };
