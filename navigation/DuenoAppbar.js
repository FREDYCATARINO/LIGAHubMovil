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
import colores from "../style/colors";
import FONTS from "../style/fonts";
import { DrawerActions } from "@react-navigation/native";

const UserAppBar = ({ navigation, title, isRoot, correo, rol, name, img }) => {
  isRoot === true;
  const control = !isRoot;
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.appBar}>
        {/* Botón para abrir el menú */}
        <TouchableOpacity
          onPress={() =>
            isRoot
              ? navigation.dispatch(DrawerActions.openDrawer())
              : navigation.goBack()
          }
        >
          <Ionicons
            //name={"menu"}
            name={isRoot ? "menu" : "arrow-back"}
            size={24}
            color="white"
          />
        </TouchableOpacity>

        {/* Título de la pantalla actual */}
        <Text style={[styles.encabezado, FONTS.nunitoNegrita]}>{title}</Text>

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
    paddingLeft: 20,
  },
  button: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "#FF5958",
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default UserAppBar;
