import React from "react";
import {
  Text,
  Button,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  Modal,
  Image,
  TextInput,
  ActivityIndicator,
  Platform,
} from "react-native";
import formStyle from "../../style/formStyles";
//import DateTimePicker from "@react-native-community/datetimepicker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
//import { TextInput } from "react-native-paper";
import WebView from "react-native-webview";
import { useRef, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
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
import LottieView from "lottie-react-native";
import { Checkbox } from "react-native-paper";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../config/api";
import { useForm, Controller, set } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import * as ImagePicker from "expo-image-picker";

const Admin3 = ({ navigation, mode = "date", display = "default" }) => {
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [modalVisible3, setModalVisible3] = useState(false);
  const [tournamentName, setTournamentName] = useState("");
  const [tournamentData, setTournamentData] = useState({});
  const [logoTorneo, setLogoTorneo] = useState("null");
  const [checked, setChecked] = useState(false);
  const [counter, setCounter] = useState(0);

  const [torneos, setTorneos] = useState([]);
  const [loadTors, setLoadTors] = useState(false);
  const [falloT, setFalloT] = useState("");
  const [estado, setEstado] = useState("");

  const [image, setImage] = useState(null);

  const ordenEstados = ["En Juego", "En Espera", "Finalizado"];

  const torneo = yup.object().shape({
    nombreTorneo: yup.string().required("El nombre es requerido"),
    descripcion: yup
      .string()
      .max(500, "Tamaño de descripción excedido")
      .required("La descripción del torneo es requerida"),
    fechaInicio: yup
      .date()
      .min(new Date(), "Se requiere una fecha de inicio")
      .required("La fecha de inicio es requerida"),
    maxEquipos: yup
      .number()
      .typeError("Debe ser un número")
      .integer("Se requiere un máximo de equipos entero")
      .min(2, "Debe ser al menos 2")
      .test("es-par", "El número debe ser par", (value) => value % 2 === 0)
      .required("Este campo es obligatorio"),
    minEquipos: yup
      .number()
      .typeError("Debe ser un número")
      .integer("Se requiere un mínimo de equipos entero")
      .min(2, "Debe ser al menos 2")
      .test("es-par", "El número debe ser par", (value) => value % 2 === 0)
      .required("Este campo es obligatorio"),
    equiposLiguilla: yup
      .number()
      .typeError("Debe ser un número")
      .integer("Debe ser un número entero")
      .required("Debes especificar cuántos pasan a liguilla"),

    vueltas: yup
      .number()
      .typeError("Debe ser un número")
      .integer("Debe ser un número entero")
      .required("Se requieren las vueltas"),
    premio: yup.string().required("Se requiere especificar premio"),
  });

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(torneo),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    console.log(data);
    if (!image || typeof image !== "string" || !image.startsWith("file://")) {
      console.log("Error: No hay imagen seleccionada.");
      return Alert.alert("Error", "Debes seleccionar una imagen válida.");
    }

    await registrarTorneo(data, image)
  };

  const [showInicio, setShowInicio] = useState(false);
  const [showFin, setShowFin] = useState(false);

  const [fechaInicio, setFechaInicio] = useState(new Date());

  const [show, setShow] = useState(false);

  const formatDate = (date) => {
    // Convierte la fecha en formato YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Asegura dos dígitos
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleConfirm = (date, onChange) => {
    const formattedDate = formatDate(date);
    onChange(formattedDate); // Actualiza el valor del formulario con formato YYYY-MM-DD
    setShow(false); // Cierra el modal
  };

  const getEstado = (nombre) => {
    for (let i = 0; i < ordenEstados.length; i++) {
      if (nombre.toLowerCase().includes(ordenEstados[i].toLowerCase())) {      
        return i;
      }
    }
    return ordenEstados.length;
  };

  const registrarTorneo = async (data, image) => {
      const formData = new FormData();
      
      formData.append("arbitro", JSON.stringify({
        email: "arbitro@example.com",
        password: "123",
        nombreCompleto: "Árbitro Test 1",
      }));
    
      formData.append("imagen", {
        uri: image,
        name: "arbitro.png",
        type: "image/png",
      });
    
      try {
        const response = await axios.post("http://192.168.1.67:8080/api/torneos", formData, {
          headers: {
            Authorization: `Bearer ${tokData}`,
            "Content-Type": "multipart/form-data",
          },
          transformRequest: (data) => data, // Devuelve directamente el FormData
        });
        console.log(response.data);
      } catch (error) {
        console.error("Error:", error.response.data || error || error.response);
      }
    };  

  const getEstadoType = (name) => {
    for (let i = 0; i < ordenEstados.length; i++) {
      if (name.includes(ordenEstados[i])) {
        return ordenEstados[i];
      }
    }
    return "";
  };

  const torneosOrdenados = torneos.sort((a, b) => {
    const estadoA = getEstado(a.nombreTorneo);
    const estadoB = getEstado(b.nombreTorneo);

    if (estadoA !== estadoB) {
      return estadoA - estadoB;
    }

    const fechaA = new Date(a.fechaInicio);
    const fechaB = new Date(b.fechaInicio);

    return fechaA - fechaB;
  });

  //Borrar despues
  const setLog = () => {
    setLogoTorneo("../../assets/EquiposLogos/LogoDefault.png");
  };

  useEffect(() => {
    setLog;
  }, []);

  useEffect(() => {
    // const getUserAll = async () => {
    //   const id = await getUserRole();
    //   const rolo = await getUserId();
    //   const tok = await getToken();
    //   setTokData(tok);

    //   setLoadSolids(true);
    //   api
    //     .get(`/api/solicitudes/admin/pendientes`, {
    //       headers: {
    //         Authorization: `Bearer ${tok}`,
    //       },
    //     })
    //     .then((res) => {
    //       if (res.data.length === 0) setFallo("No hay solicitudes pendientes");
    //       else setSolicitudes(res.data);
    //     })
    //     .catch((e) => {
    //       console.error(e, e.res.message);
    //       if (e.res.message) setFallo(e.res.message);
    //       else setFallo("Error al obtener solicitudes");
    //     })
    //     .finally(() => setLoadSolids(false));
    // };
    // getUserAll();

    setLoadTors(true);
    api
      .get(`/api/torneos`)
      .then((res) => {
        if (res.data.length === 0)
          setFalloT("No hay torneos iniciados todavía");
        else setTorneos(res.data);
      })
      .catch((e) => {
        console.error(e, e.res.message);
        if (err.response.status === 403) {
          console.log("⚠️ Token expirado, redirigiendo a login...");
          Alert.alert(
            "Sesión expirada",
            "Por favor, inicia sesión nuevamente."
          );
          logout();
          return;
        }
        if (e.res.message) setFalloT(e.res.message);
        else setFalloT("Error al obtener torneos");
      })
      .finally(() => setLoadTors(false));
  }, []);

  const showModal1 = (name) => {
    setModalVisible1(true);
    setModalVisible2(false);
    setModalVisible3(false);
    setTournamentName(name);
  };

  const showModal2 = (name) => {
    setModalVisible1(false);
    setModalVisible2(true);
    setModalVisible3(false);
    setTournamentName(name);
  };

  const showModal3 = (name, tor) => {
    setModalVisible1(false);
    setModalVisible2(false);
    setModalVisible3(true);
    setTournamentName(name);
    setTournamentData(tor);
  };

  const getEstilo = (nombreTorneo, motivo) => {
    if (motivo !== null) return stylesAdmin3.torneoCancelado; // Si tiene motivo, está cancelado

    const estado = getEstado(nombreTorneo); // Obtener el índice del estado

    switch (estado) {
      case 0: // "En Juego"
        return stylesAdmin3.torneoActivo;
      case 1: // "En Espera"
        return stylesAdmin3.torneoInactivo;
      case 2: // "Finalizado"
        return stylesAdmin3.torneoFinalizado;
      default:
        return styles.defaultText;
    }
  };

  // Crear una referencia para el ScrollView
  const scrollViewRef = useRef(null);

  // Crear referencias para cada componente al que te quieres desplazar
  const sectionOneRef = useRef(null);

  const handleScroll = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 450, animated: true }); // Ajusta 'y' a la posición deseada
    }
  };

  // Función para abrir la galería
  const openGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permiso denegado",
        "Necesitas permitir el acceso a la galería."
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      console.log(
        "Uri seleccionada:",
        imageUri,
        " Imagen seleccionada: ",
        result.assets[0]
      ); // Depuración
      setImage(imageUri);
      // setForm({ ...form, imagen: imageUri });
      // setValue("imagen", imageUri); // Actualiza react-hook-form
      // trigger("imagen"); // Valida la imagen
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        ref={scrollViewRef}
      >
        <View
          style={{
            flexDirection: "row",
            gap: 5,
            alignItems: "center",
            width: "95%",
            justifyContent: "flex-start",
          }}
        >
          <Text
            style={[
              styles.TextField,
              stylesAdmin3.title,
              FONTS.nunitoNegrita,
              { paddingVertical: 15, paddingHorizontal: 5 },
            ]}
          >
            Torneos
          </Text>
          <TouchableOpacity onPress={handleScroll}>
            <Ionicons
              name="add-circle-sharp"
              size={30}
              color={colores.acento_2_2}
            />
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal={true}
          style={[stylesAdmin3.scrollContainer, { paddingHorizontal: 2 }]}
          showsHorizontalScrollIndicator={false}
        >
          {/*<WebView
                originWhitelist={["*"]}
                source={{
                  html: `<script src="https://cdn.lordicon.com/lordicon.js"></script>
          <lord-icon
              src="https://cdn.lordicon.com/lewtedlh.json"
              trigger="loop"
              stroke="bold"
              state="loop-roll"
              colors="primary:#242424,secondary:#c71f16"
              style="width:450px;height:450px;align-items:center;justify-content:center">
          </lord-icon>`,
                }}
                style={styles.webview}
              />*/}

          {loadTors ? (
            <View>
              <Text
                style={[FONTS.oswald, styles.errMessCenter, { fontSize: 25 }]}
              >
                Cargando torneos...
              </Text>
              <ActivityIndicator size="large" color={colores.domin_1_1} />
            </View>
          ) : falloT === "" ? (
            torneosOrdenados.map((tor) => {
              return (
                <TouchableOpacity
                  style={[
                    stylesAdmin3.box,
                    getEstilo(tor.nombreTorneo, tor.motivoFinalizacion),
                  ]}
                  onPress={() =>
                    tor.esliguilla ? showModal3(tor.nombreTorneo, tor) : null
                  }
                  key={tor.id}
                >
                  <View style={stylesAdmin3.boxHeader} key={tor.id}>
                    <Text style={[stylesAdmin3.textHead1, FONTS.oswaldNegrita]}>
                      A liguilla: {tor.equiposLiguilla}
                    </Text>
                    <Text style={[stylesAdmin3.textHead2, FONTS.oswald]}>
                      {tor.fechaInicio}
                    </Text>
                  </View>
                  <View style={stylesAdmin3.lordContainer}>
                    {tor.logoTorneo === "" ? (
                      <LottieView
                        source={require("../../assets/copa.json")}
                        autoPlay
                        loop
                        style={stylesAdmin3.icon}
                        speed={1}
                        color={colores.base_3_1}
                      />
                    ) : (
                      <Image
                        source={{ uri: tor.logoTorneo }}
                        style={{
                          width: 150,
                          height: 125,
                          resizeMode: "stretch",
                          paddingVertical: 5,
                          borderRadius: 15,
                        }}
                      />
                    )}
                  </View>
                  <Text style={[FONTS.oswaldNegrita, stylesAdmin3.torneoTitle]}>
                    Torneo "{tor.nombreTorneo}"
                  </Text>
                  {tor.motivoFinalizacion !== null ? (
                    <View style={stylesAdmin3.cancel}>
                      <Text style={[FONTS.oswaldNegrita, stylesAdmin3.redText]}>
                        Cancelado debido a: {tor.motivoFinalizacion}
                      </Text>
                    </View>
                  ) : (
                    <View>
                      {getEstadoType(tor.nombreTorneo) === "Finalizado" ? (
                        <Text style={[FONTS.oswald, stylesAdmin3.torneoDet]}>
                          Ganador: {tor.ganador}
                        </Text>
                      ) : null}
                    </View>
                  )}
                  {tor.esliguilla ? (
                    <View style={stylesAdmin3.successBack}>
                      <Text
                        style={[FONTS.oswaldNegrita, stylesAdmin3.successText]}
                      >
                        En liguilla
                      </Text>
                    </View>
                  ) : (
                    <View style={stylesAdmin3.botonRow}>
                      <TouchableOpacity
                        style={stylesAdmin3.botTorneo}
                        onPress={() =>
                          getEstadoType(tor.nombreTorneo) === "En Juego"
                            ? alert("Hola")
                            : showModal3(tor.nombreTorneo, tor)
                        }
                      >
                        <Text
                          style={[FONTS.oswald, stylesAdmin3.botonTorneoText]}
                        >
                          {getEstadoType(tor.nombreTorneo) === "En Juego"
                            ? "Editar"
                            : "Detalles"}
                        </Text>
                      </TouchableOpacity>

                      {getEstadoType(tor.nombreTorneo) ===
                      "Finalizado" ? null : (
                        <TouchableOpacity
                          style={stylesAdmin3.botTorneo}
                          onPress={() =>
                            tor.estado === "En Juego"
                              ? showModal1(tor.nombreTorneo)
                              : showModal2(tor.nombreTorneo)
                          }
                        >
                          <Text
                            style={[FONTS.oswald, stylesAdmin3.botonTorneoText]}
                          >
                            {getEstadoType(tor.nombreTorneo) === "En Espera"
                              ? "Iniciar"
                              : getEstadoType(tor.nombreTorneo) === "En Juego"
                              ? "Cancelar"
                              : "Remover"}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
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

          {/* <TouchableOpacity
            style={[stylesAdmin3.box, { backgroundColor: "#ff6666" }]}
          >
            <Text style={stylesAdmin3.text}>1</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[stylesAdmin3.box, { backgroundColor: "#ffcc66" }]}
          >
            <Text style={stylesAdmin3.text}>2</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[stylesAdmin3.box, { backgroundColor: "#66ff66" }]}
          >
            <Text style={stylesAdmin3.text}>3</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[stylesAdmin3.box, { backgroundColor: "#66ccff" }]}
          >
            <Text style={stylesAdmin3.text}>4</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[stylesAdmin3.box, { backgroundColor: "#9966ff" }]}
          >
            <Text style={stylesAdmin3.text}>5</Text>
          </TouchableOpacity> */}
        </ScrollView>
        <View ref={sectionOneRef}></View>
        <Text
          style={[
            styles.TextField,
            stylesAdmin3.title,
            FONTS.nunitoNegrita,
            { paddingVertical: 15, paddingHorizontal: 5 },
          ]}
        >
          Nuevo torneo
        </Text>
        <View style={stylesAdmin3.form}>
          <Text style={[FONTS.oswald, { alignSelf: "flex-start" }]}>
            Logo del torneo
          </Text>
          <View style={{ alignItems: "center", gap: 5, paddingVertical: 5 }}>
            <Image
              source={
                image
                  ? { uri: image }
                  : require("../../assets/EquiposLogos/LogoDefault.png")
              }
              style={{
                width: 175,
                height: 175,
                resizeMode: "stretch",
                borderRadius: 15,
              }}
            />
            <TouchableOpacity
              style={stylesAdmin3.botTorneo}
              onPress={openGallery}
            >
              <Text style={[FONTS.oswald, stylesAdmin3.botonTorneoText]}>
                Elegir una imagen
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={[FONTS.oswald, { alignSelf: "flex-start" }]}>
            Datos del torneo
          </Text>
          <Controller
            control={control}
            name="nombreTorneo"
            render={({ field: { onChange, value } }) => (
              <>
                <TextInput
                  placeholder="Nombre del torneo"
                  placeholderTextColor={colores.domin_2_2}
                  style={stylesAdmin3.input}
                  value={value}
                  onChangeText={(text) => onChange(text)}
                />
                {errors.nombreTorneo && (
                  <Text style={formStyle.errText}>
                    {errors.nombreTorneo.message}
                  </Text>
                )}
              </>
            )}
          />
          <Controller
            control={control}
            name="descripcion"
            render={({ field: { onChange, value } }) => (
              <>
                <TextInput
                  placeholder="Descripción del torneo"
                  placeholderTextColor={colores.domin_2_2}
                  multiline
                  numberOfLines={4}
                  value={value}
                  onChangeText={(text) => onChange(text)}
                  style={[stylesAdmin3.input, { height: 120 }]}
                />
                {errors.descripcion && (
                  <Text style={[formStyle.errText]}>
                    {errors.descripcion.message}
                  </Text>
                )}
              </>
            )}
          />
          <Controller
            control={control}
            name="premio"
            render={({ field: { onChange, value } }) => (
              <>
                <TextInput
                  placeholder="Premio disputado"
                  placeholderTextColor={colores.domin_2_2}
                  value={value}
                  onChangeText={(text) => onChange(text)}
                  style={stylesAdmin3.input}
                />
                {errors.premio && (
                  <Text style={[formStyle.errText]}>
                    {errors.premio.message}
                  </Text>
                )}
              </>
            )}
          />
          <View style={{ flexDirection: "row", width: "100%", gap: 5 }}>
            <Controller
              control={control}
              name="fechaInicio"
              render={({ field: { onChange, value } }) => (
                <>
                  <TouchableOpacity
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
                  </TouchableOpacity>

                  <View style={{ flexDirection: "column", width: "79%" }}>
                    <TextInput
                      placeholder="Seleccionar fecha"
                      placeholderTextColor={colores.domin_2_2}
                      value={value}
                      style={[stylesAdmin3.input]}
                    />

                    {/* <Text style={styles.fechaTexto}>
                    {value || "Seleccionar Fecha"}{" "}
                  </Text> */}

                    {errors.fechaInicio && (
                      <Text style={[formStyle.errText]}>
                        {errors.fechaInicio.message}
                      </Text>
                    )}
                  </View>

                  <DateTimePickerModal
                    isVisible={show}
                    mode="date"
                    themeVariant="dark" // Usa el tema oscuro en iOS
                    accentColor={colores.domin_1_1}
                    textColor={colores.domin_1_1}
                    onConfirm={(date) => handleConfirm(date, onChange)}
                    onCancel={() => setShow(false)}
                  />
                </>
              )}
            />
          </View>
          <View style={{ flexDirection: "row", width: "100%", gap: 5 }}>
            <Controller
              control={control}
              name="maxEquipos"
              render={({ field: { onChange, value } }) => (
                <View style={{ flexDirection: "column", width: "33%" }}>
                  <TextInput
                    placeholder="Máximo de equipos"
                    placeholderTextColor={colores.domin_2_2}
                    keyboardType="numeric"
                    value={value}
                    onChangeText={(text) => onChange(text)}
                    style={[stylesAdmin3.input, {}]}
                  />
                  {errors.maxEquipos && (
                    <Text style={[formStyle.errText]}>
                      {errors.maxEquipos.message}
                    </Text>
                  )}
                </View>
              )}
            />
            <Controller
              control={control}
              name="minEquipos"
              style={{ flexDirection: "column" }}
              render={({ field: { onChange, value } }) => (
                <View style={{ flexDirection: "column", width: "33%" }}>
                  <TextInput
                    placeholder="Mínimo de equipos"
                    placeholderTextColor={colores.domin_2_2}
                    keyboardType="numeric"
                    value={value}
                    onChangeText={(text) => onChange(text)}
                    style={[stylesAdmin3.input, {}]}
                  />
                  {errors.minEquipos && (
                    <Text style={[formStyle.errText]}>
                      {errors.minEquipos.message}
                    </Text>
                  )}
                </View>
              )}
            />
            <Controller
              control={control}
              name="vueltas"
              style={{ flexDirection: "column" }}
              render={({ field: { onChange, value } }) => (
                <View style={{ flexDirection: "column", width: "31%" }}>
                  <TextInput
                    placeholder="Vueltas"
                    placeholderTextColor={colores.domin_2_2}
                    keyboardType="numeric"
                    value={value}
                    onChangeText={(text) => onChange(text)}
                    style={[stylesAdmin3.input, {}]}
                  />
                  {errors.vueltas && (
                    <Text style={[formStyle.errText]}>
                      {errors.vueltas.message}
                    </Text>
                  )}
                </View>
              )}
            />
          </View>
        </View>
        {/*<View style={stylesAdmin3.grid}>
          <View style={stylesAdmin3.card}>Hola</View>
          <View style={stylesAdmin3.card}>Hola</View>
          <View style={stylesAdmin3.card}>Hola</View>
          <View style={stylesAdmin3.card}>Hola</View>
        </View>*/}
        <View
          style={{
            alignItems: "center",
            gap: 5,
            paddingVertical: 5,
            width: "100%",
          }}
        >
          <TouchableOpacity
            style={stylesAdmin3.botTorneo}
            onPress={handleSubmit(onSubmit)}
          >
            <Text style={[FONTS.oswald, stylesAdmin3.botonTorneoText]}>
              Crear Torneo
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible1}
        onRequestClose={() => setModalVisible1(false)}
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
              onPress={() => setModalVisible1(false)}
            >
              <Ionicons name="close" size={24} color={colores.negro} />
            </TouchableOpacity>
            <Ionicons name="alert-circle" size={48} color={colores.domin_2_1} />
            <Text style={[stylesModal.modalTitle, FONTS.oswaldNegrita]}>
              ¿Cancelar torneo?
            </Text>
            <Text style={[FONTS.oswald, stylesModal.modalText]}>
              Esta acción tendrá consecuencias, todos los partidos se
              cancelarán, y no podras volver a anular esta acción
            </Text>
            <Text style={[FONTS.oswald, stylesModal.modalText]}>
              ¿Deseas cancelar el torneo?
            </Text>
            <View style={stylesModal.modalButRow}>
              <TouchableOpacity
                style={[stylesModal.buttonBack, FONTS.oswald]}
                onPress={() => setModalVisible2(false)}
              >
                <Text style={[stylesModal.buttonText, FONTS.oswald]}>
                  Cancelar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[stylesModal.buttonBack, FONTS.oswald]}
                onPress={() => setModalVisible2(false)}
              >
                <Text style={[stylesModal.buttonText, FONTS.oswald]}>
                  Cancelar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible2}
        onRequestClose={() => setModalVisible2(false)}
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
              onPress={() => setModalVisible2(false)}
            >
              <Ionicons name="close" size={24} color={colores.negro} />
            </TouchableOpacity>
            <Ionicons name="help" size={48} color={colores.domin_2_1} />
            <Text style={[stylesModal.modalTitle, FONTS.oswaldNegrita]}>
              ¿Eliminar torneo?
            </Text>
            <Text style={[FONTS.oswald, stylesModal.modalText]}>
              Esta acción es permanente, ya no podras ver más detallles de este
              torneo nuevamente
            </Text>
            <View style={stylesModal.modalButRow}>
              <TouchableOpacity
                style={[stylesModal.buttonBack, FONTS.oswald]}
                onPress={() => setModalVisible2(false)}
              >
                <Text style={[stylesModal.buttonText, FONTS.oswald]}>
                  Eliminar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[stylesModal.buttonBack, FONTS.oswald]}
                onPress={() => setModalVisible2(false)}
              >
                <Text style={[stylesModal.buttonText, FONTS.oswald]}>
                  Cancelar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible3}
        onRequestClose={() => setModalVisible3(false)}
      >
        <View style={stylesModal.modalContainer}>
          <View style={stylesModal.modalContent2}>
            <TouchableOpacity
              style={{
                alignSelf: "flex-end",
                justifyContent: "flex-start",
                marginTop: -10,
                marginRight: -10,
              }}
              onPress={() => setModalVisible3(false)}
            >
              <Ionicons name="close" size={24} color={colores.negro} />
            </TouchableOpacity>
            <Text style={[stylesModal.modalTitle, FONTS.oswaldNegrita]}>
              Torneo "{tournamentName}"
            </Text>
            {tournamentData.logoTorneo ? (
              <Image
                source={{ uri: tournamentData.logoTorneo }}
                style={{
                  width: 100,
                  height: 100,
                  resizeMode: "stretch",
                  paddingVertical: 5,
                  borderRadius: 15,
                }}
              />
            ) : (
              <LottieView
                source={require("../../assets/copa.json")}
                autoPlay
                loop
                style={{ width: 100, height: 100, alignSelf: "center" }}
                speed={1}
                color={colores.base_3_1}
              />
            )}
            <Text style={[FONTS.oswaldNegrita, stylesModal.modalDato]}>
              Fecha de inicio:{" "}
              <Text style={FONTS.oswald}>{tournamentData.fechaInicio}</Text>
            </Text>
            <Text style={[FONTS.oswaldNegrita, stylesModal.modalDato]}>
              Fecha de fin:{" "}
              <Text style={FONTS.oswald}>{tournamentData.fechaFin}</Text>
            </Text>
            <Text style={[FONTS.oswaldNegrita, stylesModal.modalDato]}>
              Vueltas:{" "}
              <Text style={FONTS.oswald}>{tournamentData.vueltas}</Text>
            </Text>
            <Text style={[FONTS.oswaldNegrita, stylesModal.modalDato]}>
              Descripción:{" "}
              <Text style={FONTS.oswald}>{tournamentData.descripcion}</Text>
            </Text>
            <Text style={[FONTS.oswaldNegrita, stylesModal.modalDato]}>
              Max: <Text style={FONTS.oswald}>{tournamentData.maxEquipos}</Text>
            </Text>
            <Text style={[FONTS.oswaldNegrita, stylesModal.modalDato]}>
              Min: <Text style={FONTS.oswald}>{tournamentData.minEquipos}</Text>
            </Text>
            <Text style={[FONTS.oswaldNegrita, stylesModal.modalDato]}>
              Premio: <Text style={FONTS.oswald}>{tournamentData.premio}</Text>
            </Text>
            <TouchableOpacity
              style={[
                stylesModal.buttonBack,
                FONTS.oswald,
                { backgroundColor: colores.acento_3_1 },
              ]}
              onPress={() => setModalVisible3(false)}
            >
              <Text style={[stylesModal.buttonText, FONTS.oswald]}>Volver</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    gap: 5,
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

const stylesAdmin3 = StyleSheet.create({
  container: { flex: 1, gap: 5 },
  scrollContent: {
    flexGrow: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    margin: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    alignItems: "flex-start",
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
    marginTop: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  box: {
    width: 250,
    height: 350,
    marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    padding: 10,
    gap: 3,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  torneoTitle: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 3,
  },
  lordContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 120,
    height: 120,
  },
  boxHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 5,
    paddingBottom: 3,
  },
  textHead1: {
    alignSelf: "flex-start",
    justifyContent: "flex-start",
    fontSize: 18,
  },
  textHead2: {
    alignSelf: "flex-end",
    justifyContent: "flex-start",
    fontSize: 18,
  },
  botonRow: {
    width: "100%",
    paddingHorizontal: 5,
    paddingVertical: 10,
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  botTorneo: {
    width: "50%",
    backgroundColor: colores.domin_2_2,
    paddingVertical: 5,
    gap: 5,
    borderRadius: 5,
    alignItems: "center",
  },
  botonTorneoText: {
    fontSize: 18,
    color: colores.blanco,
  },
  torneoDet: {
    fontSize: 20,
  },
  torneoInactivo: {
    backgroundColor: colores.base_1_2,
  },
  torneoFinalizado: {
    backgroundColor: colores.base_2_3,
  },
  torneoActivo: {
    backgroundColor: colores.acento_4_1,
  },
  torneoCancelado: {
    backgroundColor: colores.base_1_5,
  },
  redText: {
    color: colores.domin_2_1,
  },
  greenText: {
    color: colores.acento_3_1,
  },
  cancel: {
    padding: 5,
    backgroundColor: colores.domin_2_5,
    borderColor: colores.domin_2_1,
    borderWidth: 2,
    borderRadius: 3,
    width: "100%",
    alignItems: "center",
  },
  successBack: {
    padding: 5,
    borderRadius: 3,
    width: "100%",
    alignItems: "center",
  },
  successText: {
    color: colores.acento_3_1,
    fontSize: 25,
  },
  input: {
    borderColor: colores.domin_2_2,
    borderWidth: 3,
    borderRadius: 5,
    fontFamily: "Oswald_400Regular",
    color: colores.negro,
    backgroundColor: colores.base_2_5,
  },
  form: {
    padding: 10,
    paddingVertical: 15,
    gap: 5,
    backgroundColor: colores.blanco,
    marginVertical: 5,
  },
  teamSelect: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    paddingVertical: 15,
    backgroundColor: colores.base_2_4,
  },
  teamName: {
    fontSize: 25,
  },
  teamImag: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  row: {
    flexDirection: "row",
    width: "50%",
    gap: 5,
    alignItems: "center",
  },
  divdier: {
    width: "100%",
    height: 1,
    backgroundColor: colores.base_3_5,
    alignContent: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  rowTitles: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  webview: {
    width: 120,
    height: 150,
    backgroundColor: "transparent",
    flex: 1,
    resizeMode: "cover",
  },
});

export default Admin3;
