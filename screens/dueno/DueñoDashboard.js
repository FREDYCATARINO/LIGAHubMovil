import React, { useState, useEffect, useCallback, useContext } from 'react';
import { 
  View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, 
  RefreshControl, ActivityIndicator, Modal, Alert 
} from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext'; // Asegúrate de importar tu AuthContext
import pagosIcon from "../../assets/misPagos.png";
import credencialesIcon from '../../assets/credenciales.png';
import equipoIcon from '../../assets/equipo.png';
import historialIcon from '../../assets/historial.png';
import { Picker } from '@react-native-picker/picker';
import api from '../../config/api';

const TorneoScreen = () => {
  const navigation = useNavigation();
  const { getUserId, getToken } = useContext(AuthContext);
  
  // Estados para la convocatoria
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Estados para el modal de inscripción
  const [modalVisible, setModalVisible] = useState(false);
  const [equipos, setEquipos] = useState([]);
  const [torneos, setTorneos] = useState([]);
  const [selectedEquipo, setSelectedEquipo] = useState(null);
  const [selectedTorneo, setSelectedTorneo] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  // Función para configurar los headers con el token
  const getAuthHeaders = async () => {
    const token = await getToken();
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  const fetchConvocatoria = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const headers = await getAuthHeaders();
      const response = await api.get("/api/convocatorias/activa", headers);
      setImageUrl(response.data);
    } catch (error) {
      
      let errorMessage = "Error al cargar la convocatoria";
      
      // 1. Primero verificamos problemas de conexión
      if (error.request && !error.response) {
        errorMessage = "Problema de conexión. Verifica tu internet e inténtalo nuevamente.";
      
      // 2. Luego verificamos si es el caso de datos vacíos
      } else if (error.message === 'NO_DATA') {
        errorMessage = "No hay convocatorias en este momento";
      
      // 3. Para otros errores (excluyendo específicamente el 403)
      } else if (error.response?.status !== 403) {
        // Solo mostramos mensajes de error que no sean 403
        errorMessage = error.response?.data?.message 
                     || (error.response?.status === 404 ? "No se encontraron convocatorias" : "Error al obtener datos")
                     || error.message
                     || "Error desconocido";
      }
      
      // Solo establecemos el error si no es 403
      if (!error.response || error.response.status !== 403) {
        setErrorGoleadores(errorMessage);
      }
      
    }  finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Función para cargar los equipos del usuario
  const fetchEquipos = async () => {
    try {
      const userId = await getUserId();
      const headers = await getAuthHeaders();
      const response = await api.get(`/api/equipos/porDueno/${userId}`, headers);
      setEquipos(response.data);
    } catch (error) {
      console.error("Error fetching equipos:", error);
      Alert.alert("Error", "No se pudieron cargar los equipos");
    }
  };

  // Función para cargar los torneos en espera
  const fetchTorneos = async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await api.get('/api/torneos/espera', headers);
      setTorneos(response.data);
    } catch (error) {
      console.error("Error fetching torneos:", error);
      Alert.alert("Error", "No se pudieron cargar los torneos");
    }
  };

  // Función para manejar la inscripción
  const handleInscribir = async () => {
    if (!selectedEquipo || !selectedTorneo) {
      Alert.alert("Error", "Debes seleccionar un equipo y un torneo");
      return;
    }

    setModalLoading(true);
    try {
      const headers = await getAuthHeaders();
      await api.post(`/api/solicitudes/${selectedEquipo}/${selectedTorneo}`, {}, headers);
      Alert.alert("Éxito", "Solicitud enviada correctamente");
      setModalVisible(false);
    } catch (error) {
      console.error("Error enviando solicitud:", error);
      Alert.alert("Error", "No se pudo enviar la solicitud");
    } finally {
      setModalLoading(false);
    }
  };

  // Efecto para carga inicial
  useEffect(() => {
    fetchConvocatoria();
  }, []);

  // Función para manejar el refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchConvocatoria();
  }, []);

  // Función para abrir el modal y cargar los datos
  const openInscripcionModal = async () => {
    setModalVisible(true);
    await fetchEquipos();
    await fetchTorneos();
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#0000ff"]}
            tintColor="#0000ff"
          />
        }
      >
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate('Mis Pagos')}
          >
            <Image source={pagosIcon} style={styles.buttonIcon} />
            <Text>Mis pagos</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate('Solicitudes')}
          >
            <Image source={credencialesIcon} style={styles.buttonIcon} />
            <Text>Mis Solicitudes</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate('Mi Equipo')}
          >
            <Image source={equipoIcon} style={styles.buttonIcon} />
            <Text>Mi equipo</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate('Historial de pagos')}
          >
            <Image source={historialIcon} style={styles.buttonIcon} />
            <Text>Historial de pagos</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.errorText}>{error}</Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#0000ff"]}
          tintColor="#0000ff"
        />
      }
    >
      {/* Sección de botones */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('Mis Pagos')}
        >
          <Image source={pagosIcon} style={styles.buttonIcon} />
          <Text>Mis pagos</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('Solicitudes')}
        >
          <Image source={credencialesIcon} style={styles.buttonIcon} />
          <Text>Mis Solicitudes</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('Mi Equipo')}
        >
          <Image source={equipoIcon} style={styles.buttonIcon} />
          <Text>Mi equipo</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('Historial de pagos')}
        >
          <Image source={historialIcon} style={styles.buttonIcon} />
          <Text>Historial de pagos</Text>
        </TouchableOpacity>
      </View>

      {/* Sección de torneo */}
      <View style={styles.card}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.tournamentImage}
            resizeMode="cover"
            onError={(e) => {
              console.error("Error al cargar la imagen:", e.nativeEvent.error);
              setError("Error al cargar la imagen. Verifica la URL.");
            }}
          />
        ) : (
          <Text style={styles.noImageText}>No hay convocatoria disponible</Text>
        )}
        
        <TouchableOpacity 
          style={styles.buttonInscribirse}
          onPress={openInscripcionModal}
        >
          <Text style={styles.buttonText}>Inscribirme</Text>
        </TouchableOpacity>
      </View>

      {/* Modal de inscripción */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Inscripción a Torneo</Text>
            
            <Text>Selecciona tu equipo:</Text>
            <Picker
              selectedValue={selectedEquipo}
              onValueChange={(itemValue) => setSelectedEquipo(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Selecciona un equipo" value={null} />
              {equipos.map((equipo) => (
                <Picker.Item 
                  key={equipo.id} 
                  label={equipo.nombreEquipo} 
                  value={equipo.id} 
                />
              ))}
            </Picker>

            <Text>Selecciona un torneo:</Text>
            <Picker
              selectedValue={selectedTorneo}
              onValueChange={(itemValue) => setSelectedTorneo(itemValue)}
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

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleInscribir}
                disabled={modalLoading}
              >
                <Text style={styles.modalButtonText}>
                  {modalLoading ? "Enviando..." : "Enviar Solicitud"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f4f4f4' 
  },
  buttonsContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-around', 
    marginVertical: 10,
    paddingHorizontal: 10 
  },
  button: { 
    backgroundColor: '#fff', 
    padding: 15, 
    width: '45%', 
    alignItems: 'center', 
    borderRadius: 8, 
    marginBottom: 10, 
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonIcon: { 
    width: 24, 
    height: 24, 
    marginRight: 8 
  },
  card: { 
    backgroundColor: '#fff', 
    borderRadius: 10, 
    margin: 15, 
    padding: 15, 
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tournamentImage: { 
    width: '100%', 
    height: 500,
    borderRadius: 10, 
    marginBottom: 10,
    resizeMode: 'cover'
  },
  infoContainer: { 
    paddingHorizontal: 5 
  },
  tournamentTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 10,
    color: '#333'
  },
  text: { 
    fontSize: 14, 
    marginBottom: 8,
    color: '#555'
  },
  warningBox: { 
    backgroundColor: '#ffebee', 
    padding: 10, 
    borderRadius: 5, 
    marginVertical: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336'
  },
  warningText: { 
    color: '#d32f2f', 
    fontSize: 14, 
    fontWeight: 'bold' 
  },
  buttonInscribirse: { 
    backgroundColor: '#FF5958', 
    padding: 12, 
    borderRadius: 5, 
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: { 
    color: '#fff', 
    fontWeight: 'bold',
    fontSize: 16
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 16,
    textAlign: 'center',
    margin: 20
  },
  noImageText: {
    textAlign: 'center',
    marginVertical: 20,
    color: '#555'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  picker: {
    height: 100,
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding:10
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    padding:10
  },
  modalButton: {
    padding: 12,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
    color:'#FF5958'
  },
  cancelButton: {
    backgroundColor: '#cccccc',
  },
  submitButton: {
    backgroundColor: '#FF5958',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});


export default TorneoScreen;