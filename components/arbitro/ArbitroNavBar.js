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
import PerfilScreen from "../../screens/Perfil";
import colores from "../../style/colors";
import FONTS from "../../style/fonts";
import Arbito1 from "./Arbitro1";

const ArbitroAppBar = ({ navigation, title, isRoot }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.appBar}>
        <TouchableOpacity
          onPress={() =>
            /*navigation.dispatch(DrawerActions.openDrawer())*/
            isRoot ? null : navigation.goBack()
          }
        >
          {isRoot ? (
            <Image
              source={require('../../assets/icon.png')}
              style={{
                width: 24,
                height: 24,
                backgroundColor: colores.base_1_1,
                resizeMode: "stretch",
                borderRadius: 5
              }}
            />
          ) : (
            <Ionicons
              //name={"menu"}
              name={isRoot ? "menu" : "arrow-back"}
              size={24}
              color="white"
            />
          )}
        </TouchableOpacity>
        <Text style={[styles.title, FONTS.nunitoNegrita]}>{title}</Text>
        <TouchableOpacity
          onPress={() =>
            /*navigation.navigate("Perfil")*/ alert("En proceso...")
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
    padding: 15,
    justifyContent: "space-between",
    marginTop: "5%",
  },
  title: { color: "white", fontSize: 18, marginLeft: 15 },
});

export default ArbitroAppBar;
