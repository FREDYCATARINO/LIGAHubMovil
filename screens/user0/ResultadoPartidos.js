import React, { useEffect, useState, useCallback } from "react";
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
  const getScoreDisplay = () => {
    if (!match.jugado) return { mainScore: "VS", showSecondary: false };
    
    const hasValidScores = typeof match.golesLocal === 'number' && 
                          typeof match.golesVisitante === 'number';
    
    if (!hasValidScores) return { mainScore: "-", showSecondary: false };

    const baseScore = {
      mainScore: `${match.golesLocal}-${match.golesVisitante}`,
      showSecondary: false
    };

    if (match.tipoDesempate === 'PENALES' && 
        typeof match.golesLocalPenales === 'number' && 
        typeof match.golesVisitantePenales === 'number') {
      return {
        ...baseScore,
        secondaryScore: `(Penales ${match.golesLocalPenales}-${match.golesVisitantePenales})`,
        showSecondary: true
      };
    }

    if (match.tipoDesempate === 'TIEMPO_EXTRA') {
      return { ...baseScore, secondaryScore: '(T.E.)', showSecondary: true };
    }

    return baseScore;
  };
  const scoreDisplay = getScoreDisplay();

  return (
    <View style={styles.card}>
      <Text style={styles.torneoText}>
        {match.tipoPartido}
      </Text>
      <Text style={styles.date}>
        {match.fechaPartido} - {match.hora}
      </Text>
      <View style={styles.teamsContainer}>
        <View style={styles.teamContainer}>
          <Image
            source={{ uri: match.equipoLocal?.logo || "https://via.placeholder.com/40" }}
            style={styles.teamLogo}
          />
          <Text style={styles.teamName}>{match.equipoLocal?.nombreEquipo}</Text>
        </View>
        
        <View style={styles.scoreContainer}>
          <Text style={styles.score}>
            {scoreDisplay.mainScore}
          </Text>
          {scoreDisplay.showSecondary && (
            <Text style={styles.secondaryScore}>
              {scoreDisplay.secondaryScore}
            </Text>
          )}
        </View>
        
        <View style={styles.teamContainer}>
          <Image
            source={{ uri: match.equipoVisitante?.logo || "https://via.placeholder.com/40" }}
            style={styles.teamLogo}
          />
          <Text style={styles.teamName}>{match.equipoVisitante?.nombreEquipo}</Text>
        </View>
      </View>
      <Text style={styles.field}>
        Cancha: {match.cancha?.descripcion}
      </Text>
      <Text style={styles.field}>
        Árbitro: {match.arbitro?.nombreCompleto}
      </Text>
      <Text style={[styles.status, styles.finalizado]}>
        Finalizado
      </Text>
    </View>
  );
};

const TournamentWinnerCard = ({ torneo }) => {
  if (!torneo.ganador) return null;

  return (
    <View style={styles.winnerCard}>
      <Text style={styles.winnerTitle}>¡Torneo Finalizado!</Text>
      <Text style={styles.winnerSubtitle}>Campeón:</Text>
      
      <View style={styles.winnerTeamContainer}>
        <Image
          source={{ uri: torneo.ganador.logo || "https://via.placeholder.com/80" }}
          style={styles.winnerTeamLogo}
        />
        <Text style={styles.winnerTeamName}>{torneo.ganador.nombreEquipo}</Text>
      </View>
      
      <Text style={styles.tournamentName}>{torneo.nombreTorneo}</Text>
      {torneo.premio && (
        <Text style={styles.prizeText}>Premio: {torneo.premio}</Text>
      )}
    </View>
  );
};

