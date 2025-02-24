import React from "react";
import {
  Text,
  Button,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  FlatList,
  TouchableOpacity,
  Animated,
  TextInput,
  Image
} from "react-native";
import { useState } from "react";
import MapView from "react-native-maps";
import styles from "../../style/style";
import FONTS from "../../style/fonts";
import { Marker } from "react-native-maps";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import colores from "../../style/colors";
import { Ionicons } from "@expo/vector-icons";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

const Admin4 = ({ navigation }) => {
  const [lugar, setLugar] = useState("");
  const [elecc, setElecc] = useState("");

  const [selectedPlace, setSelectedPlace] = useState(null);
  const [slideAnim] = useState(new Animated.Value(-400));
  const [rows, setRows] = useState(1);

  // Función para manejar el clic en el marcador
  const handleMarkerPress = (place) => {
    setSelectedPlace(place);

    // Animación de deslizamiento de la card
    Animated.timing(slideAnim, {
      toValue: 0, // Mover la card a su posición final
      duration: 500,
      useNativeDriver: true,
    }).start();

    console.log(Animated, place);
  };

  // Función para cerrar la card
  const closeCard = () => {
    Animated.timing(slideAnim, {
      toValue: -400, // Deslizar la card fuera de la pantalla a la izquierda
      duration: 1000,
      useNativeDriver: true,
    }).start();
    setSelectedPlace(null); // Limpiar el lugar seleccionado
  };

  // Estado para la región del mapa (Zoom y posición inicial)
  const [region, setRegion] = useState({
    latitude: 18.849136305780387,
    longitude: -99.20017382614945,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const [region2, setRegion2] = useState({
    latitude: 18.849136305780387,
    longitude: -99.20017382614945,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  // Estado para los marcadores
  const [markers, setMarkers] = useState([
    {
      id: "inicio",
      latitude: 18.849136,
      longitude: -99.200173,
      title: "Punto de inicio",
    },
  ]);

  const [markers2, setMarkers2] = useState([
    {
      id: "inicio",
      latitude: 18.849136,
      longitude: -99.200173,
      title: "Punto de inicio",
    },
  ]);

  const [direccion, setDireccion] = useState([
    {
      lat: 0,
      long: 0,
    },
  ]);

  const [direccionUri, setDireccionUri] = useState('')

  const [direccion2, setDireccion2] = useState([
    {
      lat: 0,
      long: 0,
    },
  ]);

  // Función para agregar un marcador al hacer `onLongPress`
  const handleLongPress = async (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setMarkers((prevMarkers) => [
      ...prevMarkers,
      {
        id: Date.now().toString(),
        latitude,
        longitude,
        title: "Nuevo marcador",
      },
    ]);
    const placeName = await getPlaceName(latitude, longitude);
    setDireccionUri(getOSMStaticImage(latitude, longitude))
    setLugar(placeName);
    handleMarkerPress(placeName);
  };

  const handleLongPress2 = async (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setMarkers2((prevMarkers) => [
      {
        id: Date.now().toString(),
        latitude,
        longitude,
        title: "Nuevo marcador",
      },
    ]);
    const placeName = await getPlaceName(latitude, longitude);
    setElecc(placeName);
    setDireccion([{ lat: latitude, long: longitude }]);
  };

  const handlePress = async (lat, lon, name) => {
    setMarkers((prevMarkers) => [
      ...prevMarkers,
      {
        id: Date.now().toString(),
        latitude: lat,
        longitude: lon,
        title: name,
      },
    ]);
    const placeName = await getPlaceName(lat, lon);
    setDireccionUri(getOSMStaticImage(lat, lon))
    setLugar(placeName);
    handleMarkerPress(placeName);
  };

  // 🔄 Función para eliminar todos los marcadores excepto el de inicio
  const resetMarkers = () => {
    setMarkers([
      {
        id: "inicio",
        latitude: 18.849136,
        longitude: -99.200173,
        title: "Punto de inicio",
      },
    ]);
    closeCard();
  };

  const resetMarkers2 = () => {
    setMarkers2([
      {
        id: "inicio",
        latitude: 18.849136,
        longitude: -99.200173,
        title: "Punto de inicio",
      },
    ]);
    setElecc("");
    setDireccion([{ lat: 0, long: 0 }]);
  };

  const getPlaceName = async (latitude, longitude) => {
    console.log("Ay", latitude, longitude);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );
      const data = await response.json();
      setLugar(data.display_name);
      console.log(lugar);
      return data.display_name; // Devuelve el nombre del lugar
    } catch (error) {
      console.error("Error al obtener el nombre del lugar", error);
      return "Lugar desconocido";
    }
  };

  const getOSMStaticImage = (lat, lon) => {
    return `https://static-maps.yandex.ru/1.x/?ll=${lon},${lat}&z=14&l=sat&size=600,300`;
  };

  const data = [
    {
      id: "1",
      name: "The Field",
      dir: "Av sin esquinas s/n",
      canchas: 3,
      lat: 18.852205,
      lon: -99.201187,
    },
    {
      id: "2",
      name: "Deportivo Galaxy",
      dir: "Calle pollo #12",
      canchas: 4,
      lat: 18.852461,
      lon: -99.20014,
    },
    {
      id: "3",
      name: "Campo el rayo",
      dir: "Blvd of broken dreams",
      canchas: 9,
      lat: 18.851852,
      lon: -99.200673,
    },
    {
      id: "4",
      name: "Footbalistica",
      dir: "Calle cuaderno #21",
      canchas: 5,
      lat: 18.851132,
      lon: -99.200403,
    },
    {
      id: "5",
      name: "El Rayo",
      dir: "Av Acatlipa #02",
      canchas: 1,
      lat: 18.85005,
      lon: -99.201182,
    },
    {
      id: "6",
      name: "El campo cascarudo",
      dir: "Calle concha s/n",
      canchas: 5,
      lat: 18.849287,
      lon: -99.201373,
    },
    {
      id: "7",
      name: "Estadio Azteca",
      dir: "México",
      canchas: 1,
      lat: 18.849643,
      lon: -99.200279,
    }, // Ciudad de México
  ];

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={stylesAdmin4.container}>
        <ScrollView style={{ gap: 5 }}>
          <Text
            style={[
              styles.TextField,
              stylesAdmin4.title,
              FONTS.nunitoNegrita,
              { paddingVertical: 15, paddingHorizontal: 5 },
            ]}
          >
            Campos
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ width: "100%" }}
          >
            <View style={stylesAdmin4.table}>
              {/* Encabezado de la tabla */}
              <View style={stylesAdmin4.headerRow}>
                <Text style={[stylesAdmin4.headerCell, FONTS.oswaldNegrita]}>
                  ID
                </Text>
                <Text style={[stylesAdmin4.headerCell, FONTS.oswaldNegrita]}>
                  Nombre
                </Text>
                <Text style={[stylesAdmin4.headerCell, FONTS.oswaldNegrita]}>
                  Dirección
                </Text>
                <Text style={[stylesAdmin4.headerCell, FONTS.oswaldNegrita]}>
                  Canchas
                </Text>
                <Text
                  style={[
                    stylesAdmin4.headerCell,
                    FONTS.oswaldNegrita,
                    { width: 80 },
                  ]}
                >
                  Ver
                </Text>
                <Text
                  style={[
                    stylesAdmin4.headerCell,
                    FONTS.oswaldNegrita,
                    { width: 80 },
                  ]}
                >
                  Editar
                </Text>
                <Text
                  style={[
                    stylesAdmin4.headerCell,
                    FONTS.oswaldNegrita,
                    { width: 80 },
                  ]}
                >
                  Eliminar
                </Text>
              </View>

              <View style={{ maxHeight: 250, padding: 5 }}>
                <FlatList
                  data={data}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <View style={stylesAdmin4.row}>
                      <Text style={[stylesAdmin4.cell, FONTS.nunitoNegrita]}>
                        {item.id}
                      </Text>
                      <Text style={[stylesAdmin4.cell, FONTS.nunitoNegrita]}>
                        {item.name}
                      </Text>
                      <Text style={[stylesAdmin4.cell, FONTS.nunitoNegrita]}>
                        {item.dir}
                      </Text>
                      <Text style={[stylesAdmin4.cell, FONTS.nunitoNegrita]}>
                        {item.canchas}
                      </Text>
                      <TouchableOpacity
                        style={stylesAdmin4.button}
                        onPress={() => handlePress(item.lat, item.lon, item.name)}
                      >
                        <Ionicons name="map" size={24} color={colores.blanco} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[stylesAdmin4.button, stylesAdmin4.editButton]}
                      >
                        <Ionicons
                          name="pencil"
                          size={24}
                          color={colores.blanco}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[stylesAdmin4.button, stylesAdmin4.deleteButton]}
                      >
                        <Ionicons
                          name="trash"
                          size={24}
                          color={colores.blanco}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                />
              </View>
            </View>
          </ScrollView>
          <View
            style={{
              width: "100%",
              height: 350,
              borderRadius: 5,
            }}
          >
            <Text style={[FONTS.oswald, { alignSelf: "flex-start" }]}>
              Explorar
            </Text>
            <MapView
              provider={MapView.PROVIDER_DEFAULT}
              style={{ flex: 1, width: "100%", height: "100%" }}
              region={region}
              onRegionChangeComplete={setRegion}
              onPress={handleLongPress}
              mapType="hybrid"
            >
              {markers.map((marker) => (
                <Marker
                  key={marker.id}
                  coordinate={{
                    latitude: marker.latitude,
                    longitude: marker.longitude,
                  }}
                  title={marker.title}
                  onPress={() => handleMarkerPress(marker.title)}
                />
              ))}
            </MapView>
            <TouchableOpacity
              onPress={resetMarkers}
              style={{
                width: "50%",
                backgroundColor: colores.domin_1_4,
                alignSelf: "center",
                alignItems: "center",
                padding: 10,
                margin: 5,
                borderRadius: 10,
                marginTop: -50,
              }}
            >
              <Text
                style={[FONTS.oswald, { fontSize: 15, color: colores.blanco }]}
              >
                Reiniciar mapa
              </Text>
            </TouchableOpacity>
          </View>
          {selectedPlace && (
            <Animated.View
              style={[
                styles.card,
                {
                  transform: [{ translateX: slideAnim }],
                  padding: 10,
                  marginTop: 10,
                },
              ]}
            >
              <View style={styles.cardContent}>
                {/*Poner una imagen?*/}
                <Image
                  source={{ uri: direccionUri, alt: 'Lugar' }}
                  style={{ width: 300, height: 150, resizeMode: 'cover' }}
                />
                <Text style={[FONTS.oswaldNegrita, { fontSize: 18 }]}>
                  {selectedPlace}
                </Text>
                <Text style={[FONTS.nunito, { textAlign: "center" }]}>
                  Ubicación: {`${region.latitude}, ${region.longitude}`}
                </Text>
                <TouchableOpacity
                  onPress={resetMarkers}
                  style={{
                    width: "100%",
                    backgroundColor: colores.acento_4_1,
                    alignSelf: "center",
                    alignItems: "center",
                    padding: 10,
                    margin: 5,
                    borderRadius: 10,
                  }}
                >
                  <Text
                    style={[
                      FONTS.oswald,
                      { fontSize: 15, color: colores.blanco },
                    ]}
                  >
                    Cerrar
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}
          <Text
            style={[
              styles.TextField,
              stylesAdmin4.title,
              FONTS.nunitoNegrita,
              { paddingVertical: 15, paddingHorizontal: 5 },
            ]}
          >
            Registrar campo
          </Text>
          <View style={stylesAdmin4.form}>
            <Text style={[FONTS.oswald, { alignSelf: "flex-start" }]}>
              Elege buscando el lugar o en el mapa
            </Text>
            <View
              style={{
                width: "100%",
                height: 200,
                borderColor: colores.acento_3_1,
                borderRadius: 5,
                borderWidth: 2,
              }}
            >
              <MapView
                provider={MapView.PROVIDER_DEFAULT}
                style={{ flex: 1, width: "100%", height: "100%" }}
                onLongPress={handleLongPress2}
                region={region2}
                onRegionChangeComplete={setRegion2}
                mapType="hybrid"
              >
                {markers2.map((marker) => (
                  <Marker
                    key={marker.id}
                    coordinate={{
                      latitude: marker.latitude,
                      longitude: marker.longitude,
                    }}
                    title={marker.title}
                  />
                ))}
              </MapView>
              <TouchableOpacity
                onPress={resetMarkers2}
                style={{
                  width: "30%",
                  backgroundColor: colores.domin_1_4,
                  alignSelf: "flex-end",
                  alignItems: "center",
                  padding: 10,
                  margin: 5,
                  borderRadius: 10,
                  marginTop: -50,
                }}
              >
                <Text
                  style={[
                    FONTS.oswald,
                    { fontSize: 15, color: colores.blanco },
                  ]}
                >
                  Reestablecer
                </Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={[FONTS.oswald, stylesAdmin4.input]}
              placeholderTextColor={colores.domin_2_2}
              placeholder="Nombre"
              value={elecc === "" ? "" : elecc}
            />
            <TextInput
              style={[FONTS.oswald, stylesAdmin4.input]}
              placeholderTextColor={colores.domin_2_2}
              placeholder="Dirección"
              value={
                direccion[0].lat === 0 && direccion[0].long === 0
                  ? ""
                  : `${direccion[0].lat} ${direccion[0].long}`
              }
            />
            <Text style={[FONTS.oswald, { alignSelf: "flex-start" }]}>
              Asignación de canchas
            </Text>
            <View>
              {Array.from({ length: rows }).map((_, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    height: 50,
                    gap: 5,
                    paddingVertical: 3,
                  }}
                >
                  <TextInput
                    style={[FONTS.oswald, stylesAdmin4.input2]}
                    placeholderTextColor={colores.domin_2_2}
                    placeholder="#"
                    keyboardType="numeric"
                  />
                  <TextInput
                    style={[FONTS.oswald, stylesAdmin4.input, { width: "50%" }]}
                    placeholderTextColor={colores.domin_2_2}
                    placeholder="Dirección"
                  />
                  <TouchableOpacity
                    style={[stylesAdmin4.button2, stylesAdmin4.editButton]}
                    onPress={() => setRows(rows + 1)}
                  >
                    <Ionicons name="add" size={18} color={colores.blanco} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[stylesAdmin4.button2, stylesAdmin4.deleteButton]}
                    onPress={() => (rows === 1 ? "" : setRows(rows - 1))}
                  >
                    <Ionicons name="remove" size={18} color={colores.blanco} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <TouchableOpacity
              onPress={resetMarkers2}
              style={{
                width: "50%",
                backgroundColor: colores.domin_1_4,
                alignSelf: "center",
                alignItems: "center",
                padding: 10,
                margin: 5,
                borderRadius: 10,
              }}
            >
              <Text
                style={[FONTS.oswald, { fontSize: 15, color: colores.blanco }]}
              >
                Registrar
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const stylesAdmin4 = StyleSheet.create({
  container: { flex: 1, padding: 5 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    alignItems: "flex-start",
    marginBlock: 5,
  },

  table: {
    flex: 1,
    backgroundColor: colores.blanco,
    marginBottom: 10,
    width: 600,
    borderRadius: 5,
  },

  headerRow: {
    flexDirection: "row",
    backgroundColor: colores.base_2_4,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
  },
  headerCell: { flex: 1, textAlign: "center" },

  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    padding: 10,
    alignItems: "center",
    borderBottomColor: colores.base_2_4,
  },
  cell: { flex: 1, textAlign: "center", paddingHorizontal: 10 },

  button: {
    flex: 1,
    padding: 5,
    backgroundColor: colores.acento_3_1,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: "center",
  },
  buttonText: { textAlign: "center" },

  editButton: { backgroundColor: colores.acento_2_3 },
  deleteButton: { backgroundColor: colores.domin_2_2 },

  input: {
    borderColor: colores.domin_2_2,
    borderWidth: 3,
    borderRadius: 5,
    color: colores.negro,
    backgroundColor: colores.base_2_5,
    justifyContent: "center",
    paddingLeft: 10,
  },
  input2: {
    borderColor: colores.domin_2_2,
    borderWidth: 3,
    borderRadius: 5,
    color: colores.negro,
    backgroundColor: colores.base_2_5,
    justifyContent: "center",
    width: "10%",
    paddingLeft: 10,
  },
  form: {
    padding: 10,
    paddingVertical: 15,
    gap: 5,
    backgroundColor: colores.blanco,
    marginVertical: 5,
  },
  button2: {
    flex: 1,
    backgroundColor: colores.acento_3_1,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    width: "10%",
  },
  teamSelect: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    paddingVertical: 15,
    backgroundColor: colores.base_2_4,
  },
  teamName: {
    fontSize: 25,
  },
  teamImag: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  myRow: {
    flexDirection: "row",
    width: "50%",
    gap: 5,
    alignItems: "center",
  },
  divdier: {
    width: "100%",
    height: 1,
    backgroundColor: colores.base_3_5,
    alignContent: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  rowTitles: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  // Estilos de la card deslizable
  card: {
    width: "100%",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  cardContent: { alignItems: "center" },
  cardTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  closeButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "#FF5733",
    borderRadius: 5,
  },
  closeButtonText: { color: "white", textAlign: "center" },
});

export default Admin4;
