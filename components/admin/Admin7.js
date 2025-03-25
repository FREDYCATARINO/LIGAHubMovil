import React, { useState, useEffect } from "react";
import {
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import api from "../../config/api";
//import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Ionicons } from "@expo/vector-icons";
import FONTS from "../../style/fonts";
import { Picker } from "@react-native-picker/picker";
import formStyle from "../../style/formStyles";
import LottieView from "lottie-react-native";
import colores from "../../style/colors";

import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Admin7 = ({ navigation }) => {
  const [form, setForm] = useState({
    nombre: "",
    fechaInicio: new Date(),
    maxEquipos: "",
    minEquipos: "",
    descripcion: "",
  });
  const [showInicio, setShowInicio] = useState(false);
  const [showFin, setShowFin] = useState(false);

  const [fechaInicio, setFechaInicio] = useState(new Date());

  const [modalVisible, setModalVisible] = useState(false);

  const [show, setShow] = useState(false);

  const { getUserId, getUserRole, getToken, logout } = useContext(AuthContext);

  const [torneo, setTorneo] = useState({});
  const [listaTorneos, setListaTorneos] = useState([]);
  const [loadTorneos, setLoadTorneos] = useState(false);
  const [fallo, setFallo] = useState("");
  const [tokData, setTokData] = useState("");
  const [reload, setReload] = useState(false);
  const [image, setImage] = useState("");
  const [image2, setImage2] = useState("");

  useEffect(() => {
    setTorneo({});
    const getTorneos = async () => {
      setLoadTorneos(true);
      api
        .get(`/api/torneos/espera`)
        .then((res) => {
          if (res.data.length === 0)
            setFallo("No hay torneos en espera, vuelve más tarde");
          else setListaTorneos(res.data);
        })
        .catch((e) => {
          console.error(e, e.response.message);
          if (e.response.status === 403) {
            console.log("⚠️ Token expirado, redirigiendo a login...");
            Alert.alert(
              "Sesión expirada",
              "Por favor, inicia sesión nuevamente."
            );
            logout();
            return;
          }
          if (e.response.message) setFallo(e.response.message);
          else setFallo("Error al obtener pagos");
        })
        .finally(() => setLoadTorneos(false));
    };
    getTorneos();
  }, [reload]);

  const formatDate = (date) => {
    // Convierte la fecha en formato YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Asegura dos dígitos
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleConfirm = (date) => {
    const formattedDate = formatDate(date);
    //onChange(formattedDate); // Actualiza el valor del formulario con formato YYYY-MM-DD
    setShow(false); // Cierra el modal
    setFechaInicio(formattedDate);
    setForm({ ...form, fechaInicio: formattedDate });
  };

  const onChangeFechaInicio = (event, selectedDate) => {
    setShowInicio(false);
    if (selectedDate) {
      setForm({ ...form, fechaInicio: selectedDate });
    }
  };

  const onChangeFechaFin = (event, selectedDate) => {
    setShowFin(false);
    if (selectedDate) {
      setForm({ ...form, fechaFin: selectedDate });
    }
  };

  async function crearConvocatoria() {
    const tokData = await getToken();
    console.log(torneo.id);
    await api
      .post(`/api/convocatorias/publicar/${torneo.id}`, null, {
        headers: {
          Authorization: `Bearer ${tokData}`,
        },
      })
      .then((res) => {
        Alert.alert("Exito", "Convocatoria creada");
        setModalVisible(false);
        setReload(!reload);
        setImage(res.data);
        setImage2("url");
        console.log(res.data)
      })
      .catch((error) => {
        console.error(error, error.response?.data?.message);
        console.log(error.toJSON());
        if (error.response?.status === 403) {
          console.log("⚠️ Token expirado, redirigiendo a login...");
          Alert.alert(
            "Sesión expirada",
            "Por favor, inicia sesión nuevamente."
          );
          logout();
          return;
        }
        Alert.alert("Denegado", "Algo salió mal, intentalo nuevamente");
      });
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={[
            styles.title,
            FONTS.nunitoNegrita,
            {
              paddingVertical: 15,
              paddingHorizontal: 5,
              alignSelf: "flex-start",
            },
          ]}
        >
          Convocatorias
        </Text>
        {image2 && (
          <Image
            source={require("../admin/Publicidad.png")}
            style={styles.banner}
          />
        )}
        <Text style={[FONTS.nunitoNegrita, styles.title2]}>
          Nueva convocatoria
        </Text>
        <View style={styles.formContainer}>
          {image && (
            <View style={styles.imageContainer}>
              <Image
                //source={require("../admin/torneo.png")}
                source={{
                  uri: image,
                }}
                style={styles.torneoImage}
              />
              <Text style={[FONTS.oswald, { fontSize: 18 }]}>
                Resultado final
              </Text>
            </View>
          )}
          {loadTorneos ? (
            <ActivityIndicator
              size="large"
              color={colores.domin_1_1}
              style={{ marginTop: 20 }}
            />
          ) : fallo === "" ? (
            <View>
              <Picker
                selectedValue={torneo}
                onValueChange={(value) => {
                  setTorneo(listaTorneos.find((t) => t.id === value) || {});
                }}
                style={styles.picker}
                itemStyle={FONTS.nunito}
              >
                <Picker.Item label="Elige un torneo" value="" />
                {listaTorneos.map((tor, index) => (
                  <Picker.Item
                    key={index}
                    label={tor.nombreTorneo}
                    value={tor.id}
                  />
                ))}
              </Picker>
              {Object.keys(torneo).length === 0 ? null : (
                <View style={styles.formFields}>
                  {torneo.logoTorneo && (
                    <View style={styles.imageContainer}>
                      <Image
                        source={{ uri: torneo.logoTorneo }}
                        style={{
                          width: 120,
                          height: 120,
                          resizeMode: "stretch",
                        }}
                      />
                      <Text style={[FONTS.oswald, { fontSize: 18 }]}>
                        Logo del torneo
                      </Text>
                    </View>
                  )}
                  <View style={styles.row}>
                    <TextInput
                      style={[FONTS.oswald, styles.input, { width: "100%" }]}
                      placeholder="Nombre"
                      value={torneo.nombreTorneo ? torneo.nombreTorneo : ""}
                      placeholderTextColor={colores.domin_2_2}
                      readOnly={true}
                    />
                  </View>
                  <View style={styles.row}>
                    <TextInput
                      style={[
                        FONTS.oswald,
                        styles.input,
                        { width: "100%", height: 80 }, // Ajusta la altura
                      ]}
                      placeholder="Premio"
                      value={torneo.premio ? torneo.premio : ""}
                      placeholderTextColor={colores.domin_2_2}
                      editable={false}
                      multiline={true}
                      numberOfLines={2}
                      textAlignVertical="top"
                      ellipsizeMode="tail"
                    />
                  </View>
                  <View style={styles.row}>
                    <View
                      style={{ flexDirection: "row", width: "100%", gap: 5 }}
                    >
                      {/* <TouchableOpacity
                  style={[
                    {
                      backgroundColor: colores.domin_2_2,
                      borderRadius: 5,
                      width: "19%",
                      alignItems: "center",
                      justifyContent: "center",
                    },
                  ]}
                  onPress={() => setShow(true)}
                >
                  <Ionicons name="calendar" size={24} color={"white"} />
                </TouchableOpacity> */}

                      <View style={{ flexDirection: "column", width: "100%" }}>
                        <TextInput
                          placeholder="Fecha de inicio"
                          placeholderTextColor={colores.domin_2_2}
                          value={torneo.fechaInicio ? torneo.fechaInicio : ""}
                          style={[styles.input]}
                          readOnly={true}
                        />

                        {/* {errors.fechaInicio && (
                    <Text style={[formStyle.errText]}>
                      {errors.fechaInicio.message}
                    </Text>
                  )} */}
                      </View>

                      <DateTimePickerModal
                        isVisible={show}
                        mode="date"
                        themeVariant="dark"
                        accentColor={colores.domin_1_1}
                        textColor={colores.domin_1_1}
                        onConfirm={(date) => handleConfirm(date)}
                        onCancel={() => setShow(false)}
                      />
                    </View>
                  </View>
                  <View style={[styles.row, { gap: 2 }]}>
                    <TextInput
                      style={[FONTS.oswald, styles.input, { width: "49%" }]}
                      placeholder="Max. equipos"
                      value={
                        torneo.maxEquipos ? torneo.maxEquipos.toString() : ""
                      }
                      placeholderTextColor={colores.domin_2_2}
                      readOnly={true}
                    />
                    <TextInput
                      style={[FONTS.oswald, styles.input, { width: "49%" }]}
                      placeholder="Min. equipos"
                      value={
                        torneo.minEquipos ? torneo.minEquipos.toString() : ""
                      }
                      placeholderTextColor={colores.domin_2_2}
                      readOnly={true}
                    />
                    {/* <TouchableOpacity style={styles.imageUploadButton}>
                <Text style={[FONTS.oswald, styles.imageUploadText]}>
                  Elegir imagen
                </Text>
              </TouchableOpacity> */}
                  </View>
                  <TextInput
                    style={[styles.input, { height: 100 }, FONTS.oswald]}
                    placeholder="Descripción"
                    multiline
                    numberOfLines={4}
                    value={torneo.descripcion ? torneo.descripcion : ""}
                    readOnly={true}
                    placeholderTextColor={colores.domin_2_2}
                  />
                </View>
              )}
            </View>
          ) : (
            <View>
              <LottieView
                source={require("../../assets/confetti.json")}
                autoPlay
                loop
                style={styles.icon}
                speed={1}
                color={colores.base_3_1}
              />
              <Text
                style={[
                  FONTS.nunitoNegrita,
                  styles.errMessCenter,
                  {
                    marginTop: 10,
                    fontSize: 30,
                    alignContent: "center",
                    width: "100%",
                    textAlign: "center",
                  },
                ]}
              >
                ¡Yuju!
              </Text>
              <Text
                style={[
                  FONTS.oswald,
                  styles.errMessCenter,
                  {
                    marginTop: 10,
                    fontSize: 20,
                    alignContent: "center",
                    width: "100%",
                    textAlign: "center",
                  },
                ]}
              >
                {fallo}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.buttonContainer}>
          {image && (
            <TouchableOpacity
              style={styles.previewButton}
              onPress={() => {
                setImage("");
                setImage2("");
              }}
            >
              <Text style={[FONTS.oswaldNegrita, styles.buttonText]}>
                Reestablecer
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[
              styles.publishButton,
              { opacity: Object.keys(torneo).length === 0 ? 0.5 : 1 },
            ]}
            disabled={Object.keys(torneo).length === 0 ? true : false}
            onPress={() => {
              console.log(torneo);
              setModalVisible(true);
            }}
          >
            <Text style={[FONTS.oswaldNegrita, styles.buttonText]}>
              Publicar
            </Text>
          </TouchableOpacity>
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={stylesModal.modalContainer}>
            <View style={stylesModal.modalContent}>
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
              <Ionicons
                name="help-circle"
                size={48}
                color={colores.acento_3_1}
              />
              <Text style={[stylesModal.modalTitle, FONTS.oswaldNegrita]}>
                ¿Crear convocatoria para {torneo.nombreTorneo}?
              </Text>
              <View style={stylesModal.modalButRow}>
                <TouchableOpacity
                  style={[stylesModal.buttonBack, FONTS.oswald]}
                  onPress={async () => crearConvocatoria()}
                >
                  <Text style={[stylesModal.buttonText, FONTS.oswald]}>Si</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[stylesModal.buttonBack, FONTS.oswald]}
                  onPress={() => {
                    setModalVisible(false);
                  }}
                >
                  <Text style={[stylesModal.buttonText, FONTS.oswald]}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const stylesModal = StyleSheet.create({
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
  modalContent2: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: 300,
    gap: 5,
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
  modalTitle: {
    width: "100%",
    fontSize: 18,
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
  buttonBack: {
    flexDirection: "row",
    backgroundColor: colores.domin_2_3,
    padding: 5,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    width: "50%",
    marginBottom: 5,
  },
  modalButRow: {
    flexDirection: "row",
    width: "100%",
    gap: 5,
    justifyContent: "center",
  },
  buttonText: {
    color: colores.blanco,
    alignItems: "center",
  },
  modalText: {
    textAlign: "justify",
    paddingVertical: 10,
  },
  modalDato: {
    width: "100%",
  },
  fotoEquipo: { width: 100, height: 100, resizeMode: "contain" },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  scrollContent: { flexGrow: 1, padding: 20 },
  title: { fontSize: 30, marginBottom: 20 },
  title2: { fontSize: 22, marginBottom: 20 },
  banner: {
    width: "100%",
    height: 100,
    resizeMode: "contain",
    marginBottom: 20,
  },
  formContainer: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    elevation: 3,
  },
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 10,
    backgroundColor: colores.base_2_5,
    borderRadius: 5,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  imageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
  },
  torneoImage: { width: 150, height: 200, resizeMode: "contain" },
  formFields: { flex: 2 },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  input: {
    borderColor: colores.domin_2_2,
    borderWidth: 3,
    borderRadius: 5,
    fontFamily: "Oswald_400Regular",
    color: colores.negro,
    backgroundColor: colores.base_2_5,
  },
  textArea: { height: 80, textAlignVertical: "top" },
  imageUploadButton: {
    flex: 1,
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colores.domin_2_2,
    borderRadius: 5,
  },
  imageUploadText: { color: "white" },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  previewButton: {
    backgroundColor: colores.acento_4_1,
    padding: 10,
    borderRadius: 5,
  },
  publishButton: {
    backgroundColor: colores.domin_2_5,
    padding: 10,
    borderRadius: 5,
  },
  buttonText: { color: "#fff", textAlign: "center" },
});

export default Admin7;
