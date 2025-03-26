import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, Dimensions } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import api from '../../config/api';

const { width } = Dimensions.get('window');
const NUM_COLUMNS = 2;
const CARD_WIDTH = (width - 30) / NUM_COLUMNS;

const MisJugadores = ({ route }) => {
  const { equipoId } = route.params;
  const { getToken, logout } = useContext(AuthContext);
  const [jugadores, setJugadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJugadores = async () => {
      try {
        const token = await getToken();
        
        if (!token) {
          throw new Error('No hay token disponible');
        }

        const response = await api.get(`/api/jugadores/porEquipo/${equipoId}`, {
          headers: { 
            Authorization: `Bearer ${token}` 
          }
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

  const renderItem = ({ item }) => (
    <View style={[styles.cardContainer, { width: CARD_WIDTH }]}>
    <View style={[
      styles.jugadorCard,
      !item.habilitado && styles.cardDeshabilitada  // Aplica estilo gris cuando está deshabilitado
    ]}>
      {/* Etiqueta "NO DISPONIBLE" */}
      {!item.habilitado && (
        <Text style={styles.deshabilitadoText}>Deshabilitado</Text>
      )}
        {/* Foto del jugador */}
        <Image 
        source={{ uri: item.fotoJugador }} 
        style={[
          styles.fotoJugador,
          !item.habilitado && styles.fotoDeshabilitada  // Estilo para foto deshabilitada
        ]}
      />
      
    {/* Nombre completo */}
<Text 
  style={[
    styles.nombre,
    !item.habilitado && styles.textoDeshabilitado
  ]}
  numberOfLines={1}  // Correcta la sintaxis de numberOfLines
>
  {item.nombreCompleto}
</Text>
        
        {/* Número de camiseta */}
        <Text style={styles.detalle}>Camiseta: {item.numeroCamiseta}</Text>
        
        {/* Estado de expulsión */}
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
        <Text style={[
          styles.nombreEquipo,
          !item.habilitado && styles.textoDeshabilitado
        ]}>
          {item.equipo?.nombreEquipo}
          </Text>
          
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
      <Text style={styles.titulo}>Jugadores</Text>
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
    height: 220,
    alignItems:"center"
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
  },
  logoEquipo: {
    width: 20,
    height: 20,
    marginRight: 5,
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
    backgroundColor: '#e0e0e0',  // Fondo gris claro
  },
  fotoDeshabilitada: {
    opacity: 0.6,  // Reduce visibilidad de la foto
  },
  textoDeshabilitado: {
    color: '#757575',  // Texto gris
  },
  logoDeshabilitado: {
    opacity: 0.6,  // Reduce visibilidad del logo
  },
  deshabilitadoText:{
    color: '#757575',  // Texto gris

  }
});

export default MisJugadores;