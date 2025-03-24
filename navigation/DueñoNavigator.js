// DueñoDrawerNavigator.js
import React, { useState, useEffect, useRef } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import DueñoDashboard from "../screens/dueño/DueñoDashboard";
import CustomDrawerContent from "./CustomDrawerContent";
import { Ionicons } from "@expo/vector-icons";
import colores from "../style/colors";
import { StyleSheet } from "react-native";
import DuenoBar from "./DuenoAppbar";
import PerfilScreen from "../screens/Perfil";
import { useContext } from "react";
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { AuthContext, AuthProvider } from "../context/AuthContext";
import { TokenContext, TokenProvider } from "../context/TokenContext";
import { SafeAreaView } from "react-native-safe-area-context";
import ErrorComponent from "../components/ErrorComponent";
import MisPagosScreen from '../screens/dueño/MisPagos'; // Pantalla de pagos
import CredencialesScreen from '../screens/dueño/Credenciales'; // Pantalla de credenciales
import MiEquipoScreen from '../screens/dueño/MiEquipo'; // Pantalla de equipo
import HistorialPagos from "../screens/dueño/HistorialPagos";

const Drawer = createDrawerNavigator();

const DueñoNavigator = () => {
  const { setToken } = useContext(TokenContext);
  const { getToken, decodeToken } = useContext(AuthContext);
  const { logout, removeToken, removeUser } = useContext(AuthContext);

  const [tokenData, setTokenData] = useState("");
  const [expire, setExpire] = useState(false);
  const [switcht, setSwitcht] = useState(false);
  const [loadData, setLoadData] = useState(true);
  const [noData, setNoData] = useState(false);
  const tokenCheckInterval = 5 * 60 * 1000; // 5 minutos

  const tokenRef = useRef("");

  useEffect(() => {
    let intervalId;

    const fetchToken = async () => {
      try {
        setLoadData(true);
        const fetchedToken = await getToken();
        if (fetchedToken) {
          setTokenData(fetchedToken);
          setToken(fetchedToken);
          tokenRef.current = fetchedToken;
          console.log(fetchedToken, "obtenido");
          validateToken(fetchedToken);
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

    fetchToken();

    intervalId = setInterval(() => {
      console.log("Revisando expiración del token...");
      validateToken(tokenRef.current);
    }, tokenCheckInterval);

    return () => clearInterval(intervalId);
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
          <DuenoBar navigation={navigation} title={route.name} />
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
        name="Mis Pagos"
        component={MisPagosScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="wallet" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Credenciales"
        component={CredencialesScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="id-card" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Mi Equipo"
        component={MiEquipoScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }}
      />
     <Drawer.Screen
        name="Historial de pagos"
        component={HistorialPagos}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }}
      />
  
    </Drawer.Navigator>
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
