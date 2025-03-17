import React, { useState, useEffect } from "react";
import {
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FONTS from "../../style/fonts";
import colores from "../../style/colors";

import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../config/api";

const { width } = Dimensions.get("window");

const Admin5 = ({ navigation }) => {
  const [form, setForm] = useState({ nombre: "", correo: "", contrasena: "" });
  const { getUserId, getUserRole, getToken } = useContext(AuthContext);
  const [tokData, setTokData] = useState("");
  const [arbitros, setArbitros] = useState([]);
  const [loadArb, setLoadArb] = useState(false);
  const [fallo1, setFallo1] = useState("");

  const [arbitro, setArbitro] = useState({});
  const [loadArbit, setLoadArbit] = useState(false);
  const [fallo2, setFallo3] = useState("");

  useEffect(() => {
    const getAbritros = async () => {
      const id = await getUserRole();
      const rolo = await getUserId();
      const tok = await getToken();
      setTokData(tok);

      setLoadArb(true);
      api
        .get(`/api/arbitros`, {
          headers: {
            Authorization: `Bearer ${tok}`,
          },
        })
        .then((res) => {
          if (res.data.length === 0) setFallo1("No hay 'arbitros registrados");
          else setArbitros(res.data);
        })
        .catch((e) => {
          console.error(e, e.res.message);
          if (e.res.message) setFallo1(e.res.message);
          else setFallo1("Error al obtener árbitros");
        })
        .finally(() => setLoadArb(false));
    };
    getAbritros();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text
          style={[
            styles.title,
            FONTS.nunitoNegrita,
            {
              paddingVertical: 15,
              paddingHorizontal: 5,
              alignSelf: "flex-start",
            },
          ]}
        >
          Árbitros
        </Text>
        {/* <View style={styles.cardContainer}>
          {arbitros.map((arbitro, index) => (
            <View key={index} style={styles.card}>
              <Image
                source={{
                  uri: "https://th.bing.com/th/id/OIP._UyGdulfXcXluqK6G5I9JgAAAA?w=148&h=166&c=7&pcl=1b1a19&r=0&o=5&dpr=1.5&pid=1.7",
                }}
                style={styles.image}
              />
              <View style={styles.cardContent}>
                <Text style={[FONTS.oswaldNegrita, styles.name]}>
                  {arbitro.nombre}
                </Text>
                <Text style={[FONTS.oswald, styles.email]}>
                  {arbitro.email}
                </Text>
                <Text style={[FONTS.oswald, styles.matches]}>
                  Partidos pitados: {arbitro.partidos}
                </Text>
                <TouchableOpacity style={styles.optionsButton}>
                  <Text style={[FONTS.oswald, styles.buttonText]}>
                    Opciones
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View> */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: "center",
            justifyContent: "center",
          }}
          style={{ maxHeight: 250 }}
        >
          {loadArb ? (
            <View style={{ alignItems: "center", justifyContent: "center", width: '100%', height: '100%'}}>
              <ActivityIndicator
                size="large"
                color={colores.domin_1_1}
              />
            </View>
          ) : fallo1 === "" ? (
            <View style={styles.table}>
              {/* Encabezado de la tabla */}
              <View style={styles.headerRow}>
                <Text
                  style={[
                    styles.headerCell,
                    styles.idCell,
                    FONTS.oswaldNegrita,
                  ]}
                >
                  ID
                </Text>
                <Text style={[styles.headerCell, FONTS.oswaldNegrita]}>
                  Nombre Completo
                </Text>
                <Text style={[styles.headerCell, FONTS.oswaldNegrita]}>
                  Correo electrónico
                </Text>
                <Text
                  style={[
                    styles.headerCell,
                    styles.partidoCell,
                    FONTS.oswaldNegrita,
                  ]}
                >
                  Partidos
                </Text>
                <Text
                  style={[
                    styles.headerCell,
                    styles.buttonCell,
                    FONTS.oswaldNegrita,
                    { width: 80 },
                  ]}
                >
                  Eliminar
                </Text>
              </View>

              <View style={{ maxHeight: 250, padding: 5 }}>
                <FlatList
                  data={arbitros}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <View style={styles.row}>
                      <Text
                        style={[
                          styles.cell,
                          styles.idHead,
                          FONTS.nunitoNegrita,
                        ]}
                      >
                        {item.id}
                      </Text>
                      <Text style={[styles.cell, FONTS.nunitoNegrita]}>
                        {item.nombreCompleto}
                      </Text>
                      <Text style={[styles.cell, FONTS.nunitoNegrita]}>
                        {item.usuario.email}
                      </Text>
                      <Text
                        style={[
                          styles.cell,
                          styles.partidoHead,
                          FONTS.nunitoNegrita,
                        ]}
                      >
                        N/A
                      </Text>
                      <TouchableOpacity
                        style={[
                          styles.button,
                          styles.deleteButton,
                          styles.buttonHead,
                        ]}
                      >
                        <Ionicons
                          name="trash"
                          size={24}
                          color={colores.blanco}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                />
              </View>
            </View>
          ) : (
            <Text
              style={[FONTS.oswald, styles.errMessCenter, { marginTop: 10 }]}
            >
              {fallo1}
            </Text>
          )}
        </ScrollView>
        <Text style={[FONTS.nunitoNegrita, styles.registerTitle]}>
          Registrar árbitro
        </Text>
        <View style={styles.formContainer}>
          <Image
            source={{
              uri: "https://th.bing.com/th/id/OIP._UyGdulfXcXluqK6G5I9JgAAAA?w=148&h=166&c=7&pcl=1b1a19&r=0&o=5&dpr=1.5&pid=1.7",
            }}
            style={styles.registerImage}
          />
          <View style={styles.formFields}>
            <TextInput
              style={[styles.input, styles.inputError, FONTS.oswald]}
              placeholder="Nombre completo"
              placeholderTextColor={colores.domin_2_2}
              value={form.nombre}
              onChangeText={(text) => setForm({ ...form, nombre: text })}
            />
            <TextInput
              style={[styles.input, styles.inputError, FONTS.oswald]}
              placeholder="Correo electrónico"
              placeholderTextColor={colores.domin_2_2}
              value={form.correo}
              onChangeText={(text) => setForm({ ...form, correo: text })}
            />
            <TextInput
              style={[styles.input, styles.inputError, FONTS.oswald]}
              placeholder="Contraseña"
              placeholderTextColor={colores.domin_2_2}
              secureTextEntry
              value={form.contrasena}
              onChangeText={(text) => setForm({ ...form, contrasena: text })}
            />
            <TouchableOpacity style={styles.registerButton}>
              <Text style={[FONTS.oswald, styles.registerButtonText]}>
                Registrar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 10,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    alignItems: "flex-start",
    marginBlock: 5,
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    width: width * 0.4,
    alignItems: "center",
    textAlign: "center",
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  cardContent: {
    alignItems: "center",
    marginTop: 10,
    flexGrow: 1,
  },
  name: {
    fontSize: 16,
    flexShrink: 1,
  },
  email: {
    fontSize: 12,
    color: "gray",
    textAlign: "center",
    flexShrink: 1,
  },
  matches: {
    fontSize: 14,
    marginVertical: 5,
    flexShrink: 1,
  },
  optionsButton: {
    backgroundColor: colores.domin_2_1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 14,
    color: colores.blanco,
  },
  registerTitle: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  formContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: width * 0.9,
    paddingVertical: 10,
  },
  registerImage: {
    width: 120,
    height: 120,
    marginRight: 15,
  },
  formFields: {
    flex: 1,
  },
  input: {
    borderColor: colores.domin_2_2,
    borderWidth: 3,
    borderRadius: 5,
    fontFamily: "Oswald_400Regular",
    color: colores.negro,
    backgroundColor: colores.base_2_5,
    marginVertical: 3,
  },
  inputError: {
    borderColor: "red",
  },
  registerButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  registerButtonText: {
    color: "white",
  },

  table: {
    flex: 1,
    backgroundColor: colores.blanco,
    marginBottom: 10,
    width: 600,
    borderRadius: 5,
  },

  headerRow: {
    flexDirection: "row",
    backgroundColor: colores.domin_2_2,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
  },
  headerCell: {
    flex: 1,
    textAlign: "left",
    paddingHorizontal: 10,
    color: "white",
  },
  idCell: { maxWidth: 35 },
  idHead: { maxWidth: 30 },
  partidoHead: { maxWidth: 75 },
  partidoCell: { maxWidth: 75 },
  buttonCell: { maxWidth: 100 },
  buttonHead: { maxWidth: 80, alignItems: "center" },

  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    padding: 10,
    alignItems: "center",
    borderBottomColor: colores.base_2_4,
  },
  cell: { flex: 1, textAlign: "left", paddingHorizontal: 10 },

  button: {
    flex: 1,
    padding: 5,
    backgroundColor: colores.acento_3_1,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: "center",
  },
  buttonText: { textAlign: "center" },

  editButton: { backgroundColor: colores.acento_2_3 },
  deleteButton: { backgroundColor: colores.domin_2_2 },
});

export default Admin5;
