import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import colores from "../style/colors";
import FONTS from "../style/fonts";
import Arbitro1 from "../components/arbitro/Arbitro1";
import { Button } from "react-native-paper";

const PerfilScreen = ({ navigation }) => {
  return (
    <SafeAreaView>
      <Text>Perfil</Text>
      <TouchableOpacity
        style={{ backgroundColor: "#9a0001" }}
        onPress={() => navigation.navigate("Home")}
      >
        <Text>Volver</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default PerfilScreen;
