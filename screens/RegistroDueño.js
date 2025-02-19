import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import RegistroLogo from '../assets/RegistroLogo.png';
import styles from "../style/style";

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
        <Text style = {styles.loginText} >Registro de dueños de equipos</Text>
        <Text style={styles.regisText}>Regístrate aquí, y registra a tu equipo posteriormente, espera la respuesta de los administradores para ingresar a tu equipo a los torneos de la liguilla.</Text>
        </View>
        <View style = {styles.cardBody}>
        <Text style={styles.title}>Registrate</Text>
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="create" size={24} color="#666" />
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            keyboardType=""
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="auto-fix-normal" size={24} color="#666" />
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="email-outline" size={24} color="#666" />
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View> 
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="lock-outline" size={24} color="#666" />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="lock-outline" size={24} color="#666" />
          <TextInput
            style={styles.input}
            placeholder="Confirmare contraseña"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginText}>Registrarse</Text>
        </TouchableOpacity>

        </View>

      </View>
    </View>
  );
};

export default RegisterScreen;