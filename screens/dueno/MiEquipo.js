import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, RefreshControl, Alert, Image, Modal, TextInput, Button } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import api from '../../config/api';
import Icon from 'react-native-vector-icons/MaterialIcons';

const MiEquipo = ({ navigation }) => {
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const { getUserId, getToken, logout } = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [nuevoEquipo, setNuevoEquipo] = useState({
    nombreEquipo: '',
    nombreCampo: '',
    logoEquipo: ''
  });

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

      navigation.navigate('MisJugadores', { 
        equipo: equipos.find(e => e.id === equipoId),
        pagos: response.data
      });
      
    } catch (err) {
      
      if (err.response?.status === 403) {
        Alert.alert("Sesión expirada", "Por favor, inicia sesión nuevamente.");
        logout();
        return;
      }
      
      navigation.navigate('Mis Jugadores', { 
        equipoId: equipoId 
      });
    }
  };

  const handleCrearEquipo = async () => {
    try {
      const userId = await getUserId();
      const token = await getToken();

      if (!userId || !token) {
        throw new Error('Faltan credenciales de usuario');
      }

      const response = await api.post('/api/equipos', {
        ...nuevoEquipo,
        duenoId: userId
      }, {
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      });

      setEquipos([...equipos, response.data]);
      setModalVisible(false);
      setNuevoEquipo({
        nombreEquipo: '',
        nombreCampo: '',
        logoEquipo: ''
      });
      Alert.alert("Éxito", "Equipo creado correctamente");
    } catch (err) {
      console.error('Error al crear equipo:', err);
      Alert.alert("Error", err.response?.data?.message || err.message || 'Error al crear equipo');
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
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Mis Equipos</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Icon name="add-circle" size={30} color="#2196F3" />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Nuevo Equipo</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Nombre del equipo"
              value={nuevoEquipo.nombreEquipo}
              onChangeText={(text) => setNuevoEquipo({...nuevoEquipo, nombreEquipo: text})}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Nombre del campo"
              value={nuevoEquipo.nombreCampo}
              onChangeText={(text) => setNuevoEquipo({...nuevoEquipo, nombreCampo: text})}
            />
            
            <TextInput
              style={styles.input}
              placeholder="URL del logo (opcional)"
              value={nuevoEquipo.logoEquipo}
              onChangeText={(text) => setNuevoEquipo({...nuevoEquipo, logoEquipo: text})}
            />
            
            <View style={styles.buttonContainer}>
              <Button
                title="Cancelar"
                color="#ff4444"
                onPress={() => setModalVisible(false)}
              />
              <Button
                title="Crear"
                color="#2196F3"
                onPress={handleCrearEquipo}
              />
            </View>
          </View>
        </View>
      </Modal>

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
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 10,
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
    width: 70,
    borderRadius: 25,
    alignSelf: "flex-end"
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
});

export default MiEquipo;