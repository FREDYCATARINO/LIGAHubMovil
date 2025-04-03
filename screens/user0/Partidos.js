import React, { useEffect, useState,useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  ImageBackground, // Importa ImageBackground
  RefreshControl

} from "react-native";
import { Picker } from "@react-native-picker/picker";
import api from "../../config/api";

const MatchCard = ({ match }) => {
  return (
    <View style={styles.card}>
      {/* Nombre del torneo y liguilla */}
      <Text style={styles.status}>
        {match.tipoPartido}
      </Text>
      
      {/* Fecha y hora */}
      <Text style={styles.date}>
        {match.fechaPartido || "Fecha no disponible"} - {match.hora || "Hora no disponible"}
      </Text>

      {/* Equipos y "VS" */}
      <View style={styles.teamsContainer}>
        <View style={styles.teamContainer}>
          <Image
            source={{ uri: match.equipoLocal?.logo || "https://via.placeholder.com/40" }}
            style={styles.teamLogo}
          />
          <Text style={styles.teamName}>{match.equipoLocal?.nombreEquipo || "Equipo Local"}</Text>
        </View>
        <Text style={styles.vsText}>VS</Text>
        <View style={styles.teamContainer}>
          <Image
            source={{ uri: match.equipoVisitante?.logo || "https://via.placeholder.com/40" }}
            style={styles.teamLogo}
          />
          <Text style={styles.teamName}>{match.equipoVisitante?.nombreEquipo || "Equipo Visitante"}</Text>
        </View>
      </View>

      {/* Cancha */}
      <Text style={styles.field}>
        Cancha: {match.cancha?.descripcion || "Cancha no disponible"}
      </Text>

      {/* Árbitro */}
      <Text style={styles.field}>
        Árbitro: {match.arbitro?.nombreCompleto || "Árbitro no disponible"}
      </Text>

      {/* Estado del partido */}
      <Text style={[styles.status, match.jugado ? styles.finalizado : styles.proximo]}>
        {match.jugado ? "¡Finalizado!" : "¡Próximo!"}
      </Text>
    </View>
  );}
const Partidos = () => {
  const [torneos, setTorneos] = useState([]);
  const [selectedTorneo, setSelectedTorneo] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const itemsPerPage = 10;

  // Función para cargar torneos
  const fetchTorneos = useCallback(async () => {
    try {
      const response = await api.get("/api/torneos/iniciados");
      setTorneos(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching torneos:", error);
      setError("Error al cargar los torneos. Intenta de nuevo.");
    }
  }, []);

  // Función para cargar partidos
  const fetchMatches = useCallback(async (torneoId) => {
    try {
      setLoading(true);
      const response = await api.get(
        `/api/partidos/todos/portorneo/nojugados/${torneoId}`
      );
      setMatches(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching matches:", error);
    // Mensaje de error detallado
    const errorMessage = error.response?.data?.message 
      || (error.response?.status === 404 ? "No se encontraron partidos para este torneo" : "Error al cargar los partidos")
      || error.message
      || "Error desconocido al cargar partidos";
    setError(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Carga inicial de torneos
  useEffect(() => {
    fetchTorneos();
  }, [fetchTorneos]);

  // Carga de partidos cuando se selecciona un torneo
  useEffect(() => {
    if (selectedTorneo) {
      fetchMatches(selectedTorneo);
    } else {
      setMatches([]);
      setLoading(false);
    }
  }, [selectedTorneo, fetchMatches]);

  // Función para el refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    if (selectedTorneo) {
      fetchMatches(selectedTorneo);
    } else {
      fetchTorneos();
    }
    setCurrentPage(0);
  }, [selectedTorneo, fetchMatches, fetchTorneos]);

  // ... (handleNextPage y handlePreviousPage permanecen igual)

  // Calcular partidos a mostrar
  const displayedMatches = matches.slice(
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
            colors={["#FF5958"]}
            tintColor="#FF5958"
          />
        }
      >
        {/* Selector de torneos */}
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Selecciona un torneo:</Text>
          <Picker
            selectedValue={selectedTorneo}
            onValueChange={(itemValue) => {
              setSelectedTorneo(itemValue);
              setCurrentPage(0);
            }}
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
        </View>
  
        {/* Mensaje de error */}
        {error && <Text style={styles.errorText}>{error}</Text>}
  
        {/* Indicador de carga */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007BFF" />
            <Text style={styles.loadingText}>Cargando partidos...</Text>
          </View>
        )}
  
        {/* Lista de partidos */}
        {!loading && displayedMatches.length > 0 ? (
          displayedMatches.map((match, index) => (
            <MatchCard key={index} match={match} />
          ))
        ) : (
          !loading && <Text style={styles.noMatchesText}>No hay partidos disponibles.</Text>
        )}
  
        {/* Botones de paginación */}
        {!loading && matches.length > itemsPerPage && (
          <View style={styles.paginationContainer}>
            <TouchableOpacity
              style={[styles.paginationButton, currentPage === 0 && styles.disabledButton]}
              onPress={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
              disabled={currentPage === 0}
            >
              <Text style={styles.paginationButtonText}>Anterior</Text>
            </TouchableOpacity>
            <Text style={styles.pageText}>
              Página {currentPage + 1} de {Math.ceil(matches.length / itemsPerPage)}
            </Text>
            <TouchableOpacity
              style={[
                styles.paginationButton,
                (currentPage + 1) * itemsPerPage >= matches.length && styles.disabledButton,
              ]}
              onPress={() => setCurrentPage(prev => 
                (prev + 1) * itemsPerPage < matches.length ? prev + 1 : prev
              )}
              disabled={(currentPage + 1) * itemsPerPage >= matches.length}
            >
              <Text style={styles.paginationButtonText}>Siguiente</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
   
  );}
  
const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: "center",
    backgroundColor:"dcdcdc"
  },
  card: {
    padding: 20,
    marginVertical: 10,
    borderRadius: 8,
    width: "90%",
    shadowRadius: 10,
    elevation: 3,
    alignItems: "center",
    backgroundColor:"white",

  },
  date: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  teamsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 10,
  },
  teamContainer: {
    alignItems: "center",
    width: "40%",
  },
  teamLogo: {
    width: 60,
    height: 60,
    resizeMode: "contain",
    marginBottom: 5,
  },
  teamName: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    color: "#555",
  },
  vsText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  field: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginVertical: 5,
  },
  status: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  finalizado: {
    color: "green",
  },
  proximo: {
    color: "black",
  },
  pickerContainer: {
    width: "90%",
    marginBottom: 20,
    borderRadius: 5,
    padding: 10,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "black",
  },
  picker: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    marginTop: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Fondo semitransparente
    borderRadius: 5,
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Fondo semitransparente
    borderRadius: 5,
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
  },
  noMatchesText: {
    fontSize: 16,
    color: "#333",
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Fondo semitransparente
    padding: 10,
    borderRadius: 5,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Fondo semitransparente
    padding: 10,
    borderRadius: 5,
  },
  paginationButton: {
    padding: 10,
    backgroundColor: "#FF5958",
    borderRadius: 15,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  paginationButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  pageText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});

export default Partidos;