import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import pagosIcon from "../../assets/misPagos.png";
import credencialesIcon from '../../assets/credenciales.png';
import equipoIcon from '../../assets/equipo.png';
import historialIcon from '../../assets/historial.png';
import torneoImage from '../../assets/poster.png';

const TorneoScreen = () => {
  const navigation = useNavigation();
  navigation.dispatch(DrawerActions.openDrawer());

  return (
    <ScrollView style={styles.container}>
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
          onPress={() => navigation.navigate('Credenciales')}
        >
          <Image source={credencialesIcon} style={styles.buttonIcon} />
          <Text>Descargar credenciales</Text>
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
        <Image source={torneoImage} style={styles.tournamentImage} />
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
    height: 200,
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
    backgroundColor: '#2196F3', 
    padding: 12, 
    borderRadius: 5, 
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: { 
    color: '#fff', 
    fontWeight: 'bold',
    fontSize: 16
  }
});

export default TorneoScreen;