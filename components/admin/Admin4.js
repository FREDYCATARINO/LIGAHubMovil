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
  Alert,
  Modal,
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
  const [vis, setVis] = useState(false);
  const [editando, setEditando] = useState(false);
  const [campoEdit, setCampoEdit] = useState({});
  const [canchasEdit, setCanchasEdit] = useState([]);

  const [idCancha, setIdCancha] = useState({});
  const [modalCancha, setModalCancha] = useState(false);

  const [lugar, setLugar] = useState("");
  const [elecc, setElecc] = useState("");
  const [address, setAddress] = useState("");
  const [address2, setAddress2] = useState("");
  const [campos, setCampos] = useState([]);
  //const [canchas, setCanchas] = useState([]);
  const [canchas, setCanchas] = useState([
    { id: Date.now(), pos: 0, desc: "" },
  ]); // Fila por defecto
  const [canchasDesc, setCanchasDesc] = useState([]);
  const [loadCamps, setLoadCamps] = useState(false);
  const [fallo1, setFallo1] = useState("");

  const [selectedPlace, setSelectedPlace] = useState(null);
  const [slideAnim] = useState(new Animated.Value(-400));
  const [rows, setRows] = useState(1);
  const [rowsEdit, setRowsEdit] = useState(1);

  const [id, setId] = useState(0);

  const [reload, setReload] = useState(false);

  //esquema para validaciones
  const campo = yup.object().shape({
    id: yup.number(),
    nombre: yup.string().required("El nombre es requerido"),
    direccion: yup.string().required("La dirección es requerida"),
    latitud: yup
      .number("No válido")
      .typeError("Debe ser un número")
      .required("Latitud Requerida"),
    longitud: yup
      .number("No válido")
      .typeError("Debe ser un número")
      .required("Longitud Requerida"),
    cancha: yup.string().required("Debes registrar al menos 1 cancha"),
  });

  // Al momento de editar, puedes establecer estos valores como predeterminados
  const setEdicion = (campo, cancha, canchas) => {
    setId(campo.id);
    setEditando(true);
    // Usamos setValue para rellenar el formulario con los valores de miCampo
    setValue("id", campo.id);
    setValue("nombre", campo.nombre);
    setValue("direccion", campo.direccion);
    setValue("latitud", campo.latitud);
    setValue("longitud", campo.longitud);
    setValue("cancha", cancha);
    setCanchasEdit(canchas);
    canchas.map((c) => {
      console.log(c);
    });
  };

  // Al momento de editar, puedes establecer estos valores como predeterminados
  const removeEdicion = () => {
    // Usamos setValue para rellenar el formulario con los valores de miCampo
    setId(0);
    setValue("nombre", "");
    setValue("direccion", "");
    setValue("latitud", "");
    setValue("longitud", "");
    setValue("cancha", "");
    setEditando(false);
  };

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(campo),
    mode: "onChange",
  });

  const crearCampo = async (data) => {
    try {
      const res = await api.post(
        `/api/campos`,
        JSON.stringify({
          nombre: data.nombre,
          direccion: data.direccion,
          latitud: data.latitud,
          longitud: data.longitud,
        }),
        {
          headers: {
            Authorization: `Bearer ${tokData}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(res.data);
      if (res.data.id) {
        canchas.map((c) => {
          registrarCancha(c.desc, c.pos, res.data.id);
        });
      }
      Alert.alert("¡Éxito!", "Campo registrado exitosamente");
      setReload(!reload);
    } catch (err) {
      console.error(err, err.res.message);
      if (err.response.status === 403) {
        console.log("⚠️ Token expirado, redirigiendo a login...");
        Alert.alert("Sesión expirada ⚠️", "Por favor, inicia sesión nuevamente.");
        logout();
        return;
      }
    }
  };

  const registrarCancha = async (desc, pos, id) => {
    try {
      const res = await api.post(
        `/api/canchas`,
        JSON.stringify({
          numeroCancha: pos,
          descripcion: desc,
          idCampo: id,
        }),
        {
          headers: {
            Authorization: `Bearer ${tokData}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(res.data);
    } catch (err) {
      console.log(err.toJSON());
      console.error(err, err.response.message);
      if (err.response.status === 403) {
        console.log("⚠️ Token expirado, redirigiendo a login...");
        Alert.alert("Sesión expirada ⚠️", "Por favor, inicia sesión nuevamente.");
        logout();
        return;
      }
    }
  };

  const quitarCancha = async (id) => {
    try {
      const res = await api.put(
        `/api/canchas/estatus/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${tokData}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(res.data);
      Alert.alert("¡Éxito!", "operación exitosa");
      setReload(!reload);
    } catch (err) {
      console.log(err.toJSON());
      console.error(err, err.response.message);
      if (err.response.status === 403) {
        console.log("⚠️ Token expirado, redirigiendo a login...");
        Alert.alert("Sesión expirada ⚠️", "Por favor, inicia sesión nuevamente.");
        logout();
        return;
      }
    } finally {
      setModalCancha(false);
    }
  };

  const updateCampo = async (data) => {
    console.log(data, "Wey");
    const token = await getToken();
    try {
      const res = await api.put(
        `/api/campos/${data.id || id}`,
        JSON.stringify({
          nombre: data.nombre,
          direccion: data.direccion,
          latitud: data.latitud,
          longitud: data.longitud,
        }),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(res.data);
      if (res.data.id) {
        canchasEdit.map((c) => {
          updateCancha(c.descripcion, c.numeroCancha, res.data.id, c.id);
          console.log(c);
        });
      }
      Alert.alert("¡Éxito!", "Campo actualizado exitosamente");
      setReload(!reload);
      removeEdicion();
      setCampoEdit({});
      setCanchasEdit([]);
    } catch (err) {
      console.error(err, err.response.message, err.toJSON());
      if (err.response.status === 403) {
        console.log("⚠️ Token expirado, redirigiendo a login...");
        Alert.alert("Sesión expirada ⚠️", "Por favor, inicia sesión nuevamente.");
        logout();
        return;
      }
    }
  };

  const updateCancha = async (desc, pos, id, idCan) => {
    const token = await getToken();
    try {
      const res = await api.put(
        `/api/canchas/${idCan}`,
        JSON.stringify({
          numeroCancha: pos,
          descripcion: desc,
          idCampo: id,
        }),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(res.data);
    } catch (err) {
      console.log(err.toJSON());
      console.error(err, err.response.message);
      if (err.response.status === 403) {
        console.log("⚠️ Token expirado, redirigiendo a login...");
        Alert.alert("Sesión expirada ⚠️", "Por favor, inicia sesión nuevamente.");
        logout();
        return;
      }
    }
  };

  useEffect(() => {
    const getCampos = async () => {
      const id = await getUserRole();
      const rolo = await getUserId();
      const tok = await getToken();
      setTokData(tok);

      setLoadCamps(true);
      api
        .get(`/api/campos/activos`, {
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
          if (e.response.status === 403) {
            console.log("⚠️ Token expirado, redirigiendo a login...");
            Alert.alert(
              "Sesión expirada ⚠️",
              "Por favor, inicia sesión nuevamente."
            );
            logout();
            return;
          }
          if (e.res.message) setFallo1(e.res.message);
          else setFallo1("Error al obtener campos");
        })
        .finally(() => setLoadCamps(false));
    };
    getCampos();
    setCanchas([{ id: Date.now(), pos: 0, desc: "" }]);
  }, [reload]);

  // Crear una referencia para el ScrollView
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);

  // Función para manejar el desplazamiento programático
  const scrollToPosition = (position, duration = 500) => {
    setVis(!vis);
    Animated.timing(scrollY, {
      toValue: position,
      duration: duration,
      useNativeDriver: false, // Necesario para ScrollView
    }).start();

    //scrollViewRef.current?.scrollTo({ y: position, animated: true });
  };

  // Escuchar cambios en la animación y actualizar el estado si es necesario
  useEffect(() => {
    const listenerId = scrollY.addListener(({ value }) => {});

    return () => {
      scrollY.removeListener(listenerId);
    };
  }, []);

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
    setValue("latitud", latitude);
    setValue("longitud", longitude);
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
    setValue("nombre", "");
    setValue("direccion", "");
    setValue("latitud", "");
    setValue("longitud", "");
    setValue("cancha", "");
    setCanchas([{ id: Date.now(), pos: 0, desc: "" }]);
    setDireccion([{ lat: 0, long: 0 }]);
    if (canchasEdit.length !== 0)
      setCanchasEdit([[{ id: Date.now(), pos: 0, desc: "" }]]);
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

      // Obtener la dirección completa
      const direccionCompleta =
        data.display_name ||
        `${data.address.road || ""}, ${data.address.city || ""}, ${
          data.address.state || ""
        }, ${data.address.country || ""}`;

      // Tratar de obtener el nombre del lugar
      let lugarNombre = "Nombre desconocido";

      // 1. Si el display_name ya tiene un nombre claro, usarlo
      if (data.display_name) {
        const partes = data.display_name.split(",");
        if (partes.length > 1) {
          // Tratar de separar nombre de la dirección
          lugarNombre = partes[0].trim(); // Usar el primer fragmento como el nombre
        }
      }

      // 2. Si no tiene un nombre claro, tratar de identificar un nombre dentro de la dirección
      if (lugarNombre === "Nombre desconocido" && direccionCompleta) {
        const partesDireccion = direccionCompleta.split(",");

        // Usamos el primer fragmento como el nombre si no contiene palabras clave de dirección
        const palabrasClave = [
          "Avenida",
          "Calle",
          "Plaza",
          "Boulevard",
          "Camino",
          "Paseo",
          "Ruta",
        ];
        const posibleNombre = partesDireccion[0].trim();
        const tienePalabrasClave = palabrasClave.some((palabra) =>
          posibleNombre.includes(palabra)
        );

        if (!tienePalabrasClave) {
          lugarNombre = posibleNombre; // Si no tiene palabras clave, lo consideramos un nombre
        }
      }

      // Si sigue siendo "Nombre desconocido", se le permite al usuario ingresar el nombre
      if (lugarNombre === "Nombre desconocido") {
        lugarNombre = "Nombre desconocido"; // Esto se usará para activar el campo de texto
      }

      // Quitar el nombre del lugar de la dirección
      let direccionSinNombre = direccionCompleta;
      if (direccionSinNombre.includes(lugarNombre)) {
        // Si la dirección incluye el nombre, lo quitamos
        direccionSinNombre = direccionSinNombre.replace(lugarNombre, "").trim();
      }

      // Guardar en los estados
      setLugar(lugarNombre); // Nombre del lugar
      setAddress(direccionSinNombre); // Dirección sin el nombre
      setValue("nombre", lugarNombre); // Actualiza el formulario con el nombre del lugar
      setValue("direccion", direccionSinNombre); // Actualiza el formulario con la dirección sin el nombre

      return { lugarNombre, direccionSinNombre };
    } catch (error) {
      console.error("Error al obtener los datos de la ubicación", error);
      return {
        lugarNombre: "Nombre desconocido",
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

  const addRow = () => {
    setRows(rows + 1);
    setCanchas([...canchas, { id: Date.now(), pos: rows + 1, desc: "" }]); // Agrega una nueva fila con id único
  };

  const addRowEdit = () => {
    setRows(canchasEdit.length);
    setRowsEdit(rows + 1);
    setCanchasEdit([
      ...canchasEdit,
      { id: Date.now(), pos: rows + 1, desc: "" },
    ]); // Agrega una nueva fila con id único
  };

  const updateDescription = (id, text) => {
    setCanchas(
      canchas.map(
        (cancha) => (cancha.id === id ? { ...cancha, desc: text } : cancha) // Actualiza la descripción de la cancha
      )
    );
  };

  const updateDescriptionWithCount = (id, text) => {
    setCanchasEdit(
      canchasEdit.map(
        (cancha) => (cancha.id === id ? { ...cancha, desc: text } : cancha) // Actualiza la descripción de la cancha
      )
    );
  };

  const removeRow = (id) => {
    if (rows > 1) {
      setRows(rows - 1);
      setCanchas(canchas.filter((cancha) => cancha.id !== id)); // Elimina la fila con el id correspondiente
    }
  };

  const removeRowEdit = (id) => {
    setRows(canchasEdit.length);
    if (rows > 1) {
      setRowsEdit(rows - 1);
      setCanchasEdit(canchasEdit.filter((cancha) => cancha.id !== id)); // Elimina la fila con el id correspondiente
    }
  };

  useEffect(() => console.log(errors), [errors]);

  const onSubmit = async (data) => {
    console.log(data);
    console.log(markers2);
    resetMarkers2;
    console.log(canchas);
    editando ? updateCampo(data) : crearCampo(data);
  };

  return (
    <GestureHandlerRootView>
      <SafeAreaView
        style={stylesAdmin4.container}
        showsVerticalScrollIndicator={false}
      >
        <Animated.ScrollView
          style={{ gap: 5 }}
          ref={scrollViewRef}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
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
            <TouchableOpacity onPress={() => scrollToPosition(600, 1000)}>
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
            nestedScrollEnabled={true}
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
                  {/* <Text
                    style={[
                      stylesAdmin4.headerCell,
                      FONTS.oswaldNegrita,
                      stylesAdmin4.buttonHead,
                      { width: 80 },
                    ]}
                  >
                    Eliminar
                  </Text> */}
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
                          onPress={() => {
                            setEdicion(
                              item,
                              item.canchas[0].descripcion,
                              item.canchas
                            );
                            setVis(true);
                          }}
                        >
                          <Ionicons
                            name="pencil"
                            size={24}
                            color={colores.blanco}
                          />
                        </TouchableOpacity>
                        {/* <TouchableOpacity
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
                        </TouchableOpacity> */}
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

          <Modal
            animationType="fade"
            transparent={true}
            visible={modalCancha}
            onRequestClose={() => setModalCancha(false)}
          >
            <View style={stylesModal.modalContainer}>
              <View style={stylesModal.modalContent}>
                <TouchableOpacity
                  style={{
                    alignSelf: "flex-end",
                    justifyContent: "flex-start",
                    marginTop: -10,
                    marginRight: -10,
                  }}
                  onPress={() => setModalCancha(false)}
                >
                  <Ionicons name="close" size={24} color={colores.negro} />
                </TouchableOpacity>
                <Ionicons
                  name="help-circle"
                  size={48}
                  color={colores.domin_2_1}
                />
                <Text style={[stylesModal.modalTitle, FONTS.oswaldNegrita]}>
                  {idCancha.estatusCancha
                    ? "¿Deshabilitar cancha?"
                    : "¿Rehabilitar cancha?"}
                </Text>
                <Text style={[FONTS.oswald, stylesModal.modalText]}>
                  ¿Seguro deseas hacerlo?
                </Text>
                <View style={stylesModal.modalButRow}>
                  <TouchableOpacity
                    style={[stylesModal.buttonBack, FONTS.oswald]}
                    onPress={async () => quitarCancha(idCancha.id)}
                  >
                    <Text style={[stylesModal.buttonText, FONTS.oswald]}>
                      Si
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[stylesModal.buttonBack, FONTS.oswald]}
                    onPress={() => setModalCancha(false)}
                  >
                    <Text style={[stylesModal.buttonText, FONTS.oswald]}>
                      No
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          <Modal
            animationType="slide"
            transparent={true}
            visible={vis}
            onRequestClose={() => setVis(false)}
          >
            <View style={stylesModal.modalContainer}>
              <View style={stylesModal.modalContent3}>
                <TouchableOpacity
                  style={{
                    alignSelf: "flex-end",
                    justifyContent: "flex-start",
                    marginTop: 10,
                    marginRight: 10,
                    marginBottom: 2,
                  }}
                  onPress={() => setVis(false)}
                >
                  <Ionicons name="close" size={36} color={colores.negro} />
                </TouchableOpacity>
                <ScrollView
                  style={{ maxHeight: 500 }}
                  nestedScrollEnabled={true}
                  showsVerticalScrollIndicator={false}
                >
                  {vis ? (
                    <View>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Text
                          style={[
                            styles.TextField,
                            stylesAdmin4.title,
                            FONTS.nunitoNegrita,
                            { paddingVertical: 2, paddingHorizontal: 5 },
                          ]}
                        >
                          {editando ? "Editar campo" : "Registrar campo"}
                        </Text>
                        {!editando ? null : (
                          <TouchableOpacity
                            onPress={() => {
                              setEditando(false);
                              removeEdicion();
                              if (canchasEdit.length !== 0)
                                setCanchasEdit([
                                  [{ id: Date.now(), pos: 0, desc: "" }],
                                ]);
                            }}
                          >
                            <Ionicons
                              name="refresh-circle"
                              size={30}
                              color={colores.acento_2_2}
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                      <View style={stylesAdmin4.form}>
                        <Text
                          style={[FONTS.oswald, { alignSelf: "flex-start" }]}
                        >
                          Elege buscando el lugar en el mapa
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
                                const { placeId, coordinate, name } =
                                  event.nativeEvent;
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
                                width: "50%",
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
                        <Controller
                          control={control}
                          name="nombre"
                          render={({ field: { onChange, value } }) => (
                            <>
                              {value === "Nombre desconocido" ? (
                                <TextInput
                                  style={[FONTS.oswald, stylesAdmin4.input]}
                                  placeholderTextColor={colores.domin_2_2}
                                  placeholder="Escribe el nombre"
                                  value={value}
                                  onChangeText={onChange}
                                />
                              ) : (
                                <TextInput
                                  style={[FONTS.oswald, stylesAdmin4.input]}
                                  placeholderTextColor={colores.domin_2_2}
                                  value={value}
                                  placeholder="Busca un lugar"
                                  onChangeText={onChange}
                                  disabled={true}
                                />
                              )}
                              {errors.nombre && (
                                <Text style={[formStyle.errText]}>
                                  {errors.nombre.message}
                                </Text>
                              )}
                            </>
                          )}
                        />
                        <Controller
                          control={control}
                          name="direccion"
                          render={({ field: { onChange, value } }) => (
                            <>
                              <TextInput
                                style={[FONTS.oswald, stylesAdmin4.input]}
                                placeholderTextColor={colores.domin_2_2}
                                placeholder="Dirección"
                                value={value}
                              />
                              {errors.direccion && (
                                <Text style={[formStyle.errText]}>
                                  {errors.direccion.message}
                                </Text>
                              )}
                            </>
                          )}
                        />
                        <Controller
                          control={control}
                          name="latitud"
                          render={({ field: { onChange, value } }) => (
                            <>
                              {errors.latitud && (
                                <Text style={[formStyle.errText]}>
                                  {errors.latitud.message}
                                </Text>
                              )}
                            </>
                          )}
                        />
                        <Controller
                          control={control}
                          name="longitud"
                          render={({ field: { onChange, value } }) => (
                            <>
                              {errors.longitud && (
                                <Text style={[formStyle.errText]}>
                                  {errors.longitud.message}
                                </Text>
                              )}
                            </>
                          )}
                        />
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 3,
                          }}
                        >
                          <Text
                            style={[
                              FONTS.oswald,
                              { alignSelf: "flex-start", fontSize: 18 },
                            ]}
                          >
                            Asignación de canchas
                          </Text>
                          {!editando && (
                            <TouchableOpacity onPress={addRow}>
                              <Ionicons
                                name="add-circle-sharp"
                                size={24}
                                color={colores.acento_2_2}
                              />
                            </TouchableOpacity>
                          )}
                        </View>
                        <View>
                          {editando
                            ? canchasEdit.map((cancha, index) => (
                                <View
                                  key={cancha.id}
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
                                    value={(index + 1).toString()} // Muestra el número de la fila
                                    editable={false} // Solo visualización, no editable
                                  />
                                  {index === 0 ? (
                                    <Controller
                                      control={control}
                                      name="cancha"
                                      render={({
                                        field: { onChange, value },
                                      }) => (
                                        <View
                                          style={{
                                            flexDirection: "column",
                                            width: "75%",
                                          }}
                                        >
                                          <TextInput
                                            style={[
                                              FONTS.oswald,
                                              stylesAdmin4.input,
                                            ]}
                                            placeholderTextColor={
                                              colores.domin_2_2
                                            }
                                            placeholder="Descripción"
                                            onChangeText={(text) => {
                                              onChange(text);
                                              updateDescriptionWithCount(
                                                cancha.id,
                                                text
                                              );
                                            }}
                                            value={value}
                                          />
                                          {errors.cancha && (
                                            <Text style={[formStyle.errText]}>
                                              {errors.cancha.message}
                                            </Text>
                                          )}
                                        </View>
                                      )}
                                    />
                                  ) : (
                                    <TextInput
                                      style={[
                                        FONTS.oswald,
                                        stylesAdmin4.input,
                                        { width: "75%" },
                                      ]}
                                      placeholderTextColor={colores.domin_2_2}
                                      placeholder="Descripción"
                                      onChangeText={(text) =>
                                        updateDescriptionWithCount(
                                          cancha.id,
                                          text
                                        )
                                      }
                                      value={cancha.descripcion}
                                    />
                                  )}
                                  <TouchableOpacity
                                    style={[
                                      stylesAdmin4.button2,
                                      cancha.estatusCancha
                                        ? stylesAdmin4.deleteButton
                                        : stylesAdmin4.redoButton,
                                    ]}
                                    onPress={() => /*removeRowEdit(cancha.id)*/ {
                                      setModalCancha(true), setIdCancha(cancha);
                                    }}
                                  >
                                    <Ionicons
                                      name={
                                        cancha.estatusCancha
                                          ? "trash"
                                          : "reload"
                                      }
                                      size={18}
                                      color={colores.blanco}
                                    />
                                  </TouchableOpacity>
                                </View>
                              ))
                            : canchas.map((cancha, index) => (
                                <View
                                  key={cancha.id}
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
                                    value={(index + 1).toString()}
                                    editable={false}
                                  />
                                  {index === 0 ? (
                                    <Controller
                                      control={control}
                                      name="cancha"
                                      render={({
                                        field: { onChange, value },
                                      }) => (
                                        <View
                                          style={{
                                            flexDirection: "column",
                                            width: "75%",
                                          }}
                                        >
                                          <TextInput
                                            style={[
                                              FONTS.oswald,
                                              stylesAdmin4.input,
                                            ]}
                                            placeholderTextColor={
                                              colores.domin_2_2
                                            }
                                            placeholder="Descripción"
                                            onChangeText={(text) => {
                                              onChange(text);
                                              updateDescription(
                                                cancha.id,
                                                text
                                              );
                                            }}
                                            value={value}
                                          />
                                          {errors.cancha && (
                                            <Text style={[formStyle.errText]}>
                                              {errors.cancha.message}
                                            </Text>
                                          )}
                                        </View>
                                      )}
                                    />
                                  ) : (
                                    <TextInput
                                      style={[
                                        FONTS.oswald,
                                        stylesAdmin4.input,
                                        { width: "75%" },
                                      ]}
                                      placeholderTextColor={colores.domin_2_2}
                                      placeholder="Descripción"
                                      onChangeText={(text) =>
                                        updateDescription(cancha.id, text)
                                      }
                                      value={cancha.desc}
                                    />
                                  )}
                                  {index === 0 ? (
                                    <TouchableOpacity
                                      style={[
                                        stylesAdmin4.button2,
                                        stylesAdmin4.redoButton,
                                      ]}
                                      onPress={() =>
                                        Alert.alert(
                                          "Información",
                                          "Para registrar un campo, debes registrar por lo menos 1 cancha"
                                        )
                                      } // Agrega una nueva fila
                                    >
                                      <Ionicons
                                        name="help"
                                        size={18}
                                        color={colores.blanco}
                                      />
                                    </TouchableOpacity>
                                  ) : (
                                    <TouchableOpacity
                                      style={[
                                        stylesAdmin4.button2,
                                        stylesAdmin4.deleteButton,
                                      ]}
                                      onPress={() => removeRow(cancha.id)}
                                    >
                                      <Ionicons
                                        name="remove"
                                        size={18}
                                        color={colores.blanco}
                                      />
                                    </TouchableOpacity>
                                  )}
                                </View>
                              ))}
                        </View>
                        <TouchableOpacity
                          disabled={!isValid}
                          onPress={handleSubmit(onSubmit)}
                          style={{
                            width: "50%",
                            backgroundColor: colores.domin_1_4,
                            alignSelf: "center",
                            alignItems: "center",
                            padding: 10,
                            margin: 5,
                            borderRadius: 10,
                            opacity: isValid ? 1 : 0.5,
                          }}
                        >
                          <Text
                            style={[
                              FONTS.oswald,
                              { fontSize: 15, color: colores.blanco },
                            ]}
                          >
                            {editando ? "Actualizar" : "Registrar"}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : null}
                </ScrollView>
              </View>
            </View>
          </Modal>
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
  redoButton: { backgroundColor: colores.acento_3_1 },

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

const stylesModal = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    flexDirection: "row",
    backgroundColor: colores.domin_2_3,
    padding: 5,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: 250,
    gap: 5,
  },
  modalContent2: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: 300,
    gap: 5,
  },
  modalContent3: {
    backgroundColor: "white",
    padding: 5,
    borderRadius: 10,
    alignItems: "center",
    width: "95%",
    gap: 5,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: "#FF3B30",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },
  modalTitle: {
    width: "100%",
    fontSize: 20,
    textAlign: "center",
    marginBottom: 5,
  },
  modalItem: {
    borderRadius: 5,
    width: "100%",
    padding: 5,
    marginVertical: 3,
    paddingRight: 8,
  },
  modalItemActive: {
    backgroundColor: colores.domin_2_5,
    opacity: 0.5,
  },
  buttonBack: {
    flexDirection: "row",
    backgroundColor: colores.domin_2_3,
    padding: 5,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    width: "50%",
    marginBottom: 5,
  },
  modalButRow: {
    flexDirection: "row",
    width: "100%",
    gap: 5,
    justifyContent: "center",
  },
  buttonText: {
    color: colores.blanco,
    alignItems: "center",
  },
  modalText: {
    textAlign: "justify",
    paddingVertical: 10,
  },
  modalDato: {
    width: "100%",
  },
  fotoEquipo: { width: 100, height: 100, resizeMode: "contain" },
});

export default Admin4;
