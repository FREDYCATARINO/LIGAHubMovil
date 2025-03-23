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
import PerfilScreen from "../../screens/Perfil";
import colores from "../../style/colors";
import FONTS from "../../style/fonts";
import Arbito1 from "./Arbitro1";

const ArbitroAppBar = ({
  navigation,
  title,
  isRoot,
  correo,
  rol,
  name,
  img,
}) => {
  return (
    <View style={styles.safeArea}>
      <View style={styles.appBar}>
        <TouchableOpacity
          onPress={() =>
            /*navigation.dispatch(DrawerActions.openDrawer())*/
            isRoot ? null : navigation.navigate("Inicio")
          }
        >
          {title === "Inicio" ? (
            <Image
              source={require("../../assets/icon.png")}
              style={{
                width: 50,
                height: 50,
                backgroundColor: "transparent",
                resizeMode: "cover",
                borderRadius: 5,
              }}
            />
          ) : (
            <Ionicons
              //name={"menu"}
              name={"arrow-back"}
              size={24}
              color="white"
            />
          )}
        </TouchableOpacity>
        <Text style={[styles.title, FONTS.nunitoNegrita]}>{title}</Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Mi perfil", {
              usuario: name !== '' ? name : "Usuario Árbitro",
              rol: 'Árbitro',
              correo: correo,
              img: img
            })
          }
        >
          { img === "" ? (
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
    </View>
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
  title: { color: "white", fontSize: 18, marginLeft: 15 },
});

export default ArbitroAppBar;
