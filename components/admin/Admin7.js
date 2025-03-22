import React, { useState } from "react";
import {
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
//import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Ionicons } from "@expo/vector-icons";
import FONTS from "../../style/fonts";
import { Picker } from "@react-native-picker/picker";
import formStyle from "../../style/formStyles";
import colores from "../../style/colors";

const Admin7 = ({ navigation }) => {
  const [form, setForm] = useState({
    nombre: "",
    fechaInicio: new Date(),
    maxEquipos: "",
    minEquipos: "",
    descripcion: "",
  });
  const [showInicio, setShowInicio] = useState(false);
  const [showFin, setShowFin] = useState(false);

  const [fechaInicio, setFechaInicio] = useState(new Date());

  const [show, setShow] = useState(false);

  const formatDate = (date) => {
    // Convierte la fecha en formato YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Asegura dos dígitos
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleConfirm = (date) => {
    const formattedDate = formatDate(date);
    //onChange(formattedDate); // Actualiza el valor del formulario con formato YYYY-MM-DD
    setShow(false); // Cierra el modal
    setFechaInicio(formattedDate)
  };

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
        <Image
          source={require("../admin/Publicidad.png")}
          style={styles.banner}
        />
        <Text style={[FONTS.nunitoNegrita, styles.title2]}>
          Nueva convocatoria
        </Text>
        <View style={styles.formContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={require("../admin/torneo.png")}
              style={styles.torneoImage}
            />
          </View>
          <View style={styles.formFields}>
            <View style={styles.row}>
              <View style={{ flexDirection: "row", width: "100%", gap: 5 }}>
                <TouchableOpacity
                  style={[
                    {
                      backgroundColor: colores.domin_2_2,
                      borderRadius: 5,
                      width: "19%",
                      alignItems: "center",
                      justifyContent: "center",
                    },
                  ]}
                  onPress={() => setShow(true)}
                >
                  <Ionicons name="calendar" size={24} color={"white"} />
                </TouchableOpacity>

                <View style={{ flexDirection: "column", width: "79%" }}>
                  <TextInput
                    placeholder="Seleccionar fecha"
                    placeholderTextColor={colores.domin_2_2}
                    value={fechaInicio}
                    style={[styles.input]}
                  />

                  {/* {errors.fechaInicio && (
                    <Text style={[formStyle.errText]}>
                      {errors.fechaInicio.message}
                    </Text>
                  )} */}
                </View>

                <DateTimePickerModal
                  isVisible={show}
                  mode="date"
                  themeVariant="dark" // Usa el tema oscuro en iOS
                  accentColor={colores.domin_1_1}
                  textColor={colores.domin_1_1}
                  onConfirm={(date) => handleConfirm(date)}
                  onCancel={() => setShow(false)}
                />
              </View>
            </View>
            <View style={styles.row}>
              <TextInput
                style={[FONTS.oswald, styles.input, {width: '100%'}]}
                placeholder="Nombre"
                value={form.nombre}
                placeholderTextColor={colores.domin_2_2}
                onChangeText={(text) => setForm({ ...form, nombre: text })}
              />
            </View>
            <View style={[styles.row, {gap:2}]}>
              <TextInput
                style={[FONTS.oswald, styles.input]}
                placeholder="Max. equipos"
                value={form.maxEquipos}
                placeholderTextColor={colores.domin_2_2}
                onChangeText={(text) => setForm({ ...form, maxEquipos: text })}
              />
              <TextInput
                style={[FONTS.oswald, styles.input]}
                placeholder="Min. equipos"
                value={form.minEquipos}
                placeholderTextColor={colores.domin_2_2}
                onChangeText={(text) => setForm({ ...form, minEquipos: text })}
              />
              <TouchableOpacity style={styles.imageUploadButton}>
                <Text style={[FONTS.oswald, styles.imageUploadText]}>
                  Elegir imagen
                </Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={[styles.input, FONTS.oswald]}
              placeholder="Descripción"
              multiline
              numberOfLines={4}
              value={form.descripcion}
              placeholderTextColor={colores.domin_2_2}
              onChangeText={(text) => setForm({ ...form, descripcion: text })}
            />
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.previewButton}>
            <Text style={[FONTS.oswaldNegrita, styles.buttonText]}>
              Previsualizar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.publishButton}>
            <Text style={[FONTS.oswaldNegrita, styles.buttonText]}>
              Publicar
            </Text>
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
  banner: {
    width: "100%",
    height: 100,
    resizeMode: "contain",
    marginBottom: 20,
  },
  formContainer: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    elevation: 3,
  },
  imageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
  },
  torneoImage: { width: 150, height: 200, resizeMode: "contain" },
  formFields: { flex: 2 },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  input: {
    borderColor: colores.domin_2_2,
    borderWidth: 3,
    borderRadius: 5,
    fontFamily: "Oswald_400Regular",
    color: colores.negro,
    backgroundColor: colores.base_2_5,
  },
  textArea: { height: 80, textAlignVertical: "top" },
  imageUploadButton: {
    flex: 1,
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colores.domin_2_2,
    borderRadius: 5,
  },
  imageUploadText: { color: "white" },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  previewButton: { backgroundColor: colores.acento_4_1, padding: 10, borderRadius: 5 },
  publishButton: { backgroundColor: colores.domin_2_5, padding: 10, borderRadius: 5 },
  buttonText: { color: "#fff", textAlign: "center" },
});

export default Admin7;
