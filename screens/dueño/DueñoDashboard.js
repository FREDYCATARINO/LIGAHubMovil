import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

// Importando imágenes desde assets
import pagosIcon from "../../assets/misPagos.png";
import credencialesIcon from '../../assets/credenciales.png';
import equipoIcon from '../../assets/equipo.png';
import historialIcon from '../../assets/historial.png';
import torneoImage from '../../assets/poster.png';

const TorneoScreen = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Botones superiores */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button}>
          <Image source={pagosIcon} style={styles.buttonIcon} />
          <Text>Mis pagos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Image source={credencialesIcon} style={styles.buttonIcon} />
          <Text>Descargar credenciales</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Image source={equipoIcon} style={styles.buttonIcon} />
          <Text>Mi equipo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Image source={historialIcon} style={styles.buttonIcon} />
          <Text>Historial de partidos</Text>
        </TouchableOpacity>
      </View>

      {/* Convocatoria */}
      <View style={styles.card}>
        <Image source={torneoImage} style={styles.image} />
        <View style={styles.infoContainer}>
          <Text style={styles.tournamentTitle}>Torneo "Nombre del torneo"</Text>
          <Text style={styles.text}>Tu equipo: Tienes suficientes jugadores para participar</Text>
          <Text style={styles.text}>Premio: $1,000 pesos</Text>
          <Text style={styles.text}>Inicio del torneo: Domingo, 9 de febrero de 2025</Text>
          <Text style={styles.text}>Cupo disponible: 2 lugares</Text>
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>Fecha límite de inscripción: 06/Feb/2025</Text>
          </View>
          <TouchableOpacity style={styles.buttonInscribirse}>
            <Text style={styles.buttonText}>Inscribirme</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4' },
  buttonsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', marginVertical: 10 },
  button: { 
    backgroundColor: '#fff', 
    padding: 15, 
    width: '45%', 
    alignItems: 'center', 
    borderRadius: 8, 
    marginBottom: 10, 
    elevation: 3, 
    flexDirection: 'row', 
    justifyContent: 'center' 
  },
  buttonIcon: { width: 24, height: 24, marginRight: 8 }, // Tamaño de los iconos en botones
  card: { backgroundColor: '#fff', borderRadius: 10, margin: 15, padding: 15, elevation: 4 },
  image: { width: '100%', height: 150, borderRadius: 10, marginBottom: 10 },
  infoContainer: { paddingHorizontal: 10 },
  tournamentTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  text: { fontSize: 14, marginBottom: 5 },
  warningBox: { backgroundColor: '#ffcccc', padding: 8, borderRadius: 5, alignItems: 'center', marginVertical: 10 },
  warningText: { color: '#a00', fontSize: 14, fontWeight: 'bold' },
  buttonInscribirse: { backgroundColor: '#000', padding: 12, borderRadius: 5, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },

image:{ 
  width: '100%', 
  height: 200,  // Aumenté la altura para que parezca un banner
  borderRadius: 10, 
  marginBottom: 10,
  resizeMode: 'cover' // Ajusta la imagen para que cubra todo el espacio sin deformarse
}}
);

export default TorneoScreen;
