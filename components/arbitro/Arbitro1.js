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

const Arbitro1 = ({ navigation }) => {
  <SafeAreaView style={stylesArbitro1.container}>
    <Text
      style={[
        styles.TextField,
        stylesArbitro1.title,
        FONTS.nunitoNegrita,
        { paddingVertical: 15, paddingHorizontal: 5 },
      ]}
    >
      Lista de partidos
    </Text>
    <View style={stylesArbitro1.divider}></View>
    <View style={stylesArbitro1.headerRow}>
        <Text style={[FONTS.oswald, stylesArbitro1.texto18]}>Filtrar:</Text>
        <TouchableOpacity style={stylesArbitro1.botFiltro}>
            <Text style={[FONTS.oswald, stylesArbitro1.texto18, stylesArbitro1.textoBlanco]}>Todos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={stylesArbitro1.botFiltro}>
            <Text style={[FONTS.oswald, stylesArbitro1.texto18, stylesArbitro1.textoBlanco]}>Nuevos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={stylesArbitro1.botFiltro}>
            <Text style={[FONTS.oswald, stylesArbitro1.texto18, stylesArbitro1.textoBlanco]}>Finalizados</Text>
        </TouchableOpacity>
    </View>
    <View style={stylesArbitro1.grid}>
      <View style={stylesArbitro1.card}>
        <Text>Hola</Text>
      </View>
      <View style={stylesArbitro1.card}>
        <Text>Hola</Text>
      </View>
      <View style={stylesArbitro1.card}>
        <Text>Hola</Text>
      </View>
      <View style={stylesArbitro1.card}>
        <Text>Hola</Text>
      </View>
    </View>
  </SafeAreaView>;
};

const stylesArbitro1 = StyleSheet.create({
  container: { flex: 1, gap: 5 },
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
  divider: {
    width: "100%",
    height: 2,
    backgroundColor: colores.base_1_4,
    paddingHorizontal: 5,
    paddingVertical: 10
  },
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  texto18: {
    fontSize: 18
  },
  botFiltro: {
    width: 50
  },
  textoBlanco: {
    color: colores.blanco
  }
});

export default Arbitro1;