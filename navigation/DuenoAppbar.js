import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { Card, Avatar } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from '@react-navigation/native'; // Importación crucial
import colores from "../style/colors";
import FONTS from "../style/fonts";

const UserAppBar = ({ navigation, title, isRoot, correo, rol, name, img }) => {
  isRoot === true;
  const control = !isRoot;
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
          onPress={() =>
            navigation.navigate(title == "Perfil" ? "Home" : "Perfil", {
              usuario: name !== "" ? name : "Usuario Dueño",
              rol: "Dueño de equipos",
              correo: correo,
              img: img,
            })
          }
        >
          {img === "" ? (
            <Avatar.Icon
              size={50}
              icon="account"
              style={{ backgroundColor: colores.domin_2_5 }}
              color={colores.domin_1_1}
            />
          ) : (
            <Avatar.Image
              size={50}
              source={{
                uri: img,
              }}
            />
          )}
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