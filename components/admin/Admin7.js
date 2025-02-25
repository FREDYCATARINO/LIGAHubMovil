import React, { useState } from "react";
import {Text,TextInput,StyleSheet,SafeAreaView,ScrollView,View,TouchableOpacity,Image,} from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import FONTS from "../../style/fonts";
import { Picker } from "@react-native-picker/picker";

const Admin7 = ({ navigation }) => {
const [form, setForm] = useState({
    nombre: "",
    fechaInicio: new Date(),
    fechaFin: new Date(),
    maxEquipos: "",
    minEquipos: "",
    descripcion: "",
  });
  const [showInicio, setShowInicio] = useState(false);
  const [showFin, setShowFin] = useState(false);

  const onChangeFechaInicio = (event, selectedDate) => {
    setShowInicio(false); 
    if (selectedDate) {
      setForm({ ...form, fechaInicio: selectedDate });
    }
  };

  const onChangeFechaFin = (event, selectedDate) => {
    setShowFin(false);
    if (selectedDate) {
      setForm({ ...form, fechaFin: selectedDate });
    }
  };

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
        Convocatorias
      </Text>
        <Image source={require("../admin/Publicidad.png")} style={styles.banner} />
        <Text style={[FONTS.nunitoNegrita, styles.title2]}>Nueva convocatoria</Text>
        <View style={styles.formContainer}>
          <View style={styles.imageContainer}>
            <Image source={require("../admin/torneo.png")} style={styles.torneoImage} />
          </View>
          <View style={styles.formFields}>
            <View style={styles.row}>
              <TouchableOpacity onPress={() => setShowInicio(true)} style={styles.input}>
                <Text>{form.fechaInicio.toDateString()}</Text>
              </TouchableOpacity>
              {showInicio && (
                <DateTimePicker
                  value={form.fechaInicio}
                  mode="date"
                  display="default"
                  onChange={onChangeFechaInicio}
                  style={FONTS.oswald}
                />
              )}
              <TouchableOpacity onPress={() => setShowFin(true)} style={styles.input}>
                <Text>{form.fechaFin.toDateString()}</Text>
              </TouchableOpacity>
              {showFin && (
                <DateTimePicker
                  value={form.fechaFin}
                  mode="date"
                  display="default"
                  onChange={onChangeFechaFin}
                  style={FONTS.oswald}
                />
              )}
            </View>
            <View style={styles.row}>
              <TextInput
                style={[FONTS.oswald, styles.input]}
                placeholder="Nombre"
                value={form.nombre}
                onChangeText={(text) => setForm({ ...form, nombre: text })}
              />
            </View>
            <View style={styles.row}>
              <TextInput
                style={[FONTS.oswald, styles.input]}
                placeholder="Max. equipos"
                value={form.maxEquipos}
                onChangeText={(text) => setForm({ ...form, maxEquipos: text })}
              />
              <TextInput
                style={[FONTS.oswald, styles.input]}
                placeholder="Min. equipos"
                value={form.minEquipos}
                onChangeText={(text) => setForm({ ...form, minEquipos: text })}
              />
              <TouchableOpacity style={styles.imageUploadButton}>
                <Text style={[FONTS.oswald, styles.imageUploadText]}>Elegir imagen</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={[styles.input, styles.textArea, FONTS.oswald]}
              placeholder="Descripción"
              multiline
              numberOfLines={4}
              value={form.descripcion}
              onChangeText={(text) => setForm({ ...form, descripcion: text })}
            />
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.previewButton}>
            <Text style={[FONTS.oswaldNegrita, styles.buttonText]}>Previsualizar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.publishButton}>
            <Text style={[FONTS.oswaldNegrita, styles.buttonText]}>Publicar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  scrollContent: { flexGrow: 1, padding: 20 },
  title: { fontSize: 30, marginBottom: 20 },
  title2: { fontSize: 22, marginBottom: 20 },
  banner: { width: "100%", height: 100, resizeMode: "contain", marginBottom: 20 },
  formContainer: { 
    backgroundColor: "#fff", 
    padding: 10, 
    borderRadius: 10, 
    elevation: 3 
  },
  imageContainer: { 
    flex: 1, 
    alignItems: "center", 
    justifyContent: "center", 
    margin: 20
  },
  torneoImage: { width: 150, height: 200, resizeMode: "contain" },
  formFields: { flex: 2 },
  row: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 10 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "red",
    padding: 10,
    borderRadius: 5,
    margin: 5,
    backgroundColor: "#fff",
    textAlign: "center",
  },
  textArea: { height: 80, textAlignVertical: "top" },
  imageUploadButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
  },
  imageUploadText: { color: "#555" },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  previewButton: { backgroundColor: "#ffcc00", padding: 10, borderRadius: 5 },
  publishButton: { backgroundColor: "#d9534f", padding: 10, borderRadius: 5 },
  buttonText: { color: "#fff", textAlign: "center",},
});

export default Admin7;