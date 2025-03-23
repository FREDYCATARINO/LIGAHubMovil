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

const Admin5 = ({ navigation }) => {
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
    imagen: yup
      .string()
      .nullable() // Permite valores nulos para evitar validaciones antes de seleccionar la imagen
      .test("is-valid-image", "Debes seleccionar una imagen", (value) => {
        return typeof value === "string" && value.startsWith("file://");
      }),
  });

  //conectar el schema con el form
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(arbitro),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    if (!image || typeof image !== "string" || !image.startsWith("file://")) {
      console.log("Error: No hay imagen seleccionada.");
      return Alert.alert("Error", "Debes seleccionar una imagen válida.");
    }

    await registrarArbitro(data, image);

    // const formData = new FormData();

    // // Agregar la imagen
    // formData.append("imagen", {
    //   uri: image,               // The URI of the image you picked
    //   name: "arbitro.jpeg",     // File name (make sure it's correct)
    //   type: "image/jpeg",       // MIME type of the image
    // });

    // // Agregar el JSON de los datos del árbitro como string
    // formData.append(
    //   "arbitro",
    //   JSON.stringify({
    //     email: data.email,
    //     password: data.pass,
    //     nombreCompleto: data.name,
    //   })
    // );

    // // Log the image URI and FormData for debugging
    // console.log("Image URI:", image);
    // console.log("FormData content:", formData);

    // setLoadArbit(true);

    // try {
    //   // Send the POST request
    //   const res = await api.post(`/api/arbitros`, formData, {
    //     headers: {
    //       // Remove the 'Content-Type' header - Axios will handle this automatically
    //       Authorization: `Bearer ${tokData}`,
    //     },
    //   });

    //   console.log(res.data);
    //   Alert.alert("Registro exitoso", `Árbitro ${data.name} registrado`);
    //   setFallo2("");
    // } catch (err) {
    //   console.log("Error:", err.message, err.toJSON());
    //   if (err.response) {
    //     console.log("Error Response:", err.response.data.message);
    //     setFallo2(err.response.data.message);
    //     return;
    //   }
    //   setFallo2("Ocurrió un error al registrar al árbitro, inténtalo nuevamente");
    // } finally {
    //   setLoadArbit(false);
    // }
  };

  useEffect(() => {
    console.log("Estado actualizado:", image);
  }, [image]);

  const registrarArbitro = async (data, image) => {
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
      const response = await axios.post("http://192.168.1.67:8080/api/arbitros", formData, {
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
          if (err.response.status === 403) {
            console.log("⚠️ Token expirado, redirigiendo a login...");
            Alert.alert(
              "Sesión expirada",
              "Por favor, inicia sesión nuevamente."
            );
            logout();
            return;
          }
          if (e.res.message) setFallo1(e.res.message);
          else setFallo1("Error al obtener árbitros");
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
      console.log("Imagen seleccionada:", imageUri); // Depuración
      setImage(imageUri);
      setForm({ ...form, imagen: imageUri });
      setValue("image", imageUri); // Actualiza react-hook-form
      trigger("image"); // Valida la imagen
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
      setForm({ ...form, imagen: imageUri });
      setValue("imagen", imageUri); // Actualiza react-hook-form
      trigger("imagen"); // Valida la imagen
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
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
                  ID
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
                  keyExtractor={(item) => item.id}
                  nestedScrollEnabled={true}
                  renderItem={({ item }) => (
                    <View style={styles.row}>
                      <Text
                        style={[
                          styles.cell,
                          styles.idHead,
                          FONTS.nunitoNegrita,
                        ]}
                      >
                        {item.id}
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
                      <TouchableOpacity
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
                      </TouchableOpacity>
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
                  {image && (
                    <Image
                      source={{
                        uri: value,
                      }}
                      style={styles.registerImage}
                    />
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
                <Ionicons name="camera" size={24} color={colores.blanco} />
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
            <Text
              style={[
                formStyle.errText,
                { color: "black", textAlign: "center", width: "100%" },
              ]}
            >
              Seleccionar foto
            </Text>
          </View>
          <View style={styles.formFields}>
            <Controller
              control={control}
              name="nombreCompleto"
              render={({ field: { onChange, value } }) => (
                <>
                  <TextInput
                    style={[styles.input, styles.inputError, FONTS.oswald]}
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
                    style={[styles.input, styles.inputError, FONTS.oswald]}
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
                    style={[styles.input, styles.inputError, FONTS.oswald]}
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
                style={[styles.registerButton, { opacity: isValid ? 1 : 0.5 }]}
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
      </ScrollView>
    </SafeAreaView>
  );
};

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
