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
import colores from "../style/colors";
import FONTS from "../style/fonts";

const UserAppBar = ({ navigation, title, isRoot }) => {
  isRoot === true
  const control = !isRoot;
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.appBar}>
        {/* Botón para abrir el menú */}
        <TouchableOpacity
          onPress={() =>
            navigation.dispatch(DrawerActions.openDrawer())
          }
        >
          <Ionicons
            //name={"menu"}
            name={isRoot ? "menu" : "menu"}
            size={24}
            color="white"
          />
        </TouchableOpacity>

        {/* Título de la pantalla actual */}
        <Text style={[styles.encabezado, FONTS.nunitoNegrita]}>{title}</Text>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate(title == "Perfil" ? "Home" : "Perfil", {
              usuario: "Juan Peréz",
              rol: "Dueño",
            })
          }
        >
          <Image
            source={{
              uri: "https://th.bing.com/th/id/OIP.SVo8-p3WhGOnngP6K6tBsAHaKc?w=115&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7",
            }}
            style={{
              width: 50,
              height: 50,
              backgroundColor: colores.base_1_1,
              borderRadius: 100,
              resizeMode: "stretch",
            }}
          />
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
