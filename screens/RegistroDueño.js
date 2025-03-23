import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  StyleSheet,
} from "react-native";
import { Alert } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import RegistroLogo from "../assets/RegistroLogo.png";
import styles from "../style/style";
import FONTS from "../style/fonts";
import { Card, Avatar } from "react-native-paper";
import colores from "../style/colors";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const [foto, setFoto] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const handleLogin = () => {
    console.log("Iniciando sesión con:", email, password);
  };

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
      setFoto(imageUri);
      setModalVisible(false);
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
      setFoto(imageUri);
      setModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View
            style={{ width: "100%", alignItems: "center", marginBottom: 5 }}
          >
            {foto !== "" ? (
              <Avatar.Image
                size={100}
                source={{uri: foto}}
                style={{
                  borderColor: colores.base_3_5,
                }}
                color={colores.base_3_5}
              />
            ) : (
              <Avatar.Icon
                size={100}
                icon="account"
                style={{
                  backgroundColor: colores.base_1_1,
                  borderColor: colores.base_3_5,
                  borderWidth: 2,
                }}
                color={colores.base_3_5}
              />
            )}
            <TouchableOpacity
              style={{
                padding: 10,
                backgroundColor: colores.acento_1_2,
                borderRadius: 50,
                marginLeft: 60,
                marginTop: -45,
              }}
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="images" size={25} color={colores.blanco} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.loginText, FONTS.nunitoNegrita]}>
            Registro de dueños de equipos
          </Text>
          <Text
            style={[styles.regisText, FONTS.oswald, { textAlign: "justify" }]}
          >
            Regístrate aquí, y registra a tu equipo posteriormente, espera la
            respuesta de los administradores para ingresar a tu equipo a los
            torneos de la liguilla.
          </Text>
        </View>
        <View style={styles.cardBody}>
          <Text style={[styles.title, FONTS.nunitoNegrita]}>Registrate</Text>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="account-outline"
              size={24}
              color="#667"
            />
            <TextInput
              style={[styles.input, FONTS.oswald]}
              placeholder="Nombre"
              keyboardType=""
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="email-outline"
              size={24}
              color="#667"
            />
            <TextInput
              style={[styles.input, FONTS.oswald]}
              placeholder="Correo electrónico"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="lock-outline"
              size={24}
              color="#667"
            />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="lock-outline"
              size={24}
              color="#667"
            />
            <TextInput
              style={[styles.input, FONTS.oswald]}
              placeholder="Confirmar contraseña"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={[styles.loginText, FONTS.oswaldNegrita]}>
              Registrarse
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={[styles.forgotText, FONTS.oswald]}>Volver</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={stylesSignup.modalContainer}>
          <View style={stylesSignup.modalContent}>
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
            <Ionicons name="person-add" size={36} color={colores.acento_2_3} />
            <Text style={[stylesSignup.modalTitle, FONTS.oswaldNegrita]}>
              Nueva foto de perfil
            </Text>
            <TouchableOpacity
              style={[
                stylesSignup.modalItem,
                FONTS.oswald,
                //isPressed1 && stylesSignup.modalItemActive,
              ]}
              onPress={async () => openGallery()}
            >
              <Text
                style={[
                  FONTS.oswald,
                  //isPressed1 && { opacity: 1, color: colores.acento_2_4 },
                ]}
              >
                Desde la galería
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                stylesSignup.modalItem,
                FONTS.oswald,
                //isPressed2 && stylesSignup.modalItemActive,
              ]}
              onPress={async () => openCamera()}
            >
              <Text
                style={[
                  FONTS.oswald,
                  //isPressed2 && { opacity: 1, color: colores.acento_2_4 },
                ]}
              >
                Desde la camara
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const stylesSignup = StyleSheet.create({
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

export default RegisterScreen;
