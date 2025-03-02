import React, { useState ,useContext} from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import logo from '../components/logo.png';
import styles from "../style/style";
import { AuthContext } from "../context/AuthContext";


const Login = ({navigation}) => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

        <TouchableOpacity onPress={() => navigation.navigate("RecuperarContra")}>
          <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        <TouchableOpacity
  style={styles.loginButton}
  onPress={() => login(email, password)} // Pasar email y password a login
>
  <Text style={styles.loginText}>Iniciar sesión</Text>
</TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("RegistroDueño")} style={styles.regisButton}>
          <MaterialCommunityIcons name="account-multiple-plus" size={20} color={"white"} />
          <Text style={styles.regisText}>Registrate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;