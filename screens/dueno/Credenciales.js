import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import api from '../../config/api';

const Credenciales = () => {
  const { getUserId, getToken, logout } = useContext(AuthContext);
  
  // Estados del componente
  const [solicitudes, setSolicitudes] = useState([]);
  const [solicitudesFiltradas, setSolicitudesFiltradas] = useState([]);
  const [filtroActivo, setFiltroActivo] = useState('TODAS');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Función principal para obtener las solicitudes
  const obtenerSolicitudes = async (isRefresh = false) => {
    try {
      isRefresh ? setRefreshing(true) : setLoading(true);
      setError(null);

      const userId = await getUserId();
      const token = await getToken();

      if (!userId || !token) {
        throw new Error('Faltan credenciales de usuario');
      }

      const response = await api.get(
        `/api/solicitudes/dueno/pordueno/${userId}`,
        {
          headers: { 
            Authorization: `Bearer ${token}` 
          }
        }
      );

      setSolicitudes(response.data || []);
      aplicarFiltro('TODAS', response.data || []);

    } catch (err) {
      console.error('Error al obtener solicitudes:', err);
      
      if (err.response?.status === 401) {
        await logout();
        setError('Sesión expirada. Por favor inicia sesión nuevamente.');
      } else {
        setError(err.message || 'Error al obtener las solicitudes');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Función para aplicar los filtros
  const aplicarFiltro = (filtro, data = solicitudes) => {
    let filtradas = [];
    
    switch(filtro) {
      case 'ACEPTADAS':
        filtradas = data.filter(sol => sol.resolucion && sol.inscripcionEstatus && !sol.pendiente);
        break;
      case 'PENDIENTES':
        filtradas = data.filter(sol => sol.pendiente);
        break;
      default: // TODAS
        filtradas = [...data];
    }
    
    setSolicitudesFiltradas(filtradas);
    setFiltroActivo(filtro);
  };

  // Función para el refresh manual
  const handleRefresh = () => {
    obtenerSolicitudes(true);
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    obtenerSolicitudes();
  }, []);

  // Renderizar cada item de la lista
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.equipoNombre}>{item.nombreEquipo}</Text>
      <Text>Torneo: {item.nombreTorneo}</Text>
      <Text>Estado: 
        {item.pendiente ? ' Pendiente' : 
         item.resolucion && item.inscripcionEstatus ? ' Aceptada' : ' Rechazada'}
      </Text>
    </View>
  );

  // Mostrar loading inicial
  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Mostrar errores
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Contadores para los botones
  const contarSolicitudes = (tipo) => {
    switch(tipo) {
      case 'ACEPTADAS':
        return solicitudes.filter(sol => sol.resolucion && sol.inscripcionEstatus && !sol.pendiente).length;
      case 'PENDIENTES':
        return solicitudes.filter(sol => sol.pendiente).length;
      default:
        return solicitudes.length;
    }
  };

  // Renderizar la lista principal
  return (
    <View style={styles.container}>
      {/* Botones de filtrado */}
      <View style={styles.filtrosContainer}>
        <TouchableOpacity 
          style={[styles.filtroBoton, filtroActivo === 'TODAS' && styles.filtroBotonActivo]}
          onPress={() => aplicarFiltro('TODAS')}
        >
          <Text style={styles.filtroBotonTexto}>Todas ({solicitudes.length})</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filtroBoton, filtroActivo === 'ACEPTADAS' && styles.filtroBotonActivo]}
          onPress={() => aplicarFiltro('ACEPTADAS')}
        >
          <Text style={styles.filtroBotonTexto}>Aceptadas ({contarSolicitudes('ACEPTADAS')})</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filtroBoton, filtroActivo === 'PENDIENTES' && styles.filtroBotonActivo]}
          onPress={() => aplicarFiltro('PENDIENTES')}
        >
          <Text style={styles.filtroBotonTexto}>Pendientes ({contarSolicitudes('PENDIENTES')})</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de solicitudes */}
      <FlatList
        data={solicitudesFiltradas}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#1a73e8']}
          />
        }
        ListEmptyComponent={
          <View style={styles.centerContainer}>
            <Text>No hay solicitudes {filtroActivo === 'TODAS' ? '' : filtroActivo.toLowerCase()}</Text>
          </View>
        }
        contentContainerStyle={solicitudesFiltradas.length === 0 ? styles.centerContainerList : styles.listContainer}
      />
    </View>
  );
};

// Estilos del componente
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContainerList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  equipoNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
  filtrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filtroBoton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  filtroBotonActivo: {
    backgroundColor: '#FF5958',
  },
  filtroBotonTexto: {
    color: '#333',
    fontWeight: '500',
  },
  filtroBotonActivoTexto: {
    color: '#fff',
  },
});

styles.filtroBotonTexto = {
  ...styles.filtroBotonTexto,
  color: '#333==',
};

styles.filtroBotonActivo = {
  ...styles.filtroBotonActivo,
};

styles.filtroBotonActivoTexto = {
  color: '#FF5958',
};

export default Credenciales;