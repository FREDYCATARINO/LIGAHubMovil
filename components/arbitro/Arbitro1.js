import * as React from "react";
import {
  Text,
  Button,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  FlatList
} from "react-native";
import styles from "../../style/style";
import { Ionicons } from "@expo/vector-icons";
import colores from "../../style/colors";
import * as Progress from "react-native-progress";
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

const partidosPrueba = [
  {
    id: 1,
    lugar: "Mario Kart",
    fecha: "02/02/2025",
    estado: "Nuevo",
    equipo1: {
      nombre: "Pumas",
      img: "https://drive.google.com/uc?export=view&id=1IdFsp723ipbBX95PWsXwpURsO5L4jGei",
    },
    equipo2: {
      nombre: "Chivas",
      img: "https://drive.google.com/uc?export=view&id=1-FOLUn9u4T-D5ggneCO0nZm4jOOVXItI",
    },
  },
  {
    id: 2,
    lugar: "El chavo",
    fecha: "17/02/2025",
    estado: "Nuevo",
    equipo1: {
      nombre: "Pumas",
      img: "https://drive.google.com/uc?export=view&id=1IdFsp723ipbBX95PWsXwpURsO5L4jGei",
    },
    equipo2: {
      nombre: "America",
      img: "https://drive.google.com/uc?export=view&id=1hLeMo386b05HrRd2mruNXZZqlWJ_EbSC",
    },
  },
  {
    id: 3,
    lugar: "UTEZ",
    fecha: "28/02/2025",
    estado: "Finalizado",
    equipo1: {
      nombre: "Monterrey",
      img: "https://drive.google.com/uc?export=view&id=1L_u5cuRI6pI78YOb-0PIt_vovmV8SLLX",
    },
    equipo2: {
      nombre: "Tigres",
      img: "https://drive.google.com/uc?export=view&id=1HMF63odQw9WzQdVmfFbSP1H3_F8qY-uV",
    },
  },
  {
    id: 4,
    lugar: "CECyTE",
    fecha: "12/03/2025",
    estado: "Finalizado",
    equipo1: {
      nombre: "Chivas",
      img: "https://drive.google.com/uc?export=view&id=1-FOLUn9u4T-D5ggneCO0nZm4jOOVXItI",
    },
    equipo2: {
      nombre: "Monterrey",
      img: "https://drive.google.com/uc?export=view&id=1L_u5cuRI6pI78YOb-0PIt_vovmV8SLLX",
    },
  },
  {
    id: 5,
    lugar: "2022",
    fecha: "24/03/2025",
    estado: "Finalizado",
    equipo1: {
      nombre: "Necaxa",
      img: "https://drive.google.com/uc?export=view&id=1_bDUfg2szuTCPy6onk37wSbzOoZGyhWW",
    },
    equipo2: {
      nombre: "Atlas",
      img: "https://drive.google.com/uc?export=view&id=1yeIzWN8Wl6TvIrEtqci874SU7MT6E8cg",
    },
  },
  {
    id: 6,
    lugar: "Liuguilla",
    fecha: "02/04/2025",
    estado: "Nuevo",
    equipo1: {
      nombre: "Chivas",
      img: "https://drive.google.com/uc?export=view&id=1-FOLUn9u4T-D5ggneCO0nZm4jOOVXItI",
    },
    equipo2: {
      nombre: "America",
      img: "https://drive.google.com/uc?export=view&id=1hLeMo386b05HrRd2mruNXZZqlWJ_EbSC",
    },
  },
  {
    id: 7,
    lugar: "Chiapas",
    fecha: "02/04/2025",
    estado: "Nuevo",
    equipo1: {
      nombre: "Monterrey",
      img: "https://drive.google.com/uc?export=view&id=1L_u5cuRI6pI78YOb-0PIt_vovmV8SLLX",
    },
    equipo2: {
      nombre: "America",
      img: "https://drive.google.com/uc?export=view&id=1hLeMo386b05HrRd2mruNXZZqlWJ_EbSC",
    },
  },
  {
    id: 8,
    lugar: "Morelos",
    fecha: "02/04/2025",
    estado: "Nuevo",
    equipo1: {
      nombre: "Necaxa",
      img: "https://drive.google.com/uc?export=view&id=1_bDUfg2szuTCPy6onk37wSbzOoZGyhWW",
    },
    equipo2: {
      nombre: "Pumas",
      img: "https://drive.google.com/uc?export=view&id=1IdFsp723ipbBX95PWsXwpURsO5L4jGei",
    },
  },
];

const partidosNuevos = partidosPrueba.filter(
  (partido) => partido.estado === "Nuevo"
);

const partidosFinalizados = partidosPrueba.filter(
  (partido) => partido.estado === "Finalizado"
);

const partidosOrdenados = [...partidosPrueba].sort((a, b) => {
  return a.estado === "Nuevo" && b.estado !== "Nuevo" ? -1 : b.estado === "Nuevo" && a.estado !== "Nuevo" ? 1 : 0;
});

