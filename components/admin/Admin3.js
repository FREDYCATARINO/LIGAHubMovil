import React from "react";
import {
  Text,
  Button,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
} from "react-native";
import WebView from "react-native-webview";
import { useRef, useEffect } from "react";
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

const torneosPrueba = [
  {id: 1, nombre: 'Mario Kart', fechaInicio: '', fechaFin: '', estado:'En curso', img: '', motivo: '', desc: '', max: 0, min: 0},
  {id: 2, nombre: 'El chavo', fechaInicio: '', fechaFin: '', estado:'En curso', img: '', motivo: '', desc: '', max: 0, min: 0},
  {id: 3, nombre: 'UTEZ', fechaInicio: '', fechaFin: '', estado:'Finalizado', img: '', motivo: '', desc: '', max: 0, min: 0},
  {id: 4, nombre: 'CECyTE', fechaInicio: '', fechaFin: '', estado:'Cancelado', img: '', motivo: '', desc: '', max: 0, min: 0},
  {id: 5, nombre: '2022', fechaInicio: '', fechaFin: '', estado:'Finalizado', img: '', motivo: '', desc: '', max: 0, min: 0},
  {id: 6, nombre: 'Liuguilla', fechaInicio: '', fechaFin: '', estado:'Cancelado', img: '', motivo: '', desc: '', max: 0, min: 0},
]

const Admin3 = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text
          style={[
            styles.TextField,
            stylesAdmin2.title,
            FONTS.nunitoNegrita,
            { paddingVertical: 15, paddingHorizontal: 5 },
          ]}
        >
          Torneos
        </Text>
        <ScrollView
          horizontal={true}
          style={stylesAdmin2.scrollContainer}
          showsHorizontalScrollIndicator={false}
        >
          <TouchableOpacity
            style={[stylesAdmin2.box, stylesAdmin2.torneoActivo]}
          >
            <View style={stylesAdmin2.boxHeader}>
              <Text style={[stylesAdmin2.textHead1, FONTS.oswald]}>
                En curso
              </Text>
              <Text style={[stylesAdmin2.textHead2, FONTS.oswald]}>
                20/02/2025
              </Text>
            </View>
            <View style={stylesAdmin2.lordContainer}>
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
              <LottieView
                source={require('../../assets/copa.json')}
                autoPlay
                loop
                style={stylesAdmin2.icon}
                speed={1}
                color={colores.base_3_1}
              />
            </View>
            <Text style={[FONTS.oswaldNegrita, stylesAdmin2.torneoTitle]}>
              Torneo Mario Kart
            </Text>
            <View>
              <Text style={[FONTS.oswald, stylesAdmin2.torneoDet]}>---</Text>
            </View>
            <View style={stylesAdmin2.botonRow}>
              <TouchableOpacity style={stylesAdmin2.botTorneo}>
                <Text style={[FONTS.oswald, stylesAdmin2.botonTorneoText]}>
                  Detalles
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={stylesAdmin2.botTorneo}>
                <Text style={[FONTS.oswald, stylesAdmin2.botonTorneoText]}>
                  Cancelar
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[stylesAdmin2.box, { backgroundColor: "#ff6666" }]}
          >
            <Text style={stylesAdmin2.text}>1</Text>
            <View style={stylesAdmin2.lordContainer}>
              <LottieView
                source={{ uri: "https://cdn.lordicon.com/lewtedlh.json" }}
                autoPlay
                loop
                style={stylesAdmin2.icon}
                speed={1}
                color={colores.base_3_1}
                colorFilters={[
                  {
                    keypath: "fill",
                    color: colores.base_3_1,
                  },
                  {
                    keypath: "shapes",
                    color: colores.domin_1_1,
                  },
                ]}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[stylesAdmin2.box, { backgroundColor: "#ffcc66" }]}
          >
            <Text style={stylesAdmin2.text}>2</Text>
            <WebView
              originWhitelist={["*"]}
              source={{
                html: `<script src="https://cdn.lordicon.com/lordicon.js"></script>
          <lord-icon
              src="https://cdn.lordicon.com/lewtedlh.json"
              trigger="loop"
              stroke="bold"
              state="loop-roll"
              colors="primary:#333333,secondary:#9a0000"
              style="width:400px;height:350px;margin:0;padding:0;overflow:hidden">
          </lord-icon>`,
              }}
              style={styles.webview}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[stylesAdmin2.box, { backgroundColor: "#66ff66" }]}
          >
            <Text style={stylesAdmin2.text}>3</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[stylesAdmin2.box, { backgroundColor: "#66ccff" }]}
          >
            <Text style={stylesAdmin2.text}>4</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[stylesAdmin2.box, { backgroundColor: "#9966ff" }]}
          >
            <Text style={stylesAdmin2.text}>5</Text>
          </TouchableOpacity>
        </ScrollView>
        <View style={stylesAdmin2.grid}>
          <View style={stylesAdmin2.card}>Hola</View>
          <View style={stylesAdmin2.card}>Hola</View>
          <View style={stylesAdmin2.card}>Hola</View>
          <View style={stylesAdmin2.card}>Hola</View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const stylesAdmin2 = StyleSheet.create({
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
    width: 120, // Ajustar el tamaño según el HTML original
    height: 120,
  },
  boxHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 5,
    paddingBottom: 3
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
  },
  botTorneo: {
    width: "50%",
    backgroundColor: colores.domin_2_2,
    padding: 5,
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
    resizeMode: 'cover'
  },
});

export default Admin3;
