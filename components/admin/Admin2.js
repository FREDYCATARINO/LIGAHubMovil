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
import api from "../../config/api";

import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const jugadoresPrueba = [
  {
    id: 1,
    nombre: "Jugador #001",
    goles: 9,
    partidos: 5,
    fallas: 0,
    img: "https://lindamood.net/wp-content/uploads/2019/09/Blank-profile-image.jpg",
    activo: true,
  },
  {
    id: 2,
    nombre: "Jugador #002",
    goles: 3,
    partidos: 8,
    fallas: 0,
    img: "https://lindamood.net/wp-content/uploads/2019/09/Blank-profile-image.jpg",
    activo: true,
  },
  {
    id: 3,
    nombre: "Jugador #003",
    goles: 6,
    partidos: 1,
    fallas: 0,
    img: "https://lindamood.net/wp-content/uploads/2019/09/Blank-profile-image.jpg",
    activo: true,
  },
  {
    id: 4,
    nombre: "Jugador #004",
    goles: 10,
    partidos: 3,
    fallas: 0,
    img: "https://lindamood.net/wp-content/uploads/2019/09/Blank-profile-image.jpg",
    activo: false,
  },
  {
    id: 5,
    nombre: "Jugador #005",
    goles: 9,
    partidos: 2,
    fallas: 0,
    img: "https://lindamood.net/wp-content/uploads/2019/09/Blank-profile-image.jpg",
    activo: false,
  },
  {
    id: 6,
    nombre: "Jugador #006",
    goles: 2,
    partidos: 1,
    fallas: 1,
    img: "https://lindamood.net/wp-content/uploads/2019/09/Blank-profile-image.jpg",
    activo: true,
  },
  {
    id: 7,
    nombre: "Jugador #007",
    goles: 0,
    partidos: 50,
    fallas: 50,
    img: "https://lindamood.net/wp-content/uploads/2019/09/Blank-profile-image.jpg",
    activo: true,
  },
];

const equipos = [
  {
    equipoId: 1,
    nombre: "Chivas",
    dt: {
      id: 1,
      nombre: "Juan Peréz",
      correo: "juanperez@hotmail.com",
      img: "https://th.bing.com/th/id/OIP.SVo8-p3WhGOnngP6K6tBsAHaKc?w=115&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7",
    },
    jugadores: jugadoresPrueba,
    img: "https://drive.google.com/uc?export=view&id=1-FOLUn9u4T-D5ggneCO0nZm4jOOVXItI",
  },
  {
    equipoId: 2,
    nombre: "Cruz Azul",
    dt: {
      id: 2,
      nombre: "Mauro Bahena",
      correo: "maurodfr@hotmail.com",
      img: "https://i.pinimg.com/originals/55/45/e2/5545e27dd7441dc888fa6e4669421bdc.png",
    },
    jugadores: jugadoresPrueba,
    img: "https://drive.google.com/uc?export=view&id=1L4y6YuAZuIYWEOlWr0sBKmoutcMFyG54",
  },
  {
    equipoId: 3,
    nombre: "Monterrey",
    dt: {
      id: 1,
      nombre: "Nick Fury",
      correo: "vengadores@hotmail.com",
      img: "https://th.bing.com/th/id/OIP.YoIWYEmDFaQof1wx6j8xBQHaKp?w=132&h=190&c=7&pcl=1b1a19&r=0&o=5&dpr=1.5&pid=1.7",
    },
    jugadores: jugadoresPrueba,
    img: "https://drive.google.com/uc?export=view&id=1L_u5cuRI6pI78YOb-0PIt_vovmV8SLLX",
  },
  {
    equipoId: 4,
    nombre: "Necaxa",
    dt: {
      id: 1,
      nombre: "Don Ramón",
      correo: "mochito@gmail.com",
      img: "https://th.bing.com/th/id/OIP.iox5J2IefKpTqQ3A0PovKwAAAA?rs=1&pid=ImgDetMain",
    },
    jugadores: jugadoresPrueba,
    img: "https://drive.google.com/uc?export=view&id=1_bDUfg2szuTCPy6onk37wSbzOoZGyhWW",
  },
  {
    equipoId: 5,
    nombre: "Pumas",
    dt: {
      id: 1,
      nombre: "Francisco Pulido",
      correo: "camarapaino@utez.edu.mx",
      img: "https://th.bing.com/th/id/OIP.crgqPqen60BHAPwu_jzyAgHaNK?rs=1&pid=ImgDetMain",
    },
    jugadores: jugadoresPrueba,
    img: "https://drive.google.com/uc?export=view&id=1IdFsp723ipbBX95PWsXwpURsO5L4jGei",
  },
  {
    equipoId: 6,
    nombre: "America",
    dt: {
      id: 1,
      nombre: "Daniel Aguilar",
      correo: "daniel@aguilar.com",
      img: "https://th.bing.com/th/id/OIP.9Uh0RFprWijPzuoxR2tcBQHaNL?w=115&h=181&c=7&pcl=1b1a19&r=0&o=5&dpr=1.5&pid=1.7",
    },
    jugadores: jugadoresPrueba,
    img: "https://drive.google.com/uc?export=view&id=1hLeMo386b05HrRd2mruNXZZqlWJ_EbSC",
  },
  {
    equipoId: 7,
    nombre: "Atlas",
    dt: {
      id: 1,
      nombre: "El piojo Herrera",
      correo: "elpiojitoxd@gmail.com",
      img: "https://th.bing.com/th/id/OIP.vEf5l5SjcnsD1mhWGM2uRAAAAA?rs=1&pid=ImgDetMain",
    },
    jugadores: jugadoresPrueba,
    img: "https://drive.google.com/uc?export=view&id=1yeIzWN8Wl6TvIrEtqci874SU7MT6E8cg",
  },
  {
    equipoId: 8,
    nombre: "Tigres",
    dt: {
      id: 1,
      nombre: "Tigre Toño",
      correo: "grrriquisimas@hotmail.com",
      img: "https://tecolotito.elsiglodetorreon.com.mx/i/2010/05/204363.jpeg",
    },
    jugadores: jugadoresPrueba,
    img: "https://drive.google.com/uc?export=view&id=1HMF63odQw9WzQdVmfFbSP1H3_F8qY-uV",
  },
];

