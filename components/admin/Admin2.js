import React, { useEffect, useState } from "react";
import {
  Text,
  Button,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  Image,
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
import styles from "../../style/style";
import colores from "../../style/colors";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import axios from "axios";

const equipos = [
  { equipoId: 1, nombre: "Chivas", dt: "Juan Peréz", jugadores: [], img: 'https://drive.google.com/uc?export=view&id=1-FOLUn9u4T-D5ggneCO0nZm4jOOVXItI' },
  { equipoId: 2, nombre: "Cruz Azul", dt: "Mauro Bahena", jugadores: [], img: 'https://drive.google.com/uc?export=view&id=1L4y6YuAZuIYWEOlWr0sBKmoutcMFyG54' },
  { equipoId: 3, nombre: "Monterrey", dt: "Nick Fury", jugadores: [], img: 'https://drive.google.com/uc?export=view&id=1L_u5cuRI6pI78YOb-0PIt_vovmV8SLLX' },
  { equipoId: 4, nombre: "Necaxa", dt: "Don Ramón", jugadores: [], img: 'https://drive.google.com/uc?export=view&id=1_bDUfg2szuTCPy6onk37wSbzOoZGyhWW' },
  { equipoId: 5, nombre: "Pumas", dt: "Francisco Pulido", jugadores: [], img: 'https://drive.google.com/uc?export=view&id=1IdFsp723ipbBX95PWsXwpURsO5L4jGei' },
  { equipoId: 6, nombre: "America", dt: "Daniel Aguilar", jugadores: [], img: 'https://drive.google.com/uc?export=view&id=1hLeMo386b05HrRd2mruNXZZqlWJ_EbSC' },
  { equipoId: 7, nombre: "Atlas", dt: "El piojo Herrera", jugadores: [], img: 'https://drive.google.com/uc?export=view&id=1yeIzWN8Wl6TvIrEtqci874SU7MT6E8cg' },
  { equipoId: 6, nombre: "Tigres", dt: "Tigre Toño", jugadores: [], img: 'https://drive.google.com/uc?export=view&id=1HMF63odQw9WzQdVmfFbSP1H3_F8qY-uV' },
];

const Admin2 = ({ navigation }) => {
  const [equiposFut, setEquiposFut] = useState([]);

  function sendData(id, name, dt, jugadores, img) {
    const team = {
      id: id,
      nombre: name,
      dueno: dt,
      jugadores: jugadores,
      image: img,
    };
    navigation.navigate("Ver equipo", {team});
  }

  useEffect(() => {
    axios
      .get("https://fakestoreapi.com/products")
      .then((resp) => {
        setEquiposFut(resp.data);
      })
      .catch((error) => {
        console.error("Error al obtener productos:", error);
      });
  }, []);

  const [fontsLoaded] = useFonts({
    Oswald_400Regular,
    Oswald_700Bold,
    Oswald_400Italic,
    Oswald_700BoldItalic,
    Nunito_400Regular,
    Nunito_700Bold,
    Nunito_400Italic,
    Nunito_700BoldItalic,
  });

  setTimeout(() => {
    if (!fontsLoaded) {
      console.log("Cargando...");
      return (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginTop: "10%",
          }}
        >
          <ActivityIndicator color={colores.domin_1_1} />
          <Text> Loading Fonts... </Text>
        </View>
      );
    }
  }, 1000);

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={stylesAdmin2.container}>
        <ScrollView contentContainerStyle={stylesAdmin2.scrollContent}>
          <Text
            style={[
              styles.TextField,
              stylesAdmin2.title,
              FONTS.nunitoNegrita,
              { paddingVertical: 15, paddingHorizontal: 5 },
            ]}
          >
            Equipos
          </Text>
          <FlatList
            data={equipos}
            keyExtractor={(item) => item.equipoId.toString()} // Usar equipoId en lugar de id
            numColumns={2}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles3.prod}
                onPress={() =>
                  sendData(
                    item.equipoId,
                    item.nombre,
                    item.dt,
                    item.jugadores,
                    item.img
                  )
                }
              >
                <Image source={{uri: item.img, alt: item.nombre}} style={styles3.image}/>
                <Text style={[styles3.aligned1, FONTS.oswaldNegrita]}>{item.nombre}</Text>
                <Text style={[styles3.aligned2, FONTS.oswald]}>DT: {item.dt}</Text>
              </TouchableOpacity>
            )}
          />
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
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
    paddingBottom: 10
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

const styles3 = StyleSheet.create({
  container: { flex: 1, justifyContent: "flex-start", alignItems: "center" },
  spinner: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 24, fontWeight: "bold", textAlign: "center" },
  list: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    paddingBottom: 10
  },
  prod: {
    flexGrow: 1,
    flexBasis: "45%",
    backgroundColor: colores.base_2_4,
    margin: 5,
    gap: 5,
    // iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    // Android
    elevation: 3,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  box: {
    margin: 10,
    alignContent: "center",
    justifyContent: "center",
    fontSize: 20,
  },
  bot: {
    justifyContent: "flex-end",
    marginBottom: 5,
    borderRadius: 10,
  },
  image: {
    width: 125,
    height: 125,
    resizeMode: 'contain',
  },
  aligned1: {
    textAlign: "center",
    fontSize: 25
  },
  aligned2: {
    textAlign: "center",
    overflow: "visible",
    padding: 5,
    fontSize: 18, 
    width: '100%%'
  },
});

export default Admin2;
