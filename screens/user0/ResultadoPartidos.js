import React, { useEffect, useState,useCallback} from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  ImageBackground,
  RefreshControl

} from "react-native";
import { Picker } from "@react-native-picker/picker";
import api from "../../config/api";

const MatchCard = ({ match }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.date}>
        {match.fechaPartido || "Fecha no disponible"} - {match.hora || "Hora no disponible"}
      </Text>

      <View style={styles.teamsContainer}>
        <View style={styles.teamContainer}>
          <Image
            source={{ uri: match.equipoLocal?.logo || "https://via.placeholder.com/40" }}
            style={styles.teamLogo}
          />
          <Text style={styles.teamName}>{match.equipoLocal?.nombreEquipo || "Equipo Local"}</Text>
        </View>
        <Text style={styles.score}>
          {match.golesLocal} - {match.golesVisitante}
        </Text>
        <View style={styles.teamContainer}>
          <Image
            source={{ uri: match.equipoVisitante?.logo || "https://via.placeholder.com/40" }}
            style={styles.teamLogo}
          />
          <Text style={styles.teamName}>{match.equipoVisitante?.nombreEquipo || "Equipo Visitante"}</Text>
        </View>
      </View>

      <Text style={styles.field}>
        Cancha: {match.cancha?.descripcion || "Cancha no disponible"}
      </Text>

      <Text style={styles.field}>
        Árbitro: {match.arbitro?.nombreCompleto || "Árbitro no disponible"}
      </Text>

      <Text style={[styles.status, styles.finalizado]}>
        ¡Finalizado!
      </Text>
    </View>
  );
};


const ResultadoDePartidos = () => {
  const [torneos, setTorneos] = useState([]);
  const [selectedTorneo, setSelectedTorneo] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [refreshing, setRefreshing] = useState(false); // Nuevo estado para refresh
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
        `/api/partidos/todos/portorneo/${torneoId}`
      );
      const partidosJugados = response.data.filter((partido) => partido.jugado);
      setMatches(partidosJugados);
      setError(null);
    } catch (error) {
      console.error("Error fetching matches:", error);
      setError("Error al cargar los partidos. Intenta de nuevo.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Carga inicial
  useEffect(() => {
    fetchTorneos();
  }, [fetchTorneos]);

  // Carga cuando cambia el torneo seleccionado
  useEffect(() => {
    if (selectedTorneo) {
      fetchMatches(selectedTorneo);
    } else {
      setMatches([]);
      setLoading(false);
    }
  }, [selectedTorneo, fetchMatches]);

  // Función para refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    if (selectedTorneo) {
      fetchMatches(selectedTorneo);
    } else {
      fetchTorneos();
    }
    setCurrentPage(0);
  }, [selectedTorneo, fetchMatches, fetchTorneos]);

  // Paginación
  const displayedMatches = matches.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handleNextPage = () => {
    if ((currentPage + 1) * itemsPerPage < matches.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/fondo.jpg")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
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
        {/* Todo el contenido existente permanece igual */}
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

        {error && <Text style={styles.errorText}>{error}</Text>}

        {loading && !refreshing && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007BFF" />
            <Text style={styles.loadingText}>Cargando partidos...</Text>
          </View>
        )}

        {!loading && displayedMatches.length > 0 ? (
          displayedMatches.map((match, index) => (
            <MatchCard key={index} match={match} />
          ))
        ) : (
          !loading && <Text style={styles.noMatchesText}>No hay partidos finalizados disponibles.</Text>
        )}

        {!loading && matches.length > itemsPerPage && (
          <View style={styles.paginationContainer}>
            <TouchableOpacity
              style={[styles.paginationButton, currentPage === 0 && styles.disabledButton]}
              onPress={handlePreviousPage}
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
              onPress={handleNextPage}
              disabled={(currentPage + 1) * itemsPerPage >= matches.length}
            >
              <Text style={styles.paginationButtonText}>Siguiente</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </ImageBackground>
  );
};


const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    padding: 10,
    alignItems: "center",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
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
  score: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007BFF",
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
    color: "white",
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
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 5,
    padding: 10,
  },
  paginationButton: {
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 5,
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 10,
    borderRadius: 5,
  },
  noMatchesText: {
    fontSize: 16,
    color: "#333",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 10,
    borderRadius: 5,
  },
});

export default ResultadoDePartidos;