const Admin2 = ({ navigation }) => {
  const [duenos, setDuenos] = useState([]);
  const [loadDuenos, setLoadDuenos] = useState(false);
  const [falloD, setFalloD] = useState("");

  const { getUserId, getUserRole, getToken } = useContext(AuthContext);
  const [tokData, setTokData] = useState("");

  function sendData(data) {
    const team = data
    navigation.navigate("Ver equipo", { team });
  }

  useEffect(() => {
    const getDuenos = async () => {
      const id = await getUserRole();
      const rolo = await getUserId();
      const tok = await getToken();
      setTokData(tok);

      setLoadDuenos(true);
      api
        .get(`/api/duenos`, {
          headers: {
            Authorization: `Bearer ${tok}`,
          },
        })
        .then((res) => {
          if (res.data.length === 0) setFalloD("No hay dueños registrados");
          else setDuenos(res.data);
        })
        .catch((e) => {
          console.error(e, e.res.message);
          if (err.response.status === 403) {
            console.log("⚠️ Token expirado, redirigiendo a login...");
            Alert.alert(
              "Sesión expirada",
              "Por favor, inicia sesión nuevamente."
            );
            logout()
            return;
          }
          if (e.res.message) setFalloD(e.res.message);
          else setFalloD("Error al obtener dueños");
        })
        .finally(() => setLoadDuenos(false));
    };
    getDuenos();
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
            Dueños de equipos
          </Text>
          {loadDuenos ? (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
              }}
            >
              <ActivityIndicator size="large" color={colores.domin_1_1} />
            </View>
          ) : falloD === "" ? (
            <FlatList
              data={duenos}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              nestedScrollEnabled={true}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity
                    style={[styles3.prod]}
                    onPress={() =>
                      sendData(
                        item
                      )
                    }
                  >
                    <Image
                      source={{ uri: item.imagenUrl }}
                      style={styles3.image}
                    />
                    <Text style={[styles3.aligned1, FONTS.oswaldNegrita]}>
                      {item.nombreCompleto}
                    </Text>
                    <Text style={[styles3.aligned3, FONTS.oswald]}>
                      {item.usuario.email}
                    </Text>
                    <Text style={[styles3.aligned4, FONTS.oswald]}>
                      Ver equipos
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          ) : (
            <Text
              style={[FONTS.oswald, styles.errMessCenter, { marginTop: 10 }]}
            >
              {falloD}
            </Text>
          )}
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
    paddingBottom: 10,
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
    paddingBottom: 10,
  },
  prod: {
    backgroundColor: "#f8f9fa",
    flexGrow: 1,
    flexBasis: "45%",
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
  prodUnpressed: {
    backgroundColor: colores.base_2_4,
  },
  prodActive: {
    backgroundColor: colores.domin_2_5,
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
    width: 120,
    height: 120,
    resizeMode: "stretch",
    borderRadius: 50
  },
  aligned1: {
    textAlign: "center",
    fontSize: 25,
  },
  aligned3: {
    textAlign: "center",
    fontSize: 15,
  },
  aligned4: {
    textAlign: "center",
    fontSize: 15,
    color: colores.base_2_1
  },
  aligned2: {
    textAlign: "center",
    overflow: "visible",
    padding: 5,
    fontSize: 18,
    width: "100%%",
  },
});

export default Admin2;
