import React, { useEffect, useRef } from "react";
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
  Image,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import MapView from "react-native-maps";
import styles from "../../style/style";
import FONTS from "../../style/fonts";
import { Marker } from "react-native-maps";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import colores from "../../style/colors";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";
import { MAPS_API_KEY } from "@env";
import api from "../../config/api";
import formStyle from "../../style/formStyles";

import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Admin4 = ({ navigation }) => {
  const { getUserId, getUserRole, getToken } = useContext(AuthContext);
  const [tokData, setTokData] = useState("");

  const [lugar, setLugar] = useState("");
  const [elecc, setElecc] = useState("");
  const [address, setAddress] = useState("");
  const [address2, setAddress2] = useState("");
  const [campos, setCampos] = useState([]);
  const [canchas, setCanchas] = useState([]);
  const [canchasDesc, setCanchasDesc] = useState([]);
  const [loadCamps, setLoadCamps] = useState(false);
  const [fallo1, setFallo1] = useState("");

  const [selectedPlace, setSelectedPlace] = useState(null);
  const [slideAnim] = useState(new Animated.Value(-400));
  const [rows, setRows] = useState(1);

  useEffect(() => {
    const getCampos = async () => {
      const id = await getUserRole();
      const rolo = await getUserId();
      const tok = await getToken();
      setTokData(tok);

      setLoadCamps(true);
      api
        .get(`/api/campos`, {
          headers: {
            Authorization: `Bearer ${tok}`,
          },
        })
        .then((res) => {
          if (res.data.length === 0) setFallo1("No hay campos registrados");
          else setCampos(res.data);
        })
        .catch((e) => {
          console.error(e, e.res.message);
          if (err.response.status === 403) {
            console.log("⚠️ Token expirado, redirigiendo a login...");
            Alert.alert(
              "Sesión expirada",
              "Por favor, inicia sesión nuevamente."
            );
            logout()
            return;
          }
          if (e.res.message) setFallo1(e.res.message);
          else setFallo1("Error al obtener campos");
        })
        .finally(() => setLoadCamps(false));
    };
    getCampos();
  }, []);

  // Crear una referencia para el ScrollView
  const scrollViewRef = useRef(null);

  // Crear referencias para cada componente al que te quieres desplazar
  const sectionOneRef = useRef(null);

  const scrollY = useRef(new Animated.Value(0)).current;

  const handleScroll = () => {
    Animated.timing(scrollY, {
      toValue: 600, // La posición en la que quieres hacer scroll
      duration: 100, // Duración en milisegundos (ajusta este valor según lo suave que quieras la animación)
      useNativeDriver: true,
    }).start();
  };

  // Función para manejar el clic en el marcador
  const handleMarkerPress = (place) => {
    setSelectedPlace(place);

    // Animación de deslizamiento de la card
    Animated.timing(slideAnim, {
      toValue: 0, // Mover la card a su posición final
      duration: 500,
      useNativeDriver: true,
    }).start();
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

  const [direccionUri, setDireccionUri] = useState("");

  const [direccion2, setDireccion2] = useState([
    {
      lat: 0,
      long: 0,
    },
  ]);

  const handleLongPress2 = async (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setMarkers2([
      {
        id: Date.now().toString(),
        latitude,
        longitude,
        title: "Nuevo marcador",
      },
    ]);

    const { lugarNombre, direccionCompleta } = await getPlaceData(
      latitude,
      longitude
    );

    setElecc(lugarNombre);
    setDireccion([{ lat: latitude, long: longitude }]);
  };

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

    const { lugarNombre, direccionCompleta } = await getPlaceData(
      latitude,
      longitude
    );

    setDireccionUri(getOSMStaticImage(latitude, longitude));
    setLugar(lugarNombre);
    handleMarkerPress(lugarNombre);
    //setSelectedPlace(lugarNombre);
    setAddress2(direccionCompleta);
  };

  const handlePress = async (lat, lon, name, add) => {
    setMarkers((prevMarkers) => [
      ...prevMarkers,
      {
        id: Date.now().toString(),
        latitude: lat,
        longitude: lon,
        title: name,
      },
    ]);
    setDireccionUri(getOSMStaticImage(lat, lon));
    setLugar(name);
    setSelectedPlace(name);
    handleMarkerPress(name);
    setAddress2(add);
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
    setAddress2("");
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
    setLugar("");
    setAddress("");
    setDireccion([{ lat: 0, long: 0 }]);
  };

  const getPlaceData = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );
      const data = await response.json();

      if (!data || !data.address) {
        throw new Error("No se encontraron datos de ubicación");
      }

      // Obtener nombre del lugar
      const lugarNombre = data.display_name || "Lugar desconocido";

      // Obtener dirección detallada
      const road = data.address.road || "Calle desconocida";
      const city =
        data.address.city ||
        data.address.town ||
        data.address.village ||
        "Ciudad desconocida";

      const direccionCompleta = `${road}, ${city}`;

      // Guardar en estados
      setLugar(lugarNombre);
      setAddress(direccionCompleta);

      return { lugarNombre, direccionCompleta };
    } catch (error) {
      console.error("Error al obtener los datos de la ubicación", error);
      return {
        lugarNombre: "Lugar desconocido",
        direccionCompleta: "Dirección desconocida",
      };
    }
  };

  const getOSMStaticImage = (lat, lon) => {
    return `https://static-maps.yandex.ru/1.x/?ll=${lon},${lat}&z=14&l=sat&size=600,300`;
  };

  const getPlaceDetails = async (placeId) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${MAPS_API_KEY}`
      );
      const data = await response.json();

      if (data.result) {
        console.log(data.result.name, data.result.formatted_address);
        return {
          name: data.result.name, // Nombre del lugar
          address: data.result.formatted_address, // Dirección completa
        };
      } else {
        return { name: "Lugar desconocido", address: "Dirección desconocida" };
      }
    } catch (error) {
      console.error("Error al obtener detalles del lugar:", error);
      return { name: "Lugar desconocido", address: "Dirección desconocida" };
    }
  };

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={stylesAdmin4.container}>
        <Animated.ScrollView
          style={{ gap: 5 }}
          ref={scrollViewRef}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          contentOffset={{ y: scrollY }}
        >
          <View
            style={{
              flexDirection: "row",
              gap: 5,
              alignItems: "center",
              width: "95%",
              justifyContent: "flex-start",
            }}
          >
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
            <TouchableOpacity onPress={handleScroll}>
              <Ionicons
                name="add-circle-sharp"
                size={30}
                color={colores.acento_2_2}
              />
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              alignItems: "center",
              justifyContent: "center",
            }}
            style={{ maxHeight: 300 }}
          >
            {loadCamps ? (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: "100%",
                }}
              >
                <ActivityIndicator size="large" color={colores.domin_1_1} />
              </View>
            ) : fallo1 === "" ? (
              <View style={stylesAdmin4.table}>
                {/* Encabezado de la tabla */}
                <View style={stylesAdmin4.headerRow}>
                  <Text
                    style={[
                      stylesAdmin4.headerCell,
                      FONTS.oswaldNegrita,
                      stylesAdmin4.idCell,
                    ]}
                  >
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
                      stylesAdmin4.buttonHead,
                      { width: 80 },
                    ]}
                  >
                    Ver
                  </Text>
                  <Text
                    style={[
                      stylesAdmin4.headerCell,
                      FONTS.oswaldNegrita,
                      stylesAdmin4.buttonHead,
                      { width: 80 },
                    ]}
                  >
                    Editar
                  </Text>
                  <Text
                    style={[
                      stylesAdmin4.headerCell,
                      FONTS.oswaldNegrita,
                      stylesAdmin4.buttonHead,
                      { width: 80 },
                    ]}
                  >
                    Eliminar
                  </Text>
                </View>

                <View style={{ maxHeight: 250, padding: 5 }}>
                  <FlatList
                    data={campos}
                    keyExtractor={(item) => item.id}
                    nestedScrollEnabled={true}
                    renderItem={({ item }) => (
                      <View style={stylesAdmin4.row}>
                        <Text
                          style={[
                            stylesAdmin4.cell,
                            FONTS.nunitoNegrita,
                            stylesAdmin4.idCell,
                          ]}
                        >
                          {item.id}
                        </Text>
                        <Text style={[stylesAdmin4.cell, FONTS.nunitoNegrita]}>
                          {item.nombre}
                        </Text>
                        <Text style={[stylesAdmin4.cell, FONTS.nunitoNegrita]}>
                          {item.direccion}
                        </Text>
                        <Text style={[stylesAdmin4.cell, FONTS.nunitoNegrita]}>
                          {item.canchas.length}
                        </Text>
                        <TouchableOpacity
                          style={[stylesAdmin4.button, stylesAdmin4.buttonCell]}
                          onPress={() =>
                            handlePress(
                              item.latitud,
                              item.longitud,
                              item.nombre,
                              item.direccion
                            )
                          }
                        >
                          <Ionicons
                            name="map"
                            size={24}
                            color={colores.blanco}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            stylesAdmin4.button,
                            stylesAdmin4.editButton,
                            stylesAdmin4.buttonCell,
                          ]}
                        >
                          <Ionicons
                            name="pencil"
                            size={24}
                            color={colores.blanco}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            stylesAdmin4.button,
                            stylesAdmin4.deleteButton,
                            stylesAdmin4.buttonCell,
                          ]}
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
            ) : (
              <Text
                style={[FONTS.oswald, styles.errMessCenter, { marginTop: 10 }]}
              >
                {fallo1}
              </Text>
            )}
          </ScrollView>
          {Platform.OS !== "web" && (
            <View
              style={{
                width: "100%",
                height: 350,
                borderRadius: 5,
              }}
            >
              <MapView
                provider={MapView.PROVIDER_GOOGLE}
                style={{ flex: 1, width: "100%", height: "100%" }}
                region={region}
                onRegionChangeComplete={setRegion}
                onPress={handleLongPress}
                mapType="hybrid"
                onPoiClick={async (event) => {
                  const { placeId, coordinate } = event.nativeEvent;
                  handleLongPress(event);
                }}
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
                  style={[
                    FONTS.oswald,
                    { fontSize: 15, color: colores.blanco },
                  ]}
                >
                  Reiniciar mapa
                </Text>
              </TouchableOpacity>
            </View>
          )}
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
                  source={{ uri: direccionUri, alt: "Lugar" }}
                  style={{ width: 300, height: 150, resizeMode: "cover" }}
                />
                <Text style={[FONTS.oswaldNegrita, { fontSize: 18 }]}>
                  {selectedPlace}
                </Text>
                <Text style={[FONTS.nunito, { textAlign: "center" }]}>
                  Ubicación:
                  {address2 === ""
                    ? ` ${region.latitude}, ${region.longitude}`
                    : ` ${address2}`}
                </Text>
                <TouchableOpacity
                  onPress={resetMarkers}
                  style={{
                    width: "100%",
                    backgroundColor: colores.domin_3_1,
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
          <View ref={sectionOneRef}></View>
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
            {Platform.OS !== "web" && (
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
                  provider={MapView.PROVIDER_GOOGLE}
                  style={{ flex: 1, width: "100%", height: "100%" }}
                  onLongPress={handleLongPress2}
                  region={region2}
                  onRegionChangeComplete={setRegion2}
                  mapType="hybrid"
                  onPoiClick={async (event) => {
                    const { placeId, coordinate, name } = event.nativeEvent;
                    handleLongPress2(event);
                    setLugar(name);
                  }}
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
            )}
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
              value={address === "" ? "" : address}
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
                    value={rows + index}
                  />
                  <TextInput
                    style={[FONTS.oswald, stylesAdmin4.input, { width: "50%" }]}
                    placeholderTextColor={colores.domin_2_2}
                    placeholder="Descripción"
                    onChangeText={(text) => canchasDesc.push(text)}
                  />
                  <TouchableOpacity
                    style={[stylesAdmin4.button2, stylesAdmin4.editButton]}
                    onPress={() => {setRows(rows + 1); canchas.push({pos: index, desc: canchasDesc[index] || ""})}}
                  >
                    <Ionicons name="add" size={18} color={colores.blanco} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[stylesAdmin4.button2, stylesAdmin4.deleteButton]}
                    onPress={() => {(rows === 1 ? "" : (setRows(rows - 1))); }}
                  >
                    <Ionicons name="remove" size={18} color={colores.blanco} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <TouchableOpacity
              onPress={() => {resetMarkers2; console.log(canchas)}}
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
        </Animated.ScrollView>
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
    backgroundColor: colores.base_2_2,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
  },
  headerCell: {
    flex: 1,
    textAlign: "left",
    color: "white",
    paddingHorizontal: 10,
  },
  idCell: { maxWidth: 50 },
  buttonCell: { maxWidth: 60 },
  buttonHead: { maxWidth: 70 },

  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    padding: 10,
    alignItems: "center",
    borderBottomColor: colores.base_2_4,
  },
  cell: { flex: 1, textAlign: "left", paddingHorizontal: 10 },

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
