import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  ActivityIndicator, 
  ScrollView,
  RefreshControl
} from 'react-native';
import api from '../../config/api'; 

const Convocatoria = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Función para cargar la convocatoria con useCallback
  const fetchConvocatoria = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/api/convocatorias/activa");
      console.log("Respuesta de la API:", response.data);
      setImageUrl(response.data);
    } catch (error) {
      console.error("Error fetching convocatoria:", error);
      setError("Error al cargar la convocatoria. Intenta de nuevo.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Efecto para carga inicial
  useEffect(() => {
    fetchConvocatoria();
  }, [fetchConvocatoria]);

  // Función para manejar el refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchConvocatoria();
  }, [fetchConvocatoria]);

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
        <Text style={styles.errorText}>{error}</Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#0000ff"]}
          tintColor="#0000ff"
        />
      }
    >
      <View style={styles.container}>
        <Text style={styles.titulo}>Convocatoria</Text>

        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="contain"
            onLoad={() => console.log("Imagen cargada correctamente")}
            onError={(e) => {
              console.error("Error al cargar la imagen:", e.nativeEvent.error);
              setError("Error al cargar la imagen. Verifica la URL.");
            }}
          />
        ) : (
          <Text style={styles.noImageText}>No hay convocatoria disponible</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: 600,
    maxWidth: 500,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
  noImageText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginVertical: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
});

export default Convocatoria;