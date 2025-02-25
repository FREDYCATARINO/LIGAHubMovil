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
import LoginScreen from "../../screens/Login";
import colores from "../../style/colors";
import FONTS from "../../style/fonts";

import { createStackNavigator } from "@react-navigation/stack";
const Stack = createStackNavigator();


const AdminAppBar = ({ navigation, title, isRoot }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      {title === "Equipos" ? null : <View style={styles.appBar}>
        <TouchableOpacity
          onPress={() => /*navigation.dispatch(DrawerActions.openDrawer())*/
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
        <Text style={[styles.title, FONTS.nunitoNegrita]}>{title}</Text>
        <TouchableOpacity onPress={() => navigation.navigate(title == "Perfil" ? "Home" : "Perfil", { usuario: "José José", rol: "Admin" })}>
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
      </View> }
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colores.base_3_1},
  appBar: { flexDirection: "row", alignItems: "center", padding: 15, justifyContent: 'space-between', marginTop: "5%"  },
  title: { color: "white", fontSize: 18, marginLeft: 15 },
});

export default AdminAppBar;
