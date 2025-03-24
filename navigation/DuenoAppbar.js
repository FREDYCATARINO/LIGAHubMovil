import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from '@react-navigation/native'; // Importación crucial
import colores from "../style/colors";
import FONTS from "../style/fonts";

const UserAppBar = ({ navigation, title, isRoot = true }) => { // Valor por defecto para isRoot
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.appBar}>
        {/* Botón para abrir el menú */}
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <Ionicons
            name="menu" // Simplificado
            size={24}
            color="white"
          />
        </TouchableOpacity>

        {/* Título de la pantalla actual */}
        <Text style={[styles.encabezado, FONTS.nunitoNegrita]}>{title}</Text>

        {/* Botón de perfil */}
        <TouchableOpacity
          onPress={() => navigation.navigate(title === "Perfil" ? "Home" : "Perfil")}
        >
          <Image
            source={{
              uri: "https://th.bing.com/th/id/OIP.SVo8-p3WhGOnngP6K6tBsAHaKc?w=115&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7",
            }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { 
    backgroundColor: colores.base_3_1 
  },
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
    paddingLeft: 20,
  },
  profileImage: {
    width: 40,
    height: 40,
    backgroundColor: colores.base_1_1,
    borderRadius: 20,
    resizeMode: "cover",
  },
});

export default UserAppBar;