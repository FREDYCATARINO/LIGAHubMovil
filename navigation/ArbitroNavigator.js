import React, { useState, useEffect } from "react";
import {
  createDrawerNavigator,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Arbitro1 from "../components/arbitro/Arbitro1";
import Arbitro2 from "../components/arbitro/Arbitro2";
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
import PerfilScreen from "../screens/Perfil";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const ArbitroNavigator = () => {

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Arbitro1} />
        <Stack.Screen name="Partido" component={Arbitro2} />
        <Stack.Screen name="Perfilo" component={PerfilScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};