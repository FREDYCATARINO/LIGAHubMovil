import React, { useState, useEffect, useCallback } from "react";
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator, 
  Dimensions,
  RefreshControl,
  TouchableOpacity
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
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  // Fetch torneos con useCallback
  const fetchTorneos = useCallback(async () => {
    try {
      const response = await api.get("/api/torneos/iniciados");
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
      setGoleadores(response.data);
      setCurrentPage(0); // Resetear a primera página al cambiar torneo
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

  // Cambiar página
  const goToNextPage = () => {
    if ((currentPage + 1) * itemsPerPage < goleadores.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    fetchTorneos();
  }, [fetchTorneos]);

  useEffect(() => {
    fetchGoleadores();
  }, [fetchGoleadores]);

  // Ancho mínimo para las celdas
  const cellWidth = Dimensions.get('window').width * 0.25;

  // Obtener jugadores para la página actual
  const paginatedGoleadores = goleadores.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

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
                  <Text style={styles.headerText}>Goles</Text>
                </View>
                <View style={[styles.headerCell, { width: cellWidth }]}>
                  <Text style={styles.headerText}>Partidos</Text>
                </View>
               
              </View>
  
              {/* Filas de datos */}
              {paginatedGoleadores.length > 0 ? (
                paginatedGoleadores.map((jugador, index) => (
                  <View key={jugador.id || index} style={styles.row}>
                    <View style={[styles.cell, { width: cellWidth }]}>
                      <Text style={styles.cellText}>
                        {(currentPage * itemsPerPage) + index + 1}
                      </Text>
                    </View>
                    
                    <View style={[styles.cell, { width: cellWidth * 1.5 }]}>
                      <Text style={styles.cellText}>{jugador.nombreCompleto}</Text>
                    <Image
                               source={{ uri: jugador.logoEquipo || "https://via.placeholder.com/40"}}
                               style={styles.teamLogo}
                             />
                    </View>
                    <View style={[styles.cell, { width: cellWidth }]}>
                      <Text style={styles.cellText}>{jugador.goles || 0}</Text>
                    </View>
                    <View style={[styles.cell, { width: cellWidth }]}>
                      <Text style={styles.cellText}>{jugador.partidosJugados || 0}</Text>
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
  
          {/* Controles de paginación*/}
          <View style={styles.paginationContainer}>
            <TouchableOpacity
              style={[
                styles.paginationButton,
                currentPage === 0 && styles.disabledButton
              ]}
              onPress={goToPrevPage}
              disabled={currentPage === 0}
            >
              <Text style={styles.paginationText}>Anterior</Text>
            </TouchableOpacity>
  
            <Text style={styles.pageIndicator}>
              Página {currentPage + 1} de {Math.max(1, Math.ceil(goleadores.length / itemsPerPage))}
            </Text>
  
            <TouchableOpacity
              style={[
                styles.paginationButton,
                (currentPage + 1) * itemsPerPage >= goleadores.length && styles.disabledButton
              ]}
              onPress={goToNextPage}
              disabled={(currentPage + 1) * itemsPerPage >= goleadores.length}
            >
              <Text style={styles.paginationText}>Siguiente</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );}

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
    alignItems:"center"
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
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    paddingHorizontal: 10,
  },
  paginationButton: {
    backgroundColor: '#c00',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  paginationText: {
    color: 'white',
    fontWeight: 'bold',
  },
  pageIndicator: {
    color: '#333',
    fontWeight: 'bold',
  },
  teamLogo: {
    width: 50,
    height: 60,
    resizeMode: "contain",
    marginBottom: 5,
  },
});

export default TablaGoleo;