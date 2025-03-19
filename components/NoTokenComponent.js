import React from "react";
import {
  Text,
  Button,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  FlatList,
  TouchableOpacity,
  Animated,
  TextInput,
  Image,
} from "react-native";
import FONTS from "../style/fonts";
import colores from "../style/colors";

const NoTokenComponent = ({ removeToken, removeUser, logout }) => {
  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={[{ fontSize: 20 }, FONTS.oswald]}>
        Tu sesión ha expirado, inicia sesión nuevamente
      </Text>
      <TouchableOpacity
        style={{
          width: "50%",
          backgroundColor: colores.domin_2_1,
          padding: 10,
          alignItems: "center",
          borderRadius: 10,
        }}
        onPress={async () => {
          await Promise.all([removeToken(), removeUser()]);
          logout();
        }}
      >
        <Text style={[{ color: "white", fontSize: 20 }, FONTS.oswald]}>
          Regresar
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const errorStyles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  Title: {
    fontFamily: FONTS.oswaldNegrita,
    fontSize: 20,
    color: "black",
  },
});

export default NoTokenComponent;
