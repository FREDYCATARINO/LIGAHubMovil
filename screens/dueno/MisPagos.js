import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../context/AuthContext';
import api from '../../config/api';

const MisEquipos = () => {
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { userToken, getUserId } = useContext(AuthContext);

  const fetchEquipos = async () => {
    try {
      setError(null);
      setRefreshing(true);
      
      // Verificación mejorada del token
      const token = userToken || await AsyncStorage.getItem('userToken');
      console.log('Token usado:', token);
      
      if (!token) {
        throw new Error('No autenticado. Por favor inicia sesión.');
      }

      const userId = await getUserId();
      if (!userId) {
        throw new Error('No se pudo obtener el ID de usuario');
      }
      
      const response = await api.get(`/api/equipos/porDueno/${userId}`, {
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      });

      setEquipos(response.data || []);
    } catch (err) {
      console.error('Error al cargar equipos:', err);
      setError(err.message || 'Error al cargar los equipos');
      setEquipos([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEquipos();
  }, [userToken]);

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

  return (
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
          <View key={equipo.id} style={styles.card}>
            <Text style={styles.equipoNombre}>{equipo.nombreEquipo}</Text>
            <Text style={styles.detalle}>Campo: {equipo.nombreCampo}</Text>
            <Text style={styles.detalle}>Dirección: {equipo.direccionCampo}</Text>
          </View>
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
});

export default MisEquipos;