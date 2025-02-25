import React, { useState } from "react";
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
} from "react-native";
import FONTS from "../../style/fonts";
import colores from "../../style/colors";

const { width } = Dimensions.get("window");

const Admin5 = ({ navigation }) => {
  const [form, setForm] = useState({ nombre: "", correo: "", contrasena: "" });

  const arbitros = [
    { nombre: "Luis García", email: "lusitogar@gmail.com", partidos: 9 },
    { nombre: "Lalo Garza", email: "garzale@gmail.com", partidos: 2 },
    {
      nombre: "Mike Wazowski",
      email: "mikeelpapelon@hotmail.com",
      partidos: 24,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text
          style={[
            styles.title,
            FONTS.nunitoNegrita,
            { paddingVertical: 15, paddingHorizontal: 5, alignSelf: 'flex-start' },
          ]}
        >
          Árbitros
        </Text>
        <View style={styles.cardContainer}>
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
        </View>
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
              value={form.nombre}
              onChangeText={(text) => setForm({ ...form, nombre: text })}
            />
            <TextInput
              style={[styles.input, styles.inputError, FONTS.oswald]}
              placeholder="Correo electrónico"
              value={form.correo}
              onChangeText={(text) => setForm({ ...form, correo: text })}
            />
            <TextInput
              style={[styles.input, styles.inputError, FONTS.oswald]}
              placeholder="Contraseña"
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
    color: colores.blanco
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
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "white",
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
    fontWeight: "bold",
  },
});

export default Admin5;
