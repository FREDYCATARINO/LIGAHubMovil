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
        <ScrollView contentContainerStyle={stylesAdmin2.scrollContent} showsVerticalScrollIndicator={false}>
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
    borderRadius: 100
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
