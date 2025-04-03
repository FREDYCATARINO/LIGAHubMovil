import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  RefreshControl,
} from "react-native";
import { Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import FONTS from "../../style/fonts";
import colores from "../../style/colors";
import api from "../../config/api";
import LottieView from "lottie-react-native";
import { ToggleButton } from "react-native-paper";

import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Admin6 = ({ navigation }) => {
  const { getUserId, getUserRole, getToken, logout } = useContext(AuthContext);

  const [refreshing, setRefreshing] = useState(false);

  const [tipoPago, setTipoPago] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [torneoFiltro, setTorneoFiltro] = useState("");
  const [equipoFiltro, setEquipoFiltro] = useState("");
  const [listaPagos, setPagos] = useState([]);
  const [loadPagos, setLoadPagos] = useState(false);
  const [fallo, setFallo] = useState("");
  const [tokData, setTokData] = useState("");
  const [reload, setReload] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [id, setId] = useState(0);

  const confirmarPago = async (id) => {
    const tokData = await getToken();
    await api
      .put(
        `/api/pagos/admin/confirmar/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${tokData}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        Alert.alert("¡OK!", res.data || "Pago confirmado");
        setReload(!reload);
      })
      .catch((error) => {
        console.error(error, error.response?.data?.message);
        console.log(error.toJSON());
        if (error.response.status === 403) {
          console.log("⚠️ Token expirado, redirigiendo a login...");
          Alert.alert(
            "Sesión expirada ⚠️",
            "Por favor, inicia sesión nuevamente."
          );
          logout();
          return;
        }
        Alert.alert(
          "Denegado",
          error.response?.data?.message || "Error desconocido"
        );
      })
      .finally(() => {
        setModalVisible1(false);
        setId(0);
      });
  };

  useEffect(() => {
    const getPagos = async () => {
      const id = await getUserRole();
      const rolo = await getUserId();
      const tok = await getToken();
      setTokData(tok);
      setLoadPagos(true);
      api
        .get(`/api/pagos/admin/todos`, {
          headers: {
            Authorization: `Bearer ${tok}`,
          },
        })
        .then((res) => {
          if (res.data.length === 0)
            setFallo(
              "No hay pagos pendientes, los usuarios están al corriente"
            );
          else setPagos(res.data);
        })
        .catch((e) => {
          console.error(e, e.response.message);
          if (e.response.status === 403) {
            console.log("⚠️ Token expirado, redirigiendo a login...");
            Alert.alert(
              "Sesión expirada ⚠️",
              "Por favor, inicia sesión nuevamente."
            );
            logout();
            return;
          }
          if (e.response.message) setFallo(e.response.message);
          else setFallo("Error al obtener pagos");
        })
        .finally(() => setLoadPagos(false));
    };
    getPagos();
  }, [reload]);

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

  const [selectedValue, setSelectedValue] = useState("todos");

  // Estado para la página actual
  const [paginaActual, setPaginaActual] = useState(1);
  const resultadosPorPagina = 3;

  // Calcular el índice de inicio y fin de los resultados
  const indiceInicio = (paginaActual - 1) * resultadosPorPagina;
  const indiceFin = indiceInicio + resultadosPorPagina;

  // Pagos que se mostrarán en la página actual
  const pagosPagina = pagosFiltrados.slice(indiceInicio, indiceFin);

  // Función para cambiar de página
  const siguientePagina = () => {
    if (paginaActual * resultadosPorPagina < pagosFiltrados.length) {
      setPaginaActual(paginaActual + 1);
    }
  };

  const paginaAnterior = () => {
    if (paginaActual > 1) {
      setPaginaActual(paginaActual - 1);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => setReload(!reload)}
          colors={[colores.domin_1_1]}
          tintColor={colores.domin_1_1}
        />
      }
    >
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

      {loadPagos ? (
        <ActivityIndicator
          size="large"
          color={colores.domin_1_1}
          style={{ marginTop: 20 }}
        />
      ) : fallo === "" ? (
        <View>
          <View style={styles.filtrosContainer}>
            <Text style={[FONTS.nunitoNegrita, styles.titulo]}>
              Filtrar Pagos
            </Text>

            <Text style={[{ fontSize: 18 }, FONTS.nunito]}>
              Filtrar por: {selectedValue}
            </Text>
            <ToggleButton.Row
              onValueChange={(value) => setSelectedValue(value)}
              value={selectedValue}
            >
              <ToggleButton icon="view-grid" value="todos" />
              <ToggleButton icon="credit-card" value="tipo de pago" />
              <ToggleButton icon="check-circle" value="estado" />
              <ToggleButton icon="trophy" value="torneo" />
              <ToggleButton icon="soccer" value="equipos" />
            </ToggleButton.Row>

            {(selectedValue === "todos" ||
              selectedValue === "tipo de pago") && (
              <View>
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
              </View>
            )}

            {(selectedValue === "todos" || selectedValue === "estado") && (
              <View>
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
              </View>
            )}

            {(selectedValue === "todos" || selectedValue === "torneo") && (
              <View>
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
              </View>
            )}

            {(selectedValue === "todos" || selectedValue === "equipos") && (
              <View>
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
            )}
          </View>

          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <View style={styles.card}>
              <View style={styles.tabla}>
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
                {pagosPagina.map((pago) => (
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
                      style={[FONTS.oswald, styles.celda, styles.celda2]}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {pago.equipo.nombreEquipo}
                    </Text>
                    <TouchableOpacity
                      style={{
                        backgroundColor: colores.acento_1_2,
                        width: 75,
                        height: 50,
                        justifyContent: "center",
                        alignSelf: "center",
                        alignItems: "center",
                        borderRadius: 10,
                      }}
                      onPress={() => {
                        setId(pago.id);
                        setModalVisible1(true);
                      }}
                    >
                      <Text
                        style={[FONTS.oswaldNegrita, { color: colores.blanco }]}
                      >
                        Confirmar
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Controles de Paginación */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 10,
            }}
          >
            <TouchableOpacity
              onPress={paginaAnterior}
              style={{
                backgroundColor: colores.domin_1_2,
                padding: 10,
                borderRadius: 5,
                opacity: paginaActual === 1 ? 0.5 : 1,
              }}
              disabled={paginaActual === 1}
            >
              <Text style={[FONTS.oswaldNegrita, { color: colores.blanco }]}>
                Anterior
              </Text>
            </TouchableOpacity>
            <Text style={[FONTS.oswald, { alignSelf: "center" }]}>
              Página {paginaActual} de{" "}
              {Math.ceil(pagosFiltrados.length / resultadosPorPagina)}
            </Text>
            <TouchableOpacity
              onPress={siguientePagina}
              style={{
                backgroundColor: colores.domin_1_2,
                padding: 10,
                borderRadius: 5,
                opacity:
                  paginaActual * resultadosPorPagina >= pagosFiltrados.length
                    ? 0.5
                    : 1,
              }}
              disabled={
                paginaActual * resultadosPorPagina >= pagosFiltrados.length
              }
            >
              <Text style={[FONTS.oswaldNegrita, { color: colores.blanco }]}>
                Siguiente
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View>
          <LottieView
            source={
              fallo === "Error al obtener pagos"
                ? require("../../assets/puerco.json")
                : require("../../assets/confetti.json")
            }
            autoPlay
            loop
            style={styles.icon}
            speed={fallo === "Error al obtener pagos" ? 0.5 : 1}
            color={colores.base_3_1}
          />
          <Text
            style={[
              FONTS.nunitoNegrita,
              styles.errMessCenter,
              {
                marginTop: 10,
                fontSize: 30,
                alignContent: "center",
                width: "100%",
                textAlign: "center",
              },
            ]}
          >
            {fallo === "Error al obtener pagos" ? "¡Oh oh!" : "¡Yuju!"}
          </Text>
          <Text
            style={[
              FONTS.oswald,
              styles.errMessCenter,
              {
                marginTop: 10,
                fontSize: 20,
                alignContent: "center",
                width: "100%",
                textAlign: "center",
              },
            ]}
          >
            {fallo}
          </Text>
        </View>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible1}
        onRequestClose={() => setModalVisible1(false)}
      >
        <View style={stylesModal.modalContainer}>
          <View style={stylesModal.modalContent}>
            <TouchableOpacity
              style={{
                alignSelf: "flex-end",
                justifyContent: "flex-start",
                marginTop: -10,
                marginRight: -10,
              }}
              onPress={() => setModalVisible1(false)}
            >
              <Ionicons name="close" size={24} color={colores.negro} />
            </TouchableOpacity>
            <Ionicons name="help-circle" size={48} color={colores.acento_3_1} />
            <Text style={[stylesModal.modalTitle, FONTS.oswaldNegrita]}>
              Confirmar pago
            </Text>
            <Text style={[FONTS.oswald, stylesModal.modalText]}>
              Al hacer esto, confirmas que el pago correspondiente fue realizado
              de manera física.
            </Text>
            <Text style={[FONTS.oswald, stylesModal.modalText]}>
              ¿Deseas continuar?
            </Text>
            <View style={stylesModal.modalButRow}>
              <TouchableOpacity
                style={[stylesModal.buttonBack, FONTS.oswald]}
                onPress={async () => confirmarPago(id)}
              >
                <Text style={[stylesModal.buttonText, FONTS.oswald]}>Si</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[stylesModal.buttonBack, FONTS.oswald]}
                onPress={() => {
                  setModalVisible1(false);
                  setId(0);
                }}
              >
                <Text style={[stylesModal.buttonText, FONTS.oswald]}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const stylesModal = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    flexDirection: "row",
    backgroundColor: colores.domin_2_3,
    padding: 5,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: 250,
  },
  modalContent2: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: 300,
    gap: 5,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: "#FF3B30",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },
  modalTitle: {
    width: "100%",
    fontSize: 20,
    textAlign: "center",
    marginBottom: 5,
  },
  modalItem: {
    borderRadius: 5,
    width: "100%",
    padding: 5,
    marginVertical: 3,
    paddingRight: 8,
  },
  modalItemActive: {
    backgroundColor: colores.domin_2_5,
    opacity: 0.5,
  },
  buttonBack: {
    flexDirection: "row",
    backgroundColor: colores.domin_2_3,
    padding: 5,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    width: "50%",
    marginBottom: 5,
  },
  modalButRow: {
    flexDirection: "row",
    width: "100%",
    gap: 5,
    justifyContent: "center",
  },
  buttonText: {
    color: colores.blanco,
    alignItems: "center",
  },
  modalText: {
    textAlign: "justify",
    paddingVertical: 10,
  },
  modalDato: {
    width: "100%",
  },
  fotoEquipo: { width: 100, height: 100, resizeMode: "contain" },
});

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
    paddingVertical: 4,
    fontSize: 16,
    justifyContent: "center",
    alignItems: "center",
    height: "auto",
  },
  celda2: {
    width: 80,
    textAlign: "center",
    paddingVertical: 4,
    fontSize: 16,
    justifyContent: "center",
    alignItems: "center",
    height: "auto",
    marginRight: 2,
  },
  celdaEncabezado: {
    textAlign: "center",
    backgroundColor: "#f1f1f1",
    padding: 15,
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
  icon: {
    width: 150,
    height: 150,
    alignSelf: "center",
  },
  editButton: { backgroundColor: colores.acento_2_3 },
  deleteButton: { backgroundColor: colores.domin_2_2 },
  reactiveButton: { backgroundColor: colores.acento_3_1 },
});

export default Admin6;
