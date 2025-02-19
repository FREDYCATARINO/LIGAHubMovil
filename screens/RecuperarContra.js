import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import styles from "../style/style";

// Usa require() si es una imagen local
const imgRecuContra = require("../assets/RecuperarContra.png");

const RecuperarContra = () => {
  const [email, setEmail] = useState("");
  const navigation = useNavigation();

  const handleRecovery = () => {
    console.log("Solicitando recuperación para:", email);
    // Aquí puedes agregar la lógica para enviar el correo de recuperación
  };

  return (
    <View style={styles.container}>
      <View style={styles.cardBody}>
        {/* Título */}
        <Text style={styles.title}>¿Olvidaste tu contraseña?</Text>

        {/* Texto descriptivo */}
        <Text style={styles.TextField}>
          Lo entendemos, las cosas pasan. Simplemente ingresa tu dirección de correo electrónico a continuación y te enviaremos un enlace para restablecer tu contraseña.
        </Text>

        {/* Imagen corregida */}
        <Image source={imgRecuContra} style={styles.RecuperarContra} />

        {/* Input con ícono */}
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons
            name="email-outline"
            size={24}
            color="#666"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Botón de enviar enlace */}
        <TouchableOpacity style={styles.button} onPress={handleRecovery}>
          <Text style={styles.buttonText}>Enviar enlace de recuperación</Text>
        </TouchableOpacity>

        {/* Enlace para volver al inicio de sesión */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.forgotText}>Volver al inicio de sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RecuperarContra;