const Arbitro1 = ({ navigation }) => {
  const [filtro, setFiltro] = React.useState(1);
  const [lista, setLista] = React.useState(partidosOrdenados);

  return (
    <SafeAreaView style={stylesArbitro1.container}>
      <Text
        style={[
          styles.TextField,
          stylesArbitro1.title,
          FONTS.nunitoNegrita,
          { paddingVertical: 15, paddingHorizontal: 5, fontSize: 25 },
        ]}
      >
        Lista de partidos
      </Text>
      <View style={stylesArbitro1.divider}></View>
      <View style={stylesArbitro1.headerRow}>
        <Text style={[FONTS.oswald, stylesArbitro1.texto18]}>Filtrar:</Text>
        <View style={{ flexDirection: "row", gap: 2 }}>
          <TouchableOpacity
            style={[
              stylesArbitro1.botFiltro,
              filtro === 1
                ? stylesArbitro1.botFiltroElecto
                : stylesArbitro1.botFiltroNoElecto,
            ]}
            onPress={() => {
              setFiltro(1);
              setLista(partidosOrdenados);
            }}
          >
            <Text
              style={[
                FONTS.oswald,
                stylesArbitro1.texto18,
                filtro === 1
                  ? stylesArbitro1.textoBlanco
                  : stylesArbitro1.textoNegro,
              ]}
            >
              Todos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              stylesArbitro1.botFiltro,
              filtro === 2
                ? stylesArbitro1.botFiltroElecto
                : stylesArbitro1.botFiltroNoElecto,
            ]}
            onPress={() => {
              setFiltro(2);
              setLista(partidosNuevos);
            }}
          >
            <Text
              style={[
                FONTS.oswald,
                stylesArbitro1.texto18,
                filtro === 2
                  ? stylesArbitro1.textoBlanco
                  : stylesArbitro1.textoNegro,
              ]}
            >
              Nuevos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              stylesArbitro1.botFiltro,
              filtro === 3
                ? stylesArbitro1.botFiltroElecto
                : stylesArbitro1.botFiltroNoElecto,
            ]}
            onPress={() => {
              setFiltro(3);
              setLista(partidosFinalizados);
            }}
          >
            <Text
              style={[
                FONTS.oswald,
                stylesArbitro1.texto18,
                filtro === 3
                  ? stylesArbitro1.textoBlanco
                  : stylesArbitro1.textoNegro,
              ]}
            >
              Terminados
            </Text>
          </TouchableOpacity>
        </View>
      </View>
        <FlatList
          data={lista}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between', gap: 1 }}
          style={{ gap: 10, width: '100%' }}
          renderItem={({ item: par }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate("Detalles de partido")}
              style={[
                stylesArbitro1.card,
                par.estado === "Nuevo"
                  ? stylesArbitro1.cardActive
                  : stylesArbitro1.cardInactive,
              ]}
            >
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                }}
              >
                <View>
                  <Image
                    source={{ uri: par.equipo1.img }}
                    style={{
                      resizeMode: "contain",
                      width: 50,
                      height: 50,
                      alignSelf: "center",
                    }}
                  />
                  <Text style={[FONTS.oswaldNegrita, { fontSize: 15 }]}>
                    {par.equipo1.nombre}
                  </Text>
                </View>
                <Text style={[FONTS.oswaldNegrita, { fontSize: 28 }]}>-</Text>
                <View>
                  <Image
                    source={{ uri: par.equipo2.img }}
                    style={{
                      resizeMode: "contain",
                      width: 50,
                      height: 50,
                      alignSelf: "center",
                    }}
                  />
                  <Text style={[FONTS.oswaldNegrita, { fontSize: 15 }]}>
                    {par.equipo2.nombre}
                  </Text>
                </View>
              </View>
              <Text style={[FONTS.oswald, { fontSize: 18 }]}>{par.fecha}</Text>
              <Text style={[FONTS.oswald, { textAlign: "center" }]}>
                {par.lugar}
              </Text>
            </TouchableOpacity>
          )}
        />
    </SafeAreaView>
  );
};

const stylesArbitro1 = StyleSheet.create({
  container: { flex: 1, gap: 5, padding: 5 },
  grid: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    width: "100%",
    height: 200,
    padding: 1,
  },
  card: {
    backgroundColor: colores.blanco,
    marginVertical: 5,
    marginHorizontal: 1,
    width: "49%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    gap: 5,
  },
  divider: {
    width: "90%",
    height: 1,
    backgroundColor: colores.base_1_3,
    marginHorizontal: 20,
    marginVertical: 10,
    alignItems: "center",
  },
  headerRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  texto18: {
    fontSize: 18,
    paddingVertical: 4,
  },
  botFiltro: {
    paddingHorizontal: 5,
    paddingVertical: 3,
  },
  botFiltroElecto: {
    backgroundColor: colores.domin_2_2,
  },
  botFiltroNoElecto: {
    backgroundColor: colores.blanco,
  },
  textoBlanco: {
    color: colores.blanco,
  },
  textoNegro: {
    color: colores.negro,
  },
  cardActive: {
    backgroundColor: colores.blanco,
  },
  cardInactive: {
    backgroundColor: colores.base_2_5,
  },
});

export default Arbitro1;
