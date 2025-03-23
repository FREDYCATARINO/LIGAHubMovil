// DueñoDrawerNavigator.js
import React, { useState, useEffect, useRef } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import DueñoDashboard from "../screens/dueño/DueñoDashboard";
import CustomDrawerContent from "./CustomDrawerContent"; // Importar el componente del menú
import { Ionicons } from "@expo/vector-icons";
import colores from "../style/colors"; // Asegúrate de importar colores
import { StyleSheet } from "react-native";
import DuenoBar from "./DuenoAppbar";
import PerfilScreen from "../screens/Perfil";
import { useContext } from "react";
import api from "../config/api";
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { AuthContext, AuthProvider } from "../context/AuthContext";
import { TokenContext, TokenProvider } from "../context/TokenContext";
import { SafeAreaView } from "react-native-safe-area-context";
import ErrorComponent from "../components/ErrorComponent";
const Drawer = createDrawerNavigator();

const DueñoNavigator = () => {
  const { setToken } = useContext(TokenContext);
  const { getToken, decodeToken, getUserId, getUserEmail, getUserRole } =
    useContext(AuthContext);
  const { logout, removeToken, removeUser } = useContext(AuthContext);

  const [correo, setCorreo] = useState("");
  const [rol, setRol] = useState("");
  const [nombre, setNombre] = useState("");
  const [imagen, setImagen] = useState("");

  const [tokenData, setTokenData] = useState("");
  const [expire, setExpire] = useState(false);
  const [switcht, setSwitcht] = useState(false);
  const [loadData, setLoadData] = useState(true);
  const [noData, setNoData] = useState(false);
  const tokenCheckInterval = 5 * 60 * 1000; // 5 minutos

  // useRef para mantener el valor más reciente del token
  const tokenRef = useRef("");

  useEffect(() => {
    let intervalId;

    const fetchToken = async () => {
      try {
        setLoadData(true);
        const dueId = await getUserId();
        const fetchedToken = await getToken();
        const rol = await getUserRole();
        const correo = await getUserEmail();
        if (fetchedToken) {
          setTokenData(fetchedToken);
          setToken(fetchedToken);
          tokenRef.current = fetchedToken; // Actualizar el token más reciente
          console.log(fetchedToken, "obtenido");
          validateToken(fetchedToken);
          setRol(rol);
          setCorreo(correo);
          getUserData(dueId, fetchedToken);
          setNoData(false);
        } else {
          console.log("Token no encontrado o está vacío.");
          setNoData(true);
        }
      } catch (error) {
        console.log("Error al obtener el token:", error);
        setNoData(true);
      } finally {
        setLoadData(false);
      }
    };

    const getUserData = async (id, tok) => {
      await api
        .get(`/api/duenos/porusuario/${id}`,{
          headers: {
            Authorization: `Bearer ${tok}`,
            "Content-Type": "application/json",
          }
        })
        .then((res) => {
          setNombre(res.data.nombreCompleto);
          setImagen(res.data.imagenUrl);
        })
        .catch((err) => {
          console.error(err);
          Alert.alert("Error", "Hubo un error al recuperar tus datos");
          return;
        });
    };

    const validateToken = (token) => {
      if (!token) {
        setExpire(true);
        console.log("Token inválido ❌");
        return;
      }

      const expirationDate = decodeToken(token);
      const currentDate = new Date();

      if (!expirationDate || expirationDate < currentDate) {
        setExpire(true);
        console.log("El token ha expirado ❌");
      } else {
        setExpire(false);
        console.log("Token válido ✅");
      }
    };

    fetchToken(); // Ejecutar al montar el componente

    // Verificar cada 5 minutos con el token más reciente
    intervalId = setInterval(() => {
      console.log("Revisando expiración del token...");
      validateToken(tokenRef.current);
    }, tokenCheckInterval);

    return () => clearInterval(intervalId); // Limpiar intervalo al desmontar
  }, [switcht]);

  if (loadData) {
    return (
      <SafeAreaView
        style={{
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={colores.acento_2_1} />
      </SafeAreaView>
    );
  }

  if (noData) {
    return <ErrorComponent reintentar={setSwitcht} valor={switcht} />;
  }

  if (expire) {
    return (
      <NoTokenComponent
        removeToken={removeToken}
        removeUser={removeUser}
        logout={logout}
      />
    );
  }
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        drawerActiveTintColor: colores.acento_1_5,
        drawerItemStyle: { marginVertical: 5, marginHorizontal: 5 },
        drawerContentStyle: { backgroundColor: colores.base_3_5 },
        drawerActiveBackgroundColor: colores.domin_1_4,
        header: ({ navigation, route }) => (
          <DuenoBar
            navigation={navigation}
            title={route.name}
            correo={correo}
            rol={rol}
            name={nombre}
            img={imagen}
          />
        ),
      }}
    >
      <Drawer.Screen
        name="Dashboard del Dueño"
        component={DueñoDashboard}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="briefcase" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Perfil"
        component={PerfilScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="briefcase" size={size} color={color} />
          ),
          drawerItemStyle: { display: "none" },
        }}
      />
    </Drawer.Navigator> // Aquí cierra correctamente el JSX
  );
};

export default DueñoNavigator;

const styles = StyleSheet.create({
  header: {
    height: 150,
    backgroundColor: colores.domin_1_2,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
    marginBottom: 10,
    width: "auto",
    display: "flex",
    flexDirection: "col",
    gap: 5,
  },
  image: {
    width: 50,
    height: 80,
    borderRadius: 40,
  },
  title: {
    color: "white",
    fontSize: 25,
    marginTop: 10,
  },
  item: {
    margin: 40,
  },
  webview: {
    width: 60,
    backgroundColor: "transparent",
    margin: 20,
  },
  containerL: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 50,
  },
  icon: {
    alignItems: "flex-start",
  },
  leave: {
    alignItems: "flex-end",
    width: "95%",
  },
  imgTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  button: {
    position: "absolute",
    top: 30,
    right: 10,
    paddingVertical: 5,
    paddingHorizontal: 5,
    backgroundColor: "#FF5958",
    borderRadius: 5,
    fontSize: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  safeArea: { backgroundColor: colores.base_3_1 },
  appBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    marginTop: "5%",
  },
  encabezado: {
    flex: 1,
    textAlign: "left",
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
    paddingLeft: 20,
  },
});