const ResultadoDePartidos = () => {
  const [activeTorneos, setActiveTorneos] = useState([]);
  const [finishedTorneos, setFinishedTorneos] = useState([]);
  const [selectedActiveTorneo, setSelectedActiveTorneo] = useState(null);
  const [selectedFinishedTorneo, setSelectedFinishedTorneo] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [showFinishedTournaments, setShowFinishedTournaments] = useState(false);
  const itemsPerPage = 10;

  const fetchTorneos = useCallback(async () => {
    try {
      setLoading(true);
      const activeResponse = await api.get("/api/torneos/iniciados");
      setActiveTorneos(activeResponse.data);
      
      const finishedResponse = await api.get("/api/torneos/finalizados");
      setFinishedTorneos(finishedResponse.data);
      
      setError(null);
    } catch (error) {
      console.error("Error fetching torneos:", error);
      setError("Error al cargar los torneos. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }, []);

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

  useEffect(() => {
    fetchTorneos();
  }, [fetchTorneos]);

  useEffect(() => {
    if (showFinishedTournaments && selectedFinishedTorneo) {
      fetchMatches(selectedFinishedTorneo);
    } else if (!showFinishedTournaments && selectedActiveTorneo) {
      fetchMatches(selectedActiveTorneo);
    } else {
      setMatches([]);
      setLoading(false);
    }
  }, [selectedActiveTorneo, selectedFinishedTorneo, showFinishedTournaments, fetchMatches]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    if (showFinishedTournaments && selectedFinishedTorneo) {
      fetchMatches(selectedFinishedTorneo);
    } else if (!showFinishedTournaments && selectedActiveTorneo) {
      fetchMatches(selectedActiveTorneo);
    } else {
      fetchTorneos();
    }
    setCurrentPage(0);
  }, [selectedActiveTorneo, selectedFinishedTorneo, showFinishedTournaments, fetchMatches, fetchTorneos]);

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

  const toggleTournamentView = () => {
    setShowFinishedTournaments(!showFinishedTournaments);
    setSelectedActiveTorneo(null);
    setSelectedFinishedTorneo(null);
    setMatches([]);
  };

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
      {/* Selector de vista (Activos/Finalizados) */}
      <View style={styles.viewSelector}>
        <TouchableOpacity
          style={[styles.viewOption, !showFinishedTournaments && styles.activeViewOption]}
          onPress={() => setShowFinishedTournaments(false)}
        >
          <Text style={[styles.viewOptionText, !showFinishedTournaments && styles.activeViewOptionText]}>
            Torneos Activos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.viewOption, showFinishedTournaments && styles.activeViewOption]}
          onPress={() => setShowFinishedTournaments(true)}
        >
          <Text style={[styles.viewOptionText, showFinishedTournaments && styles.activeViewOptionText]}>
            Torneos Finalizados
          </Text>
        </TouchableOpacity>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {loading && !refreshing && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007BFF" />
          <Text style={styles.loadingText}>Cargando datos...</Text>
        </View>
      )}

      {showFinishedTournaments ? (
        <>
          <Text style={styles.sectionTitle}>Torneos Finalizados</Text>

          {/* Picker para seleccionar torneo finalizado */}
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedFinishedTorneo}
              onValueChange={(itemValue) => {
                setSelectedFinishedTorneo(itemValue);
                setSelectedActiveTorneo(null);
                setCurrentPage(0);
              }}
              style={styles.picker}
            >
              <Picker.Item label="Selecciona un torneo finalizado" value={null} />
              {finishedTorneos.map((torneo) => (
                <Picker.Item
                  key={torneo.id}
                  label={torneo.nombreTorneo}
                  value={torneo.id}
                />
              ))}
            </Picker>
          </View>

          {/* Mostrar solo el torneo finalizado seleccionado */}
          {selectedFinishedTorneo && (
            <View style={styles.tournamentContainer}>
              {finishedTorneos
                .filter(torneo => torneo.id === selectedFinishedTorneo)
                .map(torneo => (
                  <React.Fragment key={torneo.id}>
                    <TournamentWinnerCard torneo={torneo} />
                    
                    {/* Botón para cargar partidos (opcional, puedes eliminarlo si prefieres carga automática) */}
                   
                  </React.Fragment>
                ))
              }

              {/* Lista de partidos */}
              {loading ? (
                <ActivityIndicator size="small" color="#007BFF" />
              ) : matches.length > 0 ? (
                <>
                  {displayedMatches.map((match) => (
                    <MatchCard key={`${match.id}-${match.fechaPartido}`} match={match} />
                  ))}

                  {/* Paginación */}
                  {matches.length > itemsPerPage && (
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
                </>
              ) : (
                <Text style={styles.noMatchesText}>
                  No hay partidos finalizados disponibles para este torneo.
                </Text>
              )}
            </View>
          )}
        </>
      ) : (
        <>
          <Text style={styles.sectionTitle}>Torneos Activos</Text>
          
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedActiveTorneo}
              onValueChange={(itemValue) => {
                setSelectedActiveTorneo(itemValue);
                setSelectedFinishedTorneo(null);
                setCurrentPage(0);
              }}
              style={styles.picker}
            >
              <Picker.Item label="Selecciona un torneo activo" value={null} />
              {activeTorneos.map((torneo) => (
                <Picker.Item
                  key={torneo.id}
                  label={torneo.nombreTorneo}
                  value={torneo.id}
                />
              ))}
            </Picker>
          </View>
  
          {!loading && selectedActiveTorneo && (
            <>
              {displayedMatches.length > 0 ? (
                <>
                  {displayedMatches.map((match) => (
                    <MatchCard key={`${match.id}-${match.fechaPartido}`} match={match} />
                  ))}
  
                  {matches.length > itemsPerPage && (
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
                </>
              ) : (
                <Text style={styles.noMatchesText}>No hay partidos finalizados disponibles.</Text>
              )}
            </>
          )}
        </>
      )}
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#f5f5f5',

  },
  viewSelector: {
    flexDirection: 'row',
    marginBottom: 15,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#e0e0e0',
  },
  
  viewOption: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
  },
  activeViewOption: {
    backgroundColor: '#FF5958',
  },
  viewOptionText: {
    color: '#555',
    fontWeight: 'bold',
  },
  activeViewOptionText: {
    color: 'white',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  pickerContainer: {
    marginBottom: 15,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  picker: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  winnerCard: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  winnerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  winnerSubtitle: {
    fontSize: 16,
    color: 'white',
    marginBottom: 10,
  },
  winnerTeamContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  winnerTeamLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'white',
  },
  winnerTeamName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  tournamentName: {
    fontSize: 16,
    color: 'white',
    marginBottom: 5,
    textAlign: 'center',
  },
  prizeText: {
    fontSize: 14,
    color: 'white',
    fontStyle: 'italic',
  },
  selectButton: {
    backgroundColor: '#FF5958',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  selectButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  container: {
    padding: 10,
    alignItems: "center",
    backgroundColor:"dcdcdc"
  },
  card: {
    padding: 20,
    marginVertical: 10,
    borderRadius: 8,
    width: "95%",
    shadowRadius: 10,
    elevation: 3,
    alignItems: "center",
    backgroundColor:"white",

  },
  torneoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
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
  scoreContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  score: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007BFF",
  },
  secondaryScore: {
    fontSize: 12,
    color: '#FF5958',
    fontWeight: 'bold',
    marginTop: 4,
    textAlign: 'center',
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
    width: "100%",
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