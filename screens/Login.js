import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Modal,
  Button,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import logo from "../components/logo.png";
import styles from "../style/style";
import { AuthContext } from "../context/AuthContext";
import colores from "../style/colors";
import FONTS from "../style/fonts";
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

const Login = ({ navigation }) => {
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
  const {
    login,
    isLoading,
    setIsLoading,
    failure,
    saveToken,
    getToken,
    removeToken,
    mensaje,
    setFailure
  } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (failure) {
      setModalVisible(true);
    } else {
      setModalVisible(false);
    }
  }, [failure]); // Se ejecuta cada vez que `failure` cambia

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

  return (
    <View style={styles.container}>
      <View style={[styles.cardBody, {gap: -2}]}>
        <Image source={logo} style={styles.logo} />
        <Text style={[styles.title, FONTS.nunitoNegrita]}>Iniciar sesión</Text>

        <View style={styles.inputContainer}>
          <MaterialCommunityIcons
            name="email-outline"
            size={24}
            color="#333333"
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
            color="#333333"
          />
          <TextInput
            style={[styles.input, FONTS.oswald]}
            placeholder="Contraseña"
            secureTextEntry
            value={password}
            keyboardType="password"
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate("RecuperarContra")}
        >
          <Text style={[styles.forgotText, FONTS.oswald]}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        {isLoading ? (
          <ActivityIndicator size="large" color={colores.domin_1_5} />
        ) : (
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => login(email, password)} // Pasar email y password a login
          >
            <Text style={[styles.loginText, FONTS.oswaldNegrita]}>Iniciar sesión</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() => navigation.navigate("RegistroDueño")}
          style={styles.regisButton}
        >
          <MaterialCommunityIcons
            name="account-multiple-plus"
            size={20}
            color={"white"}
          />
          <Text style={[styles.regisText, FONTS.nunito]}>Registrate</Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="fade" // Animación del modal (puede ser 'fade', 'slide', o 'none')
        transparent={true} // Hace que el fondo sea transparente
        visible={modalVisible} // El Modal solo se muestra si modalVisible es true
        onRequestClose={() => {setModalVisible(false); setFailure(false)}} // Cierra el modal al presionar el botón de retroceso en Android
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
            <Text style={[{ fontSize: 25 }, FONTS.oswaldNegrita]}>¡ERROR!</Text>
            <Text style={[{ fontSize: 20 }, FONTS.oswald]}>
              {mensaje === "" || mensaje === undefined
                ? "Algo salió mal, intentalo nuevamente"
                : mensaje}
            </Text>
            <TouchableOpacity
              title="Cerrar Modal"
              style={[styles.loginButton, { width: "50%" }]}
              onPress={() => {setModalVisible(false); setFailure(false)}}
            >
              <Text style={[styles.loginText, FONTS.oswaldNegrita]}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Login;
