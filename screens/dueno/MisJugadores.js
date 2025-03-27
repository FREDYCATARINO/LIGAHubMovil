import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  ActivityIndicator, 
  Dimensions,
  TouchableOpacity,
  Modal,
  Alert,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import api from '../../config/api';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const { width } = Dimensions.get('window');
const NUM_COLUMNS = 2;
const CARD_WIDTH = (width - 30) / NUM_COLUMNS;

const MisJugadores = ({ route }) => {
  const { equipoId, equipoNombre } = route.params;
  const { getToken, logout } = useContext(AuthContext);
  const [jugadores, setJugadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    numeroCamiseta: '',
    fechaNacimiento: '',
  });
  const [fotoUri, setFotoUri] = useState(null);

  useEffect(() => {
    const fetchJugadores = async () => {
      try {
        const token = await getToken();
        const response = await api.get(`/api/jugadores/porEquipo/${equipoId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setJugadores(response.data);
      } catch (err) {
        if (err.response?.status === 401) {
          Alert.alert('Sesión expirada', 'Por favor inicia sesión nuevamente');
          logout();
          return;
        }
        setError(err.response?.data?.message || err.message || 'Error al cargar jugadores');
      } finally {
        setLoading(false);
      }
    };
    fetchJugadores();
  }, [equipoId, getToken, logout]);

  const resetForm = () => {
    setFormData({
      nombreCompleto: '',
      numeroCamiseta: '',
      fechaNacimiento: '',
    });
    setFotoUri(null);
    setSelectedPlayer(null);
  };

  const openEditModal = (jugador) => {
    resetForm();
    setSelectedPlayer(jugador);
    setFormData({
      nombreCompleto: jugador.nombreCompleto,
      numeroCamiseta: jugador.numeroCamiseta.toString(),
      fechaNacimiento: jugador.fechaNacimiento,
    });
    setFotoUri(jugador.fotoJugador);
    setShowEditModal(true);
  };

  const openDisableModal = (jugador) => {
    setSelectedPlayer(jugador);
    setShowConfirmModal(true);
  };

  const handleChangeStatus = async () => {
    try {
      const token = await getToken();
      await api.put(
        `/api/jugadores/estatus/${selectedPlayer.id}`,
        { habilitado: !selectedPlayer.habilitado },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setJugadores(jugadores.map(j => 
        j.id === selectedPlayer.id ? { ...j, habilitado: !j.habilitado } : j
      ));
      
      setShowConfirmModal(false);
      Alert.alert(
        'Éxito', 
        `Jugador ${selectedPlayer.habilitado ? 'deshabilitado' : 'habilitado'} correctamente`
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo cambiar el estado del jugador');
    }
  };

  const selectPhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setFotoUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setFotoUri(result.assets[0].uri);
    }
  };

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async () => {
    try {
      const errors = [];
      if (!formData.nombreCompleto?.trim()) errors.push('Nombre completo requerido');
      if (!formData.numeroCamiseta?.trim()) errors.push('Número de camiseta requerido');
      if (!formData.fechaNacimiento?.trim()) errors.push('Fecha de nacimiento requerida');
      if (!fotoUri) errors.push('Imagen requerida');
      if (!equipoId) errors.push('Equipo no asignado');

      if (errors.length > 0) {
        throw new Error(errors.join('\n'));
      }

      const token = await getToken();
      
      const base64Image = await FileSystem.readAsStringAsync(fotoUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const requestData = {
        nombreCompleto: formData.nombreCompleto.trim(),
        fechaNacimiento: formData.fechaNacimiento.trim(),
        numero_camiseta: formData.numeroCamiseta.trim(),
        idEquipo: Number(equipoId),
        imagen: `data:image/jpeg;base64,${base64Image}`
      };

      const response = await api.post('/api/jugadores/movil', requestData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      setJugadores([...jugadores, {
        ...response.data,
        equipo: { id: equipoId, nombre: equipoNombre },
        fotoJugador: fotoUri
      }]);
      
      setShowRegisterModal(false);
      resetForm();
      Alert.alert('Éxito', 'Jugador registrado correctamente');

    } catch (error) {
      console.error('Error detallado:', {
        message: error.message,
        response: error.response?.data,
        request: error.config?.data
      });

      Alert.alert(
        'Error al registrar',
        error.response?.data?.message || 
        error.message || 
        'Revise los datos e intente nuevamente'
      );
    }
  };

  const handleUpdate = async () => {
    try {
      if (!formData.nombreCompleto?.trim()) throw new Error('Debes ingresar el nombre completo');
      if (!formData.numeroCamiseta?.trim()) throw new Error('Debes ingresar el número de camiseta');
      if (!formData.fechaNacimiento?.trim()) throw new Error('Debes ingresar la fecha de nacimiento');

      const token = await getToken();
      
      let base64Image = '';
      if (fotoUri && fotoUri !== selectedPlayer.fotoJugador) {
        try {
          const fileInfo = await FileSystem.getInfoAsync(fotoUri);
          if (!fileInfo.exists) throw new Error('La imagen seleccionada no existe');

          base64Image = await FileSystem.readAsStringAsync(fotoUri, {
            encoding: FileSystem.EncodingType.Base64,
          });
        } catch (imageError) {
          console.error('Error procesando imagen:', imageError);
          Alert.alert('Error', 'No se pudo procesar la imagen');
          return;
        }
      }

      const requestData = {
        nombreCompleto: formData.nombreCompleto.trim(),
        fechaNacimiento: formData.fechaNacimiento.trim(),
        numero_camiseta: formData.numeroCamiseta.trim(),
        idEquipo: equipoId,
        ...(base64Image && { imagen: `data:image/jpeg;base64,${base64Image}` })
      };

      const response = await fetch(`${api.defaults.baseURL}/api/jugadores/movil/${selectedPlayer.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar jugador');
      }

      const data = await response.json();

      setJugadores(jugadores.map(j => 
        j.id === selectedPlayer.id ? { 
          ...data,
          fotoJugador: fotoUri || selectedPlayer.fotoJugador
        } : j
      ));
      
      Alert.alert('Éxito', 'Jugador actualizado correctamente');
      setShowEditModal(false);
      resetForm();
      
    } catch (error) {
      console.error('Error completo:', {
        error: error.message,
        response: error.response?.data
      });
      
      Alert.alert('Error', error.message || 'Error al actualizar jugador');
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.cardContainer, { width: CARD_WIDTH }]}>
      <View style={[
        styles.jugadorCard,
        !item.habilitado && styles.cardDeshabilitada
      ]}>
        {!item.habilitado && (
          <Text style={styles.deshabilitadoText}>Deshabilitado</Text>
        )}
        
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => openEditModal(item)}
        >
          <Icon name="edit" size={18} color="#333" />
        </TouchableOpacity>
        
        <Image 
          source={{ uri: item.fotoJugador }} 
          style={[
            styles.fotoJugador,
            !item.habilitado && styles.fotoDeshabilitada
          ]}
        />
        
        <Text style={[
          styles.nombre,
          !item.habilitado && styles.textoDeshabilitado
        ]} numberOfLines={1}>
          {item.nombreCompleto}
        </Text>
        
        <Text style={[
          styles.detalle,
          !item.habilitado && styles.textoDeshabilitado
        ]}>
          Camiseta: {item.numeroCamiseta}
        </Text>
        
        {item.expulsado && (
          <Text style={styles.expulsado}>EXPULSADO</Text>
        )}
        
        <View style={styles.equipoContainer}>
          <Image 
            source={{ uri: item.equipo?.logo }} 
            style={[
              styles.logoEquipo,
              !item.habilitado && styles.logoDeshabilitado
            ]} 
          />
          <View style={styles.teamNameContainer}>
            <Text 
              style={[
                styles.nombreEquipo,
                !item.habilitado && styles.textoDeshabilitado
              ]} 
              numberOfLines={1}
            >
              {item.equipo?.nombreEquipo}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.disableButton}
            onPress={() => openDisableModal(item)}
          >
            <Icon 
              name={item.habilitado ? "toggle-off" : "toggle-on"} 
              size={18} 
              color={item.habilitado ? "green" : "red"} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={false}
        visible={showRegisterModal}
        onRequestClose={() => {
          setShowRegisterModal(false);
          resetForm();
        }}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <ScrollView contentContainerStyle={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Registrar Nuevo Jugador</Text>
              <TouchableOpacity onPress={() => {
                setShowRegisterModal(false);
                resetForm();
              }}>
                <Icon name="close" size={24} />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.label}>Nombre Completo</Text>
            <TextInput
              style={styles.input}
              value={formData.nombreCompleto}
              onChangeText={(text) => handleChange('nombreCompleto', text)}
            />
            
            <Text style={styles.label}>Número de Camiseta</Text>
            <TextInput
              style={styles.input}
              value={formData.numeroCamiseta}
              onChangeText={(text) => handleChange('numeroCamiseta', text)}
              keyboardType="numeric"
            />
            
            <Text style={styles.label}>Fecha de Nacimiento</Text>
            <TextInput
              style={styles.input}
              value={formData.fechaNacimiento}
              onChangeText={(text) => handleChange('fechaNacimiento', text)}
              placeholder="AAAA-MM-DD"
            />
            
            <Text style={styles.label}>Foto del Jugador</Text>
            <TouchableOpacity onPress={selectPhoto}>
              {fotoUri ? (
                <Image source={{ uri: fotoUri }} style={styles.imagePreview} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Icon name="add-a-photo" size={30} color="#888" />
                  <Text>Seleccionar imagen</Text>
                </View>
              )}
            </TouchableOpacity>
            
            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setShowRegisterModal(false);
                  resetForm();
                }}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.submitButton]}
                onPress={handleRegister}
              >
                <Text style={styles.buttonText}>Registrar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>

      <Modal
        animationType="slide"
        transparent={false}
        visible={showEditModal}
        onRequestClose={() => {
          setShowEditModal(false);
          resetForm();
        }}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <ScrollView contentContainerStyle={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar Jugador</Text>
              <TouchableOpacity onPress={() => {
                setShowEditModal(false);
                resetForm();
              }}>
                <Icon name="close" size={24} />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.label}>Nombre Completo</Text>
            <TextInput
              style={styles.input}
              value={formData.nombreCompleto}
              onChangeText={(text) => handleChange('nombreCompleto', text)}
            />
            
            <Text style={styles.label}>Número de Camiseta</Text>
            <TextInput
              style={styles.input}
              value={formData.numeroCamiseta}
              onChangeText={(text) => handleChange('numeroCamiseta', text)}
              keyboardType="numeric"
            />
            
            <Text style={styles.label}>Fecha de Nacimiento</Text>
            <TextInput
              style={styles.input}
              value={formData.fechaNacimiento}
              onChangeText={(text) => handleChange('fechaNacimiento', text)}
              placeholder="AAAA-MM-DD"
            />
            
            <Text style={styles.label}>Foto del Jugador</Text>
            <TouchableOpacity onPress={selectPhoto}>
              {fotoUri ? (
                <Image source={{ uri: fotoUri }} style={styles.imagePreview} />
              ) : (
                <Image source={{ uri: selectedPlayer?.fotoJugador }} style={styles.imagePreview} />
              )}
            </TouchableOpacity>
            
            <View style={styles.photoOptions}>
              <TouchableOpacity onPress={selectPhoto}>
                <Text>Galería</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={takePhoto}>
                <Text>Cámara</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setShowEditModal(false);
                  resetForm();
                }}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.submitButton]}
                onPress={handleUpdate}
              >
                <Text style={styles.buttonText}>Actualizar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={showConfirmModal}
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.confirmModalContainer}>
          <View style={styles.confirmModalContent}>
            <Text style={styles.confirmModalTitle}>
              {selectedPlayer?.habilitado ? 'Deshabilitar' : 'Habilitar'} Jugador
            </Text>
            <Text style={styles.confirmModalText}>
              ¿Estás seguro de {selectedPlayer?.habilitado ? 'deshabilitar' : 'habilitar'} a {selectedPlayer?.nombreCompleto}?
            </Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]}
                onPress={() => setShowConfirmModal(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.confirmButton]}
                onPress={handleChangeStatus}
              >
                <Text style={styles.buttonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.header}>
        <Text style={styles.titulo}>Jugadores - {equipoNombre}</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => {
            resetForm();
            setShowRegisterModal(true);
          }}
        >
          <Icon name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={jugadores}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        numColumns={NUM_COLUMNS}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay jugadores registrados</Text>
        }
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardContainer: {
    paddingHorizontal: 5,
  },
  jugadorCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    height: 250,
    alignItems: "center"
  },
   
  equipoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 'auto',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
    width: '100%',
    justifyContent: 'space-between'
  },
  teamNameContainer: {
    flex: 1, 
    marginHorizontal: 5, 
  },
  nombreEquipo: {
    fontSize: 12,
    color: '#666',
    flexShrink: 1,  
  },
  fotoJugador: {
    width: '70%',
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
    resizeMode: 'cover',
  },
  nombre: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  detalle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  expulsado: {
    color: 'red',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  equipoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 'auto',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
    width: '100%',
    justifyContent: 'space-between'
  },
  logoEquipo: {
    width: 20,
    height: 20,
    marginRight: 5,
    borderRadius: 10,
  },
  nombreEquipo: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    paddingBottom: 20,
  },
  cardDeshabilitada: {
    backgroundColor: '#e0e0e0',
  },
  fotoDeshabilitada: {
    opacity: 0.6,
  },
  textoDeshabilitado: {
    color: '#757575',
  },
  logoDeshabilitado: {
    opacity: 0.6,
  },
  deshabilitadoText: {
    color: '#757575',
    marginBottom: 5,
  },
  editButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1
  },
  disableButton: {
    padding: 5
  },
  addButton: {
    backgroundColor: '#1E90FF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  //estos son para modales
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff'
  },
  modalContent: {
    paddingBottom: 40
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '500'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 15
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15
  },
  photoOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  },
  button: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5
  },
  cancelButton: {
    backgroundColor: '#f1f1f1'
  },
  submitButton: {
    backgroundColor: '#1E90FF'
  },
  confirmButton: {
    backgroundColor: '#2ecc71'
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  confirmModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  confirmModalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%'
  },
  confirmModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center'
  },
  confirmModalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 10
  },
  equipoInfoContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5
  },
  equipoLabel: {
    fontSize: 14,
    color: '#666'
  },
  equipoNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333'
  }
});


export default MisJugadores;