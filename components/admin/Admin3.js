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
  RefreshControl,
} from "react-native";
import { Alert } from "react-native";
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
import * as FileSystem from "expo-file-system";
import axios from "axios";

const Admin3 = ({ navigation, mode = "date", display = "default" }) => {
  const { getUserId, getUserRole, getToken, logout } = useContext(AuthContext);

  const [refreshing, setRefreshing] = useState(false);

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

  const [formVis, setFormVis] = useState(false);
  const [image, setImage] = useState(null);
  const [motivo, setMotivo] = useState("");

  const [loadBtn, setLoadBtn] = useState(false);

  const ordenEstados = ["En Juego", "En Espera", "Finalizado"];

  const torneo = yup.object().shape({
    id: yup.number(),
    foto: yup.string(),
    iniciado: yup.boolean(),
    nombreTorneo: yup.string("No válido").required("El nombre es requerido"),
    descripcion: yup
      .string("No válido")
      .max(500, "Tamaño de descripción excedido")
      .required("La descripción del torneo es requerida"),
    fechaInicio: yup
      .string("No válido")
      .required("La fecha de inicio es requerida")
      .test("es-futura", "La fecha debe ser hoy o en el futuro", (value) => {
        const fechaIngresada = new Date(value);
        const fechaActual = new Date();
        fechaActual.setHours(0, 0, 0, 0);
        return fechaIngresada >= fechaActual;
      })
      .test("es-domingo", "La fecha debe ser un domingo", (value) => {
        const fechaIngresada = new Date(value);
        return fechaIngresada.getDay() === 6; // 0 representa el domingo en JavaScript
      }),
    minEquipos: yup
      .number("No válido")
      .typeError("Debe ser un número")
      .integer("Se requiere un número entero")
      .min(2, "Debe ser al menos 2")
      .test("es-par", "El número debe ser par", (value) => value % 2 === 0)
      .required("Este campo es obligatorio")
      .test("max-min", "Debe ser menor o igual al máximo", function (value) {
        return value <= this.parent.maxEquipos;
      }),
    maxEquipos: yup
      .number("No válido")
      .typeError("Debe ser un número")
      .integer("Se requiere un número entero")
      .min(2, "Debe ser al menos 2")
      .test("es-par", "El número debe ser par", (value) => value % 2 === 0)
      .required("Este campo es obligatorio")
      .test("min-max", "Debe ser mayor o igual al mínimo", function (value) {
        return value >= this.parent.minEquipos;
      }),
    equiposLiguilla: yup
      .number()
      .typeError("Debe ser un número")
      .integer("Debe ser un número entero")
      .min(4, "Debe ser al menos 4")
      .required("Debes especificar cuántos pasan a liguilla")
      .max(
        yup.ref("maxEquipos"),
        "No puede ser mayor que el máximo de equipos"
      ),
    vueltas: yup
      .number("No válido")
      .typeError("Debe ser un número")
      .integer("Debe ser un número entero")
      .min(1, "Debe ser mayor a 0")
      .required("Se requieren las vueltas"),
    premio: yup.string().required("Se requiere especificar premio"),
  });

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    reset,
    trigger,
    clearErrors, // ✅ Extraído correctamente desde useForm()
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(torneo),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    if (!editar) {
      if (!image || typeof image !== "string" || !image.startsWith("file://")) {
        console.log("Error: No hay imagen seleccionada.");
        return Alert.alert(
          "Imagen no seleccionada",
          "Debes seleccionar una imagen válida."
        );
      }
    }

    !editar
      ? await registrarTorneo(data, image)
      : await updateTorneo(data, image);
  };

  const [showInicio, setShowInicio] = useState(false);
  const [showFin, setShowFin] = useState(false);

  const [fechaInicio, setFechaInicio] = useState(new Date());

  const [show, setShow] = useState(false);
  const [editar, setEditar] = useState(false);

  const formatDate = (date) => {
    // Convierte la fecha en formato YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Asegura dos dígitos
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleConfirm = (date, onChange, value) => {
    const formattedDate = formatDate(date);
    console.log("Fecha seleccionada:", formattedDate); // Verificar qué valor se guarda
    onChange(formattedDate);
    setValue("fechaInicio", formattedDate, { shouldValidate: true });
    trigger("fechaInicio");
    setShow(false);
    console.log(value);
  };

  const getEstadoName = (nombre) => {
    for (let i = 0; i < ordenEstados.length; i++) {
      if (nombre.toLowerCase().includes(ordenEstados[i].toLowerCase())) {
        return i;
      }
    }
    return ordenEstados.length;
  };

  function triggerAll() {
    trigger("nombreTorneo");
    trigger("descripcion");
    trigger("premio");
    trigger("fechaInicio");
    trigger("equiposLiguilla");
    trigger("maxEquipos");
    trigger("minEquipos");
    trigger("vueltas");
  }

  function setEdicion(torneo) {
    setValue("id", torneo.id);
    setValue("nombreTorneo", torneo.nombreTorneo);
    setValue("descripcion", torneo.descripcion);
    setValue("fechaInicio", torneo.fechaInicio);
    setValue("maxEquipos", torneo.maxEquipos);
    setValue("minEquipos", torneo.minEquipos);
    setValue("equiposLiguilla", torneo.equiposLiguilla);
    setValue("premio", torneo.premio);
    setValue("vueltas", torneo.vueltas);
    setValue("iniciado", torneo.iniciado);
    setImage(torneo.logoTorneo);

    trigger("nombreTorneo");
    trigger("descripcion");
    trigger("premio");
    trigger("fechaInicio");
    trigger("equiposLiguilla");
    trigger("maxEquipos");
    trigger("minEquipos");
    trigger("vueltas");
  }

  function removeEdicion() {
    setValue("id", "");
    setValue("nombreTorneo", "");
    setValue("descripcion", "");
    setValue("fechaInicio", "");
    setValue("maxEquipos", "");
    setValue("minEquipos", "");
    setValue("equiposLiguilla", "");
    setValue("premio", "");
    setValue("vueltas", "");
    setValue("iniciado", "");
    setImage("");
    setFormVis(false);
  }

  function editarFunction(torneo) {
    console.log(torneo);
    setEdicion(torneo);
    if (!formVis) setFormVis(!formVis);
    setEditar(true);
    console.log(torneo);
  }

  const registrarTorneo = async (data, image) => {
    setLoadBtn(true);

    try {
      // 1. Verificar que el archivo existe
      const fileInfo = await FileSystem.getInfoAsync(image);
      if (!fileInfo.exists) {
        console.error("El archivo no existe en la ruta:", image);
        Alert.alert("Imagen no seleccionada", "No se encontró la imagen");
        return;
      }

      // 2. Leer la imagen como base64
      const base64Image = await FileSystem.readAsStringAsync(image, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // 3. Determinar el tipo MIME (puedes ajustarlo según necesites)
      const mimeType = "image/jpeg"; // o podrías detectarlo del nombre del archivo

      const nombre = data.nombreTorneo.trim();
      const desc = data.descripcion.trim();

      // 4. Construir el objeto de datos como en tu ejemplo
      const requestData = {
        nombreTorneo: nombre,
        descripcion: desc,
        fechaInicio: data.fechaInicio,
        maxEquipos: parseInt(data.maxEquipos),
        minEquipos: parseInt(data.minEquipos),
        equiposLiguilla: parseInt(data.equiposLiguilla),
        premio: data.premio,
        vueltas: parseInt(data.vueltas),
        imagen: `data:${mimeType};base64,${base64Image}`,
      };

      console.log("Datos a enviar:", {
        ...requestData,
        imagen: requestData.imagen.substring(0, 30) + "...",
      });

      const tokData = await getToken();

      // 5. Enviar la petición
      const response = await Promise.race([
        api.post("/api/torneos/movil", requestData, {
          headers: {
            Authorization: `Bearer ${tokData}`,
            "Content-Type": "application/json",
          },
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout después de 6s")), 6000)
        ),
      ]);

      if (!response.data) {
        throw new Error("La API no devolvió datos");
      }

      Alert.alert("¡Éxito!", "Torneo creado exitosamente");
      setReload(!reload);
      reset();
      setImage("");
    } catch (error) {
      console.error("Error completo:", error);

      if (error.response) {
        console.error(
          "Error del servidor:",
          error.response.status,
          error.response.data
        );

        if (error.response.status === 403) {
          console.log("⚠️ Token expirado, redirigiendo a login...");
          Alert.alert(
            "Sesión expirada ⚠️",
            "Por favor, inicia sesión nuevamente."
          );
          logout();
          return;
        }

        Alert.alert(
          "Error",
          error.response.data.message || "Error al registrar el torneo"
        );
      } else if (error.message === "Network Error") {
        Alert.alert(
          "Advertencia",
          "El torneo se creó, pero no pudimos confirmarlo. Verifica la lista."
        );
      } else {
        Alert.alert("Error", error.message || "Error inesperado");
      }
    } finally {
      setLoadBtn(false);
    }
  };

  const updateTorneo = async (data, image) => {
    setLoadBtn(true);

    let localUri = ""; // Ruta del archivo local para eliminar luego

    try {
      let base64Image;

      // 1. Verificar si la imagen es una URL (empieza con 'https://')
      if (image.startsWith("https://")) {
        // 2. Descargar la imagen desde la URL
        const response = await fetch(image);
        const blob = await response.blob();

        if (!blob) {
          console.error("No se pudo descargar la imagen desde la URL:", image);
          Alert.alert("Error", "No se pudo obtener la imagen");
          return;
        }

        // 3. Convertir el Blob a Base64 usando FileReader
        base64Image = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result.split(",")[1]); // Elimina la parte 'data:image/jpeg;base64,'
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob); // Lee el blob como una URL de datos (base64)
        });

        // 4. Guardar el Blob como archivo local (opcional)
        localUri = FileSystem.documentDirectory + "image.jpg"; // Define una ruta local para la imagen
        await FileSystem.writeAsStringAsync(localUri, base64Image, {
          encoding: FileSystem.EncodingType.Base64,
        });
      } else {
        // 5. Procesar la imagen local (de la galería)
        const fileInfo = await FileSystem.getInfoAsync(image);
        if (!fileInfo.exists) {
          console.error("El archivo no existe en la ruta:", image);
          Alert.alert("Imagen no seleccionada", "No se encontró la imagen");
          return;
        }

        // 6. Leer la imagen local como base64
        base64Image = await FileSystem.readAsStringAsync(image, {
          encoding: FileSystem.EncodingType.Base64,
        });
      }

      // 7. Determinar el tipo MIME
      const mimeType = "image/jpeg"; // o puedes ajustarlo según el tipo de archivo

      // 8. Construir el objeto de datos como antes
      const requestData = {
        nombreTorneo: data.nombreTorneo,
        descripcion: data.descripcion,
        fechaInicio: data.fechaInicio,
        maxEquipos: data.maxEquipos,
        minEquipos: data.minEquipos,
        equiposLiguilla: data.equiposLiguilla,
        premio: data.premio,
        vueltas: data.vueltas,
        imagen: `data:${mimeType};base64,${base64Image}`,
      };

      console.log("Datos a enviar:", {
        ...requestData,
        imagen: requestData.imagen.substring(0, 30) + "...",
      });

      const tokData = await getToken();

      // 5. Enviar la petición
      const response = await Promise.race([
        api.put(`/api/torneos/movil/${data.id}`, requestData, {
          headers: {
            Authorization: `Bearer ${tokData}`,
            "Content-Type": "application/json",
          },
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout después de 6s")), 6000)
        ),
      ]);

      if (!response.data) {
        throw new Error("La API no devolvió datos");
      }

      console.log(response.data);

      Alert.alert("¡Éxito!", "Torneo actualizado exitosamente");
      setReload(!reload);
      reset();
      clearErrors();
      setImage("");
      setEditar(false);
      removeEdicion();
    } catch (error) {
      console.error("Error completo:", error);

      if (error.response) {
        console.error(
          "Error del servidor:",
          error.response.status,
          error.response.data
        );

        if (error.response.status === 403) {
          console.log("⚠️ Token expirado, redirigiendo a login...");
          Alert.alert(
            "Sesión expirada ⚠️",
            "Por favor, inicia sesión nuevamente."
          );
          logout();
          return;
        }

        Alert.alert(
          "Error",
          error.response.data.message || "Error al actualizar el torneo"
        );
      } else if (error.message === "Network Error") {
        Alert.alert(
          "Advertencia",
          "El torneo se actualizó, pero no pudimos confirmarlo. Verifica la lista."
        );
      } else {
        Alert.alert("Error", error.message || "Error inesperado");
      }
    } finally {
      setLoadBtn(false);
    }
  };

  const getEstado = (tor) => {
    if (tor.motivoFinalizacion) return 4; // Cancelado
    if (!tor.estatusTorneo) return 3; // Finalizado con ganador
    if (tor.iniciado && tor.esliguilla) return 0; // En liguilla
    if (tor.iniciado) return 1; // En juego
    if (!tor.estatusLlenado) return 2; // En espera
    return 5; // Otros casos
  };

  const torneosOrdenados = torneos.sort((a, b) => {
    const estadoA = getEstado(a);
    const estadoB = getEstado(b);

    if (estadoA !== estadoB) {
      return estadoA - estadoB; // Ordena por estado según la prioridad definida
    }

    // Si están en el mismo estado, ordena por fecha de inicio
    return new Date(a.fechaInicio) - new Date(b.fechaInicio);
  });

  //Borrar despues
  const setLog = () => {
    setLogoTorneo("../../assets/EquiposLogos/LogoDefault.png");
  };

  useEffect(() => {
    setLog;
  }, []);

  const [reload, setReload] = useState(false);

  useEffect(() => {
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
            "Sesión expirada ⚠️",
            "Por favor, inicia sesión nuevamente."
          );
          logout();
          return;
        }
        if (e.res.message) setFalloT(e.res.message);
        else setFalloT("Error al obtener torneos");
      })
      .finally(() => setLoadTors(false));
  }, [reload]);

  const iniciarTorneo = async (id) => {
    const tokData = await getToken();
    await api
      .post(
        `/api/partidos/admin/iniciartorneo/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${tokData}`,
          },
        }
      )
      .then((res) => {
        Alert.alert("Éxito", res.data || "Torneo iniciado correctamente");
        setReload(!reload);
      })
      .catch((error) => {
        console.error("Error completo:", error);
        if (error.response.status === 403) {
          console.log("⚠️ Token expirado, redirigiendo a login...");
          Alert.alert(
            "Sesión expirada ⚠️",
            "Por favor, inicia sesión nuevamente."
          );
          logout();
          return;
        }
        console.error("Respuesta del servidor:", error.response?.data.message);
        Alert.alert(
          "Denegado",
          error.response?.data?.message || "Error desconocido"
        );
      });
  };

  const cancelarTorneo = async (id) => {
    const tokData = await getToken();
    console.log(id);
    await api
      .patch(
        `/api/torneos/${id}/cancelar`,
        {
          motivoFinalizacion: motivo,
        },
        {
          headers: {
            Authorization: `Bearer ${tokData}`,
            "Content-Type": "application/json", // Agrega este encabezado
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        Alert.alert("Éxito", "Torneo cancelado correctamente");
        setReload(!reload);
      })
      .catch((error) => {
        console.error(error, error.response?.data?.message);
        console.log(error.toJSON());
        if (error.response?.status === 403) {
          console.log("⚠️ Token expirado, redirigiendo a login...");
          Alert.alert(
            "Sesión expirada ⚠️",
            "Por favor, inicia sesión nuevamente."
          );
          logout();
          return;
        }
        Alert.alert(
          "Denegado",
          error.response?.data?.message || "Error desconocido"
        );
      })
      .finally(() => setModalVisible1(false));
  };

  const [id, setId] = useState(0);

  const showModal1 = (name, id) => {
    setId(id);
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

  const getEstilo = (tor) => {
    if (tor.motivoFinalizacion) return stylesAdmin3.torneoCancelado; // Cancelado
    if (!tor.estatusTorneo) return stylesAdmin3.torneoFinalizado; // Finalizado con ganador
    if (tor.iniciado && tor.esliguilla) return stylesAdmin3.torneoLiguilla; // En liguilla
    if (tor.iniciado) return stylesAdmin3.torneoActivo; // En juego
    if (!tor.estatusLlenado) return stylesAdmin3.torneoInactivo; // En espera

    return stylesAdmin3.defaultTorneo; // Por defecto
  };

  // Crear una referencia para el ScrollView
  const scrollViewRef = useRef(null);

  // Crear referencias para cada componente al que te quieres desplazar
  const sectionOneRef = useRef(null);

  const handleScroll = () => {
    setFormVis(!formVis);
    clearErrors();
    // if (scrollViewRef.current) {
    //   scrollViewRef.current.scrollTo({ y: 450, animated: true }); // Ajusta 'y' a la posición deseada
    // }
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
      triggerAll();
      console.log(errors);
    }
  };

  useEffect(() => {
    console.log("Errores en el formulario:", errors);
  }, [errors]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => setReload(!reload)}
            colors={[colores.domin_1_1]}
            tintColor={colores.domin_1_1}
          />
        }
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
                  style={[stylesAdmin3.box, getEstilo(tor)]}
                  onPress={() =>
                    tor.esliguilla || tor.iniciado || !tor.iniciado
                      ? showModal3(tor.nombreTorneo, tor)
                      : null
                  }
                  key={tor.id}
                >
                  {/* Encabezado */}
                  <View style={stylesAdmin3.boxHeader}>
                    <Text style={[stylesAdmin3.textHead1, FONTS.oswaldNegrita]}>
                      A liguilla: {tor.equiposLiguilla}
                    </Text>
                    <Text style={[stylesAdmin3.textHead2, FONTS.oswald]}>
                      {tor.fechaInicio}
                    </Text>
                  </View>

                  {/* Imagen o animación */}
                  <View style={stylesAdmin3.lordContainer}>
                    {tor.logoTorneo ? (
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
                    ) : (
                      <LottieView
                        source={require("../../assets/copa.json")}
                        autoPlay
                        loop
                        style={stylesAdmin3.icon}
                        speed={1}
                        color={colores.base_3_1}
                      />
                    )}
                  </View>

                  {/* Nombre del torneo */}
                  <Text style={[FONTS.oswaldNegrita, stylesAdmin3.torneoTitle]}>
                    Torneo "{tor.nombreTorneo}"
                  </Text>

                  {/* Estado del torneo */}
                  {tor.motivoFinalizacion ? (
                    <View style={stylesAdmin3.cancel}>
                      <Text style={[FONTS.oswaldNegrita, stylesAdmin3.redText]}>
                        Cancelado: {tor.motivoFinalizacion}
                      </Text>
                    </View>
                  ) : tor.ganador ? (
                    <Text style={[FONTS.oswald, stylesAdmin3.torneoDet]}>
                      Ganador: {tor.ganador}
                    </Text>
                  ) : null}

                  {/* Liguilla */}
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
                      {/* Botón Editar/Detalles */}
                      <TouchableOpacity
                        style={stylesAdmin3.botTorneo}
                        onPress={() =>
                          !tor.estatusTorneo || tor.motivoFinalizacion
                            ? showModal3(tor.nombreTorneo, tor)
                            : tor.iniciado
                            ? editarFunction(tor)
                            : editarFunction(tor)
                        }
                      >
                        <Text
                          style={[FONTS.oswald, stylesAdmin3.botonTorneoText]}
                        >
                          {tor.estatusTorneo
                            ? tor.iniciado
                              ? "Editar"
                              : "Editar"
                            : "Detalles"}
                        </Text>
                      </TouchableOpacity>

                      {/* Botón Iniciar/Cancelar/Remover */}
                      {tor.estatusTorneo || tor.motivoFinalizacion
                        ? !tor.ganador &&
                          !tor.motivoFinalizacion && (
                            <TouchableOpacity
                              style={stylesAdmin3.botTorneo}
                              onPress={() => {
                                if (!tor.iniciado) {
                                  iniciarTorneo(tor.id);
                                } else if (tor.iniciado) {
                                  showModal1(tor.nombreTorneo, tor.id);
                                } else {
                                  showModal2(tor.nombreTorneo);
                                }
                              }}
                            >
                              <Text
                                style={[
                                  FONTS.oswald,
                                  stylesAdmin3.botonTorneoText,
                                ]}
                              >
                                {!tor.iniciado
                                  ? "Iniciar"
                                  : tor.iniciado
                                  ? "Cancelar"
                                  : "Remover"}
                              </Text>
                            </TouchableOpacity>
                          )
                        : null}
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
        {!formVis ? null : <View></View>}
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
              En caso de confirmar, escribe el motivo de su ancelación.
            </Text>
            <TextInput
              placeholder="Mótivo de cancelación"
              placeholderTextColor={colores.domin_2_2}
              style={stylesAdmin3.modalInput}
              onChangeText={(text) => setMotivo(text)}
            />
            <Text style={[FONTS.oswald, stylesModal.modalText]}>
              ¿Deseas cancelar el torneo?
            </Text>
            <View style={stylesModal.modalButRow}>
              <TouchableOpacity
                disabled={motivo === "" ? true : false}
                style={[
                  stylesModal.buttonBack,
                  FONTS.oswald,
                  { opacity: motivo === "" ? 0.5 : 1 },
                ]}
                onPress={async () => cancelarTorneo(id)}
              >
                <Text style={[stylesModal.buttonText, FONTS.oswald]}>Si</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[stylesModal.buttonBack, FONTS.oswald]}
                onPress={() => setModalVisible1(false)}
              >
                <Text style={[stylesModal.buttonText, FONTS.oswald]}>No</Text>
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
            <Ionicons name="help-circle" size={48} color={colores.domin_2_1} />
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
              Equipos en liguilla:{" "}
              <Text style={FONTS.oswald}>{tournamentData.equiposLiguilla}</Text>
            </Text>
            <Text style={[FONTS.oswaldNegrita, stylesModal.modalDato]}>
              Premio: <Text style={FONTS.oswald}>{tournamentData.premio}</Text>
            </Text>
            {tournamentData.ganador !== null && (
              <Text style={[FONTS.oswaldNegrita, stylesModal.modalDato]}>
                Ganador: {tournamentData.ganador}
                <Text style={FONTS.oswald}>{tournamentData.premio}</Text>
              </Text>
            )}
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={formVis}
        onRequestClose={() => setFormVis(false)}
      >
        <View style={stylesModal.modalContainer}>
          <View style={stylesModal.modalContent3}>
            <TouchableOpacity
              style={{
                alignSelf: "flex-end",
                justifyContent: "flex-start",
                marginTop: 10,
                marginRight: 10,
              }}
              onPress={() => {
                setFormVis(false);
                setEditar(false);
                removeEdicion();
              }}
            >
              <Ionicons name="close" size={36} color={colores.negro} />
            </TouchableOpacity>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={[
                  styles.TextField,
                  stylesAdmin3.title,
                  FONTS.nunitoNegrita,
                  { paddingVertical: 5, paddingHorizontal: 5 },
                ]}
              >
                {editar ? "Editar torneo" : "Nuevo torneo"}
              </Text>
              {!editar ? null : (
                <TouchableOpacity
                  onPress={() => {
                    setEditar(false);
                    removeEdicion();
                  }}
                >
                  <Ionicons
                    name="refresh-circle"
                    size={30}
                    color={colores.acento_2_2}
                  />
                </TouchableOpacity>
              )}
            </View>
            <ScrollView
              ref={sectionOneRef}
              style={{ maxHeight: 500 }}
              showsVerticalScrollIndicator={false}
            >
              <View style={stylesAdmin3.form}>
                <Text style={[FONTS.oswald, { alignSelf: "flex-start" }]}>
                  Logo del torneo
                </Text>
                <View
                  style={{ alignItems: "center", gap: 5, paddingVertical: 5 }}
                >
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
                        style={[stylesAdmin3.input, { width: "100%" }]}
                        value={value}
                        onChangeText={(text) => {
                          onChange(text);
                          trigger("nombreTorneo");
                        }}
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
                        onChangeText={(text) => {
                          onChange(text);
                          trigger("descripcion");
                        }}
                        style={[
                          stylesAdmin3.input,
                          { height: 120, width: "100%" },
                        ]}
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
                        onChangeText={(text) => {
                          onChange(text);
                          trigger("premio");
                        }}
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
                <Controller
                  control={control}
                  name="equiposLiguilla"
                  render={({ field: { onChange, value } }) => (
                    <>
                      <TextInput
                        placeholder="Equipos en liguilla"
                        placeholderTextColor={colores.domin_2_2}
                        value={editar ? value.toString() : value}
                        keyboardType="numeric"
                        onChangeText={(text) => {
                          onChange(text);
                          trigger("equiposLiguilla");
                        }}
                        style={[stylesAdmin3.input, { width: "100%" }]}
                      />
                      {errors.equiposLiguilla && (
                        <Text style={[formStyle.errText]}>
                          {errors.equiposLiguilla.message}
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
                            readOnly={true}
                          />

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
                          onConfirm={(date) =>
                            handleConfirm(date, onChange, value)
                          }
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
                          placeholder="Máx equipos"
                          placeholderTextColor={colores.domin_2_2}
                          keyboardType="numeric"
                          value={editar ? value.toString() : value}
                          onChangeText={(text) => {
                            {
                              editar
                                ? setValue("maxEquipos", text)
                                : onChange(text);
                            }
                            trigger("equiposLiguilla");
                            trigger("minEquipos");
                          }}
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
                          placeholder="Mín equipos"
                          placeholderTextColor={colores.domin_2_2}
                          keyboardType="numeric"
                          value={editar ? value.toString() : value}
                          onChangeText={(text) => {
                            {
                              editar
                                ? setValue("minEquipos", text)
                                : onChange(text);
                            }
                            trigger("maxEquipos");
                          }}
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
                          value={editar ? value.toString() : value}
                          onChangeText={(text) => {
                            editar ? setValue("vueltas", text) : onChange(text);
                            trigger("vueltas");
                          }}
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
              <View
                style={{
                  gap: 5,
                  paddingVertical: 5,
                  width: "100%",
                  alignSelf: "center",
                  flexDirection: "column",
                }}
              >
                {loadBtn ? (
                  <ActivityIndicator size="large" color={colores.domin_1_1} />
                ) : (
                  <TouchableOpacity
                    style={[
                      stylesAdmin3.botTorneo,
                      {
                        opacity: isValid ? 1 : 0.5,
                        width: "50%",
                        alignSelf: "center",
                        justifyContent: "center",
                      },
                    ]}
                    onPress={handleSubmit(onSubmit)}
                    disabled={!isValid}
                  >
                    <Text style={[FONTS.oswald, stylesAdmin3.botonTorneoText]}>
                      {!editar ? "Crear Torneo" : "Actualizar torneo"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
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
  modalContent3: {
    backgroundColor: "white",
    paddingHorizontal: 0,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "98%",
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
    marginTop: 0,
  },
  torneoDet: {
    fontSize: 20,
  },
  torneoLiguilla: {
    backgroundColor: colores.acento_3_1,
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
    color: colores.acento_2_5,
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
    width: "100%",
    backgroundColor: colores.acento_1_4,
    color: colores.acento_2_1,
    fontSize: 25,
    textAlign: "center",
  },
  input: {
    borderColor: colores.domin_2_2,
    borderWidth: 3,
    borderRadius: 5,
    fontFamily: "Oswald_400Regular",
    color: colores.negro,
    backgroundColor: colores.base_2_5,
  },
  modalInput: {
    borderColor: colores.domin_2_2,
    width: "100%",
    borderWidth: 1,
    borderRadius: 5,
    fontFamily: "Oswald_400Regular",
    color: colores.negro,
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
