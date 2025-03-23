import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import api from "../../config/api";

const MatchCard = ({ match }) => {
  return (
    <View style={styles.card}>
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
  );
};

const Partidos = () => {
  const [torneos, setTorneos] = useState([]); // Lista de torneos iniciados
  const [selectedTorneo, setSelectedTorneo] = useState(null); // Torneo seleccionado
  const [matches, setMatches] = useState([]); // Todos los partidos no jugados del torneo seleccionado
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Manejo de errores
  const [currentPage, setCurrentPage] = useState(0); // Página actual
  const itemsPerPage = 10; // Número de partidos por página

  // Obtener la lista de torneos iniciados
  useEffect(() => {
    const fetchTorneos = async () => {
      try {
        const response = await api.get("/api/torneos/iniciados");
        setTorneos(response.data);
        setError(null); // Limpiar errores
      } catch (error) {
        console.error("Error fetching torneos:", error);
        setError("Error al cargar los torneos. Intenta de nuevo."); // Mostrar mensaje de error
      }
    };

    fetchTorneos();
  }, []);

  // Obtener los partidos no jugados del torneo seleccionado
  useEffect(() => {
    if (selectedTorneo) {
      setLoading(true); // Activar el estado de carga
      const fetchMatches = async () => {
        try {
          const response = await api.get(
            `/api/partidos/todos/portorneo/nojugados/${selectedTorneo}`
          );
          setMatches(response.data);
          setError(null); // Limpiar errores
        } catch (error) {
          console.error("Error fetching matches:", error);
          setError("Error al cargar los partidos. Intenta de nuevo."); // Mostrar mensaje de error
        } finally {
          setLoading(false); // Desactivar el estado de carga
        }
      };

      fetchMatches();
    } else {
      setMatches([]); // Limpiar partidos si no hay torneo seleccionado
      setLoading(false); // Desactivar el estado de carga
    }
  }, [selectedTorneo]);

  // Calcular los partidos que se deben mostrar en la página actual
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedMatches = matches.slice(startIndex, endIndex);

  // Función para avanzar a la siguiente página
  const handleNextPage = () => {
    if (endIndex < matches.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Función para retroceder a la página anterior
  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Selector de torneos */}
      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Selecciona un torneo:</Text>
        <Picker
          selectedValue={selectedTorneo}
          onValueChange={(itemValue) => {
            setSelectedTorneo(itemValue);
            setCurrentPage(0); // Reiniciar la página al cambiar de torneo
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
          <Text>Cargando partidos...</Text>
        </View>
      )}

      {/* Lista de partidos */}
      {!loading && displayedMatches.length > 0 ? (
        displayedMatches.map((match, index) => (
          <MatchCard key={index} match={match} />
        ))
      ) : (
        !loading && <Text>No hay partidos disponibles.</Text>
      )}

      {/* Botones de paginación */}
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
              endIndex >= matches.length && styles.disabledButton,
            ]}
            onPress={handleNextPage}
            disabled={endIndex >= matches.length}
          >
            <Text style={styles.paginationButtonText}>Siguiente</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
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
  vsText: {
    fontSize: 20,
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
  proximo: {
    color: "blue",
  },
  pickerContainer: {
    width: "90%",
    marginBottom: 20,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
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
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 20,
  },
});

export default Partidos;