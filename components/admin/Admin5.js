import React, { useState, useEffect } from "react";
import {
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  FlatList,
  ActivityIndicator,
  Button,
  Alert,
  Modal,
  Switch,
  RefreshControl
} from "react-native";
import { Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FONTS from "../../style/fonts";
import colores from "../../style/colors";
import * as ImagePicker from "expo-image-picker";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../config/api";
import api_multi from "../../config/api_multi";
import formStyle from "../../style/formStyles";

import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";

const { width } = Dimensions.get("window");

import { API_URL_LOCAL } from "@env";
const API_URL = API_URL_LOCAL;
import * as FileSystem from "expo-file-system";

const Admin5 = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    contrasena: "",
    imagen: "",
  });
  const [reload, setReload] = useState(false);
  const { getUserId, getUserRole, getToken, logout } = useContext(AuthContext);
  const [tokData, setTokData] = useState("");
  const [arbitros, setArbitros] = useState([]);
  const [loadArb, setLoadArb] = useState(false);
  const [fallo1, setFallo1] = useState("");

  const [image, setImage] = useState(null);
  const [loadBtn, setLoadBtn] = useState(false);

  const [loadArbit, setLoadArbit] = useState(false);
  const [fallo2, setFallo2] = useState("");

  //esquema para validaciones
  const arbitro = yup.object().shape({
    nombreCompleto: yup.string().required("El nombre es requerido"),
    email: yup
      .string()
      .email("Formato de correo inválido")
      .required("El correo es requerido"),
    password: yup.string().required("Contraseña requerida"),
    imagen: yup.mixed().test("fileType", "Formato no soportado", (value) => {
      if (!value) return false;
      const uri = typeof value === "string" ? value : value.uri;
      return uri && /\.(jpe?g|png)$/i.test(uri);
    }),
  });

  //conectar el schema con el form
  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    trigger,
    clearErrors, // ✅ Extraído correctamente desde useForm()
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(arbitro),
    mode: "onChange",
  });

  const desactivarArbitro = async (id, name) => {
    try {
      const tokData = await getToken();
      const res = await api.put(
        `/api/arbitros/cambiarEstatus/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${tokData}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Registro exitoso:", res.data);
      Alert.alert("Operación exitosa", `${res.data}`);
      setReload(!reload);
    } catch (err) {
      console.error(err);
      if (err.response.status === 400) {
        console.log(err.response.data.message);
        Alert.alert("Árbitro no desactivado", err.response.data.message);
        return;
      }
      if (err.response.status === 403) {
        console.log("⚠ Token expirado, redirigiendo a login...");
        logout();
        Alert.alert("Sesión expirada ⚠️", "Por favor, inicia sesión nuevamente.");
        return;
      }
      Alert.alert("¡Error!", `No se pudo deshabilitar a ${name}`);
    }
  };

  const onSubmit = async (data) => {
    if (!image || typeof image !== "string" || !image.startsWith("file://")) {
      console.log("Error: No hay imagen seleccionada.");
      return Alert.alert("Error", "Debes seleccionar una imagen válida.");
    }

    await registrarArbitro(data, image);
  };

  useEffect(() => {
    console.log("Estado actualizado:", image);
  }, [image]);

  const registrarArbitro = async (data, imageUri) => {
    setLoadArbit(true);
    try {
      // 1. Leer la imagen como base64
      const base64Image = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // 2. Preparar el objeto de datos
      const requestData = {
        arbitro: {
          email: data.email,
          password: data.password,
          nombreCompleto: data.nombreCompleto,
        },
        imagen: `data:image/jpeg;base64,${base64Image}`,
      };

      console.log("Datos a enviar:", {
        ...requestData,
        imagen: requestData.imagen.substring(0, 30) + "...",
      });

      // 3. Enviar la petición con timeout
      const response = await Promise.race([
        api.post("/api/arbitros/movil", requestData, {
          headers: {
            Authorization: `Bearer ${tokData}`,
            "Content-Type": "application/json",
          },
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout después de 6s")), 6000)
        ),
      ]);

      // 4. Verificar si realmente falló (aunque el backend haya respondido)
      if (!response.data) {
        throw new Error("La API no devolvió datos");
      }

      console.log("Registro exitoso:", response.data);
      Alert.alert("Éxito", "Árbitro registrado correctamente");

      // 5. Actualizar el estado para recargar la lista de árbitros
      setReload(!reload); // Esto disparará el useEffect para recargar los árbitros
      setValue("nombreCompleto", "");
      setValue("email", "");
      setValue("password", "");
      setValue("imagen", "");
      setVis(false);
      setImage("");
      clearErrors();
      reset();
    } catch (error) {
      console.error("Error completo:", error, error.toJSON());

      // Verificar si es error de red pero el registro fue exitoso
      if (error.message === "Network Error") {
        Alert.alert(
          "Registro posiblemente exitoso",
          "El árbitro se registró pero no pudimos confirmarlo. Verifica la lista."
        );
      } else {
        Alert.alert(
          "Error",
          error.response?.data?.message || error.message || "Error al registrar"
        );
      }
      console.error(e, e.res.message);
      if (err.response.status === 403) {
        console.log("⚠️ Token expirado, redirigiendo a login...");
        Alert.alert("Sesión expirada ⚠️", "Por favor, inicia sesión nuevamente.");
        logout();
        return;
      }

      verificarRegistro(data.email);
    } finally {
      setLoadArbit(false);
    }
  };

  const clearForm = () => {
    setValue("nombreCompleto", "");
    setValue("email", "");
    setValue("password", "");
    setValue("imagen", "");
    setVis(false);
    setImage("");
    clearErrors();
    reset();
  };

  // Función para verificar si realmente se registró
  const verificarRegistro = async (email) => {
    try {
      const res = await api.get(`/api/arbitros?email=${email}`);
      if (res.data) {
        Alert.alert("Verificación", "El árbitro fue registrado exitosamente");
        setReload(!reload); // Actualizar lista
      }
    } catch (e) {
      console.log("Error al verificar:", e);
    }
  };

  useEffect(() => {
    const getAbritros = async () => {
      const id = await getUserRole();
      const rolo = await getUserId();
      const tok = await getToken();
      setTokData(tok);

      setLoadArb(true);
      api
        .get(`/api/arbitros`, {
          headers: {
            Authorization: `Bearer ${tok}`,
          },
        })
        .then((res) => {
          if (res.data.length === 0) setFallo1("No hay árbitros registrados");
          else setArbitros(res.data);
        })
        .catch((e) => {
          console.error(e, e.res.message, e.res.code);
          if (e.response.status === 403) {
            console.log("⚠ Token expirado, redirigiendo a login...");
            Alert.alert(
              "Sesión expirada ⚠️",
              "Por favor, inicia sesión nuevamente."
            );
            logout();
            return;
          }
          if (e.res.message) Alert.alert("Error", e.res.message);
          Alert.alert("Error", "Error al obtener árbitros");
        })
        .finally(() => setLoadArb(false));
    };
    getAbritros();
  }, [reload]);

  // Función para pedir permisos y abrir la cámara
  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permiso denegado",
        "Necesitas permitir el acceso a la cámara."
      );
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      console.log("Imagen seleccionada:", imageUri);
      setImage(imageUri);
      setForm({ ...form, imagen: imageUri });
      setValue("imagen", imageUri);
      trigger("image");
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
      );
      setImage(imageUri);
      setForm({ ...form, imagen: imageUri });
      setValue("imagen", imageUri);
      trigger("imagen");
    }
  };

  const [vis, setVis] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        nestedScrollEnabled={true}
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
              styles.title,
              FONTS.nunitoNegrita,
              {
                paddingVertical: 15,
                paddingHorizontal: 5,
                alignSelf: "flex-start",
              },
            ]}
          >
            Árbitros
          </Text>
          <TouchableOpacity onPress={() => setVis(!vis)}>
            <Ionicons
              name="add-circle-sharp"
              size={30}
              color={colores.acento_2_2}
            />
          </TouchableOpacity>
        </View>
        {/* <View style={styles.cardContainer}>
          {arbitros.map((arbitro, index) => (
            <View key={index} style={styles.card}>
              <Image
                source={{
                  uri: "https://th.bing.com/th/id/OIP._UyGdulfXcXluqK6G5I9JgAAAA?w=148&h=166&c=7&pcl=1b1a19&r=0&o=5&dpr=1.5&pid=1.7",
                }}
                style={styles.image}
              />
              <View style={styles.cardContent}>
                <Text style={[FONTS.oswaldNegrita, styles.name]}>
                  {arbitro.nombre}
                </Text>
                <Text style={[FONTS.oswald, styles.email]}>
                  {arbitro.email}
                </Text>
                <Text style={[FONTS.oswald, styles.matches]}>
                  Partidos pitados: {arbitro.partidos}
                </Text>
                <TouchableOpacity style={styles.optionsButton}>
                  <Text style={[FONTS.oswald, styles.buttonText]}>
                    Opciones
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View> */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled={true}
          contentContainerStyle={{
            alignItems: "center",
            justifyContent: "center",
          }}
          style={{ maxHeight: 250 }}
        >
          {loadArb ? (
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
          ) : fallo1 === "" ? (
            <View style={styles.table}>
              {/* Encabezado de la tabla */}
              <View style={styles.headerRow}>
                <Text
                  style={[
                    styles.headerCell,
                    styles.idCell,
                    FONTS.oswaldNegrita,
                  ]}
                >
                  #
                </Text>
                <Text style={[styles.headerCell, FONTS.oswaldNegrita]}>
                  Nombre Completo
                </Text>
                <Text style={[styles.headerCell, FONTS.oswaldNegrita]}>
                  Correo electrónico
                </Text>
                <Text
                  style={[
                    styles.headerCell,
                    styles.partidoCell,
                    FONTS.oswaldNegrita,
                  ]}
                >
                  Estado
                </Text>
                <Text
                  style={[
                    styles.headerCell,
                    styles.buttonCell,
                    FONTS.oswaldNegrita,
                    { width: 80 },
                  ]}
                >
                  Opciones
                </Text>
              </View>

              <View style={{ maxHeight: 200, padding: 5 }}>
                <FlatList
                  data={arbitros}
                  keyExtractor={(item, index) => item.id}
                  nestedScrollEnabled={true}
                  renderItem={({ item, index }) => (
                    <View style={styles.row}>
                      <Text
                        style={[
                          styles.cell,
                          styles.idHead,
                          FONTS.nunitoNegrita,
                        ]}
                      >
                        {index + 1}
                      </Text>
                      <Text style={[styles.cell, FONTS.nunitoNegrita]}>
                        {item.nombreCompleto}
                      </Text>
                      <Text style={[styles.cell, FONTS.nunitoNegrita]}>
                        {item.usuario.email}
                      </Text>
                      <Text
                        style={[
                          styles.cell,
                          styles.partidoHead,
                          FONTS.nunitoNegrita,
                        ]}
                      >
                        {item.usuario.estatus ? "Activo" : "Inactivo"}
                      </Text>
                      <View style={{width: 90, alignItems: 'center'}}>
                        <Switch
                          value={item.usuario.estatus}
                          thumbColor={
                            item.usuario.estatus
                              ? colores.base_1_1
                              : colores.base_2_5
                          } // Color del círculo
                          trackColor={{
                            false: colores.domin_2_3,
                            true: colores.acento_3_1,
                          }} // Color de la pista
                          onValueChange={() =>
                            desactivarArbitro(item.id, item.nombreCompleto)
                          }
                          style={{
                            transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }], // Ajustar tamaño correctamente
                          }}
                        />
                      </View>

                      {/* <TouchableOpacity
                        style={[
                          styles.button,
                          item.usuario.estatus
                            ? styles.reactiveButton
                            : styles.deleteButton,
                          styles.buttonHead,
                        ]}
                        onPress={async () =>
                          desactivarArbitro(item.id, item.nombreCompleto)
                        }
                      >
                        {!item.usuario.estatus ? (
                          <Ionicons
                            name="refresh"
                            size={24}
                            color={colores.blanco}
                          />
                        ) : (
                          <Ionicons
                            name="trash"
                            size={24}
                            color={colores.blanco}
                          />
                        )}
                      </TouchableOpacity> */}
                    </View>
                  )}
                />
              </View>
            </View>
          ) : (
            <Text
              style={[FONTS.oswald, styles.errMessCenter, { marginTop: 10 }]}
            >
              {fallo1}
            </Text>
          )}
        </ScrollView>
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={vis}
        onRequestClose={() => {
          clearForm();
        }}
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
              onPress={() => clearForm()}
            >
              <Ionicons name="close" size={24} color={colores.negro} />
            </TouchableOpacity>
            <View>
              <Text style={[FONTS.nunitoNegrita, styles.registerTitle]}>
                Registrar árbitro
              </Text>
              <View style={styles.formContainer}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Text style={[FONTS.nunitoNegrita, styles.registerTitlePic]}>
                    Foto de perfil
                  </Text>
                  <Controller
                    control={control}
                    name="imagen"
                    render={({ field: { value } }) => (
                      <>
                        {image ? (
                          <Image
                            source={{
                              uri: value,
                            }}
                            style={styles.registerImage}
                          />
                        ) : (
                          <Text
                            style={[
                              formStyle.errText,
                              {
                                color: "black",
                                textAlign: "center",
                                width: "100%",
                              },
                            ]}
                          >
                            Seleccionar foto
                          </Text>
                        )}
                        {errors.imagen && (
                          <Text style={formStyle.errText}>
                            {errors.imagen.message}
                          </Text>
                        )}
                      </>
                    )}
                  />
                  <View
                    style={{
                      flexDirection: "row",
                      width: "100%",
                      gap: 5,
                      marginVertical: 3,
                    }}
                  >
                    <TouchableOpacity
                      onPress={openCamera}
                      style={{
                        backgroundColor: colores.acento_1_2,
                        width: "45%",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 10,
                      }}
                    >
                      <Ionicons
                        name="camera"
                        size={24}
                        color={colores.blanco}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={openGallery}
                      style={{
                        backgroundColor: colores.acento_1_2,
                        width: "45%",
                        height: 50,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 10,
                      }}
                    >
                      <Ionicons name="image" size={24} color={colores.blanco} />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.formFields}>
                  <Controller
                    control={control}
                    name="nombreCompleto"
                    render={({ field: { onChange, value } }) => (
                      <>
                        <TextInput
                          style={[
                            styles.input,
                            styles.inputError,
                            FONTS.oswald,
                          ]}
                          placeholder="Nombre completo"
                          placeholderTextColor={colores.domin_2_2}
                          value={value}
                          onChangeText={(text) => onChange(text)}
                        />
                        {errors.nombreCompleto && (
                          <Text style={formStyle.errText}>
                            {errors.nombreCompleto.message}
                          </Text>
                        )}
                      </>
                    )}
                  />
                  <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, value } }) => (
                      <>
                        <TextInput
                          style={[
                            styles.input,
                            styles.inputError,
                            FONTS.oswald,
                          ]}
                          placeholder="Correo electrónico"
                          placeholderTextColor={colores.domin_2_2}
                          value={value}
                          autoCapitalize="none"
                          keyboardType="email-address"
                          onChangeText={(text) => onChange(text)}
                        />
                        {errors.email && (
                          <Text style={formStyle.errText}>
                            {errors.email.message}
                          </Text>
                        )}
                      </>
                    )}
                  />
                  <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, value } }) => (
                      <>
                        <TextInput
                          style={[
                            styles.input,
                            styles.inputError,
                            FONTS.oswald,
                          ]}
                          placeholder="Contraseña"
                          placeholderTextColor={colores.domin_2_2}
                          secureTextEntry
                          value={value}
                          keyboardType="password"
                          onChangeText={(text) => onChange(text)}
                        />
                        {errors.password && (
                          <Text style={formStyle.errText}>
                            {errors.password.message}
                          </Text>
                        )}
                      </>
                    )}
                  />
                  {loadArbit ? (
                    <ActivityIndicator size="large" color={colores.domin_2_3} />
                  ) : (
                    <TouchableOpacity
                      style={[
                        styles.registerButton,
                        { opacity: isValid ? 1 : 0.5 },
                      ]}
                      onPress={handleSubmit(onSubmit)}
                      disabled={!isValid}
                    >
                      <Text style={[FONTS.oswald, styles.registerButtonText]}>
                        Registrar
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              {fallo2 ? (
                <Text
                  style={[
                    FONTS.nunitoNegrita,
                    formStyle.errText,
                    { color: colores.domin_1_1 },
                  ]}
                >
                  ¡{fallo2}!
                </Text>
              ) : null}
            </View>
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
    //width: 250,
    width: "95%",
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 10,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    alignItems: "flex-start",
    marginBlock: 5,
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    width: width * 0.4,
    alignItems: "center",
    textAlign: "center",
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  cardContent: {
    alignItems: "center",
    marginTop: 10,
    flexGrow: 1,
  },
  name: {
    fontSize: 16,
    flexShrink: 1,
  },
  email: {
    fontSize: 12,
    color: "gray",
    textAlign: "center",
    flexShrink: 1,
  },
  matches: {
    fontSize: 14,
    marginVertical: 5,
    flexShrink: 1,
  },
  optionsButton: {
    backgroundColor: colores.domin_2_1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 14,
    color: colores.blanco,
  },
  registerTitle: {
    fontSize: 22,
    marginBottom: 10,
    textAlign: "center",
  },
  registerTitlePic: {
    fontSize: 20,
    marginBottom: 10,
    marginRight: 8,
    textAlign: "left",
  },
  formContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: width * 0.9,
    paddingVertical: 10,
  },
  registerImage: {
    width: "90%",
    marginRight: 10,
    height: 120,
    borderRadius: 5,
  },
  formFields: {
    flex: 1,
  },
  input: {
    borderColor: colores.domin_2_2,
    borderWidth: 3,
    borderRadius: 5,
    fontFamily: "Oswald_400Regular",
    color: colores.negro,
    backgroundColor: colores.base_2_5,
    marginVertical: 3,
  },
  inputError: {
    borderColor: colores.domin_2_3,
  },
  registerButton: {
    backgroundColor: colores.domin_2_3,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  registerButtonText: {
    color: "white",
  },

  table: {
    flex: 1,
    backgroundColor: colores.blanco,
    marginBottom: 10,
    width: 600,
    borderRadius: 5,
  },

  headerRow: {
    flexDirection: "row",
    backgroundColor: colores.domin_2_2,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
  },
  headerCell: {
    flex: 1,
    textAlign: "left",
    paddingHorizontal: 10,
    color: "white",
  },
  idCell: { maxWidth: 35 },
  idHead: { maxWidth: 30 },
  partidoHead: { maxWidth: 75 },
  partidoCell: { maxWidth: 75 },
  buttonCell: { maxWidth: 100 },
  buttonHead: { maxWidth: 80, alignItems: "center" },

  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    padding: 10,
    alignItems: "center",
    borderBottomColor: colores.base_2_4,
  },
  cell: { flex: 1, textAlign: "left", paddingHorizontal: 10 },

  button: {
    flex: 1,
    padding: 5,
    backgroundColor: colores.acento_3_1,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: "center",
  },
  buttonText: { textAlign: "center" },

  editButton: { backgroundColor: colores.acento_2_3 },
  deleteButton: { backgroundColor: colores.domin_2_2 },
  reactiveButton: { backgroundColor: colores.acento_3_1 },
});

export default Admin5;
