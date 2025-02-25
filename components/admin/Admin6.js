import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import FONTS from "../../style/fonts";

const Admin6 = ({ navigation }) => {
  const [tipoPago, setTipoPago] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");

  const productosSimulados = [
    {
      id: "prod_1",
      nombre: "Cancha 1",
      tipoPago: "Cancha",
      estado: "Pagado",
      equipo: "Equipo A",
    },
    {
      id: "prod_2",
      nombre: "Arbitraje 1",
      tipoPago: "Arbitraje",
      estado: "Pendiente",
      equipo: "Equipo B",
    },
    {
      id: "prod_3",
      nombre: "Inscripción 1",
      tipoPago: "Inscripción",
      estado: "Pagado",
      equipo: "Equipo C",
    },
    {
      id: "prod_4",
      nombre: "Cancha 2",
      tipoPago: "Cancha",
      estado: "Pendiente",
      equipo: "Equipo D",
    },
  ];

  const productosFiltrados = productosSimulados.filter((producto) => {
    return (
      (!tipoPago || producto.tipoPago === tipoPago) &&
      (!estadoFiltro || producto.estado === estadoFiltro)
    );
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
        <Text style={[FONTS.nunitoNegrita, styles.titulo]}>Filtrar Productos</Text>
        <Text style={[FONTS.oswald, styles.label]}>Tipo de Pago:</Text>
        <Picker
          selectedValue={tipoPago}
          onValueChange={(itemValue) => setTipoPago(itemValue)}
          style={[styles.picker]}
          itemStyle={FONTS.nunito}
        >
          <Picker.Item label="Todos" value="" style={FONTS.nunito}/>
          <Picker.Item label="Cancha" value="Cancha" style={FONTS.nunito} />
          <Picker.Item label="Arbitraje" value="Arbitraje" style={FONTS.nunito} />
          <Picker.Item label="Inscripción" value="Inscripción" style={FONTS.nunito} />
        </Picker>

        <Text style={[FONTS.oswald, styles.label]}>Estado:</Text>
        <Picker
          selectedValue={estadoFiltro}
          onValueChange={(itemValue) => setEstadoFiltro(itemValue)}
          style={styles.picker}
          itemStyle={FONTS.nunito}
        >
          <Picker.Item label="Todos" value="" style={FONTS.nunito} />
          <Picker.Item label="Pagado" value="Pagado" style={FONTS.nunito} />
          <Picker.Item label="Pendiente" value="Pendiente" style={FONTS.nunito} />
        </Picker>
      </View>

      <View style={styles.card}>
        <View style={styles.tabla}>
          <View style={styles.fila}>
            <Text style={[FONTS.oswaldNegrita, styles.celdaEncabezado]}>Nombre</Text>
            <Text style={[FONTS.oswaldNegrita, styles.celdaEncabezado]}>Tipo de Pago</Text>
            <Text style={[FONTS.oswaldNegrita, styles.celdaEncabezado]}>Estado</Text>
            <Text style={[FONTS.oswaldNegrita, styles.celdaEncabezado]}>Equipo</Text>
          </View>
          {productosFiltrados.map((producto) => (
            <View key={producto.id} style={styles.fila}>
              <Text style={[FONTS.oswald, styles.celda]}>{producto.nombre}</Text>
              <Text style={[FONTS.oswald, styles.celda]}>{producto.tipoPago}</Text>
              <Text style={[FONTS.oswald, styles.celda]}>{producto.estado}</Text>
              <Text style={[FONTS.oswald, styles.celda]}>{producto.equipo}</Text>
            </View>
          ))}
        </View>
      </View>
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
    backgroundColor: "#f9f9f9",
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
    flex: 1,
    textAlign: "center",
    paddingVertical: 8,
    fontSize: 16,
  },
  celdaEncabezado: {
    flex: 1,
    textAlign: "center",
    backgroundColor: "#f1f1f1",
    padding: 10,
  },
});

export default Admin6;
