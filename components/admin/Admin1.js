import React, { useState, useEffect } from "react";
import {
  Text,
  Button,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Calendar } from "react-native-calendars";
import styles from "../../style/style";
import { Ionicons } from "@expo/vector-icons";
import colores from "../../style/colors";
import * as Progress from "react-native-progress";
import FONTS from "../../style/fonts";
import { useFonts } from "expo-font";
import api from "../../config/api";
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
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { TokenContext } from "../../context/TokenContext";

const Admin1 = ({ navigation, route }) => {
  const [progress, setProgress] = useState(0.25);
  const { getUserId, getUserRole, getToken } = useContext(AuthContext);
  const { token } = useContext(TokenContext);
  const [modalSolid, setModalSolid] = useState(false);
  const [torName, setTorName] = useState("");

  const [load1, setLoad1] = useState(false);
  const [load2, setLoad2] = useState(false);
  const [load3, setLoad3] = useState(false);
  const [load4, setLoad4] = useState(false);

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

  const increaseProgress = () => {
    setProgress((prev) => (prev < 1 ? prev + 0.1 : 1)); // Aumentar 10% cada vez
  };

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

  const [solicitudes, setSolicitudes] = useState([]);
  const [loadSolids, setLoadSolids] = useState(false);
  const [fallo, setFallo] = useState("");
  const [tokData, setTokData] = useState("");

  const [equipos, setEquipos] = useState([]);
  const [loadEqu, setLoadEqu] = useState(false);
  const [fallo2, setFallo2] = useState("");

  const [torEspera, setTorEspera] = useState(0);
  const [totPagos, setTotPagos] = useState(0);

  const [torneos, setTorneos] = useState([]);

  useEffect(() => {
    const getUserAll = async () => {
      const id = await getUserRole();
      const rolo = await getUserId();
      const tok = await getToken();
      setTokData(tok);
      setLoadSolids(true);
      api
        .get(`/api/solicitudes/admin/pendientes`, {
          headers: {
            Authorization: `Bearer ${tok}`,
          },
        })
        .then((res) => {
          if (res.data.length === 0) setFallo("No hay solicitudes pendientes");
          else setSolicitudes(res.data);
        })
        .catch((e) => {
          console.error(e, e.res.message);
          if (e.res.message) setFallo(e.res.message);
          else setFallo("Error al obtener solicitudes");
        })
        .finally(() => setLoadSolids(false));

      api
        .get(`/api/torneos`)
        .then((res) => {
          setTorneos(res.data);
        })
        .catch((e) => {
          console.error(e, e.res.message);
        });
    };
    getUserAll();

    setLoad1(true);
    setLoad2(true);
    setLoad3(true);
    setLoad4(true);
    setLoadEqu(true);
    api
      .get(`/api/equipos`)
      .then((res) => {
        if (res.data.length === 0)
          setFallo("No hay equipos registrados todavía");
        else setEquipos(res.data);
      })
      .catch((e) => {
        console.error(e, e.res.message);
        if (e.res.message) setFallo2(e.res.message);
        else setFallo2("Error al obtener equipos");
      })
      .finally(() => setLoadEqu(false));

    api
      .get(`/api/torneos/espera`)
      .then((res) => {
        if (res.data.length === 0) setTorEspera(0);
        else setTorEspera(res.data.length);
      })
      .catch((e) => {
        console.error(e, e.res.message);
        setTorEspera(0);
      })
      .finally(() => {
        setLoad1(false);
        setLoad4(false);
      });

    api
      .get(`/api/pagos/equipo/torneo/pendientes/3/15a`, {
        headers: {
          Authorization: `Bearer ${tokData}`,
        },
      })
      .then((res) => {
        if (res.data.length === 0) setTotPagos(0);
        else setTotPagos(res.data.length);
      })
      .catch((e) => {
        console.error(e, e.res.message);
        setTotPagos(0);
      })
      .finally(() => {
        setLoad2(false);
        setLoad3(false);
      });
  }, []);

  function getTorneoLogo(id) {
    const torneo = torneos.find((tor) => tor.id === id);
    if (torneo) {
      console.log("Encontrado");
      return torneo.logoTorneo;
    } else {
      console.log("No encontrado");
      return "https://th.bing.com/th/id/OIP.vxFF12mSgYf6Cs5z9O2i7QAAAA?rs=1&pid=ImgDetMain"; // Imagen de respaldo
    }
  }  

  const markedDates = {
    "2025-02-19": {
      selected: true,
      selectedColor: colores.acento_3_1,
    },
    "2025-02-25": {
      selected: true,
      selectedColor: colores.acento_3_1,
    },
    "2025-03-02": {
      selected: true,
      selectedColor: colores.acento_3_1,
    },
  };

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={[styless.scrollContent]}>
        <ScrollView contentContainerStyle={styless.myScrollContent}>
          <Text
            style={[
              styles.TextField,
              styless.title,
              FONTS.nunitoNegrita,
              { paddingVertical: 15, paddingHorizontal: 5 },
            ]}
          >
            Inicio
          </Text>
          <View style={styless.grid}>
            <View style={styless.card}>
              <View
                style={[styless.barrita, { backgroundColor: "#3CB371" }]}
              ></View>
              <View style={styless.col}>
                <View style={styless.row3}>
                  <Text style={[{ color: "#3CB371" }, FONTS.oswald]}>
                    Proximo partido
                  </Text>
                  <Ionicons
                    name="calendar"
                    size={24}
                    color={colores.base_1_3}
                  />
                </View>
                {load1 ? (
                  <ActivityIndicator size="small" color="#3CB371" />
                ) : (
                  <Text style={FONTS.oswald}>Domingo, 23 de febrero</Text>
                )}
              </View>
            </View>
            <View style={styless.card}>
              <View
                style={[styless.barrita, { backgroundColor: "#FFC300" }]}
              ></View>
              <View style={styless.col}>
                <View style={styless.row3}>
                  <Text style={[{ color: "#FFC300" }, FONTS.oswald]}>
                    Pagos pendientes
                  </Text>
                  <Ionicons
                    name="cash"
                    size={24}
                    color={colores.base_1_3}
                    style={{ marginTop: 2 }}
                  />
                </View>
                {load2 ? (
                  <ActivityIndicator size="small" color="#FFC300" />
                ) : (
                  <Text style={FONTS.oswald}>{totPagos}</Text>
                )}
              </View>
            </View>
            <View style={styless.card}>
              <View
                style={[styless.barrita, { backgroundColor: "#4E73DF" }]}
              ></View>
              <View style={styless.col}>
                <View style={styless.row3}>
                  <Text style={[{ color: "#4E73DF" }, FONTS.oswald]}>
                    Solicitudes pendientes
                  </Text>
                  <Ionicons name="mail" size={24} color={colores.base_1_3} />
                </View>
                {load3 ? (
                  <ActivityIndicator size="small" color="#4E73DF" />
                ) : (
                  <Text style={FONTS.oswald}>{solicitudes.length}</Text>
                )}
              </View>
            </View>
            <View style={styless.card}>
              <View
                style={[styless.barrita, { backgroundColor: "#9A0000" }]}
              ></View>
              <View style={styless.col}>
                <View style={styless.row3}>
                  <Text style={[{ color: "#9A0000" }, FONTS.oswald]}>
                    Torneos en espera
                  </Text>
                  <Ionicons name="trophy" size={24} color={colores.base_1_3} />
                </View>
                <View style={styless.row3}>
                  {load4 ? (
                    <ActivityIndicator size="small" color="#9A0000" />
                  ) : (
                    <Text style={FONTS.oswald}>{torEspera}</Text>
                  )}
                  {/* <Progress.Bar
                    progress={progress}
                    width={100}
                    color="#9A0000"
                  /> */}
                </View>
              </View>
            </View>
          </View>
          <View style={styless.card2}>
            <Text style={[FONTS.oswaldNegrita, styless.title2]}>
              Solicitudes pendientes
            </Text>
            <ScrollView style={styless.list} nestedScrollEnabled={true}>
              {loadSolids ? (
                <ActivityIndicator
                  size="large"
                  color={colores.domin_1_1}
                  style={{ marginTop: 20 }}
                />
              ) : fallo === "" ? (
                solicitudes.map((s) => {
                  return (
                    <View key={s.id}>
                      <TouchableOpacity
                        style={styless.solid}
                        onPress={() => {
                          setTorName(s.nombreTorneo);
                          setModalSolid(true);
                        }}
                      >
                        <View
                          style={{
                            width: 80,
                            justifyContent: "center",
                            gap: 5,
                          }}
                        >
                          <Image
                            source={{
                              uri: getTorneoLogo(s.idTorneo),
                            }}
                            style={{
                              height: 80,
                              backgroundColor: colores.base_1_1,
                              borderRadius: 100,
                              resizeMode: "stretch",
                              padding: 0,
                            }}
                          />
                        </View>
                        <View style={{ width: '72%', marginLeft: 5 }}>
                          <View style={styless.row1}>
                            {/* <Image
                          source={{
                            uri: "https://th.bing.com/th/id/OIP.SVo8-p3WhGOnngP6K6tBsAHaKc?w=115&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7",
                          }}
                          style={{
                            width: 40, 
                            height: 40,
                            backgroundColor: colores.base_1_1,
                            borderRadius: 100,
                            resizeMode: "stretch",
                            alignSelf: "center",
                          }}
                        /> */}
                            <Text style={[styless.nombre]}>
                              {s.nombreEquipo}
                            </Text>
                          </View>
                          <View style={styless.row2}>
                            <TouchableOpacity
                              style={[
                                styles.button,
                                { backgroundColor: colores.acento_3_1 },
                                styless.boton,
                              ]}
                            >
                              <Text
                                style={[
                                  FONTS.oswald,
                                  { color: "white", fontSize: 18 },
                                ]}
                              >
                                Aceptar
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={[
                                styles.button,
                                { backgroundColor: colores.domin_1_1 },
                                styless.boton,
                              ]}
                            >
                              <Text
                                style={[
                                  FONTS.oswald,
                                  { color: "white", fontSize: 18 },
                                ]}
                              >
                                Rechazar
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </TouchableOpacity>
                      <View style={styless.myBorder}></View>
                    </View>
                  );
                })
              ) : (
                <Text
                  style={[
                    FONTS.oswald,
                    styles.errMessCenter,
                    { marginTop: 10 },
                  ]}
                >
                  {fallo}
                </Text>
              )}
            </ScrollView>
          </View>
          <View style={styless.card2}>
            <Text style={[FONTS.oswaldNegrita, styless.title2]}>
              Equipos registrados
            </Text>
            {loadEqu ? (
              <ActivityIndicator
                size="large"
                color={colores.domin_1_1}
                style={{ marginTop: 20 }}
              />
            ) : fallo2 === "" ? (
              <View style={{ height: 280 }}>
                <FlatList
                  data={equipos}
                  keyExtractor={(item) => item.id.toString()} // Usar equipoId en lugar de id
                  numColumns={2}
                  nestedScrollEnabled={true}
                  renderItem={({ item }) => {
                    return (
                      <TouchableOpacity
                        style={[styless.prod]}
                        onPress={() =>
                          navigation.navigate("Jugadores", { team: item })
                        }
                        // onPress={() =>
                        //   sendData(
                        //     item.equipoId,
                        //     item.nombre,
                        //     item.dt,
                        //     item.jugadores,
                        //     item.img
                        //   )
                        // }
                      >
                        <Image
                          source={{ uri: item.logoEquipo }}
                          style={styless.image}
                        />
                        <Text style={[styless.aligned1, FONTS.oswaldNegrita]}>
                          {item.nombreEquipo}
                        </Text>
                        <Text style={[styless.aligned2, FONTS.oswaldNegrita]}>
                          Ver jugadores
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
            ) : (
              <Text
                style={[FONTS.oswald, styles.errMessCenter, { marginTop: 10 }]}
              >
                {fallo2}
              </Text>
            )}
          </View>
          <View style={styless.card3}>
            <Text style={[FONTS.oswaldNegrita, styless.title3]}>
              Calendario de partidos
            </Text>
            <Calendar
              style={[FONTS.nunito, styless.calendar]}
              onDayPress={(day) => {
                if (markedDates.hasOwnProperty(day.dateString)) {
                  alert("Hola " + day.day);
                }
              }}
              monthFormat={"MMM yyyy"}
              markedDates={markedDates} // Usamos la variable aquí
              theme={{
                todayTextColor: colores.domin_2_1,
                todayBackgroundColor: colores.acento_1_3,
                selectedDayBackgroundColor: colores.acento_2_5,
                selectedDayTextColor: colores.blanco,
                textSectionTitleColor: colores.acento_1_3,
                monthTextColor: colores.domin_2_1,
                arrowColor: colores.domin_2_1,
                textDayFontSize: 16,
                textDayFontFamily: "Nunito_400Regular",
                textMonthFontFamily: "Nunito_400Regular",
                textDayHeaderFontFamily: "Nunito_400Regular",
                textDayStyle: {
                  minWidth: 30,
                  textAlign: "center",
                },
              }}
            />
            ;
          </View>
        </ScrollView>
        <Modal
          animationType="fade" // Animación del modal (puede ser 'fade', 'slide', o 'none')
          transparent={true} // Hace que el fondo sea transparente
          visible={modalSolid} // El Modal solo se muestra si modalVisible es true
          onRequestClose={() => {
            setModalSolid(false);
          }} // Cierra el modal al presionar el botón de retroceso en Android
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          >
            <View
              style={{
                width: 300,
                padding: 20,
                backgroundColor: "white",
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
                gap: 5,
              }}
            >
              <Text style={[{ fontSize: 25 }, FONTS.oswaldNegrita]}>
                Detalles de la solicitud
              </Text>
              <Text
                style={[{ fontSize: 20, textAlign: "center" }, FONTS.oswald]}
              >
                Toneo solicitado: {torName}
              </Text>
              <TouchableOpacity
                title="Cerrar Modal"
                style={[styles.loginButton, { width: "50%" }]}
                onPress={() => {
                  setModalSolid(false);
                }}
              >
                <Text style={[styles.loginText, FONTS.oswaldNegrita]}>
                  Aceptar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styless = StyleSheet.create({
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
    paddingVertical: 3,
    color: "black",
  },
  title2: {
    fontSize: 25,
    justifyContent: "center",
    alignItems: "center",
    width: "95%",
    marginBlock: 5,
    backgroundColor: colores.domin_2_5,
    opacity: 0.75,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 3,
    color: "white",
  },
  title3: {
    fontSize: 25,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    width: "96%",
    backgroundColor: colores.domin_2_5,
    opacity: 0.75,
    borderRadius: 5,
    marginRight: 5,
    marginLeft: 5,
    marginTop: 5,
    marginBottom: 0,
    paddingHorizontal: 10,
    paddingVertical: 3,
    color: "white",
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
  card2: {
    backgroundColor: colores.blanco,
    marginVertical: 5,
    marginHorizontal: 1,
    width: "100%",
    height: 350,
    justifyContent: "center",
    alignItems: "center",
  },
  card3: {
    backgroundColor: colores.blanco,
    width: "100%",
    maxHeight: 400,
    marginBottom: 10,
  },
  myScrollContent: {
    paddingBottom: 50,
  },
  list: {
    maxHeight: 250,
    overflow: "scroll",
    width: "95%",
  },
  calendar: {
    width: "100%", // Ocupa el 100% del ancho
    borderWidth: 1,
    borderColor: colores.base_2_4,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 10,
    padding: 10,
    fontFamily: "Oswald_400Regular",
  },
  solid: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginVertical: 10,
    marginHorizontal: 5,
    borderTopColor: colores.base_3_1,
    borderBottomColor: colores.base_3_1,
    borderRadius: 10,
    width: '100%',
  },
  myBorder: {
    width: "100%",
    height: 1,
    backgroundColor: colores.base_1_4,
    borderRadius: 1,
  },
  row1: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 5,
    width: "100%",
  },
  row2: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 5,
    width: "100%",
  },
  row3: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 5,
  },
  barrita: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: 5,
    height: "100%",
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5,
  },
  col: {
    flexDirection: "column",
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  nombre: {
    fontSize: 20,
    fontFamily: "Oswald_400Regular",
  },
  boton: {
    width: "40%",
    paddingVertical: 5,
    paddingHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
    textAlign: 'center',
    paddingBottom: 3,
  },
  image: {
    width: 125,
    height: 125,
    resizeMode: "stretch",
    borderRadius: 15,
  },
  prod: {
    backgroundColor: colores.base_1_1,
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
  aligned1: {
    textAlign: "center",
    fontSize: 18,
  },
  aligned2: {
    textAlign: "center",
    fontSize: 15,
    color: colores.acento_2_1,
  },
});

export default Admin1;
