import React from "react";
import {
  Text,
  Button,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  Modal,
  Image,
  TextInput,
} from "react-native";
//import { TextInput } from "react-native-paper";
import WebView from "react-native-webview";
import { useRef, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import FONTS from "../../style/fonts";
import { useFonts } from "expo-font";
import {
  Oswald_400Regular,
  Oswald_700Bold,
  Oswald_400Italic,
  Oswald_700BoldItalic,
} from "@expo-google-fonts/oswald"; // Cargar Oswald
import {
  Nunito_400Regular,
  Nunito_700Bold,
  Nunito_400Italic,
  Nunito_700BoldItalic,
} from "@expo-google-fonts/nunito"; // Cargar Nunito
import colores from "../../style/colors";
import LottieView from "lottie-react-native";
import { Checkbox } from "react-native-paper";

const jugadoresPrueba = [
  {
    id: 1,
    nombre: "Jugador #001",
    goles: 9,
    partidos: 5,
    fallas: 0,
    img: "https://lindamood.net/wp-content/uploads/2019/09/Blank-profile-image.jpg",
    activo: true,
  },
  {
    id: 2,
    nombre: "Jugador #002",
    goles: 3,
    partidos: 8,
    fallas: 0,
    img: "https://lindamood.net/wp-content/uploads/2019/09/Blank-profile-image.jpg",
    activo: true,
  },
  {
    id: 3,
    nombre: "Jugador #003",
    goles: 6,
    partidos: 1,
    fallas: 0,
    img: "https://lindamood.net/wp-content/uploads/2019/09/Blank-profile-image.jpg",
    activo: true,
  },
  {
    id: 4,
    nombre: "Jugador #004",
    goles: 10,
    partidos: 3,
    fallas: 0,
    img: "https://lindamood.net/wp-content/uploads/2019/09/Blank-profile-image.jpg",
    activo: false,
  },
  {
    id: 5,
    nombre: "Jugador #005",
    goles: 9,
    partidos: 2,
    fallas: 0,
    img: "https://lindamood.net/wp-content/uploads/2019/09/Blank-profile-image.jpg",
    activo: false,
  },
  {
    id: 6,
    nombre: "Jugador #006",
    goles: 2,
    partidos: 1,
    fallas: 1,
    img: "https://lindamood.net/wp-content/uploads/2019/09/Blank-profile-image.jpg",
    activo: true,
  },
  {
    id: 7,
    nombre: "Jugador #007",
    goles: 0,
    partidos: 50,
    fallas: 50,
    img: "https://lindamood.net/wp-content/uploads/2019/09/Blank-profile-image.jpg",
    activo: true,
  },
];

const equipos = [
  {
    equipoId: 1,
    nombre: "Chivas",
    dt: {
      id: 1,
      nombre: "Juan Peréz",
      correo: "juanperez@hotmail.com",
      img: "https://th.bing.com/th/id/OIP.SVo8-p3WhGOnngP6K6tBsAHaKc?w=115&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7",
    },
    jugadores: jugadoresPrueba,
    img: "https://drive.google.com/uc?export=view&id=1-FOLUn9u4T-D5ggneCO0nZm4jOOVXItI",
  },
  {
    equipoId: 2,
    nombre: "Cruz Azul",
    dt: {
      id: 2,
      nombre: "Mauro Bahena",
      correo: "maurodfr@hotmail.com",
      img: "https://i.pinimg.com/originals/55/45/e2/5545e27dd7441dc888fa6e4669421bdc.png",
    },
    jugadores: jugadoresPrueba,
    img: "https://drive.google.com/uc?export=view&id=1L4y6YuAZuIYWEOlWr0sBKmoutcMFyG54",
  },
  {
    equipoId: 3,
    nombre: "Monterrey",
    dt: {
      id: 3,
      nombre: "Nick Fury",
      correo: "vengadores@hotmail.com",
      img: "https://th.bing.com/th/id/OIP.YoIWYEmDFaQof1wx6j8xBQHaKp?w=132&h=190&c=7&pcl=1b1a19&r=0&o=5&dpr=1.5&pid=1.7",
    },
    jugadores: jugadoresPrueba,
    img: "https://drive.google.com/uc?export=view&id=1L_u5cuRI6pI78YOb-0PIt_vovmV8SLLX",
  },
  {
    equipoId: 4,
    nombre: "Necaxa",
    dt: {
      id: 4,
      nombre: "Don Ramón",
      correo: "mochito@gmail.com",
      img: "https://th.bing.com/th/id/OIP.iox5J2IefKpTqQ3A0PovKwAAAA?rs=1&pid=ImgDetMain",
    },
    jugadores: jugadoresPrueba,
    img: "https://drive.google.com/uc?export=view&id=1_bDUfg2szuTCPy6onk37wSbzOoZGyhWW",
  },
  {
    equipoId: 5,
    nombre: "Pumas",
    dt: {
      id: 5,
      nombre: "Francisco Pulido",
      correo: "camarapaino@utez.edu.mx",
      img: "https://th.bing.com/th/id/OIP.crgqPqen60BHAPwu_jzyAgHaNK?rs=1&pid=ImgDetMain",
    },
    jugadores: jugadoresPrueba,
    img: "https://drive.google.com/uc?export=view&id=1IdFsp723ipbBX95PWsXwpURsO5L4jGei",
  },
  {
    equipoId: 6,
    nombre: "America",
    dt: {
      id: 6,
      nombre: "Daniel Aguilar",
      correo: "daniel@aguilar.com",
      img: "https://th.bing.com/th/id/OIP.9Uh0RFprWijPzuoxR2tcBQHaNL?w=115&h=181&c=7&pcl=1b1a19&r=0&o=5&dpr=1.5&pid=1.7",
    },
    jugadores: jugadoresPrueba,
    img: "https://drive.google.com/uc?export=view&id=1hLeMo386b05HrRd2mruNXZZqlWJ_EbSC",
  },
  {
    equipoId: 7,
    nombre: "Atlas",
    dt: {
      id: 7,
      nombre: "El piojo Herrera",
      correo: "elpiojitoxd@gmail.com",
      img: "https://th.bing.com/th/id/OIP.vEf5l5SjcnsD1mhWGM2uRAAAAA?rs=1&pid=ImgDetMain",
    },
    jugadores: jugadoresPrueba,
    img: "https://drive.google.com/uc?export=view&id=1yeIzWN8Wl6TvIrEtqci874SU7MT6E8cg",
  },
  {
    equipoId: 8,
    nombre: "Tigres",
    dt: {
      id: 8,
      nombre: "Tigre Toño",
      correo: "grrriquisimas@hotmail.com",
      img: "https://tecolotito.elsiglodetorreon.com.mx/i/2010/05/204363.jpeg",
    },
    jugadores: jugadoresPrueba,
    img: "https://drive.google.com/uc?export=view&id=1HMF63odQw9WzQdVmfFbSP1H3_F8qY-uV",
  },
];

const torneosPrueba = [
  {
    id: 1,
    nombre: "Mario Kart",
    fechaInicio: "02/02/2025",
    fechaFin: "10/02/2025",
    estado: "En curso",
    img: "",
    motivo: "",
    desc: "Hola",
    max: 10,
    min: 8,
    resul: "",
  },
  {
    id: 2,
    nombre: "El chavo",
    fechaInicio: "17/02/2025",
    fechaFin: "25/02/2025",
    estado: "En curso",
    img: "",
    motivo: "",
    desc: "Mundo",
    max: 12,
    min: 10,
    resul: "",
  },
  {
    id: 3,
    nombre: "UTEZ",
    fechaInicio: "28/02/2025",
    fechaFin: "07/03/2025",
    estado: "Finalizado",
    img: "",
    motivo: "",
    desc: "No se",
    max: 10,
    min: 12,
    resul: "Chivas",
  },
  {
    id: 4,
    nombre: "CECyTE",
    fechaInicio: "12/03/2025",
    fechaFin: "20/03/2025",
    estado: "Cancelado",
    img: "",
    motivo: "Sismo",
    desc: "Qué",
    max: 12,
    min: 14,
    resul: "",
  },
  {
    id: 5,
    nombre: "2022",
    fechaInicio: "24/03/2025",
    fechaFin: "01/04/2025",
    estado: "Finalizado",
    img: "",
    motivo: "",
    desc: "Poner",
    max: 14,
    min: 16,
    resul: "Pumas",
  },
  {
    id: 6,
    nombre: "Liuguilla",
    fechaInicio: "02/04/2025",
    fechaFin: "10/04/2025",
    estado: "Cancelado",
    img: "",
    motivo: "Balacera",
    desc: "Aquí",
    max: 16,
    min: 18,
    resul: "",
  },
];

const ordenEstados = ["En curso", "Finalizado", "Cancelado"];

const torneosOrdenados = torneosPrueba.sort((a, b) => {
  const indexA = ordenEstados.indexOf(a.estado);
  const indexB = ordenEstados.indexOf(b.estado);

  if (indexA !== indexB) {
    return indexA - indexB;
  }

  const fechaA = new Date(a.fechaInicio.split("/").reverse().join("-"));
  const fechaB = new Date(b.fechaInicio.split("/").reverse().join("-"));

  return fechaA - fechaB;
});

const Admin3 = ({ navigation }) => {
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [modalVisible3, setModalVisible3] = useState(false);
  const [tournamentName, setTournamentName] = useState("");
  const [tournamentData, setTournamentData] = useState({});
  const [logoTorneo, setLogoTorneo] = useState("null");
  const [checked, setChecked] = useState(false);
  const [counter, setCounter] = useState(0);

  const [checkedState, setCheckedState] = useState(
    equipos.reduce((acc, equipo) => {
      acc[equipo.id] = false;
      return acc;
    }, {})
  );

  const handleCheckboxChange = (id) => {
    setCheckedState((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
    console.log(id, checkedState);
  };

  //Borrar despues
  const setLog = () => {
    setLogoTorneo("../../assets/EquiposLogos/LogoDefault.png");
  };

  useEffect(() => {
    setLog;
  }, []);

  const showModal1 = (name) => {
    setModalVisible1(true);
    setModalVisible2(false);
    setModalVisible3(false);
    setTournamentName(name);
  };

  const showModal2 = (name) => {
    setModalVisible1(false);
    setModalVisible2(true);
    setModalVisible3(false);
    setTournamentName(name);
  };

  const showModal3 = (name, tor) => {
    setModalVisible1(false);
    setModalVisible2(false);
    setModalVisible3(true);
    setTournamentName(name);
    setTournamentData(tor);
  };

  const getEstilo = (nombre) => {
    switch (nombre) {
      case "En curso":
        return stylesAdmin3.torneoActivo;
      case "Finalizado":
        return stylesAdmin3.torneoInactivo;
      case "Cancelado":
        return stylesAdmin3.torneoCancelado;
      default:
        return styles.defaultText;
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text
          style={[
            styles.TextField,
            stylesAdmin3.title,
            FONTS.nunitoNegrita,
            { paddingVertical: 15, paddingHorizontal: 5 },
          ]}
        >
          Torneos
        </Text>
        <ScrollView
          horizontal={true}
          style={stylesAdmin3.scrollContainer}
          showsHorizontalScrollIndicator={false}
        >
          {/*<WebView
                originWhitelist={["*"]}
                source={{
                  html: `<script src="https://cdn.lordicon.com/lordicon.js"></script>
          <lord-icon
              src="https://cdn.lordicon.com/lewtedlh.json"
              trigger="loop"
              stroke="bold"
              state="loop-roll"
              colors="primary:#242424,secondary:#c71f16"
              style="width:450px;height:450px;align-items:center;justify-content:center">
          </lord-icon>`,
                }}
                style={styles.webview}
              />*/}

          {torneosOrdenados.map((tor) => {
            return (
              <TouchableOpacity
                style={[stylesAdmin3.box, getEstilo(tor.estado)]}
              >
                <View style={stylesAdmin3.boxHeader}>
                  <Text
                    style={[
                      stylesAdmin3.textHead1,
                      FONTS.oswaldNegrita,
                      tor.estado === "Cancelado" && stylesAdmin3.redText,
                      tor.estado === "En curso" && stylesAdmin3.greenText,
                    ]}
                  >
                    {tor.estado}
                  </Text>
                  <Text style={[stylesAdmin3.textHead2, FONTS.oswald]}>
                    {tor.fechaInicio}
                  </Text>
                </View>
                <View style={stylesAdmin3.lordContainer}>
                  <LottieView
                    source={require("../../assets/copa.json")}
                    autoPlay
                    loop
                    style={stylesAdmin3.icon}
                    speed={1}
                    color={colores.base_3_1}
                  />
                </View>
                <Text style={[FONTS.oswaldNegrita, stylesAdmin3.torneoTitle]}>
                  Torneo "{tor.nombre}"
                </Text>
                {tor.estado === "Cancelado" ? (
                  <View style={stylesAdmin3.cancel}>
                    <Text style={[FONTS.oswaldNegrita, stylesAdmin3.redText]}>
                      Cancelado debido a: {tor.motivo}
                    </Text>
                  </View>
                ) : (
                  <View>
                    <Text style={[FONTS.oswald, stylesAdmin3.torneoDet]}>
                      {tor.resul !== "" ? `Ganador: ${tor.resul}` : "--"}
                    </Text>
                  </View>
                )}
                <View style={stylesAdmin3.botonRow}>
                  <TouchableOpacity
                    style={stylesAdmin3.botTorneo}
                    onPress={() =>
                      tor.estado === "En curso"
                        ? alert("Hola")
                        : showModal3(tor.nombre, tor)
                    }
                  >
                    <Text style={[FONTS.oswald, stylesAdmin3.botonTorneoText]}>
                      {tor.estado === "En curso" ? "Editar" : "Detalles"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={stylesAdmin3.botTorneo}
                    onPress={() =>
                      tor.estado === "En curso"
                        ? showModal1(tor.nombre)
                        : showModal2(tor.nombre)
                    }
                  >
                    <Text style={[FONTS.oswald, stylesAdmin3.botonTorneoText]}>
                      {tor.estado === "En curso" ? "Cancelar" : "Remover"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity
            style={[stylesAdmin3.box, { backgroundColor: "#ff6666" }]}
          >
            <Text style={stylesAdmin3.text}>1</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[stylesAdmin3.box, { backgroundColor: "#ffcc66" }]}
          >
            <Text style={stylesAdmin3.text}>2</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[stylesAdmin3.box, { backgroundColor: "#66ff66" }]}
          >
            <Text style={stylesAdmin3.text}>3</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[stylesAdmin3.box, { backgroundColor: "#66ccff" }]}
          >
            <Text style={stylesAdmin3.text}>4</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[stylesAdmin3.box, { backgroundColor: "#9966ff" }]}
          >
            <Text style={stylesAdmin3.text}>5</Text>
          </TouchableOpacity>
        </ScrollView>
        <Text
          style={[
            styles.TextField,
            stylesAdmin3.title,
            FONTS.nunitoNegrita,
            { paddingVertical: 15, paddingHorizontal: 5 },
          ]}
        >
          Nuevo torneo
        </Text>
        <View style={stylesAdmin3.form}>
          <Text style={[FONTS.oswald, { alignSelf: "flex-start" }]}>
            Logo del torneo
          </Text>
          <View style={{ alignItems: "center", gap: 5, paddingVertical: 5 }}>
            <Image
              source={require("../../assets/EquiposLogos/LogoDefault.png")}
              style={{ width: 150, height: 150, resizeMode: "contain" }}
            />
            <TouchableOpacity style={stylesAdmin3.botTorneo}>
              <Text style={[FONTS.oswald, stylesAdmin3.botonTorneoText]}>
                Elegir una imagen
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={[FONTS.oswald, { alignSelf: "flex-start" }]}>
            Datos del torneo
          </Text>
          <TextInput
            placeholder="Nombre del torneo"
            placeholderTextColor={colores.domin_2_2}
            style={stylesAdmin3.input}
          />
          <TextInput
            placeholder="Descripción del torneo"
            placeholderTextColor={colores.domin_2_2}
            multiline
            numberOfLines={4}
            style={[stylesAdmin3.input, { height: 120 }]}
          />
          <TextInput
            placeholder="Premio disputado"
            placeholderTextColor={colores.domin_2_2}
            keyboardType="decimal-pad"
            style={stylesAdmin3.input}
          />
          <View style={{ flexDirection: "row", width: "100$", gap: 5 }}>
            <TextInput
              placeholder="Fecha de inicio"
              placeholderTextColor={colores.domin_2_2}
              style={[stylesAdmin3.input, { width: "49%" }]}
            />
            <TextInput
              placeholder="Fecha de fin"
              placeholderTextColor={colores.domin_2_2}
              style={[stylesAdmin3.input, { width: "49%" }]}
            />
          </View>
          <View style={{ flexDirection: "row", width: "100$", gap: 5 }}>
            <TextInput
              placeholder="Máximo de equipos"
              placeholderTextColor={colores.domin_2_2}
              keyboardType="numeric"
              style={[stylesAdmin3.input, { width: "49%" }]}
            />
            <TextInput
              placeholder="Mínimo de equipos"
              placeholderTextColor={colores.domin_2_2}
              keyboardType="numeric"
              style={[stylesAdmin3.input, { width: "49%" }]}
            />
          </View>
          <View style={stylesAdmin3.rowTitles}>
            <Text style={[FONTS.oswald, { alignSelf: "flex-start" }]}>
              Elección de equipos
            </Text>
            <Text style={[FONTS.oswald, { alignSelf: "flex-start" }]}>
              {counter}/{equipos.length}
            </Text>
          </View>
          <ScrollView style={{ maxHeight: 300 }}>
            <View>
              {equipos.map((e) => {
                return (
                  <>
                  <View style={stylesAdmin3.teamSelect} key={e.equipoId}>
                    <View style={stylesAdmin3.row}>
                      <Image
                        source={{uri: e.img}}
                        style={stylesAdmin3.teamImag}
                      />
                      <Text style={[FONTS.oswald, stylesAdmin3.teamName]}>
                        {e.nombre}
                      </Text>
                    </View>
                    <Checkbox
                      status={
                        checkedState[e.equipoId] ? "checked" : "unchecked"
                      }
                      onPress={() => {handleCheckboxChange(e.equipoId); checkedState[e.equipoId] ? setCounter(counter - 1) : setCounter(counter + 1)}}
                      color={colores.acento_1_1}
                    />
                  </View>
                  <View style={stylesAdmin3.divdier}></View>
                  </>
                );
              })}
            </View>
          </ScrollView>
        </View>
        {/*<View style={stylesAdmin3.grid}>
          <View style={stylesAdmin3.card}>Hola</View>
          <View style={stylesAdmin3.card}>Hola</View>
          <View style={stylesAdmin3.card}>Hola</View>
          <View style={stylesAdmin3.card}>Hola</View>
        </View>*/}
        <View
          style={{
            alignItems: "center",
            gap: 5,
            paddingVertical: 5,
            width: "100%",
          }}
        >
          <TouchableOpacity style={stylesAdmin3.botTorneo}>
            <Text style={[FONTS.oswald, stylesAdmin3.botonTorneoText]}>
              Crear Torneo
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible1}
        onRequestClose={() => setModalVisible1(false)}
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
              onPress={() => setModalVisible1(false)}
            >
              <Ionicons name="close" size={24} color={colores.negro} />
            </TouchableOpacity>
            <Ionicons name="alert-circle" size={48} color={colores.domin_2_1} />
            <Text style={[stylesModal.modalTitle, FONTS.oswaldNegrita]}>
              ¿Cancelar torneo?
            </Text>
            <Text style={[FONTS.oswald, stylesModal.modalText]}>
              Esta acción tendrá consecuencias, todos los partidos se
              cancelarán, y no podras volver a anular esta acción
            </Text>
            <Text style={[FONTS.oswald, stylesModal.modalText]}>
              ¿Deseas cancelar el torneo?
            </Text>
            <View style={stylesModal.modalButRow}>
              <TouchableOpacity
                style={[stylesModal.buttonBack, FONTS.oswald]}
                onPress={() => setModalVisible2(false)}
              >
                <Text style={[stylesModal.buttonText, FONTS.oswald]}>
                  Cancelar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[stylesModal.buttonBack, FONTS.oswald]}
                onPress={() => setModalVisible2(false)}
              >
                <Text style={[stylesModal.buttonText, FONTS.oswald]}>
                  Cancelar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible2}
        onRequestClose={() => setModalVisible2(false)}
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
              onPress={() => setModalVisible2(false)}
            >
              <Ionicons name="close" size={24} color={colores.negro} />
            </TouchableOpacity>
            <Ionicons name="help" size={48} color={colores.domin_2_1} />
            <Text style={[stylesModal.modalTitle, FONTS.oswaldNegrita]}>
              ¿Eliminar torneo?
            </Text>
            <Text style={[FONTS.oswald, stylesModal.modalText]}>
              Esta acción es permanente, ya no podras ver más detallles de este
              torneo nuevamente
            </Text>
            <View style={stylesModal.modalButRow}>
              <TouchableOpacity
                style={[stylesModal.buttonBack, FONTS.oswald]}
                onPress={() => setModalVisible2(false)}
              >
                <Text style={[stylesModal.buttonText, FONTS.oswald]}>
                  Eliminar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[stylesModal.buttonBack, FONTS.oswald]}
                onPress={() => setModalVisible2(false)}
              >
                <Text style={[stylesModal.buttonText, FONTS.oswald]}>
                  Cancelar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible3}
        onRequestClose={() => setModalVisible3(false)}
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
              onPress={() => setModalVisible3(false)}
            >
              <Ionicons name="close" size={24} color={colores.negro} />
            </TouchableOpacity>
            <Text style={[stylesModal.modalTitle, FONTS.oswaldNegrita]}>
              Torneo "{tournamentName}"
            </Text>
            {tournamentData.img === "" ? (
              <LottieView
                source={require("../../assets/copa.json")}
                autoPlay
                loop
                style={{ width: 100, height: 100, alignSelf: "center" }}
                speed={1}
                color={colores.base_3_1}
              />
            ) : (
              <Image
                source={{ uri: tournamentData.img, alt: tournamentName }}
                style={stylesModal.fotoEquipo}
              />
            )}
            <Text style={[FONTS.oswaldNegrita, stylesModal.modalDato]}>
              Fecha de inicio:{" "}
              <Text style={FONTS.oswald}>{tournamentData.fechaInicio}</Text>
            </Text>
            <Text style={[FONTS.oswaldNegrita, stylesModal.modalDato]}>
              Fecha de fin:{" "}
              <Text style={FONTS.oswald}>{tournamentData.fechaFin}</Text>
            </Text>
            <Text style={[FONTS.oswaldNegrita, stylesModal.modalDato]}>
              Id: <Text style={FONTS.oswald}>{tournamentData.id}</Text>
            </Text>
            <Text style={[FONTS.oswaldNegrita, stylesModal.modalDato]}>
              Descripción:{" "}
              <Text style={FONTS.oswald}>{tournamentData.desc}</Text>
            </Text>
            <Text style={[FONTS.oswaldNegrita, stylesModal.modalDato]}>
              Max: <Text style={FONTS.oswald}>{tournamentData.max}</Text>
            </Text>
            <Text style={[FONTS.oswaldNegrita, stylesModal.modalDato]}>
              Min: <Text style={FONTS.oswald}>{tournamentData.min}</Text>
            </Text>
            <TouchableOpacity
              style={[
                stylesModal.buttonBack,
                FONTS.oswald,
                { backgroundColor: colores.acento_3_1 },
              ]}
              onPress={() => setModalVisible3(false)}
            >
              <Text style={[stylesModal.buttonText, FONTS.oswald]}>Volver</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

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
    textAlign: "center",
    width: "100%",
  },
  fotoEquipo: { width: 100, height: 100, resizeMode: "contain" },
});

