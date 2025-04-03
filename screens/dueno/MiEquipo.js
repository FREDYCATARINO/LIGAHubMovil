import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacity, 
  RefreshControl, 
  Alert, 
  Image, 
  Modal, 
  TextInput, 
  Button
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { AuthContext } from '../../context/AuthContext';
import api from '../../config/api';
import Icon from 'react-native-vector-icons/MaterialIcons';

const MiEquipo = ({ navigation }) => {
  const [equipos, setEquipos] = useState([]);
  const [campos, setCampos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const { getUserId, getToken, logout } = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [nuevoEquipo, setNuevoEquipo] = useState({
    nombreEquipo: '',
    idCampo: null
  });
  const [image, setImage] = useState(null);
  const [selectedCampo, setSelectedCampo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEquipoId, setCurrentEquipoId] = useState(null);

  useEffect(() => {
    fetchCampos();
    fetchEquipos();
    
    (async () => {
      const { status: galleryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (galleryStatus !== 'granted' || cameraStatus !== 'granted') {
        Alert.alert(
          "Permisos requeridos", 
          "Necesitamos acceso a la cámara y galería para subir imágenes de equipos"
        );
      }
    })();
  }, []);

  const fetchCampos = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      
      if (!token) {
        throw new Error('No hay token disponible');
      }

      const response = await api.get('/api/campos/activos', {
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      });
      
      setCampos(response.data);
    } catch (error) {
      console.error('Error al obtener campos:', error);
      setError(error.message || "No se pudieron cargar los campos disponibles");
    } finally {
      setLoading(false);
    }
  };

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

  const handleEquipoPress = (equipoId) => {
    navigation.navigate('Mis Jugadores', { 
      equipoId: equipoId 
    });
  };

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error al seleccionar imagen:", error);
      Alert.alert("Error", "No se pudo seleccionar la imagen");
    }
  };

  const takePhoto = async () => {
    try {
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error al tomar foto:", error);
      Alert.alert("Error", "No se pudo tomar la foto");
    }
  };

  const handleCrearEquipo = async () => {
    try {
      const userId = await getUserId();
      const token = await getToken();
  
      if (!userId || !token) {
        throw new Error('Faltan credenciales de usuario');
      }
  
      if (!nuevoEquipo.nombreEquipo || !nuevoEquipo.idCampo) {
        throw new Error('Nombre del equipo y campo son requeridos');
      }
  
      let imagenBase64 = '';
      if (image) {
        imagenBase64 = await FileSystem.readAsStringAsync(image, {
          encoding: FileSystem.EncodingType.Base64,
        });
      }
  
      const requestData = {
        nombreEquipo: nuevoEquipo.nombreEquipo.trim(),
        idUsuario: userId,
        idCampo: nuevoEquipo.idCampo,
        ...(imagenBase64 && { imagen: `data:image/jpeg;base64,${imagenBase64}` })
      };
  
      const response = await api.post('/api/equipos/movil', requestData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      setEquipos([...equipos, response.data]);
      resetForm();
      Alert.alert("Éxito", "Equipo creado correctamente");
    } catch (err) {
      console.error('Error al crear equipo:', {
        error: err,
        response: err.response?.data,
        request: err.config?.data
      });
      
      Alert.alert(
        "Error al crear equipo",
        err.response?.data?.message || 
        err.message || 
        "Ocurrió un error al crear el equipo"
      );
    }
  };

  const handleUpdateEquipo = async () => {
    try {
      const userId = await getUserId();
      const token = await getToken();
  
      if (!userId || !token) {
        throw new Error('Faltan credenciales de usuario');
      }
  
      if (!nuevoEquipo.nombreEquipo || !nuevoEquipo.idCampo) {
        throw new Error('Nombre del equipo y campo son requeridos');
      }
  
      // 1. Determinar el estado de la imagen
      let imagenPayload = undefined;
      const equipoOriginal = equipos.find(e => e.id === currentEquipoId);
  
      if (image) {
        if (image.startsWith('file://')) {
          // Caso 1: Nueva imagen seleccionada - convertir a base64
          const base64 = await FileSystem.readAsStringAsync(image, {
            encoding: FileSystem.EncodingType.Base64,
          });
          imagenPayload = `data:image/jpeg;base64,${base64}`;
        } else if (image !== equipoOriginal?.logoEquipo) {
          // Caso 2: URL existente pero modificada (raro caso)
          imagenPayload = image;
        }
        // Si image === equipoOriginal.logoEquipo, no hacemos nada (mantiene la misma imagen)
      }
      // Caso 3: Si image es null, se elimina la imagen
  
      const requestData = {
        nombreEquipo: nuevoEquipo.nombreEquipo.trim(),
        idUsuario: userId,
        idCampo: nuevoEquipo.idCampo,
        ...(imagenPayload !== undefined && { imagen: imagenPayload })
      };
  
      const response = await api.put(`/api/equipos/movil/${currentEquipoId}`, requestData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      setEquipos(equipos.map(e => e.id === currentEquipoId ? response.data : e));
      resetForm();
      Alert.alert("Éxito", "Equipo actualizado correctamente");
    } catch (err) {
      console.error('Error al actualizar equipo:', err);
      Alert.alert(
        "Error al actualizar equipo",
        err.response?.data?.message || 
        err.message || 
        "Ocurrió un error al actualizar el equipo"
      );
    }
  };
  

  const resetForm = () => {
    setModalVisible(false);
    setNuevoEquipo({ nombreEquipo: '', idCampo: null });
    setImage(null);
    setSelectedCampo(null);
    setIsEditing(false);
    setCurrentEquipoId(null);
  };

  const openEditModal = (equipo) => {
    setIsEditing(true);
    setCurrentEquipoId(equipo.id);
    setNuevoEquipo({
      nombreEquipo: equipo.nombreEquipo,
      idCampo: equipo.idCampo
    });
    setImage(equipo.logoEquipo || null);
    setSelectedCampo(equipo.idCampo);
    setModalVisible(true);
  };

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
        onRequestClose={resetForm}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>
              {isEditing ? 'Editar Equipo' : 'Nuevo Equipo'}
            </Text>
            
            <TextInput
              style={styles.input}
              placeholder="Nombre del equipo*"
              value={nuevoEquipo.nombreEquipo}
              onChangeText={(text) => setNuevoEquipo({...nuevoEquipo, nombreEquipo: text})}
            />
            
            <Text style={styles.label}>Campo*:</Text>
            <Picker
              selectedValue={selectedCampo}
              onValueChange={(itemValue) => {
                setSelectedCampo(itemValue);
                setNuevoEquipo({...nuevoEquipo, idCampo: itemValue});
              }}
              style={styles.picker}
            >
              <Picker.Item label="Selecciona un campo" value={null} />
              {campos.map((campo) => (
                <Picker.Item 
                  key={campo.id} 
                  label={`${campo.nombre} - ${campo.direccion}`} 
                  value={campo.id} 
                />
              ))}
            </Picker>
            
            <Text style={styles.label}>Logo del equipo:</Text>
            <View style={styles.imageOptions}>
              <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                <Text>Seleccionar de galería</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
                <Text>Tomar foto</Text>
              </TouchableOpacity>
            </View>
            
            {image && (
              <Image source={{ uri: image }} style={styles.imagePreview} />
            )}
            
            <View style={styles.buttonContainer}>
              <Button
                title="Cancelar"
                color="#ff4444"
                onPress={resetForm}
              />
              <Button
                title={isEditing ? "Actualizar" : "Crear"}
                color="#2196F3"
                onPress={isEditing ? handleUpdateEquipo : handleCrearEquipo}
                disabled={!nuevoEquipo.nombreEquipo || !nuevoEquipo.idCampo}
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
          <View key={equipo.id} style={styles.cardContainer}>
            <TouchableOpacity 
              style={styles.card}
              onPress={() => handleEquipoPress(equipo.id)}
            >
              {equipo.logoEquipo ? (
                <Image 
                  source={{ uri: equipo.logoEquipo }} 
                  style={styles.logo} 
                />
              ) : (
                <View style={styles.logoPlaceholder}>
                  <Icon name="sports-soccer" size={30} color="#666" />
                </View>
              )}
              <View style={styles.cardContent}>
                <Text style={styles.equipoNombre}>{equipo.nombreEquipo}</Text>
                <Text style={styles.detalle}>Campo: {equipo.nombreCampo}</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => openEditModal(equipo)}
            >
              <Icon name="edit" size={20} color="#2196F3" />
            </TouchableOpacity>
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
  cardContainer: {
    position: 'relative',
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  logoPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
  },
  editButton: {
    position: 'absolute',
    right: 15,
    top: 15,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  equipoNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  detalle: {
    fontSize: 14,
    color: '#666',
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '90%',
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
  label: {
    marginBottom: 5,
    fontWeight: 'bold',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  imageOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  imageButton: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  imagePreview: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 15,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
});

export default MiEquipo;