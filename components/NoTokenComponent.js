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
import { Title } from "react-native-paper";
import FONTS from "../style/fonts";
import colores from "../style/colors";

const NoTokenComponent = ({ reintentar, valor }) => {
  return (
    <SafeAreaView
      style={{
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
      }}
    >
      <Image
        source={require("../assets/error_bot.png")}
        style={{ width: "75%", height: 250 }}
      />
      <Text style={[{ fontSize: 25 }, FONTS.oswaldNegrita]}>
        ¡Oh no!
      </Text>
      <Text style={[{ fontSize: 20 }, FONTS.oswald]}>
        Tu sesión ha expirado, vuelve a iniciar sesión para continuar
      </Text>
      <TouchableOpacity
        style={{
          width: "50%",
          backgroundColor: colores.domin_2_1,
          padding: 10,
          alignItems: "center",
          borderRadius: 10,
        }}
        onPress={() => reintentar(!valor)}
      >
        <Text style={[{ color: "white", fontSize: 20 }, FONTS.oswald]}>
          Ir
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
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
