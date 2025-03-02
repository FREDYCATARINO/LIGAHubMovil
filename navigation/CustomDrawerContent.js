import React from "react";
import { View, Image, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DrawerItemList } from "@react-navigation/drawer";
import colores from "../style/colors";

const CustomDrawerContent = (props) => {
  return (
    <View style={{ flex: 1, backgroundColor: colores.base_1_1 }}>
      <View style={styles.header}>
        <View style={styles.leave}>
          <TouchableOpacity onPress={() => props.navigation.closeDrawer()}>
            <Ionicons name="close" size={30} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.imgTitle}>
          <Image source={require("../components/logo.png")} style={styles.image} />
          <Text style={[styles.Titles, styles.title]}>Menú</Text>
        </View>
      </View>
      <DrawerItemList {...props} />
    </View>
  );
};

export default CustomDrawerContent;

const styles = StyleSheet.create({
  header: {
    height: 150,
    backgroundColor: colores.domin_1_2,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
    marginBottom: 10,
    width: "auto",
    flexDirection: "column",
    gap: 5,
  },
  image: {
    width: 50,
    height: 80,
    borderRadius: 40,
  },
  title: {
    color: "white",
    fontSize: 25,
    marginTop: 10,
  },
  leave: {
    alignSelf: "flex-end",
    marginRight: 10,
  },
  imgTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});
