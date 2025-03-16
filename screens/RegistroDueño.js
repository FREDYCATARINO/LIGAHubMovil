import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import RegistroLogo from '../assets/RegistroLogo.png';
import styles from "../style/style";
import FONTS from "../style/fonts";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleLogin = () => {
    console.log("Iniciando sesión con:", email, password);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style = {styles.cardHeader}>
        <Image source={RegistroLogo} style={styles.RegistroLogo} /> 
        <Text style = {[styles.loginText, FONTS.nunitoNegrita]} >Registro de dueños de equipos</Text>
        <Text style={[styles.regisText, FONTS.oswald, {textAlign: 'justify'}]}>Regístrate aquí, y registra a tu equipo posteriormente, espera la respuesta de los administradores para ingresar a tu equipo a los torneos de la liguilla.</Text>
        </View>
        <View style = {styles.cardBody}>
        <Text style={[styles.title, FONTS.nunitoNegrita]}>Registrate</Text>
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="account-outline" size={24} color="#667" />
          <TextInput
            style={[styles.input, FONTS.oswald]}
            placeholder="Nombre"
            keyboardType=""
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="email-outline" size={24} color="#667" />
          <TextInput
            style={[styles.input, FONTS.oswald]}
            placeholder="Correo electrónico"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View> 
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="lock-outline" size={24} color="#667" />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="lock-outline" size={24} color="#667" />
          <TextInput
            style={[styles.input, FONTS.oswald]}
            placeholder="Confirmar contraseña"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={[styles.loginText, FONTS.oswaldNegrita]}>Registrarse</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.forgotText, FONTS.oswald]}>Volver</Text>
        </TouchableOpacity>
        </View>

      </View>
    </View>
  );
};

export default RegisterScreen;