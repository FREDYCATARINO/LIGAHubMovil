import React, { useState, useEffect, useRef } from "react";
import {
  createDrawerNavigator,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "../screens/Login";
import { useNavigation } from "@react-navigation/native";
import {
  StyleSheet,
  Image,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import AdminAppBar from "../components/admin/AdminNavBar";
import { Ionicons } from "@expo/vector-icons";
import myStyles from "../style/style";
import { WebView } from "react-native-webview";
import { DrawerActions } from "@react-navigation/native";
import colores from "../style/colors";
import FONTS from "../style/fonts";
import { useFonts } from "@expo-google-fonts/oswald";
import { useContext } from "react";
import { AuthContext, AuthProvider } from "../context/AuthContext";
import { TokenContext, TokenProvider } from "../context/TokenContext";
import { SafeAreaView } from "react-native-safe-area-context";
import NoTokenComponent from "../components/NoTokenComponent";

import {
  Oswald_400Regular,
  Oswald_700Bold,
  Oswald_400Italic,
  Oswald_700BoldItalic,
} from "@expo-google-fonts/oswald"; // Cargar Oswald
import {
  Nunito_400Regular,
  Nunito_700Bold,
  Nunito_400Italic,
  Nunito_700BoldItalic,
} from "@expo-google-fonts/nunito"; // Cargar Nunito
import { Alert } from "react-native";
import Arbitro1 from "../components/arbitro/Arbitro1";
import Arbitro2 from "../components/arbitro/Arbitro2";
import ArbitroAppBar from "../components/arbitro/ArbitroNavBar";
import PerfilScreen from "../screens/Perfil";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ErrorComponent from "../components/ErrorComponent";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

import { Feather } from "@expo/vector-icons";
import api from "../config/api";

const Tab = createBottomTabNavigator();

const ArbitroNavigator = () => {
  const { setToken } = useContext(TokenContext);
  const { getToken, decodeToken, getUserId, getUserEmail, getUserRole } = useContext(AuthContext);
  const { logout, removeToken, removeUser } = useContext(AuthContext);

  const [tokenData, setTokenData] = useState("");
  const [expire, setExpire] = useState(false);
  const [switcht, setSwitcht] = useState(false);
  const [loadData, setLoadData] = useState(true);
  const [noData, setNoData] = useState(false);

  const [correo, setCorreo] = useState("");
  const [rol, setRol] = useState("");
  const [nombre, setNombre] = useState("");
  const [imagen, setImagen] = useState("");
  const tokenCheckInterval = 5 * 60 * 1000; // 5 minutos

  // useRef para mantener el valor más reciente del token
  const tokenRef = useRef("");

  useEffect(() => {
    let intervalId;

    const fetchToken = async () => {
      try {
        setLoadData(true);
        const fetchedToken = await getToken();
        const abrId = await getUserId();
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
          getUserData(abrId, fetchedToken);
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

    const getUserData = async (id,tok) => {
      await api.get(`/api/arbitros/poruser/${id}`, {
        headers: {
          Authorization: `Bearer ${tok}`
        }
      })
      .then((res) => {
        setNombre(res.data.nombreCompleto);
        setImagen(res.data.imagenUrl);
      })
      .catch((err) => {
        console.error(err);
        Alert.alert("Error","Hubo un error al recuperar tus datos")
        return;
      })
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

  const [fontsLoaded] = useFonts({
    Oswald_400Regular,
    Oswald_700Bold,
    Oswald_400Italic,
    Oswald_700BoldItalic,
    Nunito_400Regular,
    Nunito_700Bold,
    Nunito_400Italic,
    Nunito_700BoldItalic,
  });

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
    <Tab.Navigator
      screenOptions={{
        header: ({ navigation, route }) => {
          return (
            <ArbitroAppBar
              navigation={navigation}
              title={route.name}
              isRoot={
                route.name !== "Detalles de partido" &&
                route.name !== "Mi perfil"
              }
              correo={correo}
              rol={rol}
              name={nombre}
              img={imagen}
            />
          );
        },
        tabBarStyle: { display: "none" },
      }}
    >
      <Tab.Screen
        name="Inicio"
        component={Arbitro1}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="home" size={24} color={color} />
          ),
          tabBarItemStyle: { display: "none" },
        }}
      />
      <Tab.Screen
        name="Detalles de partido"
        component={Arbitro2}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="book-open" size={24} color={color} />
          ),
          tabBarItemStyle: { display: "none" },
        }}
      />
      <Tab.Screen
        name="Mi perfil"
        component={PerfilScreen}
        options={{ tabBarItemStyle: { display: "none" } }}
      />
    </Tab.Navigator>
  );
};

export default ArbitroNavigator;