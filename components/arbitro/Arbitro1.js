import React, { useState, useEffect, useContext } from 'react';
import {
  Text,
  StyleSheet,
  SafeAreaView,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  FlatList,
  RefreshControl
} from "react-native";
import { AuthContext } from '../../context/AuthContext';
import api from '../../config/api';
import colores from "../../style/colors";
import FONTS from "../../style/fonts";
import { Oswald_700Bold } from "@expo-google-fonts/oswald";
import { Nunito_700Bold } from "@expo-google-fonts/nunito";

const PartidosArbitro = ({ navigation }) => {
  const { getUserId, getToken } = useContext(AuthContext);
  const [partidos, setPartidos] = useState([]);
  const [filtro, setFiltro] = useState(1); // 1: Todos, 2: Nuevos, 3: Terminados
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Función para obtener los partidos del árbitro
  const obtenerPartidos = async (isRefresh = false) => {
  try {
    isRefresh ? setRefreshing(true) : setLoading(true);
    setError(null);

    const userId = await getUserId();
    const token = await getToken();

    if (!userId || !token) {
      throw new Error('Faltan credenciales de usuario');
    }

    const response = await api.get(`/api/partidos/arbitro/asignados/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log("Datos recibidos de la API:", response.data); // Depuración

    // Mapeamos la respuesta al formato esperado, asegurando que los valores existan
    const partidosFormateados = response.data.map(partido => ({
      id: partido.id,
      equipo1: {
        nombre: partido.equipoLocal?.nombreEquipo || "Equipo Desconocido",
        img: partido.equipoLocal?.logo?.startsWith("http") 
             ? partido.equipoLocal.logo 
             : "https://via.placeholder.com/50" // Imagen por defecto si falta o está mal
      },
      equipo2: {
        nombre: partido.equipoVisitante?.nombreEquipo || "Equipo Desconocido",
        img: partido.equipoVisitante?.logo?.startsWith("http") 
             ? partido.equipoVisitante.logo 
             : "https://via.placeholder.com/50"
      },
      fecha: partido.fechaPartido 
             ? new Date(partido.fechaPartido).toLocaleDateString() 
             : "Fecha no disponible",
      hora: partido.hora 
            ? partido.hora.substring(0, 5) 
            : "Hora no disponible",
      lugar: partido.cancha?.campo?.nombre || "Lugar desconocido",
      estado: partido.jugado ? "Finalizado" : "Nuevo",
      golesLocal: partido.golesLocal ?? "-",
      golesVisitante: partido.golesVisitante ?? "-",
      partidoOriginal: partido // Guardamos el objeto original para detalles
    }));

    setPartidos(partidosFormateados);

  } catch (err) {
    console.error('Error al obtener partidos:', err);
    setError(err.message || 'Error al obtener los partidos');
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};


  // Función para manejar el refresh
  const handleRefresh = () => {
    obtenerPartidos(true);
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    obtenerPartidos();
  }, []);

  // Filtrar partidos según selección
  const partidosFiltrados = () => {
    switch(filtro) {
      case 2: // Nuevos
        return partidos.filter(p => p.estado === "Nuevo");
      case 3: // Terminados
        return partidos.filter(p => p.estado === "Finalizado");
      default: // Todos
        return [...partidos].sort((a, b) => {
          return a.estado === "Nuevo" && b.estado !== "Nuevo" ? -1 : 
                 b.estado === "Nuevo" && a.estado !== "Nuevo" ? 1 : 0;
        });
    }
  };

  // Mostrar loading inicial
  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colores.domin_2_2} />
      </View>
    );
  }

  // Mostrar errores
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.reintentarButton}
          onPress={obtenerPartidos}
        >
          <Text style={styles.reintentarText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={[styles.title, FONTS.nunitoNegrita]}>
        Lista de partidos
      </Text>
      <View style={styles.divider}></View>
      
      {/* Filtros */}
      <View style={styles.headerRow}>
        <Text style={[FONTS.oswald, styles.filterText]}>Filtrar:</Text>
        <View style={styles.filterButtonsContainer}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filtro === 1 ? styles.filterButtonActive : styles.filterButtonInactive
            ]}
            onPress={() => setFiltro(1)}
          >
            <Text style={[
              FONTS.oswald,
              filtro === 1 ? styles.filterTextActive : styles.filterTextInactive
            ]}>
              Todos ({partidos.length})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              filtro === 2 ? styles.filterButtonActive : styles.filterButtonInactive
            ]}
            onPress={() => setFiltro(2)}
          >
            <Text style={[
              FONTS.oswald,
              filtro === 2 ? styles.filterTextActive : styles.filterTextInactive
            ]}>
              Nuevos ({partidos.filter(p => p.estado === "Nuevo").length})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              filtro === 3 ? styles.filterButtonActive : styles.filterButtonInactive
            ]}
            onPress={() => setFiltro(3)}
          >
            <Text style={[
              FONTS.oswald,
              filtro === 3 ? styles.filterTextActive : styles.filterTextInactive
            ]}>
              Terminados ({partidos.filter(p => p.estado === "Finalizado").length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Lista de partidos */}
      <FlatList
        data={partidosFiltrados()}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colores.domin_2_2]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[FONTS.oswald, styles.emptyText]}>
              No hay partidos {filtro === 1 ? '' : filtro === 2 ? 'nuevos' : 'terminados'}
            </Text>
          </View>
        }
        renderItem={({ item: partido }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("Detalles de partido", { partido: partido.partidoOriginal })}
            style={[
              styles.card,
              partido.estado === "Nuevo" ? styles.cardActive : styles.cardInactive
            ]}
          >
            <View style={styles.teamsContainer}>
              <View style={styles.teamContainer}>
                <Image
                  source={{ uri: partido.equipo1.img }}
                  style={styles.teamImage}
                />
                <Text style={[FONTS.oswaldNegrita, styles.teamName]}>
                  {partido.equipo1.nombre}
                </Text>
                {partido.estado === "Finalizado" && (
                  <Text style={[FONTS.oswaldNegrita, styles.scoreText]}>
                    {partido.golesLocal}
                  </Text>
                )}
              </View>
              
              <Text style={[FONTS.oswaldNegrita, styles.vsText]}>-</Text>
              
              <View style={styles.teamContainer}>
                <Image
                  source={{ uri: partido.equipo2.img }}
                  style={styles.teamImage}
                />
                <Text style={[FONTS.oswaldNegrita, styles.teamName]}>
                  {partido.equipo2.nombre}
                </Text>
                {partido.estado === "Finalizado" && (
                  <Text style={[FONTS.oswaldNegrita, styles.scoreText]}>
                    {partido.golesVisitante}
                  </Text>
                )}
              </View>
            </View>
            
            <Text style={[FONTS.oswald, styles.matchDate]}>
              {partido.fecha} - {partido.hora}
            </Text>
            <Text style={[FONTS.oswald, styles.matchLocation]}>
              {partido.lugar}
            </Text>
            <View style={[
              styles.statusBadge,
              partido.estado === "Nuevo" ? styles.statusNew : styles.statusFinished
            ]}>
              <Text style={[FONTS.oswald, styles.statusText]}>
                {partido.estado}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colores.blanco,
    padding: 10
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colores.blanco
  },
  title: {
    fontSize: 25,
    paddingVertical: 15,
    paddingHorizontal: 5,
    color: colores.negro,
    textAlign: 'center'
  },
  divider: {
    width: '90%',
    height: 1,
    backgroundColor: colores.base_1_3,
    marginHorizontal: 20,
    marginVertical: 10,
    alignSelf: 'center'
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    flexWrap: 'wrap'
  },
  filterText: {
    fontSize: 18,
    color: colores.negro,
    marginRight: 10
  },
  filterButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 5
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colores.domin_2_2
  },
  filterButtonActive: {
    backgroundColor: colores.domin_2_2
  },
  filterButtonInactive: {
    backgroundColor: colores.blanco
  },
  filterTextActive: {
    color: colores.blanco,
    fontSize: 16
  },
  filterTextInactive: {
    color: colores.negro,
    fontSize: 16
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 10
  },
  listContent: {
    paddingBottom: 20
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  emptyText: {
    fontSize: 18,
    color: colores.base_1_3
  },
  card: {
    width: '48%',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colores.negro,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  cardActive: {
    backgroundColor: colores.blanco,
    borderWidth: 1,
    borderColor: colores.domin_2_2
  },
  cardInactive: {
    backgroundColor: colores.base_2_5
  },
  teamsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10
  },
  teamContainer: {
    alignItems: 'center',
    flex: 1
  },
  teamImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginBottom: 5
  },
  teamName: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 5
  },
  scoreText: {
    fontSize: 18,
    color: colores.domin_2_2
  },
  vsText: {
    fontSize: 24,
    marginHorizontal: 5
  },
  matchDate: {
    fontSize: 16,
    marginBottom: 5,
    color: colores.negro
  },
  matchLocation: {
    fontSize: 14,
    textAlign: 'center',
    color: colores.base_1_3
  },
  statusBadge: {
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10
  },
  statusNew: {
    backgroundColor: colores.domin_2_2
  },
  statusFinished: {
    backgroundColor: colores.base_1_3
  },
  statusText: {
    color: colores.blanco,
    fontSize: 14
  },
  errorText: {
    color: colores.rojo,
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center'
  },
  reintentarButton: {
    backgroundColor: colores.domin_2_2,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5
  },
  reintentarText: {
    color: colores.blanco,
    fontFamily: 'Oswald_700Bold'
  }
});

export default PartidosArbitro;