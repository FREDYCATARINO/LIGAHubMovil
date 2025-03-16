import React, { useEffect } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import ResultadoPartidos from "../screens/user0/ResultadoPartidos";
import TabladeClasificacion from "../screens/user0/TabladeClasificacion";
import TabladeGoleo from "../screens/user0/TablaGoleo";
import CustomDrawerContent from "./CustomDrawerContent";
import { Ionicons } from "@expo/vector-icons";
import UserAppBar from "./UserAppBar";
import colores from "../style/colors";
import AuthStackNavigator from "./AuthStackNavigator";

const Drawer = createDrawerNavigator();
import { useContext } from "react";
import { AuthContext, AuthProvider } from "../context/AuthContext";

const UserDrawerNavigator = () => {
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
          <UserAppBar navigation={navigation} title={route.name} />
        ),
      }}
    >
      <Drawer.Screen
        name="Resultado de Partidos"
        component={ResultadoPartidos}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="football" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Tabla de Clasificación"
        component={TabladeClasificacion}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="stats-chart" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Tabla de Goleo"
        component={TabladeGoleo}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="trophy" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="LoginStack"
        component={AuthStackNavigator}
        options={{ drawerItemStyle: { display: "none" }, headerShown: false }} // Ocultar del menú
      />
    </Drawer.Navigator>
  );
};

export default UserDrawerNavigator;
