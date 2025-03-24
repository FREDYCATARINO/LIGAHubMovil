import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import FONTS from "../../style/fonts";
import colores from "../../style/colors";

const Admin6 = ({ navigation }) => {
  const [tipoPago, setTipoPago] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [torneoFiltro, setTorneoFiltro] = useState("");
  const [equipoFiltro, setEquipoFiltro] = useState("");
  const [pagos, setPagos] = useState([]);
  const [loadPagos, setLoadPagos] = useState(false);
  const [fallo, setFallo] = useState("");

  const listaPagos = [
    {
      id: 37,
      tipoPago: "Inscripción",
      descripcion: "Inscripción Torneo Sub-12 Finalizado",
      monto: 850.0,
      fechaPago: null,
      fechaLimitePago: "2024-12-11",
      estatusPago: false,
      equipo: { id: 4, nombreEquipo: "Real Madrid Sub-12" },
    },
    {
      id: 38,
      tipoPago: "Inscripción",
      descripcion: "Inscripción Torneo Sub-12 Finalizado",
      monto: 850.0,
      fechaPago: null,
      fechaLimitePago: "2024-12-11",
      estatusPago: false,
      equipo: { id: 4, nombreEquipo: "Real Madrid Sub-12" },
    },
  ];

  // Extraer torneos únicos de la lista de pagos
  const torneosUnicos = [
    ...new Set(listaPagos.map((pago) => pago.descripcion)),
  ];

  // Extraer equipos únicos de la lista de pagos
  const equiposUnicos = [
    ...new Set(listaPagos.map((pago) => pago.equipo.nombreEquipo)),
  ];

  // Filtrado de pagos según selecciones
  const pagosFiltrados = listaPagos.filter((pago) => {
    return (
      (!tipoPago || pago.tipoPago === tipoPago) &&
      (!estadoFiltro ||
        (estadoFiltro === "Pagado" && pago.estatusPago) ||
        (estadoFiltro === "Pendiente" && !pago.estatusPago)) &&
      (!torneoFiltro || pago.descripcion === torneoFiltro) &&
      (!equipoFiltro || pago.equipo.nombreEquipo === equipoFiltro)
    );
  });

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
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
        Gestión de pagos
      </Text>

      <View style={styles.filtrosContainer}>
        <Text style={[FONTS.nunitoNegrita, styles.titulo]}>Filtrar Pagos</Text>

        {/* Picker Tipo de Pago */}
        <Text style={[FONTS.oswald, styles.label]}>Tipo de Pago:</Text>
        <Picker
          selectedValue={tipoPago}
          onValueChange={setTipoPago}
          style={styles.picker}
          itemStyle={FONTS.nunitoNegrita}
        >
          <Picker.Item label="Todos" value="" />
          <Picker.Item label="Inscripción" value="Inscripción" />
          <Picker.Item label="Arbitraje" value="Arbitraje" />
          <Picker.Item label="Cancha" value="Cancha" />
        </Picker>

        {/* Picker Estado */}
        <Text style={[FONTS.oswald, styles.label]}>Estado:</Text>
        <Picker
          selectedValue={estadoFiltro}
          onValueChange={setEstadoFiltro}
          style={styles.picker}
          itemStyle={FONTS.nunito}
        >
          <Picker.Item label="Todos" value="" />
          <Picker.Item label="Pagado" value="Pagado" />
          <Picker.Item label="Pendiente" value="Pendiente" />
        </Picker>

        {/* Picker Torneo */}
        <Text style={[FONTS.oswald, styles.label]}>Torneo:</Text>
        <Picker
          selectedValue={torneoFiltro}
          onValueChange={setTorneoFiltro}
          style={styles.picker}
          itemStyle={FONTS.nunito}
        >
          <Picker.Item label="Todos" value="" />
          {torneosUnicos.map((torneo, index) => (
            <Picker.Item key={index} label={torneo} value={torneo} />
          ))}
        </Picker>

        {/* Picker Equipo */}
        <Text style={[FONTS.oswald, styles.label]}>Equipo:</Text>
        <Picker
          selectedValue={equipoFiltro}
          onValueChange={setEquipoFiltro}
          style={styles.picker}
          itemStyle={FONTS.nunito}
        >
          <Picker.Item label="Todos" value="" />
          {equiposUnicos.map((equipo, index) => (
            <Picker.Item key={index} label={equipo} value={equipo} />
          ))}
        </Picker>
      </View>

      {/* Tabla de resultados */}
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.tabla}>
            {/* <View style={styles.fila}>
              <Text style={[FONTS.oswaldNegrita, styles.celdaEncabezado]}>
                Descripción
              </Text>
              <Text style={[FONTS.oswaldNegrita, styles.celdaEncabezado]}>
                Tipo de Pago
              </Text>
              <Text style={[FONTS.oswaldNegrita, styles.celdaEncabezado]}>
                Estado
              </Text>
              <Text style={[FONTS.oswaldNegrita, styles.celdaEncabezado]}>
                Equipo
              </Text>
              <Text style={[FONTS.oswaldNegrita, styles.celdaEncabezado]}>
                Opciones
              </Text>
            </View> */}
            <View style={styles.headerRow}>
              <Text style={[styles.headerCell, FONTS.oswaldNegrita]}>
                Descripción
              </Text>
              <Text style={[styles.headerCell, FONTS.oswaldNegrita]}>
                Tipo de pago
              </Text>
              <Text style={[styles.headerCell, FONTS.oswaldNegrita]}>
                Estado
              </Text>
              <Text
                style={[
                  styles.headerCell,
                  styles.partidoCell,
                  FONTS.oswaldNegrita,
                ]}
              >
                Equipo
              </Text>
              <Text
                style={[
                  styles.headerCell,
                  styles.buttonCell,
                  FONTS.oswaldNegrita,
                  { width: 60 },
                ]}
              >
                Opciones
              </Text>
            </View>
            {pagosFiltrados.map((pago) => (
              <View key={pago.id} style={styles.fila}>
                <Text
                  style={[FONTS.oswald, styles.celda]}
                  numberOfLines={3}
                  ellipsizeMode="tail"
                >
                  {pago.descripcion}
                </Text>
                <Text
                  style={[FONTS.oswald, styles.celda]}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {pago.tipoPago}
                </Text>
                <Text
                  style={[FONTS.oswald, styles.celda]}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {pago.estatusPago ? "Pagado" : "Pendiente"}
                </Text>
                <Text
                  style={[FONTS.oswald, styles.celda]}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {pago.equipo.nombreEquipo}
                </Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: colores.acento_1_2,
                    width: 80,
                    height: "50%",
                    justifyContent: "center",
                    alignSelf: "center",
                    alignItems: "center",
                    borderRadius: 10,
                  }}
                >
                  {/* <Ionicons name="wallet" size={24} color={colores.blanco} /> */}
                  <Text style={[FONTS.oswaldNegrita, {color: colores.blanco}]}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#eef2f3",
  },
  title: {
    fontSize: 30,
    alignItems: "flex-start",
    marginBlock: 5,
  },
  filtrosContainer: {
    marginBottom: 20,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 15,
    elevation: 3,
  },
  titulo: {
    fontSize: 20,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
  },
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 10,
    backgroundColor: colores.base_2_5,
    borderRadius: 5,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  card: {
    borderRadius: 10,
    backgroundColor: "#ffffff",
    elevation: 5, // Sombra en Android
    shadowColor: "#000", // Sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    overflow: "hidden",
  },
  tabla: {
    width: "100%",
  },
  fila: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  celda: {
    width: 100,
    textAlign: "center",
    paddingVertical: 8,
    fontSize: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  celdaEncabezado: {
    textAlign: "center",
    backgroundColor: "#f1f1f1",
    padding: 12,
  },

  buttonText: {
    fontSize: 14,
    color: colores.blanco,
  },

  registerButton: {
    backgroundColor: colores.domin_2_3,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  registerButtonText: {
    color: "white",
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
    textAlign: "center",
    paddingHorizontal: 10,
    color: "white",
    width: 80,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    padding: 10,
    alignItems: "center",
    borderBottomColor: colores.base_2_4,
  },
  cell: { flex: 1, textAlign: "left", paddingHorizontal: 10 },

  editButton: { backgroundColor: colores.acento_2_3 },
  deleteButton: { backgroundColor: colores.domin_2_2 },
  reactiveButton: { backgroundColor: colores.acento_3_1 },
});

export default Admin6;
