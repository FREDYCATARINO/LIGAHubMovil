import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import api from '../../config/api'; 

const Convocatoria = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConvocatoria = async () => {
      try {
        const response = await api.get("/api/convocatorias/activa");
        console.log("Respuesta de la API:", response.data);
        setImageUrl(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching convocatoria:", error);
        setError("Error al cargar la convocatoria. Intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    fetchConvocatoria();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
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
        <Text>No se pudo cargar la imagen.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', 
  },
  image: {
    width: 500, 
    height: 600,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 40,
  },
});

export default Convocatoria;