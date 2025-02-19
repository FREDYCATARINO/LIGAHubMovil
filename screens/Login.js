import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import logo from '../components/logo.png';
import styles from "../style/style";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleLogin = () => {
    console.log("Iniciando sesión con:", email, password);
  };

  return (
    <View style={styles.container}>
      <View style={styles.cardBody}>
        <Image source={logo} style={styles.logo} /> 
        <Text style={styles.title}>Iniciar sesión</Text>

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

        {/* Corrección aquí: pasar el nombre de la pantalla como string */}
        <TouchableOpacity onPress={() => navigation.navigate("RecuperarContra")}>
          <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>
        

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginText}>Iniciar sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={ () => navigation.navigate("RegistroDueño")} style={styles.regisButton}  >
        <MaterialCommunityIcons name="account-multiple-plus" size={20} color={"white"} />
        <Text style={styles.regisText}>Registrate</Text>
</TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;