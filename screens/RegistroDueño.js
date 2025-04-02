import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
  ActivityIndicator,
  StyleSheet
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from 'expo-file-system';
import { Avatar } from "react-native-paper";
import RegistroLogo from "../assets/RegistroLogo.png";
import styles from "../style/style";
import FONTS from "../style/fonts";
import colores from "../style/colors";
import api from "../config/api";

const RegisterScreen = () => {
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [fotoUri, setFotoUri] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  // Funciones para manejar imágenes
  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso denegado", "Necesitas permitir el acceso a la cámara.");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setFotoUri(result.assets[0].uri);
      setModalVisible(false);
    }
  };

  const openGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso denegado", "Necesitas permitir el acceso a la galería.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setFotoUri(result.assets[0].uri);
      setModalVisible(false);
    }
  };

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleRegister = async () => {
    try {
      setIsLoading(true);
      
      // Validación de campos
      const errors = [];
      if (!formData.nombreCompleto?.trim()) errors.push('Nombre completo requerido');
      if (!formData.email?.trim()) errors.push('Correo electrónico requerido');
      if (!formData.password?.trim()) errors.push('Contraseña requerida');
      if (formData.password !== formData.confirmPassword) errors.push('Las contraseñas no coinciden');
      if (!fotoUri) errors.push('Imagen de perfil requerida');
  
      if (errors.length > 0) {
        throw new Error(errors.join('\n'));
      }
  
      // Convertir imagen a base64
      const base64Image = await FileSystem.readAsStringAsync(fotoUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
  
      // Preparar datos según el DTO del backend
      const requestData = {
        email: formData.email.trim(),
        password: formData.password.trim(),
        nombreCompleto: formData.nombreCompleto.trim(),
        imagen: `data:image/jpeg;base64,${base64Image}` // Formato data URI
      };
  
      // Enviar petición
      const response = await api.post('/api/duenos/movil', requestData, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });
  
      // Manejar respuesta exitosa
      if (response.data) {
        const { id, nombreCompleto, usuario } = response.data;
        
        Alert.alert(
          'Registro exitoso',
          `Dueño registrado correctamente:\n\n` +
          `ID: ${id}\n` +
          `Nombre: ${nombreCompleto}\n` +
          `Email: ${usuario.email}\n` +
          `Estado: ${usuario.estatus === 1 ? 'Activo' : 'Pendiente de aprobación'}`
        );
        
        navigation.goBack();
      } else {
        throw new Error('Respuesta inesperada del servidor');
      }
  
    } catch (error) {
      console.error('Error en registro:', {
        error: error.response?.data || error.message,
        requestData: {
          email: formData.email,
          nombre: formData.nombreCompleto
        },
        stack: error.stack
      });
  
      let errorMessage = 'Error al registrar: ';
      
      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage += 'Datos inválidos o incompletos';
            break;
          case 409:
            errorMessage += 'El correo electrónico ya está registrado';
            break;
          case 413:
            errorMessage += 'La imagen es demasiado grande';
            break;
          case 500:
            errorMessage += 'Error interno del servidor';
            break;
          default:
            errorMessage += `Error del servidor (${error.response.status})`;
        }
        
        // Agregar mensaje específico del backend si existe
        if (error.response.data.message) {
          errorMessage += `\n${error.response.data.message}`;
        }
      } else if (error.message.includes('timeout')) {
        errorMessage += 'Tiempo de espera agotado. Verifica tu conexión';
      } else {
        errorMessage += error.message || 'Error de conexión';
      }
  
      Alert.alert('Error en el registro', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={{ width: "100%", alignItems: "center", marginBottom: 5 }}>
            {fotoUri ? (
              <Avatar.Image
                size={100}
                source={{ uri: fotoUri }}
                style={{ borderColor: colores.base_3_5 }}
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
              disabled={isLoading}
            >
              <Ionicons name="images" size={25} color={colores.blanco} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.loginText, FONTS.nunitoNegrita]}>
            Registro de dueños de equipos
          </Text>
          <Text style={[styles.regisText, FONTS.oswald, { textAlign: "justify" }]}>
            Regístrate aquí, y registra a tu equipo posteriormente, espera la
            respuesta de los administradores para ingresar a tu equipo a los
            torneos de la liguilla.
          </Text>
        </View>

        <View style={styles.cardBody}>
          <Text style={[styles.title, FONTS.nunitoNegrita]}>Registrate</Text>
          
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="account-outline" size={24} color="#667" />
            <TextInput
              style={[styles.input, FONTS.oswald]}
              placeholder="Nombre completo"
              value={formData.nombreCompleto}
              onChangeText={(text) => handleChange('nombreCompleto', text)}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="email-outline" size={24} color="#667" />
            <TextInput
              style={[styles.input, FONTS.oswald]}
              placeholder="Correo electrónico"
              keyboardType="email-address"
              value={formData.email}
              onChangeText={(text) => handleChange('email', text)}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="lock-outline" size={24} color="#667" />
            <TextInput
              style={[styles.input, FONTS.oswald]}
              placeholder="Contraseña"
              secureTextEntry
              value={formData.password}
              onChangeText={(text) => handleChange('password', text)}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="lock-outline" size={24} color="#667" />
            <TextInput
              style={[styles.input, FONTS.oswald]}
              placeholder="Confirmar contraseña"
              secureTextEntry
              value={formData.confirmPassword}
              onChangeText={(text) => handleChange('confirmPassword', text)}
            />
          </View>
          
          <TouchableOpacity 
            style={[styles.loginButton, isLoading && { opacity: 0.7 }]} 
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={[styles.loginText, FONTS.oswaldNegrita]}>Registrarse</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => navigation.goBack()} disabled={isLoading}>
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
