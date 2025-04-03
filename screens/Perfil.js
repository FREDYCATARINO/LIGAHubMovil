import React, { useState, useEffect, useContext } from "react";
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
import { AuthContext } from "../context/AuthContext";
import { Card, Avatar } from "react-native-paper";

const PerfilScreen = ({ navigation, route }) => {
  const { logout, removeToken, removeUser } = useContext(AuthContext);
  const [color, setColor] = useState("");
  const [page, setPage] = useState("");
  const { usuario, rol, correo, img } = route.params || {};

  const getColor = () => {
    switch (rol) {
      case "Árbitro":
        setColor(colores.acento_3_1);
        setPage("Inicio");
        break;
      case "Dueño de equipos":
        setColor(colores.acento_2_2);
        setPage("Home");
        break;
      case "Administrador":
        setColor(colores.domin_1_1);
        setPage("Home");
        break;
      default:
        setColor(colores.base_1_5);
        break;
    }
  };

  useEffect(() => {
    getColor();
  }, [rol]);

  const [visible, setVisible] = useState(false);

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
                height: 175,
                backgroundColor: colores.base_1_1,
                resizeMode: "stretch",
              }}
            />
            {correo === "sistemaligafutleagueshub@gmail.com" || img === "" ? (
              <Avatar.Icon
                size={150}
                icon="account"
                style={{ backgroundColor: colores.domin_2_5, marginTop: -75 }}
                color={colores.domin_1_1}
              />
            ) : (
              <Avatar.Image
                size={150}
                source={{
                  uri: img,
                }}
                style={{
                  marginTop: -75,
                  //   width: 50,
                  //   height: 50,
                  //   backgroundColor: colores.base_1_1,
                  //   borderRadius: 100,
                  //   resizeMode: "stretch",
                }}
              />
            )}
            {/* <Image
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
            /> */}
            {correo === "sistemaligafutleagueshub@gmail.com" ||
            correo === "" ? null : (
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
            )}
          </View>
          <Text
            style={[FONTS.oswaldNegrita, { alignSelf: "center", fontSize: 25 }]}
          >
            {usuario}
          </Text>
          <Text style={[FONTS.oswald, { alignSelf: "center", fontSize: 25 }]}>
            Rol: <Text style={{ color: color }}>{rol}</Text>
          </Text>
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              gap: 10,
              justifyContent: "center",
              marginVertical: 10,
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: colores.domin_1_1,
                paddingVertical: 5,
                borderRadius: 5,
                width: "40%",
                alignSelf: "center",
                justifyContent: "center",
              }}
              onPress={() => /*navigation.navigate(page)*/ {
                setVisible(!visible);
              }}
            >
              <Text
                style={[
                  FONTS.oswald,
                  { color: colores.blanco, alignSelf: "center", fontSize: 20 },
                ]}
              >
                Editar perfil
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: colores.domin_1_1,
                paddingVertical: 5,
                borderRadius: 5,
                width: "40%",
                alignSelf: "center",
                justifyContent: "center",
              }}
              onPress={() => /*navigation.navigate(page)*/ {
                logout();
                removeToken();
                removeUser();
              }}
            >
              <Text
                style={[
                  FONTS.oswald,
                  { color: colores.blanco, alignSelf: "center", fontSize: 20 },
                ]}
              >
                Cerrar sesión
              </Text>
            </TouchableOpacity>
          </View>
          {visible && (
            <View style={stylesPerfil.form}>
              <Text style={[FONTS.oswald, { fontSize: 20 }]}>
                Datos personales
              </Text>
              <TextInput
                style={[
                  FONTS.oswald,
                  stylesPerfil.input,
                  { color: colores.domin_3_1, borderColor: colores.domin_3_1 },
                ]}
                placeholderTextColor={colores.domin_2_2}
                placeholder="Correo electrónico"
                value={correo}
                readOnly
              />
              {correo === "sistemaligafutleagueshub@gmail.com" ||
              correo === "" ? null : (
                <TextInput
                  style={[FONTS.oswald, stylesPerfil.input]}
                  placeholderTextColor={colores.domin_2_2}
                  placeholder="Nombre"
                  value={usuario}
                />
              )}
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
                style={{
                  backgroundColor: colores.base_3_1,
                  padding: 10,
                  borderRadius: 5,
                  width: "25%",
                }}
                onPress={() => alert("Guardado")}
              >
                <Text
                  style={[
                    FONTS.oswald,
                    { color: colores.blanco, alignSelf: "center" },
                  ]}
                >
                  Guardar
                </Text>
              </TouchableOpacity>
            </View>
          )}
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
