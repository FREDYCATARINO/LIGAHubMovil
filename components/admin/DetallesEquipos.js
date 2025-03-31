import React, { useEffect } from "react";
import {
  Text,
  Button,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import colores from "../../style/colors";
import FONTS from "../../style/fonts";
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
import { useState } from "react";
import RNPickerSelect from "react-native-picker-select";
import { Picker } from "@react-native-picker/picker";
import api from "../../config/api";

const EquipoScreen = ({ navigation, route }) => {
  const [selectedValue, setSelectedValue] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [playerDate, setPlayerDate] = useState("");

  const [isPressed1, setIsPressed1] = useState(false);
  const [isPressed2, setIsPressed2] = useState(false);
  const [isPressed3, setIsPressed3] = useState(false);

  const handlePressIn1 = () => setIsPressed1(true);
  const handlePressOut1 = () => setIsPressed1(false);

  const handlePressIn2 = () => setIsPressed2(true);
  const handlePressOut2 = () => setIsPressed2(false);

  const handlePressIn3 = () => setIsPressed3(true);
  const handlePressOut3 = () => setIsPressed3(false);

  const [equipos, setEquipos] = useState([]);
  const [loadTeams, setLoadTeams] = useState(false);
  const [falloT, setFalloT] = useState("");
  const [equipoNombre, setEquipoNombre] = useState("");

  const [jugadores, setJugadores] = useState([]);
  const [loadPlayers, setLoadPlayers] = useState(false);
  const [fallo, setFallo] = useState("");
  const [isSelected, setIsSelected] = useState(false);

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

  const { team } = route.params;

  useEffect(() => {
    setLoadTeams(true);
    api
      .get(`/api/equipos/porDueno/${team.usuario.id}`)
      .then((res) => {
        if (res.data.length === 0)
          setFalloT(`${team.nombreCompleto} no tiene equipos disponibles`);
        else setEquipos(res.data);
      })
      .catch((e) => {
        console.error(e, e.res.message);
        if (err.response.status === 403) {
          console.log("⚠️ Token expirado, redirigiendo a login...");
          Alert.alert(
            "Sesión expirada ⚠️",
            "Por favor, inicia sesión nuevamente."
          );
          logout();
          return;
        }
        if (e.res.message) setFalloT(e.res.message);
        else setFalloT("Error al obtener equipos");
      })
      .finally(() => setLoadTeams(false));
  }, []);

  const getPlayers = async (id, name) => {
    setEquipoNombre("");
    setLoadPlayers(true);
    await api
      .get(`/api/jugadores/porEquipo/${id}`)
      .then((res) => {
        if (res.data.length === 0) setFallo("No hay jugadores disponibles");
        else setJugadores(res.data);
      })
      .catch((e) => {
        console.error(e, e.res.message);
        if (err.response.status === 403) {
          console.log("⚠️ Token expirado, redirigiendo a login...");
          Alert.alert(
            "Sesión expirada ⚠️",
            "Por favor, inicia sesión nuevamente."
          );
          logout();
          return;
        }
        if (e.res.message) setFallo(e.res.message);
        else setFallo("Error al obtener jugadores");
      })
      .finally(() => {
        setLoadPlayers(false);
        setIsSelected(true);
        setEquipoNombre(name);
      });
  };

  return (
    <SafeAreaView style={stylesTeamDet.container}>
      <ScrollView
        contentContainerStyle={stylesTeamDet.scrollContent}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={[FONTS.nunitoNegrita, stylesTeamDet.titulo]}
          numberOfLines={2}
        >
          Equipos de {team.nombreCompleto}
        </Text>
        <ScrollView
          horizontal={true}
          style={[stylesTeamDet.scrollContainer, { paddingHorizontal: 2 }]}
          showsHorizontalScrollIndicator={false}
        >
          {loadTeams ? (
            <View>
              <Text
                style={[FONTS.oswald, styles.errMessCenter, { fontSize: 25 }]}
              >
                Cargando equipos...
              </Text>
              <ActivityIndicator size="large" color={colores.domin_1_1} />
            </View>
          ) : falloT === "" ? (
            equipos.map((e) => {
              return (
                <TouchableOpacity
                  style={[stylesTeamDet.box]}
                  onPress={async () => {
                    getPlayers(e.id, e.nombreEquipo);
                  }}
                >
                  <Image
                    source={{ uri: e.logoEquipo }}
                    style={{
                      width: 125,
                      height: 125,
                      resizeMode: "stretch",
                      paddingVertical: 5,
                      borderRadius: 100,
                    }}
                  />
                  <Text
                    style={[FONTS.oswaldNegrita, stylesTeamDet.torneoTitle]}
                  >
                    {e.nombreEquipo}
                  </Text>
                  <Text style={[stylesTeamDet.titulo3, FONTS.oswald]}>
                    Ver jugadores
                  </Text>
                </TouchableOpacity>
              );
            })
          ) : (
            <Text
              style={[FONTS.oswald, styles.errMessCenter, { fontSize: 25 }]}
            >
              {falloT}
            </Text>
          )}
        </ScrollView>
        {!isSelected ? (
          <Text style={[FONTS.nunitoNegrita, stylesTeamDet.titulo, {marginBottom: '50%'}]}>
            Selecciona un equipo para ver jugadores
          </Text>
        ) : (
          <View>
            {equipoNombre !== "" && (
              <Text
                style={[FONTS.nunitoNegrita, stylesTeamDet.titulo2]}
                numberOfLines={2}
              >
                Jugadores del equipo: {equipoNombre}
              </Text>
            )}
            <ScrollView
              style={{ maxHeight: 300, minHeight: 100, padding: 5 }}
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={false}
            >
              {loadPlayers ? (
                <ActivityIndicator
                  size="large"
                  color={colores.domin_1_1}
                  style={{ marginTop: 20 }}
                />
              ) : fallo === "" ? (
                <View style={stylesTeamDet.grid}>
                  {jugadores.map((jugador) => {
                    return (
                      <View style={stylesTeamDet.card} key={jugador.id}>
                        {/* Es importante agregar una key única si es posible */}
                        <View
                          style={
                            jugador.habilitado
                              ? stylesTeamDet.cardHeader
                              : stylesTeamDet.cardHeaderDark
                          }
                        >
                          <TouchableOpacity
                            style={stylesTeamDet.menuIconJ}
                            onPress={() => {
                              setModalVisible(true);
                              setPlayerName(jugador.nombreCompleto);
                              setPlayerDate(jugador.fechaNacimiento);
                            }}
                          >
                            <Ionicons name="menu" size={30} color="black" />
                          </TouchableOpacity>
                        </View>
                        <View style={stylesTeamDet.cardBody}>
                          <Image
                            source={{
                              uri: jugador.fotoJugador,
                              alt: jugador.nombreCompleto,
                            }}
                            style={stylesTeamDet.playerImage}
                          />
                          <Text
                            style={[
                              FONTS.oswaldNegrita,
                              stylesTeamDet.playerNameText,
                            ]}
                          >
                            {jugador.nombreCompleto}
                          </Text>
                          <View style={stylesTeamDet.playerDataRow}>
                            <Text style={[FONTS.oswald, stylesTeamDet.font16]}>
                              Partidos: {jugador.partidosJugados}
                            </Text>
                            <Text style={[FONTS.oswald, stylesTeamDet.font16]}>
                              Expulsado: {jugador.expulsado ? "Si" : "No"}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={
                            jugador.habilitado
                              ? stylesTeamDet.viewActivo
                              : stylesTeamDet.viewInactivo
                          }
                        >
                          <Text
                            style={[
                              FONTS.oswaldNegrita,
                              jugador.habilitado
                                ? stylesTeamDet.textActivo
                                : stylesTeamDet.textInactivo,
                            ]}
                          >
                            {jugador.habilitado ? "ACTIVO" : "¡INACTIVO!"}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
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
        )}
        <TouchableOpacity
          style={stylesTeamDet.buttonBack}
          onPress={() => navigation.goBack()}
        >
          <Text style={[FONTS.oswald, { color: colores.blanco, fontSize: 25 }]}>
            Volver
          </Text>
        </TouchableOpacity>
      </ScrollView>
      {/* Modal con el Picker */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={{
                alignSelf: "flex-end",
                justifyContent: "flex-start",
                marginTop: -10,
                marginRight: -10,
              }}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={24} color={colores.negro} />
            </TouchableOpacity>
            <Text style={[stylesTeamDet.modalTitle, FONTS.oswaldNegrita]}>
              {playerName}
            </Text>
            <TouchableOpacity
              style={[
                stylesTeamDet.modalItem,
                FONTS.oswald,
                isPressed1 && stylesTeamDet.modalItemActive,
              ]}
              disabled
              onPressIn={handlePressIn1}
              onPressOut={handlePressOut1}
            >
              <Text
                style={[
                  FONTS.oswald,
                  isPressed1 && { opacity: 1, color: colores.acento_2_4 },
                ]}
              >
                Fecha de nacimiento: {playerDate}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                stylesTeamDet.modalItem,
                FONTS.oswald,
                isPressed2 && stylesTeamDet.modalItemActive,
              ]}
              disabled
              onPressIn={handlePressIn2}
              onPressOut={handlePressOut2}
            >
              <Text
                style={[
                  FONTS.oswald,
                  isPressed2 && { opacity: 1, color: colores.acento_2_4 },
                ]}
              >
                Amonestaciones: 0
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const stylesTeamDet = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  box: {
    width: 175,
    height: 200,
    marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    padding: 3,
    gap: 2,
    backgroundColor: "#f8f9fa",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  torneoTitle: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 3,
  },
  titulo: { fontSize: 30, width: "90%", textAlign: "center", marginTop: 5 },
  titulo2: { fontSize: 20, textAlign: "center", marginVertical: 5 },
  titulo3: {
    textAlign: "center",
    fontSize: 15,
    color: colores.base_2_1,
  },
  fotoEquipo: { width: 125, height: 125, resizeMode: "stretch" },
  cardDueño: {
    backgroundColor: colores.blanco,
    margin: 5,
    padding: 10,
    width: "100%",
    gap: 5,
  },
  grid: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    width: "100%",
    padding: 5,
    marginBottom: 0,
  },
  card: {
    backgroundColor: colores.blanco,
    marginVertical: 5,
    marginHorizontal: 3,
    width: "48%",
    height: 300,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "column",
    borderRadius: 5,
    borderColor: "black",
  },
  colum: {
    backgroundColor: colores.domin_2_5,
    marginVertical: 5,
    width: "50%",
    height: 120,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 5,
    borderColor: "black",
  },
  row: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexWrap: "wrap",
    width: "100%",
    maxHeight: 215,
    padding: 1,
  },
  duenoText: {
    fontSize: 20,
  },
  duenoDataText: {
    fontSize: 18,
    width: 200,
  },
  duenoDataButton: {
    color: colores.blanco,
    borderRadius: 5,
    paddingVertical: 3,
    backgroundColor: colores.domin_1_2,
    marginTop: 9,
  },
  modalTitle: {
    width: "100%",
    fontSize: 20,
    textAlign: "center",
    marginBottom: 5,
  },
  modalItem: {
    borderRadius: 5,
    width: "100%",
    padding: 5,
    marginVertical: 3,
    paddingRight: 8,
  },
  modalItemActive: {
    backgroundColor: colores.domin_2_5,
    opacity: 0.5,
  },
  cardHeader: {
    backgroundColor: colores.domin_2_5,
    width: "100%",
    height: 100,
    justifyContent: "flex-start",
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    borderBottomRightRadius: 100,
    borderBottomLeftRadius: 100,
    alignItems: "flex-end",
  },
  cardHeaderDark: {
    backgroundColor: colores.base_2_2,
    width: "100%",
    height: 100,
    justifyContent: "flex-start",
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    borderBottomRightRadius: 100,
    borderBottomLeftRadius: 100,
    alignItems: "flex-end",
  },
  menuIconJ: {
    justifyContent: "flex-end",
    marginRight: 3,
    marginTop: 1,
  },
  cardBody: { marginTop: -80, alignItems: "center" },
  playerImage: {
    width: 100,
    height: 100,
    backgroundColor: colores.base_1_1,
    resizeMode: "stretch",
    alignSelf: "center",
    borderRadius: 100,
  },
  playerNameText: { fontSize: 20, textAlign: "center" },
  playerDataRow: {
    flexDirection: "column",
    gap: 5,
    width: "100%",
    alignItems: 'center',
    margin: 5,
  },
  font16: { fontSize: 16 },
  font18: { fontSize: 18 },
  viewActivo: {
    paddingVertical: 5,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  viewInactivo: {
    paddingVertical: 5,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: colores.base_2_3,
    borderColor: colores.base_2_1,
    borderWidth: 2,
    borderRadius: 3,
  },
  textActivo: {
    color: colores.acento_3_1,
  },
  textInactivo: {
    color: colores.base_2_1,
  },
  buttonBack: {
    flexDirection: "row",
    backgroundColor: colores.domin_2_3,
    padding: 5,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    width: "98%",
    marginBottom: 5,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    flexDirection: "row",
    backgroundColor: colores.domin_2_3,
    padding: 5,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: 250,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: "#FF3B30",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },
});
export default EquipoScreen;
