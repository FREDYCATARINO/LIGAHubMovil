import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from "react-native";
import { Card, Avatar } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import LoginScreen from "../../screens/Login";
import colores from "../../style/colors";
import FONTS from "../../style/fonts";
import { createStackNavigator } from "@react-navigation/stack";
const Stack = createStackNavigator();

const AdminAppBar = ({ navigation, title, isRoot, correo, rol, name, img }) => {
  function getRole(rol){
    switch (rol){
      case "ROLE_ADMIN": return 'Administrador';
      case "ROLE_ARBITRO": return 'Árbitro';
      case "ROLE_DUENO": return 'Dueño';
      default: return '';
    }
  }
  return (
    <SafeAreaView style={styles.safeArea}>
      {title === "Dueños" ? null : (
        <View style={styles.appBar}>
          <TouchableOpacity
            onPress={() =>
              /*navigation.dispatch(DrawerActions.openDrawer())*/
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
          <Text style={[styles.title, FONTS.nunitoNegrita]}>
            {title === "Home" ? "Home" : title}
          </Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(title == "Perfil" ? "Home" : "Perfil", {
                usuario: name !== '' ? name : "Usuario Administrador",
                rol: getRole(rol),
                correo: correo
              })
            }
          >
            {correo === "sistemaligafutleagueshub@gmail.com" ||
            correo === "" ? (
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
                // style={{
                //   width: 50,
                //   height: 50,
                //   backgroundColor: colores.base_1_1,
                //   borderRadius: 100,
                //   resizeMode: "stretch",
                // }}
              />
            )}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colores.base_3_1 },
  appBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    justifyContent: "space-between",
    marginTop: "5%",
  },
  title: { color: "white", fontSize: 18, marginLeft: 15, width: "auto" },
});

export default AdminAppBar;
