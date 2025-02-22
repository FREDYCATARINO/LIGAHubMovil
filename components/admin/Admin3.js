import React from "react";
import {
  Text,
  Button,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity
} from "react-native";
import FONTS from "../../style/fonts";
import { useFonts } from "expo-font";
import {
  Oswald_400Regular,
  Oswald_700Bold,
  Oswald_400Italic,
  Oswald_700BoldItalic,
} from "@expo-google-fonts/oswald"; // Cargar Oswald
import {
  Nunito_400Regular,
  Nunito_700Bold,
  Nunito_400Italic,
  Nunito_700BoldItalic,
} from "@expo-google-fonts/nunito"; // Cargar Nunito
import colores from "../../style/colors";

const Admin3 = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
      <Text
            style={[
              styles.TextField,
              stylesAdmin2.title,
              FONTS.nunitoNegrita,
              { paddingVertical: 15, paddingHorizontal: 5 },
            ]}
          >
            Torneos
          </Text>
        <View style={stylesAdmin2.grid}>
          <View style={stylesAdmin2.card}>Hola</View>
          <View style={stylesAdmin2.card}>Hola</View>
          <View style={stylesAdmin2.card}>Hola</View>
          <View style={stylesAdmin2.card}>Hola</View>
        </View>
        <ScrollView
          horizontal={true}
          style={stylesAdmin2.scrollContainer}
          showsHorizontalScrollIndicator={false}
        >
          <TouchableOpacity
            style={[stylesAdmin2.box, { backgroundColor: "#ff6666" }]}
          >
            <Text style={stylesAdmin2.text}>1</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[stylesAdmin2.box, { backgroundColor: "#ffcc66" }]}
          >
            <Text style={stylesAdmin2.text}>2</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[stylesAdmin2.box, { backgroundColor: "#66ff66" }]}
          >
            <Text style={stylesAdmin2.text}>3</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[stylesAdmin2.box, { backgroundColor: "#66ccff" }]}
          >
            <Text style={stylesAdmin2.text}>4</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[stylesAdmin2.box, { backgroundColor: "#9966ff" }]}
          >
            <Text style={stylesAdmin2.text}>5</Text>
          </TouchableOpacity>
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

const stylesAdmin2 = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    margin: 5,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    alignItems: "flex-start",
    width: "95%",
    marginBlock: 5,
  },
  grid: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    width: "100%",
    maxHeight: 215,
    padding: 1,
  },
  card: {
    backgroundColor: colores.blanco,
    marginVertical: 5,
    marginHorizontal: 1,
    width: "48%",
    height: 100,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 5,
  },
  scrollContainer: {
    marginTop: 50,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  box: {
    width: 200,
    height: 300,
    marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Admin3;
