import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, RefreshControl, Alert,Image } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import api from '../../config/api';

const HistorialPagos = ({ navigation }) => {
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const { getUserId, getToken, logout } = useContext(AuthContext);

  const fetchEquipos = async () => {
    try {
      setError("");
      setRefreshing(true);
      
      const userId = await getUserId();
      const token = await getToken();

      if (!userId || !token) {
        throw new Error('Faltan credenciales de usuario');
      }

      const response = await api.get(`/api/equipos/porDueno/${userId}`, {
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      });

      setEquipos(response.data || []);
    } catch (err) {
      console.error('Error:', err);
      
      if (err.response?.status === 403) {
        Alert.alert("Sesión expirada", "Por favor, inicia sesión nuevamente.");
        logout();
        return;
      }
      
      setError(err.response?.data?.message || err.message || 'Error al cargar equipos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleEquipoPress = async (equipoId) => {
    try {
      const token = await getToken();
      
      if (!token) {
        throw new Error('Faltan credenciales de usuario');
      }


      navigation.navigate('Historial de Pagos', { 
        equipo: equipos.find(e => e.id === equipoId),
        pagos: response.data
      });
      
    } catch (err) {
      
      if (err.response?.status === 403) {
        Alert.alert("Sesión expirada", "Por favor, inicia sesión nuevamente.");
        logout();
        return;
      }
      
      navigation.navigate('Historial de Pagos', { 
        equipo: equipos.find(e => e.id === equipoId) 
      });
    }
  };

  useEffect(() => {
    fetchEquipos();
  }, []);

  const onRefresh = () => {
    fetchEquipos();
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return ( // ✅ Asegúrate de incluir el return del JSX principal
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#2196F3']}
        />
      }
    >
      <Text style={styles.title}>Mis Equipos</Text>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchEquipos}>
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : equipos.length === 0 ? (
        <Text style={styles.noResults}>No tienes equipos registrados</Text>
      ) : (
          equipos.map((equipo) => (
               <TouchableOpacity 
                 key={equipo.id} 
                 style={styles.card}
                 onPress={() => handleEquipoPress(equipo.id)}
               >
                  <Image 
                   source={{ uri: equipo.logoEquipo }} 
                   style={styles.logo} 
                 />
                 <Text style={styles.equipoNombre}>{equipo.nombreEquipo}</Text>
                 <Text style={styles.detalle}>Campo: {equipo.nombreCampo}</Text>
               </TouchableOpacity>
             ))
           )}
         </ScrollView>
       );
     };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  equipoNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  detalle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  errorContainer: {
    backgroundColor: '#ffecec',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  errorText: {
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noResults: {
    textAlign: 'center',
    color: '#6c757d',
    marginTop: 20,
    fontSize: 16,
  },
  logo: {
    height: 70,
    width:70,
    borderRadius: 25,
    alignSelf:"flex-end"
  },
   
});

export default HistorialPagos;