const stylesAdmin3 = StyleSheet.create({
  container: { flex: 1, gap: 5 },
  scrollContent: {
    flexGrow: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    margin: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    alignItems: "flex-start",
    width: "95%",
    marginBlock: 5,
  },
  grid: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    width: "100%",
    maxHeight: 215,
    padding: 1,
  },
  card: {
    backgroundColor: colores.blanco,
    marginVertical: 5,
    marginHorizontal: 1,
    width: "48%",
    height: 100,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 5,
  },
  scrollContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  box: {
    width: 250,
    height: 300,
    marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    padding: 10,
    gap: 3,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  torneoTitle: {
    fontSize: 20,
  },
  lordContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 120,
    height: 120,
  },
  boxHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 5,
    paddingBottom: 3,
  },
  textHead1: {
    alignSelf: "flex-start",
    justifyContent: "flex-start",
    fontSize: 18,
  },
  textHead2: {
    alignSelf: "flex-end",
    justifyContent: "flex-start",
    fontSize: 18,
  },
  botonRow: {
    width: "100%",
    paddingHorizontal: 5,
    paddingVertical: 10,
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  botTorneo: {
    width: "50%",
    backgroundColor: colores.domin_2_2,
    paddingVertical: 5,
    gap: 5,
    borderRadius: 5,
    alignItems: "center",
  },
  botonTorneoText: {
    fontSize: 18,
    color: colores.blanco,
  },
  torneoDet: {
    fontSize: 20,
  },
  torneoInactivo: {
    backgroundColor: colores.base_1_2,
  },
  torneoActivo: {
    backgroundColor: colores.acento_4_1,
  },
  torneoCancelado: {
    backgroundColor: colores.base_2_3,
  },
  redText: {
    color: colores.domin_2_1,
  },
  greenText: {
    color: colores.acento_3_1,
  },
  cancel: {
    padding: 5,
    backgroundColor: colores.domin_2_5,
    borderColor: colores.domin_2_1,
    borderWidth: 2,
    borderRadius: 3,
    width: "100%",
    alignItems: "center",
  },
  input: {
    borderColor: colores.domin_2_2,
    borderWidth: 3,
    borderRadius: 5,
    fontFamily: "Oswald_400Regular",
    color: colores.negro,
    backgroundColor: colores.base_2_5,
  },
  form: {
    padding: 10,
    paddingVertical: 15,
    gap: 5,
    backgroundColor: colores.blanco,
    marginVertical: 5,
  },
  teamSelect: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    paddingVertical: 15,
    backgroundColor: colores.base_2_4
  },
  teamName: {
    fontSize: 25,
  },
  teamImag: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  row: {
    flexDirection: 'row',
    width: '50%',
    gap: 5,
    alignItems: 'center'
  },
  divdier: {
    width: '100%',
    height: 1,
    backgroundColor: colores.base_3_5, 
    alignContent: 'center',
    justifyContent: 'center',
    borderRadius: 5
  },
  rowTitles: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between'
  }
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  webview: {
    width: 120,
    height: 150,
    backgroundColor: "transparent",
    flex: 1,
    resizeMode: "cover",
  },
});

export default Admin3;
