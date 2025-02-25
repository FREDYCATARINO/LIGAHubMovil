import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Image,
  TextInput,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import colores from "../style/colors";
import FONTS from "../style/fonts";
import Arbitro1 from "../components/arbitro/Arbitro1";
import { Button } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";

const PerfilScreen = ({ navigation, route }) => {
  const [color, setColor] = useState('')
  const { usuario, rol } = route.params || {}; 

  const getColor = () => {
    switch (rol) {
      case "Árbitro": setColor(colores.acento_3_1); break;
      case "Dueño": setColor(colores.acento_2_2); break;
      case "Admin": setColor(colores.domin_1_1); break;
      default: setColor(colores.base_1_5); break;
    }
  }

  useEffect(() => {
    getColor();
  }, [rol]);

  return (
    <GestureHandlerRootView>
      <SafeAreaView>
        <ScrollView style={{ marginBottom: 20 }}>
          <View
            style={{ width: "100%", alignItems: "center", marginBottom: 5 }}
          >
            <Image
              source={{
                uri: "https://st4.depositphotos.com/11634452/24646/i/950/depositphotos_246465640-stock-photo-football-field-soccer-field-background.jpg",
              }}
              style={{
                width: "100%",
                height: 150,
                backgroundColor: colores.base_1_1,
                resizeMode: "stretch",
              }}
            />
            <Image
              source={{
                uri: "https://th.bing.com/th/id/OIP.SVo8-p3WhGOnngP6K6tBsAHaKc?w=115&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7",
              }}
              style={{
                width: 150,
                height: 150,
                backgroundColor: colores.base_1_1,
                borderRadius: 100,
                resizeMode: "stretch",
                marginTop: -75,
              }}
            />
            <TouchableOpacity
              style={{
                padding: 15,
                backgroundColor: colores.acento_1_2,
                borderRadius: 25,
                marginLeft: 90,
                marginTop: -60,
              }}
            >
              <Ionicons name="image" size={30} color={colores.blanco} />
            </TouchableOpacity>
          </View>
          <Text
            style={[FONTS.oswaldNegrita, { alignSelf: "center", fontSize: 25 }]}
          >
            {usuario}
          </Text>
          <Text style={[FONTS.oswald, { alignSelf: "center", fontSize: 25 }]}>
            Rol: <Text style={{ color: color }}>{rol}</Text>
          </Text>
          <View style={stylesPerfil.form}>
            <Text style={[FONTS.oswald, { fontSize: 20 }]}>
              Datos personales
            </Text>
            <TextInput
              style={[FONTS.oswald, stylesPerfil.input]}
              placeholderTextColor={colores.domin_2_2}
              placeholder="Correo electrónico"
              readOnly
            />
            <TextInput
              style={[FONTS.oswald, stylesPerfil.input]}
              placeholderTextColor={colores.domin_2_2}
              placeholder="Nombre"
            />
            <Text style={[FONTS.oswald, { fontSize: 20 }]}>
              Cambiar contraseña
            </Text>
            <TextInput
              style={[FONTS.oswald, stylesPerfil.input]}
              placeholderTextColor={colores.domin_2_2}
              placeholder="Contraseña Actual"
            />
            <TextInput
              style={[FONTS.oswald, stylesPerfil.input]}
              placeholderTextColor={colores.domin_2_2}
              placeholder="Nueva contraseña"
            />
            <TextInput
              style={[FONTS.oswald, stylesPerfil.input]}
              placeholderTextColor={colores.domin_2_2}
              placeholder="Confirmar contraseña"
            />
            <TouchableOpacity
              style={{ backgroundColor: colores.base_3_1, padding: 10, borderRadius: 5, width: '25%'}}
              onPress={() => alert("Guardado")}
            >
              <Text style={[FONTS.oswald, {color: colores.blanco, alignSelf: 'center'}]}>Guardar</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={{ backgroundColor: colores.domin_1_1, paddingVertical: 10, borderRadius: 5, width: '90%', alignSelf: 'center', justifyContent: 'center'}}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={[FONTS.oswald, {color: colores.blanco, alignSelf: 'center', fontSize: 20}]}>Volver</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const stylesPerfil = StyleSheet.create({
  input: {
    borderColor: colores.domin_2_2,
    borderWidth: 3,
    borderRadius: 5,
    color: colores.negro,
    backgroundColor: colores.base_2_5,
    justifyContent: "center",
    paddingLeft: 10,
  },
  form: {
    padding: 10,
    paddingVertical: 15,
    gap: 5,
    backgroundColor: colores.blanco,
    marginVertical: 5,
  },
});

export default PerfilScreen;
