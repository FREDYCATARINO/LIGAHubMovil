import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import api from '../../config/api';
import { Ionicons } from '@expo/vector-icons'; // Asegúrate de tener esta importación


const DetalleEquipo = ({ route, navigation }) => {
  const { equipo, pagos: pagosIniciales } = route.params;

  // Estados mejorados
  const [pagosData, setPagosData] = useState(pagosIniciales || null);
  const [loadingPagos, setLoadingPagos] = useState(!pagosIniciales);
  const [error, setError] = useState('');
  const { getToken, logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchPagos = async () => {
      if (pagosIniciales) {
        const pagosPagados = pagosIniciales.filter(pago => pago.estatusPago === true);
        setPagosData(pagosPagados);
        return;
      }

      try {
        setError('');
        setLoadingPagos(true);
        const token = await getToken();

        if (!token) {
          throw new Error('Token no disponible');
        }

        console.log(`Solicitando pagos para equipo ${equipo.id}`);
        const response = await api.get(`/api/pagos/equipo/${equipo.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Filtrar SOLO los pagos con estatusPago: true
        const pagosPagados = response.data.filter(pago => pago.estatusPago === false);
        setPagosData(pagosPagados);

        console.log('Pagos pagados recibidos:', pagosPagados);

      } catch (err) {
        console.error('Error al obtener pagos:', err);

        if (err.response?.status === 403) {
          Alert.alert("Sesión expirada", "Por favor inicia sesión nuevamente");
          logout();
        } else {
          setError(err.response?.data?.message || err.message || 'Error al cargar pagos');
        }
      } finally {
        setLoadingPagos(false);
      }
    };

    fetchPagos();
  }, [equipo.id]);

  return (
    <ScrollView style={styles.container}>

      <View style={styles.section}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Mis Pagos')}
          >
          <Ionicons name="arrow-back" style={styles.iconBack} size={24} color="#2196F3"> 

          </Ionicons>
        </TouchableOpacity>
        <Text style={styles.title}>{equipo.nombreEquipo}</Text>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Campo:</Text>
          <Text style={styles.value}>{equipo.nombreCampo}</Text>
        </View>

        {equipo.descripcion && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Descripción:</Text>
            <Text style={styles.value}>{equipo.descripcion}</Text>
          </View>
        )}
      </View>

      {/* Sección de pagos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pagos Pendientes</Text>

        {loadingPagos ? (
          <ActivityIndicator size="small" color="#0000ff" />
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => {
                setLoadingPagos(true);
                setError('');
              }}
            >
              <Text style={styles.retryText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        ) : pagosData.length === 0 ? (
          <Text style={styles.noResults}>No hay registros de pagos</Text>
        ) : (
          pagosData.map((pago, index) => (
            <View key={index} style={styles.pagoCard}>
              <View style={styles.pagoRow}>
                <Text style={styles.pagoLabel}>Descripción:</Text>
                <Text style={styles.pagoValue}>
                  {pago.descripcion.length > 12
                    ? pago.descripcion.slice(0, -12)
                    : pago.descripcion}
                </Text>
              </View>
              <View style={styles.pagoRow}>
                <Text style={styles.pagoLabel}>Tipo de pago:</Text>
                <Text style={styles.pagoValue}>{pago.tipoPago}</Text>
              </View>
              <View style={styles.pagoRow}>
                <Text style={styles.pagoLabel}>Monto:</Text>
                <Text style={styles.pagoValue}>${pago.monto}</Text>
              </View>
              <View style={styles.pagoRow}>
                <Text style={styles.pagoLabel}>Fecha límite:</Text>
                <Text style={styles.pagoValue}>{pago.fechaLimitePago}</Text>
              </View>
              <View style={styles.pagoRow}>
                <Text style={styles.pagoLabel}>Estado:</Text>
                <Text style={[
                  styles.pagoValue,
                  pago.estatusPago ? styles.approved : styles.pending
                ]}>
                  {pago.estatusPago ? 'Pagado' : 'Pendiente'}
                </Text>
              </View>
            </View>
          ))
        )}



        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.actionButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    width: 100,
    color: '#555',
  },
  value: {
    flex: 1,
    color: '#333',
  },
  pagoCard: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftColor: '#FF5958',
    borderLeftWidth: 4

  },
  pagoRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  pagoLabel: {
    fontWeight: 'bold',
    width: 100,
    color: '#555',
  },
  pagoValue: {
    flex: 1,
    color: '#333',
  },
  approved: {
    color: 'green',
  },
  pending: {
    color: 'orange',
  },
  rejected: {
    color: 'red',
  },
  errorContainer: {
    backgroundColor: '#ffecec',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  errorText: {
    color: '#dc3545',
    marginBottom: 8,
  },
  retryButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  retryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noResults: {
    textAlign: 'center',
    color: '#6c757d',
    fontStyle: 'italic',
  },
  actionsContainer: {
    justifyContent: 'center',
    marginTop: 10,
  },
  actionButton: {
    backgroundColor: '#FF5958',
    padding: 1,
    borderRadius: 6,
    flex: 1,
    marginHorizontal: 8,
    alignItems: 'center',

  },
  actionButtonText: {
    fontWeight: 'bold',
    padding: 10,
    color: "white"
  },
  iconBack: {
    color: "#FF5958"
  },
});

export default DetalleEquipo;