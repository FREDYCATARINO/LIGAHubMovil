import React, { useState, useEffect, useCallback } from "react";
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator, 
  Dimensions,
  RefreshControl
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import api from "../../config/api";

const TablaGoleo = () => {
  const [torneos, setTorneos] = useState([]);
  const [selectedTorneo, setSelectedTorneo] = useState(null);
  const [errorTorneos, setErrorTorneos] = useState(null);
  const [goleadores, setGoleadores] = useState([]);
  const [loadingGoleadores, setLoadingGoleadores] = useState(false);
  const [errorGoleadores, setErrorGoleadores] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch torneos con useCallback
  const fetchTorneos = useCallback(async () => {
    try {
      const response = await api.get("/api/torneos/iniciados");
      console.log("Respuesta de API - Torneos:", response.data);
      setTorneos(response.data);
      setErrorTorneos(null);
    } catch (error) {
      console.error("Error fetching torneos:", error);
      setErrorTorneos("Error al cargar los torneos. Intenta de nuevo.");
    }
  }, []);

  // Fetch goleadores con useCallback
  const fetchGoleadores = useCallback(async () => {
    if (!selectedTorneo) return;
    
    setLoadingGoleadores(true);
    setErrorGoleadores(null);
    try {
      const response = await api.get(`/api/jugadorestadisticas/torneo/${selectedTorneo}`);
      console.log("Respuesta de API - Goleadores:", response.data);
      setGoleadores(response.data);
    } catch (error) {
      console.error("Error fetching goleadores:", error);
      setErrorGoleadores("Error al cargar los goleadores. Intenta de nuevo.");
    } finally {
      setLoadingGoleadores(false);
      setRefreshing(false);
    }
  }, [selectedTorneo]);

  // Función para manejar el refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    if (selectedTorneo) {
      fetchGoleadores();
    } else {
      fetchTorneos();
    }
  }, [selectedTorneo, fetchGoleadores, fetchTorneos]);

  useEffect(() => {
    fetchTorneos();
  }, [fetchTorneos]);

  useEffect(() => {
    fetchGoleadores();
  }, [fetchGoleadores]);

  // Ancho mínimo para las celdas
  const cellWidth = Dimensions.get('window').width * 0.25;

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#c00"]}
          tintColor="#c00"
        />
      }
    >
      {/* Selector de torneos */}
      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Selecciona un torneo:</Text>
        {errorTorneos ? (
          <Text style={styles.errorText}>{errorTorneos}</Text>
        ) : (
          <Picker
            selectedValue={selectedTorneo}
            onValueChange={(itemValue) => setSelectedTorneo(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Selecciona un torneo" value={null} />
            {torneos.map((torneo) => (
              <Picker.Item
                key={torneo.id}
                label={torneo.nombreTorneo}
                value={torneo.id}
              />
            ))}
          </Picker>
        )}
      </View>

      {/* Tabla de goleadores */}
      <Text style={styles.title}>Goleadores</Text>
      
      {loadingGoleadores ? (
        <ActivityIndicator size="large" color="#c00" />
      ) : errorGoleadores ? (
        <Text style={styles.errorText}>{errorGoleadores}</Text>
      ) : !selectedTorneo ? (
        <Text>Por favor selecciona un torneo</Text>
      ) : (
        <View style={styles.tableContainer}>
          {/* Scroll horizontal para la tabla */}
          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <View>
              {/* Encabezados */}
              <View style={styles.headerRow}>
                <View style={[styles.headerCell, { width: cellWidth }]}>
                  <Text style={styles.headerText}>Pos</Text>
                </View>
                <View style={[styles.headerCell, { width: cellWidth * 1.5 }]}>
                  <Text style={styles.headerText}>Jugador</Text>
                </View>
                <View style={[styles.headerCell, { width: cellWidth }]}>
                  <Text style={styles.headerText}>Partidos</Text>
                </View>
                <View style={[styles.headerCell, { width: cellWidth }]}>
                  <Text style={styles.headerText}>Goles</Text>
                </View>
              </View>

              {/* Filas de datos */}
              {goleadores.length > 0 ? (
                goleadores.map((jugador, index) => (
                  <View key={jugador.id || index} style={styles.row}>
                    <View style={[styles.cell, { width: cellWidth }]}>
                      <Text style={styles.cellText}>{index + 1}</Text>
                    </View>
                    
                    <View style={[styles.cell, { width: cellWidth * 1.5 }]}>
                      <Text style={styles.cellText}>{jugador.nombreCompleto}</Text>
                    </View>
                    <View style={[styles.cell, { width: cellWidth }]}>
                      <Text style={styles.cellText}>{jugador.partidosJugados || 0}</Text>
                    </View>
                    <View style={[styles.cell, { width: cellWidth }]}>
                      <Text style={styles.cellText}>{jugador.goles || 0}</Text>
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.row}>
                  <Text style={styles.noDataText}>No hay datos disponibles para este torneo</Text>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  pickerContainer: {
    width: "100%",
    marginBottom: 30,
    paddingHorizontal: 1,
  
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 15,
    fontWeight: "bold",
    color: "#333",
  },
  picker: {
    width: "100%",
    height: 60,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    borderWidth: 5,
    borderColor: "#ddd",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 15,
    color: "#c00",
    textAlign: "center",
  },
  errorText: {
    color: "red",
    marginVertical: 15,
    textAlign: "center",
    fontSize: 16,
  },
  tableContainer: {
    width: "100%",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#c00",
    paddingVertical: 12,
  },
  headerCell: {
    paddingHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontWeight: "bold",
    color: "#fff",
    fontSize: 14,
  },
  row: {
    flexDirection: "row",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  cell: {
    paddingHorizontal: 8,
    justifyContent: "center",
  },
  cellText: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
  teamCell: {
    flexDirection: "row",
    alignItems: "center",
  },
  teamLogo: {
    width: 30,
    height: 30,
    resizeMode: "contain",
    marginRight: 10,
    borderRadius: 15,
  },
  teamName: {
    fontSize: 14,
    color: "#333",
    flexShrink: 1,
  },
  noDataText: {
    textAlign: "center",
    paddingVertical: 20,
    color: "#666",
    fontSize: 16,
    width: Dimensions.get('window').width - 20,
  },
});

export default TablaGoleo;