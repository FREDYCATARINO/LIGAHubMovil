import React, {useState, useEffect} from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../screens/Login";
import RegistroDueño from "../screens/RegistroDueño";
import RecuperarContra from "../screens/RecuperarContra";
import { useContext } from "react";
import { AuthContext, AuthProvider } from "../context/AuthContext";

const Stack = createStackNavigator();

const AuthStackNavigator = () => {
  // const [loadData, setLoadData] = useState(false);
  // const [noData, setNoData] = useState(false);
  // const [tokenData, setTokenData] = useState("");
  // const [switcht, setSwitcht] = useState(false);
  // const [expire, setExpire] = useState(false);

  // const { getToken, decodeToken } = useContext(AuthContext);

  // useEffect(() => {
  //   const fetchToken = async () => {
  //     try {
  //       const token = await getToken(); // Esperamos a que getToken devuelva el valor
  //       if (token && token !== "") {
  //         // Verificamos que el token sea válido
  //         setTokenData(token);
  //         console.log(token, "obtenido");
  //       } else {
  //         console.log("Token no encontrado o está vacío.");
  //       }
  //     } catch (error) {
  //       console.error("Error al obtener el token:", error);
  //     }
  //   };

  //   const validateToken = (token) => {
  //     if (!noData) {
  //       if (decodeToken(token) === null) {
  //         setExpire(true);
  //       } else {
  //         setExpire(false);
  //       }
  //     }
  //   };

  //   fetchToken();
  //   validateToken(tokenData);
  // }, []);
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} /> 
      <Stack.Screen name="RegistroDueño" component={RegistroDueño} />
      <Stack.Screen name="RecuperarContra" component={RecuperarContra} />
    </Stack.Navigator>
  );
};

export default AuthStackNavigator;
