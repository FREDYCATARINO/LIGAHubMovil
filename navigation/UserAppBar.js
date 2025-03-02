import React from "react";
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colores from "../style/colors";
import LoginStack from "../navigation/AuthStackNavigator";
const UserAppBar = ({ navigation, title }) => {

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.appBar}>
        {/* Botón para abrir el menú */}
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={40} color="white" />
        </TouchableOpacity>

        {/* Título de la pantalla actual */}
        <Text style={styles.encabezado}>{title}</Text>

        {/* Botón para ir al Login */}
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("LoginStack")}>
        <Text style={styles.buttonText}>Iniciar sesión</Text>
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
    fontWeight: "bold",
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
