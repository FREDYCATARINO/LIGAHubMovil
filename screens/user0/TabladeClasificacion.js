import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  ImageBackground, // Importa ImageBackground
  ActivityIndicator, // Importa ActivityIndicator

} from "react-native";
import { Picker } from "@react-native-picker/picker";
import api from "../../config/api";

const ClassificationTable = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [torneos, setTorneos] = useState([]); // Lista de torneos iniciados
  const [selectedTorneo, setSelectedTorneo] = useState(null); // Torneo seleccionado
  const [currentPage, setCurrentPage] = useState(0); // Página actual
  const itemsPerPage = 10; // Número de equipos por página

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

  // Obtener la tabla de clasificación según el torneo seleccionado
  useEffect(() => {
    if (selectedTorneo) {
      setLoading(true); // Activar el estado de carga
      const fetchClassificationTable = async () => {
        try {
          const response = await api.get(`/api/tabla-clasificacion/${selectedTorneo}`);
          console.log("Respuesta de la API:", response.data);

          // Ordenar los equipos según los criterios especificados
          const sortedTeams = response.data.sort((a, b) => {
            if (b.puntos !== a.puntos) return b.puntos - a.puntos;
            const difA = a.golesAFavor - a.golesEnContra;
            const difB = b.golesAFavor - b.golesEnContra;
            if (difB !== difA) return difB - difA;
            if (b.golesAFavor !== a.golesAFavor) return b.golesAFavor - a.golesAFavor;
            if (a.golesEnContra !== b.golesEnContra) return a.golesEnContra - b.golesEnContra;
            if (b.partidosGanados !== a.partidosGanados) return b.partidosGanados - a.partidosGanados;
            return a.partidosPerdidos - b.partidosPerdidos;
          });

          setTeams(sortedTeams);
          setError(null);
        } catch (error) {
          console.error("Error fetching classification table:", error);
          setError("Error al cargar la tabla de clasificación. Intenta de nuevo.");
        } finally {
          setLoading(false); // Desactivar el estado de carga
        }
      };

      fetchClassificationTable();
    } else {
      setTeams([]); // Limpiar equipos si no hay torneo seleccionado
      setLoading(false); // Desactivar el estado de carga
    }
  }, [selectedTorneo]);

  // Calcular los equipos que se deben mostrar en la página actual
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedTeams = teams.slice(startIndex, endIndex);

  // Función para avanzar a la siguiente página
  const handleNextPage = () => {
    if (endIndex < teams.length) {
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
    <ImageBackground
      source={require("../../assets/fondo.jpg")} // Ruta de la imagen de fondo
      style={styles.backgroundImage}
      resizeMode="cover" // Ajusta la imagen al tamaño de la pantalla
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Tabla de clasificación</Text>

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
            <Text style={styles.loadingText}>Cargando tabla de clasificación...</Text>
          </View>
        )}

        {/* Tabla de clasificación */}
        {!loading && displayedTeams.length > 0 ? (
          <>
            <ScrollView horizontal={true} style={styles.horizontalScroll}>
              <View style={styles.table}>
                <View style={styles.headerRow}>
                  <Text style={[styles.headerCell, styles.positionCell]}>Pos</Text>
                  <Text style={[styles.headerCell, styles.teamCell]}>Equipo</Text>
                  <Text style={styles.headerCell}>PTS</Text>
                  <Text style={styles.headerCell}>DIF</Text>
                  <Text style={styles.headerCell}>GF</Text>
                  <Text style={styles.headerCell}>GC</Text>
                  <Text style={styles.headerCell}>JJ</Text>
                  <Text style={styles.headerCell}>JG</Text>
                  <Text style={styles.headerCell}>JE</Text>
                  <Text style={styles.headerCell}>JP</Text>
                </View>
                {displayedTeams.map((team, index) => (
                  <View key={team.id} style={styles.row}>
                    <Text style={[styles.cell, styles.positionCell]}>{startIndex + index + 1}</Text>
                    <View style={[styles.cell, styles.teamCell]}>
                      <Image source={{ uri: team.logo }} style={styles.teamLogo} />
                      <Text style={styles.teamName}>{team.nombreEquipo}</Text>
                    </View>
                    <Text style={styles.cell}>{team.puntos}</Text>
                    <Text style={styles.cell}>{team.golesAFavor - team.golesEnContra}</Text>
                    <Text style={styles.cell}>{team.golesAFavor}</Text>
                    <Text style={styles.cell}>{team.golesEnContra}</Text>
                    <Text style={styles.cell}>
                      {team.partidosGanados + team.partidosEmpatados + team.partidosPerdidos}
                    </Text>
                    <Text style={styles.cell}>{team.partidosGanados}</Text>
                    <Text style={styles.cell}>{team.partidosEmpatados}</Text>
                    <Text style={styles.cell}>{team.partidosPerdidos}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>

            {/* Botones de paginación */}
            <View style={styles.paginationContainer}>
              <TouchableOpacity
                style={[styles.paginationButton, currentPage === 0 && styles.disabledButton]}
                onPress={handlePreviousPage}
                disabled={currentPage === 0}
              >
                <Text style={styles.paginationButtonText}>Anterior</Text>
              </TouchableOpacity>
              <Text style={styles.pageText}>
                Página {currentPage + 1} de {Math.ceil(teams.length / itemsPerPage)}
              </Text>
              <TouchableOpacity
                style={[
                  styles.paginationButton,
                  endIndex >= teams.length && styles.disabledButton,
                ]}
                onPress={handleNextPage}
                disabled={endIndex >= teams.length}
              >
                <Text style={styles.paginationButtonText}>Siguiente</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          !loading && <Text style={styles.noMatchesText}>No hay equipos disponibles.</Text>
        )}

        {/* Pie de página con las abreviaturas */}
        <Text style={styles.footer}>
          • JJ: Juegos Jugados • JG: Juegos Ganados • JE: Juegos Empatados • JP: Juegos Perdidos • GF: Goles a Favor • GC: Goles en Contra • DIF: Diferencia de Goles • PTS: Puntos
        </Text>
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
    alignItems: "center",
    paddingBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
    color: "white",
    padding: 10,
    borderRadius: 5,
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
  horizontalScroll: {
    width: "100%",
  },
  table: {
    width: Dimensions.get("window").width * 2.2,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginHorizontal: 10,
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Fondo semitransparente
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#c00",
    padding: 10,
  },
  headerCell: {
    width: 80,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  positionCell: {
    width: 40,
  },
  teamCell: {
    width: 150,
    flexDirection: "row",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    alignItems: "center",
  },
  cell: {
    width: 80,
    textAlign: "center",
  },
  teamLogo: {
    width: 30,
    height: 30,
    resizeMode: "contain",
    marginRight: 10,
  },
  teamName: {
    fontSize: 14,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Fondo semitransparente
    borderRadius: 5,
    padding: 10,
  },
  paginationButton: {
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
    marginHorizontal: 5,
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
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Fondo semitransparente
    padding: 10,
    borderRadius: 5,
  },
  footer: {
    textAlign: "center",
    padding: 10,
    fontSize: 12,
    color: "#555",
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Fondo semitransparente
    borderRadius: 5,
    marginTop: 10,
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
});

export default ClassificationTable;