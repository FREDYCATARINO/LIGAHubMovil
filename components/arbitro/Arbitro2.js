import React, { useState, useEffect, useContext, useCallback } from "react";
import { SafeAreaView, View, Text, Image, TextInput, TouchableOpacity, ScrollView, Alert, RefreshControl } from "react-native";
import { Checkbox } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AuthContext } from '../../context/AuthContext';
import FONTS from "../../style/fonts";
import colores from "../../style/colors";
import api from '../../config/api';

const Arbitro2 = ({ navigation, route }) => {
  const { partido } = route.params;
  const { getToken } = useContext(AuthContext);
  
  // Estados para el marcador
  const [golesLocal, setGolesLocal] = useState(0);
  const [golesVisitante, setGolesVisitante] = useState(0);
  const [autogolesLocal, setAutogolesLocal] = useState(0);
  const [autogolesVisitante, setAutogolesVisitante] = useState(0);
  
  // Estados para jugadores y estadísticas
  const [jugadoresLocal, setJugadoresLocal] = useState([]);
  const [jugadoresVisitante, setJugadoresVisitante] = useState([]);
  const [estadisticasLocal, setEstadisticasLocal] = useState([]);
  const [estadisticasVisitante, setEstadisticasVisitante] = useState([]);
  
  // Estados para partido default
  const [partidoDefault, setPartidoDefault] = useState(false);
  const [ganadorDefault, setGanadorDefault] = useState("local");
  
  // Estados para penales y desempate
  const [penalesLocal, setPenalesLocal] = useState(0);
  const [penalesVisitante, setPenalesVisitante] = useState(0);
  const [criterioDesempate, setCriterioDesempate] = useState("NORMAL");
  
  // Estados para secciones plegables
  const [localCollapsed, setLocalCollapsed] = useState(false);
  const [visitanteCollapsed, setVisitanteCollapsed] = useState(false);
  const [refreshing, setRefreshing] = useState(false);


  // Función para cargar jugadores
  const cargarJugadores = useCallback(async () => {
    try {
      setRefreshing(true);
      const token = await getToken();
      
      const [resLocal, resVisitante] = await Promise.all([
        api.get(`/api/jugadores/porEquipo/${partido.equipoLocal.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        api.get(`/api/jugadores/porEquipo/${partido.equipoVisitante.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      setJugadoresLocal(resLocal.data);
      setJugadoresVisitante(resVisitante.data);
      setEstadisticasLocal([]);
      setEstadisticasVisitante([]);
    } catch (err) {
      Alert.alert("Error", "No se pudieron cargar los jugadores");
      console.error("Error al cargar jugadores:", err);
    } finally {
      setRefreshing(false);
    }
  }, [partido.id, getToken]);

  // Efecto para cargar jugadores
  useEffect(() => {
    cargarJugadores();
    limpiarEstados()
  }, [cargarJugadores]);

  const limpiarEstados = () => {
    setGolesLocal(0);
    setGolesVisitante(0);
    setAutogolesLocal(0);
    setAutogolesVisitante(0);
    setPenalesLocal(0);
    setPenalesVisitante(0);
    setEstadisticasLocal([]);
    setEstadisticasVisitante([]);
    setPartidoDefault(false);
    setGanadorDefault("local");
    setCriterioDesempate("NORMAL");
    setLocalCollapsed(false);
    setVisitanteCollapsed(false);
  };

  // Función para manejar el refresh
  const onRefresh = useCallback(() => {
    cargarJugadores();
  }, [cargarJugadores]);

  // Manejar selección de jugador
  const manejarCheckbox = (jugador, equipo, activo) => {
    const estadisticas = equipo === "local" ? [...estadisticasLocal] : [...estadisticasVisitante];
    const setter = equipo === "local" ? setEstadisticasLocal : setEstadisticasVisitante;

    if (activo) {
      estadisticas.push({
        jugadorId: jugador.id,
        goles: 0,
        amarillas: 0,
        rojas: 0,
        comentarioExpulsion: "",
      });
    } else {
      const filtrados = estadisticas.filter(e => e.jugadorId !== jugador.id);
      setter(filtrados);
      return;
    }
    setter(estadisticas);
  };

  // Actualizar estadísticas de jugador
  const manejarEstadistica = (jugador, equipo, campo, valor) => {
    const estadisticas = equipo === "local" ? [...estadisticasLocal] : [...estadisticasVisitante];
    const setter = equipo === "local" ? setEstadisticasLocal : setEstadisticasVisitante;

    const index = estadisticas.findIndex(e => e.jugadorId === jugador.id);
    if (index !== -1) {
      estadisticas[index][campo] = valor;
      setter(estadisticas);
    }
  };

  // Contar jugadores seleccionados
  const contarCheckbox = (equipo) => 
    equipo === "local" ? estadisticasLocal.length : estadisticasVisitante.length;

  // Sumar goles de jugadores
  const sumarGoles = (equipo) => {
    const estadisticas = equipo === "local" ? estadisticasLocal : estadisticasVisitante;
    return estadisticas.reduce((acc, val) => acc + (parseInt(val.goles) || 0), 0);
  };

  // Validar antes de registrar
  const validarAntesDeRegistrar = () => {
    if (!partidoDefault) {
      const sumaLocal = sumarGoles("local");
      const sumaVisitante = sumarGoles("visitante");

      if (contarCheckbox("local") < 7 || contarCheckbox("visitante") < 7) {
        Alert.alert("Advertencia", "Debes seleccionar al menos 7 jugadores por equipo");
        return false;
      }

      if (golesLocal !== sumaLocal + autogolesVisitante) {
        Alert.alert(
          "Advertencia",
          `Los jugadores del equipo local y autogoles del rival suman ${
            sumaLocal + autogolesVisitante
          } goles y en realidad el equipo marcó ${golesLocal}`
        );
        return false;
      }

      if (golesVisitante !== sumaVisitante + autogolesLocal) {
        Alert.alert(
          "Advertencia",
          `Los goles del equipo visitante y autogoles del rival suman ${
            sumaVisitante + autogolesLocal
          } goles y en realidad el equipo marcó ${golesVisitante}`
        );
        return false;
      }
    }

    if (partidoDefault) {
      if (ganadorDefault === "local" && contarCheckbox("local") < 7) {
        Alert.alert(
          "Advertencia",
          "Debes seleccionar al menos 7 jugadores del equipo local (ganador por default)"
        );
        return false;
      }
      if (ganadorDefault === "visitante" && contarCheckbox("visitante") < 7) {
        Alert.alert(
          "Advertencia",
          "Debes seleccionar al menos 7 jugadores del equipo visitante (ganador por default)"
        );
        return false;
      }
    }
    return true;
  };

  // Registrar resultado
  const registrarResultado = async () => {
    if (!validarAntesDeRegistrar()) return;

    const resultado = {
      golesLocal: partidoDefault ? (ganadorDefault === "local" ? 3 : 0) : golesLocal,
      golesVisitante: partidoDefault ? (ganadorDefault === "visitante" ? 3 : 0) : golesVisitante,
      autogolesLocal,
      autogolesVisitante,
      penalesLocal,
      penalesVisitante,
      estadisticasLocal: partidoDefault
        ? ganadorDefault === "visitante"
          ? []
          : estadisticasLocal.map(e => ({ ...e, goles: 0 }))
        : estadisticasLocal,
      estadisticasVisitante: partidoDefault
        ? ganadorDefault === "local"
          ? []
          : estadisticasVisitante.map(e => ({ ...e, goles: 0 }))
        : estadisticasVisitante,
      tipoDesempate: criterioDesempate,
      golesLocalPenales: criterioDesempate === "PENALES" ? penalesLocal : 0,
      golesVisitantePenales: criterioDesempate === "PENALES" ? penalesVisitante : 0,
    };

    try {
      const token = await getToken();
      await api.post(
        `/api/partidos/arbitro/registraresultado/${partido.id}`,
        resultado,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Limpiar estados después de registrar
      setGolesLocal(0);
      setGolesVisitante(0);
      setAutogolesLocal(0);
      setAutogolesVisitante(0);
      setPenalesLocal(0);
      setPenalesVisitante(0);
      setEstadisticasLocal([]);
      setEstadisticasVisitante([]);
      setPartidoDefault(false);
      setGanadorDefault("local");
      setCriterioDesempate("NORMAL");
      
      Alert.alert("Éxito", "Resultado registrado correctamente");
      navigation.goBack();
    } catch (err) {
      Alert.alert(
        "Error",
        err.response?.data?.message || "No se pudo registrar el resultado"
      );
      console.error("Error al registrar:", err);
    }
  };

  // Renderizar jugadores
  const renderJugadores = (jugadores, equipo) => {
    return jugadores.map(jugador => {
      const estad = (equipo === "local" ? estadisticasLocal : estadisticasVisitante)
        .find(e => e.jugadorId === jugador.id);
      const checked = Boolean(estad);

      return (
        <View key={jugador.id} style={styles.jugadorCard}>
          <Checkbox
            status={checked ? "checked" : "unchecked"}
            onPress={() => manejarCheckbox(jugador, equipo, !checked)}
            color={colores.acento_1_1}
          />
          
          <Image 
            source={{ uri: jugador.fotoJugador || "https://via.placeholder.com/50" }} 
            style={styles.jugadorImage} 
          />
          
          <Text style={styles.jugadorNombre}>
            {jugador.nombreCompleto} - #{jugador.numeroCamiseta}
          </Text>

          {checked && (
            <View style={styles.jugadorStats}>
              <Text style={styles.statLabel}>Goles:</Text>
              <TextInput
                style={styles.statInput}
                value={String(estad.goles)}
                onChangeText={text => 
                  manejarEstadistica(jugador, equipo, "goles", parseInt(text) || 0)
                }
                keyboardType="numeric"
              />

              <Text style={styles.statLabel}>Amarillas:</Text>
              <Picker
                selectedValue={estad.amarillas}
                onValueChange={value => 
                  manejarEstadistica(jugador, equipo, "amarillas", value)
                }
                style={styles.statPicker}
              >
                {[0, 1, 2].map(n => (
                  <Picker.Item key={n} label={String(n)} value={n} />
                ))}
              </Picker>

              <Text style={styles.statLabel}>Roja:</Text>
              <Checkbox
                status={estad.rojas === 1 ? "checked" : "unchecked"}
                onPress={() => 
                  manejarEstadistica(
                    jugador, 
                    equipo, 
                    "rojas", 
                    estad.rojas === 1 ? 0 : 1
                  )
                }
                color={colores.danger}
              />

              {estad.rojas === 1 && (
                <TextInput
                  style={styles.motivoInput}
                  placeholder="Motivo expulsión"
                  value={estad.comentarioExpulsion}
                  onChangeText={text => 
                    manejarEstadistica(jugador, equipo, "comentarioExpulsion", text)
                  }
                  multiline
                />
              )}
            </View>
          )}
        </View>
      );
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colores.primary]}
            tintColor={colores.primary}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color={colores.domin_2_2} />
          </TouchableOpacity>
          <Text style={styles.headerText}>Registrar Resultado</Text>
        </View>
<View style={styles.card}>
        {/* Info del partido */}
        <View style={styles.matchInfo}>
          <Image 
            source={{ uri: partido.equipoLocal.logo || "https://via.placeholder.com/80" }} 
            style={styles.teamLogo} 
          />
          <Text style={styles.vsText}>VS</Text>
          <Image 
            source={{ uri: partido.equipoVisitante.logo || "https://via.placeholder.com/80" }} 
            style={styles.teamLogo} 
          />
        </View>
        <Text style={styles.teamsText}>
          {partido.equipoLocal.nombreEquipo} vs {partido.equipoVisitante.nombreEquipo}
        </Text>

        {/* Marcador */}
        <View style={styles.scoreContainer}>
          <TextInput
            style={styles.scoreInput}
            value={String(golesLocal)}
            onChangeText={text => setGolesLocal(Number(text) || 0)}
            keyboardType="numeric"
            placeholder="0"
          />
          <Text style={styles.vsText}>-</Text>
          <TextInput
            style={styles.scoreInput}
            value={String(golesVisitante)}
            onChangeText={text => setGolesVisitante(Number(text) || 0)}
            keyboardType="numeric"
            placeholder="0"
          />
        </View>

        {/* Autogoles */}
        <View style={styles.autoGoalsContainer}>
          <View style={styles.autoGoalInput}>
            <Text style={styles.autoGoalLabel}>Autogoles Local:</Text>
            <TextInput
              style={styles.smallInput}
              value={String(autogolesLocal)}
              onChangeText={text => setAutogolesLocal(Number(text) || 0)}
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.autoGoalInput}>
            <Text style={styles.autoGoalLabel}>Autogoles Visitante:</Text>
            <TextInput
              style={styles.smallInput}
              value={String(autogolesVisitante)}
              onChangeText={text => setAutogolesVisitante(Number(text) || 0)}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Opciones de desempate */}
        {partido.tipoPartido === "LIGUILLA" && partido.idaVuelta === "VUELTA" && (
          <View style={styles.desempateContainer}>
            <Text style={styles.sectionTitle}>Criterio de desempate:</Text>
            <Picker
              selectedValue={criterioDesempate}
              onValueChange={setCriterioDesempate}
              style={styles.picker}
            >
              <Picker.Item label="Normal" value="NORMAL" />
              <Picker.Item label="Tiempo Extra" value="TIEMPO_EXTRA" />
              <Picker.Item label="Penales" value="PENALES" />
            </Picker>

            {criterioDesempate === "PENALES" && (
              <View style={styles.penalesContainer}>
                <View style={styles.penalInput}>
                  <Text>Penales Local:</Text>
                  <TextInput
                    style={styles.smallInput}
                    value={String(penalesLocal)}
                    onChangeText={text => setPenalesLocal(Number(text) || 0)}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.penalInput}>
                  <Text>Penales Visitante:</Text>
                  <TextInput
                    style={styles.smallInput}
                    value={String(penalesVisitante)}
                    onChangeText={text => setPenalesVisitante(Number(text) || 0)}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            )}
          </View>
        )}

        {/* Partido por default */}
        <View style={styles.defaultContainer}>
          <Checkbox
            status={partidoDefault ? "checked" : "unchecked"}
            onPress={() => setPartidoDefault(!partidoDefault)}
            color={colores.acento_1_1}
          />
          <Text style={styles.defaultText}>Partido ganado por default</Text>
          
          {partidoDefault && (
            <Picker
              selectedValue={ganadorDefault}
              onValueChange={setGanadorDefault}
              style={styles.smallPicker}
            >
              <Picker.Item label="Ganó Local" value="local" />
              <Picker.Item label="Ganó Visitante" value="visitante" />
            </Picker>
          )}
        </View>
        </View>
        {/* Botones de acción */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={registrarResultado}
          >
            <Text style={styles.saveButtonText}>REGISTRAR RESULTADO</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>CANCELAR</Text>
          </TouchableOpacity>
        </View>

        {/* Lista de jugadores */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.sectionHeader}
            onPress={() => setLocalCollapsed(!localCollapsed)}
          >
            <Text style={styles.sectionTitle}>
              Jugadores {partido.equipoLocal.nombreEquipo}
            </Text>
            <Icon 
              name={localCollapsed ? "keyboard-arrow-down" : "keyboard-arrow-up"} 
              size={24} 
              color={colores.text} 
            />
          </TouchableOpacity>
          
          {!localCollapsed && renderJugadores(jugadoresLocal, "local")}
        </View>

        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.sectionHeader}
            onPress={() => setVisitanteCollapsed(!visitanteCollapsed)}
          >
            <Text style={styles.sectionTitle}>
              Jugadores {partido.equipoVisitante.nombreEquipo}
            </Text>
            <Icon 
              name={visitanteCollapsed ? "keyboard-arrow-down" : "keyboard-arrow-up"} 
              size={24} 
              color={colores.text} 
            />
          </TouchableOpacity>
          
          {!visitanteCollapsed && renderJugadores(jugadoresVisitante, "visitante")}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colores.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    
    
  },
  headerText: {
    ...FONTS.oswaldBold,
    fontSize: 22,
    color: colores.domin_2_2,
    marginLeft: 10,
  },
  matchInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
   paddingTop: 30,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowRadius: 2,
    elevation: 5,
    backgroundColor:"white"
  },
  teamLogo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginHorizontal: 10,
  },
  teamsText: {
    ...FONTS.oswald,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  scoreInput: {
    ...FONTS.oswaldBold,
    fontSize: 28,
    width: 60,
    textAlign: 'center',
    borderBottomWidth: 2,
    borderColor: colores.domin_2_2,
    paddingVertical: 5,
  },
  vsText: {
    ...FONTS.oswaldBold,
    fontSize: 20,
    marginHorizontal: 15,
    color: colores.text,
  },
  autoGoalsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  autoGoalInput: {
    alignItems: 'center',
  },
  autoGoalLabel: {
    ...FONTS.oswald,
    fontSize: 14,
    marginBottom: 5,
  },
  smallInput: {
    borderWidth: 1,
    borderColor: colores.grayLight,
    borderRadius: 5,
    padding: 5,
    width: 60,
    textAlign: 'center',
    ...FONTS.oswald,
  },
  desempateContainer: {
    backgroundColor: colores.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  section: {
    backgroundColor: colores.white,
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: colores.backgroundLight,
  },
  sectionTitle: {
    ...FONTS.oswaldBold,
    fontSize: 16,
    color: colores.text,
  },
  picker: {
    height: 50,
    backgroundColor: colores.white,
  },
  penalesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  penalInput: {
    alignItems: 'center',
  },
  defaultContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Alinea verticalmente los elementos al centro
    justifyContent: 'flex-start', // Esto alinea el contenido a la izquierda
  borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    width: '60%',
    alignSelf: 'flex-start', // Esto asegura que el contenedor en sí se alinee a la izquierda
  },
  defaultText: {
    ...FONTS.oswald,
    fontSize: 16,
    marginLeft: 10,
  },
  smallPicker: {
    
    width: '100%',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: "#E53935",
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold'  
  },
  cancelButton: {
    padding: 15,
    borderRadius: 14,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
    backgroundColor:"#bababa"

  },
  cancelButtonText: {

    fontSize: 16,
  },
  jugadorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: colores.grayLight,
  },
  jugadorImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  jugadorNombre: {
    ...FONTS.oswald,
    fontSize: 14,
    flex: 1,
  },
  jugadorStats: {
    flex: 1,
    marginLeft: 10,
  },
  statLabel: {
    ...FONTS.oswald,
    fontSize: 12,
    marginTop: 5,
  },
  statInput: {
    borderWidth: 1,
    borderColor: colores.grayLight,
    borderRadius: 5,
    padding: 5,
    ...FONTS.oswald,
  },
  statPicker: {
    height: 30,
    width: '100%',
  },
  motivoInput: {
    borderWidth: 1,
    borderColor: colores.grayLight,
    borderRadius: 5,
    padding: 5,
    marginTop: 5,
    minHeight: 40,
    ...FONTS.oswald,
  },
});

export default Arbitro2;