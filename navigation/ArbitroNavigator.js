import React, { useState, useEffect } from "react";
import {
  createDrawerNavigator,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "../screens/Login";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Image, View, Text, TouchableOpacity } from "react-native";
import AdminAppBar from "../components/admin/AdminNavBar";
import { Ionicons } from "@expo/vector-icons";
import myStyles from "../style/style";
import { WebView } from "react-native-webview";
import { DrawerActions } from "@react-navigation/native";
import colores from "../style/colors";
import FONTS from "../style/fonts";
import { useFonts } from "@expo-google-fonts/oswald";

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
import Arbitro1 from "../components/arbitro/Arbitro1";
import Arbitro2 from "../components/arbitro/Arbitro2";
import ArbitroAppBar from "../components/arbitro/ArbitroNavBar";
import PerfilScreen from "../screens/Perfil";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

import { Feather } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

const ArbitroNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          header: ({ navigation, route }) => {
            return (
              <ArbitroAppBar
                navigation={navigation}
                title={route.name}
                isRoot={route.name !== "Detalles de partido" && route.name !== "Mi perfil"}
              />
            );
          },
          tabBarStyle: { display: "none" }
        }}
      >
        <Tab.Screen
          name="Inicio"
          component={Arbitro1}
          options={{
            tabBarIcon: ({ color }) => (
              <Feather name="home" size={24} color={color} />
            ),
            tabBarItemStyle: { display: "none" }
          }}
        />
        <Tab.Screen
          name="Detalles de partido"
          component={Arbitro2}
          options={{
            tabBarIcon: ({ color }) => (
              <Feather name="book-open" size={24} color={color} />
            ),
            tabBarItemStyle: { display: "none" }
          }}
        />
        <Tab.Screen
          name="Mi perfil"
          component={PerfilScreen}
          options={{ tabBarItemStyle: { display: "none" } }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default ArbitroNavigator;
