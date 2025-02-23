import React from "react";
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

const EqiposScreen = ({ navigation, route }) => {
  const [selectedValue, setSelectedValue] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [playerName, setPlayerName] = useState("");

  const [isPressed1, setIsPressed1] = useState(false);
  const [isPressed2, setIsPressed2] = useState(false);
  const [isPressed3, setIsPressed3] = useState(false);

  const handlePressIn1 = () => setIsPressed1(true);
  const handlePressOut1 = () => setIsPressed1(false);

  const handlePressIn2 = () => setIsPressed2(true);
  const handlePressOut2 = () => setIsPressed2(false);

  const handlePressIn3 = () => setIsPressed3(true);
  const handlePressOut3 = () => setIsPressed3(false);

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

  return (
    <SafeAreaView style={stylesTeamDet.container}>
      <ScrollView contentContainerStyle={stylesTeamDet.scrollContent}>
        <Text style={[FONTS.nunitoNegrita, stylesTeamDet.titulo]}>
          Detalles del equipo {team.nombre}:
        </Text>
        <Image
          source={{ uri: team.image, alt: team.nombre }}
          style={stylesTeamDet.fotoEquipo}
        />
        <Text style={FONTS.oswald}>id de equipo: #{team.id}</Text>
        <View style={stylesTeamDet.cardDueño}>
          <Text style={[FONTS.nunitoNegrita, stylesTeamDet.titulo]}>
            Detalles del dueño del equipo
          </Text>
          <View style={stylesTeamDet.row}>
            <Image
              source={{
                uri: team.dueno.img,
              }}
              style={{
                width: 125,
                height: 150,
                backgroundColor: colores.base_1_1,
                resizeMode: "stretch",
                alignSelf: "center",
                marginRight: 10,
                borderRadius: 10,
              }}
            />
            <View>
              <Text style={[FONTS.oswaldNegrita, stylesTeamDet.duenoText]}>
                Nombre completo:
              </Text>
              <Text style={[FONTS.nunito, stylesTeamDet.duenoDataText]}>
                {team.dueno.nombre}
              </Text>
              <Text style={[FONTS.oswaldNegrita, stylesTeamDet.duenoText]}>
                Correo electrónico:
              </Text>
              <Text style={[FONTS.nunito, stylesTeamDet.duenoDataText]}>
                {team.dueno.correo}
              </Text>
              <TouchableOpacity style={stylesTeamDet.duenoDataButton}>
                <Text
                  style={[
                    FONTS.oswald,
                    { color: colores.blanco, alignSelf: "center" },
                  ]}
                >
                  Deshabilitar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <Text style={[FONTS.nunitoNegrita, stylesTeamDet.titulo]}>
          Jugadores
        </Text>
        <ScrollView style={{ maxHeight: 350 }}>
          <View style={stylesTeamDet.grid}>
            {team.jugadores.map((jugador) => {
              return (
                <View style={stylesTeamDet.card} key={jugador.id}>
                  {" "}
                  {/* Es importante agregar una key única si es posible */}
                  <View
                    style={
                      jugador.activo
                        ? stylesTeamDet.cardHeader
                        : stylesTeamDet.cardHeaderDark
                    }
                  >
                    <TouchableOpacity
                      style={stylesTeamDet.menuIconJ}
                      onPress={() => {
                        setModalVisible(true);
                        setPlayerName(jugador.nombre);
                      }}
                    >
                      <Ionicons name="menu" size={30} color="black" />
                    </TouchableOpacity>
                  </View>
                  <View style={stylesTeamDet.cardBody}>
                    <Image
                      source={{
                        uri: jugador.img,
                        alt: jugador.nombre,
                      }}
                      style={stylesTeamDet.playerImage}
                    />
                    <Text
                      style={[
                        FONTS.oswaldNegrita,
                        stylesTeamDet.playerNameText,
                      ]}
                    >
                      {jugador.nombre}
                    </Text>
                    <View style={stylesTeamDet.playerDataRow}>
                      <Text style={[FONTS.oswald, stylesTeamDet.font16]}>
                        Partidos: {jugador.partidos}
                      </Text>
                      <Text style={[FONTS.oswald, stylesTeamDet.font16]}>
                        Goles: {jugador.goles}
                      </Text>
                    </View>
                    <Text style={[FONTS.oswald, stylesTeamDet.font18]}>
                      Amonestaciones: {jugador.fallas}
                    </Text>
                  </View>
                  <View
                    style={
                      jugador.activo
                        ? stylesTeamDet.viewActivo
                        : stylesTeamDet.viewInactivo
                    }
                  >
                    <Text
                      style={[
                        FONTS.oswaldNegrita,
                        jugador.activo
                          ? stylesTeamDet.textActivo
                          : stylesTeamDet.textInactivo,
                      ]}
                    >
                      {jugador.activo ? "ACTIVO" : "¡INACTIVO!"}
                    </Text>
                  </View>
                </View>
              );
            })}

            {/*<Picker
          selectedValue={selectedValue}
          onValueChange={(itemValue) => setSelectedValue(itemValue)}
          style={{ height: 50, width: 200 }}
        >
          <Picker.Item label="Opción 1" value="opcion1" />
          <Picker.Item label="Opción 2" value="opcion2" />
          <Picker.Item label="Opción 3" value="opcion3" />
        </Picker>*/}
            {/* Botón para abrir el Picker */}
          </View>
        </ScrollView>
        <TouchableOpacity
          style={stylesTeamDet.buttonBack}
          onPress={() => navigation.navigate("Menú de equipos")}
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
              onPressIn={handlePressIn1}
              onPressOut={handlePressOut1}
            >
              <Text
                style={[
                  FONTS.oswald,
                  isPressed1 && { opacity: 1, color: colores.acento_2_4 },
                ]}
              >
                Editar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                stylesTeamDet.modalItem,
                FONTS.oswald,
                isPressed2 && stylesTeamDet.modalItemActive,
              ]}
              onPressIn={handlePressIn2}
              onPressOut={handlePressOut2}
            >
              <Text
                style={[
                  FONTS.oswald,
                  isPressed2 && { opacity: 1, color: colores.acento_2_4 },
                ]}
              >
                Eliminar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                stylesTeamDet.modalItem,
                FONTS.oswald,
                isPressed3 && stylesTeamDet.modalItemActive,
              ]}
              onPressIn={handlePressIn3}
              onPressOut={handlePressOut3}
            >
              <Text
                style={[
                  FONTS.oswald,
                  isPressed3 && { opacity: 1, color: colores.acento_2_4 },
                ]}
              >
                Expulsar
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  titulo: { fontSize: 20 },
  fotoEquipo: { width: 125, height: 125, resizeMode: "contain" },
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
    marginBottom: 0
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
  playerNameText: { fontSize: 25, textAlign: "center" },
  playerDataRow: {
    flexDirection: "row",
    gap: 5,
    width: "100%",
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
export default EqiposScreen;
