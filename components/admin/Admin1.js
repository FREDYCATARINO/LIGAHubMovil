import React, { useState } from "react";
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
import { Calendar } from "react-native-calendars";
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

const Admin1 = ({ navigation }) => {
  const [progress, setProgress] = useState(0.25);

  const [fontsLoaded] = useFonts({
    Oswald_400Regular,
    Oswald_700Bold,
    Oswald_400Italic,
    Oswald_700BoldItalic,
    Nunito_400Regular,
    Nunito_700Bold,
    Nunito_400Italic,
    Nunito_700BoldItalic,
  });

  const increaseProgress = () => {
    setProgress((prev) => (prev < 1 ? prev + 0.1 : 1)); // Aumentar 10% cada vez
  };

  setTimeout(() => {
    if (!fontsLoaded) {
    return (
      <View style={{ alignItems: "center", justifyContent: "center", marginTop: '10%' }}>
        <ActivityIndicator color={colores.domin_1_1}/>
        <Text> Loading Fonts... </Text>
      </View>
    );
  }},1000);

  return (
    <SafeAreaView style={[styless.scrollContent]}>
      <ScrollView contentContainerStyle={styless.myScrollContent}>
        <Text
          style={[
            styles.TextField,
            styless.title,
            FONTS.nunitoNegrita,
            { paddingVertical: 15, paddingHorizontal: 5 },
          ]}
        >
          Inicio
        </Text>
        <View style={styless.grid}>
          <View style={styless.card}>
            <View
              style={[styless.barrita, { backgroundColor: "#3CB371" }]}
            ></View>
            <View style={styless.col}>
              <View style={styless.row3}>
                <Text style={[{ color: "#3CB371" }, FONTS.oswald]}>
                  Proximo partido
                </Text>
                <Ionicons name="calendar" size={24} color={colores.base_1_3} />
              </View>
              <Text style={FONTS.oswald}>Domingo, 23 de febrero</Text>
            </View>
          </View>
          <View style={styless.card}>
            <View
              style={[styless.barrita, { backgroundColor: "#FFC300" }]}
            ></View>
            <View style={styless.col}>
              <View style={styless.row3}>
                <Text style={[{ color: "#FFC300" }, FONTS.oswald]}>
                  Pagos pendientes
                </Text>
                <Ionicons
                  name="cash"
                  size={24}
                  color={colores.base_1_3}
                  style={{ marginTop: 2 }}
                />
              </View>
              <Text style={FONTS.oswald}>3</Text>
            </View>
          </View>
          <View style={styless.card}>
            <View
              style={[styless.barrita, { backgroundColor: "#4E73DF" }]}
            ></View>
            <View style={styless.col}>
              <View style={styless.row3}>
                <Text style={[{ color: "#4E73DF" }, FONTS.oswald]}>
                  Solicitudes pendientes
                </Text>
                <Ionicons name="mail" size={24} color={colores.base_1_3} />
              </View>
              <Text style={FONTS.oswald}>2</Text>
            </View>
          </View>
          <View style={styless.card}>
            <View
              style={[styless.barrita, { backgroundColor: "#9A0000" }]}
            ></View>
            <View style={styless.col}>
              <View style={styless.row3}>
                <Text style={[{ color: "#9A0000" }, FONTS.oswald]}>
                  Progreso de torneo
                </Text>
                <Ionicons name="trophy" size={24} color={colores.base_1_3} />
              </View>
              <View style={styless.row3}>
                <Text style={FONTS.oswald}>25%</Text>
                <Progress.Bar progress={progress} width={100} color="#9A0000" />
              </View>
            </View>
          </View>
        </View>
        <View style={styless.card2}>
          <Text style={[FONTS.oswaldNegrita, styless.title2]}>
            Solicitudes pendientes
          </Text>
          <ScrollView style={styless.list}>
            <View style={styless.solid}>
              <View style={styless.row1}>
                <Image
                  source={{
                    uri: "https://th.bing.com/th/id/OIP.SVo8-p3WhGOnngP6K6tBsAHaKc?w=115&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7",
                  }}
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: colores.base_1_1,
                    borderRadius: 100,
                    resizeMode: "stretch",
                    alignSelf: "center",
                  }}
                />
                <Text style={[styless.nombre]}>Francisco Pulido</Text>
              </View>
              <View style={styless.row2}>
                <TouchableOpacity
                  style={[
                    styles.button,
                    { backgroundColor: colores.acento_3_1 },
                    styless.boton,
                  ]}
                >
                  <Text
                    style={[FONTS.oswald, { color: "white", fontSize: 18 }]}
                  >
                    Aceptar
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.button,
                    { backgroundColor: colores.domin_1_1 },
                    styless.boton,
                  ]}
                >
                  <Text
                    style={[FONTS.oswald, { color: "white", fontSize: 18 }]}
                  >
                    Rechazar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styless.myBorder}></View>
            <View style={styless.solid}>
              <View style={styless.row1}>
                <Image
                  source={{
                    uri: "https://th.bing.com/th/id/OIP.SVo8-p3WhGOnngP6K6tBsAHaKc?w=115&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7",
                  }}
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: colores.base_1_1,
                    borderRadius: 100,
                    resizeMode: "stretch",
                    alignSelf: "center",
                  }}
                />
                <Text style={styless.nombre}>Francisco Pulido</Text>
              </View>
              <View style={styless.row2}>
                <TouchableOpacity
                  style={[
                    styles.button,
                    { backgroundColor: colores.acento_3_1 },
                    styless.boton,
                  ]}
                >
                  <Text
                    style={[FONTS.oswald, { color: "white", fontSize: 18 }]}
                  >
                    Aceptar
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.button,
                    { backgroundColor: colores.domin_1_1 },
                    styless.boton,
                  ]}
                >
                  <Text
                    style={[FONTS.oswald, { color: "white", fontSize: 18 }]}
                  >
                    Rechazar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styless.myBorder}></View>
            <View style={styless.solid}>
              <View style={styless.row1}>
                <Image
                  source={{
                    uri: "https://th.bing.com/th/id/OIP.SVo8-p3WhGOnngP6K6tBsAHaKc?w=115&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7",
                  }}
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: colores.base_1_1,
                    borderRadius: 100,
                    resizeMode: "stretch",
                    alignSelf: "center",
                  }}
                />
                <Text style={styless.nombre}>Francisco Pulido</Text>
              </View>
              <View style={styless.row2}>
                <TouchableOpacity
                  style={[
                    styles.button,
                    { backgroundColor: colores.acento_3_1 },
                    styless.boton,
                  ]}
                >
                  <Text
                    style={[FONTS.oswald, { color: "white", fontSize: 18 }]}
                  >
                    Aceptar
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.button,
                    { backgroundColor: colores.domin_1_1 },
                    styless.boton,
                  ]}
                >
                  <Text
                    style={[FONTS.oswald, { color: "white", fontSize: 18 }]}
                  >
                    Rechazar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styless.myBorder}></View>
            <View style={styless.solid}>
              <View style={styless.row1}>
                <Image
                  source={{
                    uri: "https://th.bing.com/th/id/OIP.SVo8-p3WhGOnngP6K6tBsAHaKc?w=115&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7",
                  }}
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: colores.base_1_1,
                    borderRadius: 100,
                    resizeMode: "stretch",
                    alignSelf: "center",
                  }}
                />
                <Text style={styless.nombre}>Francisco Pulido</Text>
              </View>
              <View style={styless.row2}>
                <TouchableOpacity
                  style={[
                    styles.button,
                    { backgroundColor: colores.acento_3_1 },
                    styless.boton,
                  ]}
                >
                  <Text
                    style={[FONTS.oswald, { color: "white", fontSize: 18 }]}
                  >
                    Aceptar
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.button,
                    { backgroundColor: colores.domin_1_1 },
                    styless.boton,
                  ]}
                >
                  <Text
                    style={[FONTS.oswald, { color: "white", fontSize: 18 }]}
                  >
                    Rechazar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styless.myBorder}></View>
            <View style={styless.solid}>
              <View style={styless.row1}>
                <Image
                  source={{
                    uri: "https://th.bing.com/th/id/OIP.SVo8-p3WhGOnngP6K6tBsAHaKc?w=115&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7",
                  }}
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: colores.base_1_1,
                    borderRadius: 100,
                    resizeMode: "stretch",
                    alignSelf: "center",
                  }}
                />
                <Text style={[styless.nombre]}>Francisco Pulido</Text>
              </View>
              <View style={styless.row2}>
                <TouchableOpacity
                  style={[
                    styles.button,
                    { backgroundColor: colores.acento_3_1 },
                    styless.boton,
                  ]}
                >
                  <Text
                    style={[FONTS.oswald, { color: "white", fontSize: 18 }]}
                  >
                    Aceptar
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.button,
                    { backgroundColor: colores.domin_1_1 },
                    styless.boton,
                  ]}
                >
                  <Text
                    style={[FONTS.oswald, { color: "white", fontSize: 18 }]}
                  >
                    Rechazar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
        {/*<View style={styless.card2}>
          <Text style={[FONTS.oswaldNegrita, styless.title2]}>
            Gestión de pagos
          </Text>
        </View>*/}
        <View style={styless.card3}>
          <Text style={[FONTS.oswaldNegrita, styless.title3]}>
            Calendario de partidos
          </Text>
          <Calendar
            style={[FONTS.nunito, styless.calendar]} // Aplica la fuente en el estilo principal (si es necesario)
            // Configuración básica
            onDayPress={(day) => {
              console.log("Selected day", day);
              alert("Hola " + day.day);
            }}
            monthFormat={"MMM yyyy"}
            markedDates={{
              "2025-02-19": {
                selected: true,
                selectedColor: colores.acento_3_1,
              },
              "2025-02-25": {
                selected: true,
                selectedColor: colores.acento_3_1,
              },
              "2025-03-02": {
                selected: true,
                selectedColor: colores.acento_3_1,
              },
            }}
            theme={{
              todayTextColor: colores.domin_2_1, // Cambia el color del texto de hoy
              todayBackgroundColor: colores.acento_1_3,
              selectedDayBackgroundColor: colores.acento_2_5, // Color del fondo del día seleccionado
              selectedDayTextColor: colores.blanco, // Color del texto del día seleccionado
              textSectionTitleColor: colores.acento_1_3, // Color del texto de las secciones del mes
              monthTextColor: colores.domin_2_1, // Color del texto del mes
              arrowColor: colores.domin_2_1, // Color de las flechas del calendario
              // Aplicar la fuente en todos los textos del calendario
              textDayFontSize: 16,
              textDayFontFamily: "Nunito_400Regular", // Aplicar Nunito en los días
              textMonthFontFamily: "Nunito_400Regular", // Aplicar Nunito en el mes
              textDayHeaderFontFamily: "Nunito_400Regular", // Aplicar Nunito en el encabezado
              textDayStyle: {
                minWidth: 30, // Ajusta el tamaño mínimo de la celda para evitar recortes
                textAlign: "center",
              }
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styless = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    margin: 5,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    alignItems: "flex-start",
    width: "95%",
    marginBlock: 5,
    paddingVertical: 3
  },
  title2: {
    fontSize: 25,
    justifyContent: "center",
    alignItems: "center",
    width: "95%",
    marginBlock: 5,
    backgroundColor: colores.domin_2_5,
    opacity: 0.75,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 3
  },
  title3: {
    fontSize: 25,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    width: "96%",
    backgroundColor: colores.domin_2_5,
    opacity: 0.75,
    borderRadius: 5,
    marginRight: 5,
    marginLeft: 5,
    marginTop: 5,
    marginBottom: 0,
    paddingHorizontal: 10,
    paddingVertical: 3
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
  card2: {
    backgroundColor: colores.blanco,
    marginVertical: 5,
    marginHorizontal: 1,
    width: "100%",
    height: 350,
    justifyContent: "center",
    alignItems: "center",
  },
  card3: {
    backgroundColor: colores.blanco,
    width: "100%",
    maxHeight: 400,
  },
  myScrollContent: {
    paddingBottom: 50,
  },
  list: {
    maxHeight: 250,
    overflow: "scroll",
    width: "95%",
  },
  calendar: {
    width: "100%", // Ocupa el 100% del ancho
    borderWidth: 1,
    borderColor: colores.base_2_4,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 10,
    padding: 10,
    fontFamily: "Oswald_400Regular",
  },
  solid: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginVertical: 10,
    marginHorizontal: 5,
    borderTopColor: colores.base_3_1,
    borderBottomColor: colores.base_3_1,
    borderRadius: 10,
  },
  myBorder: {
    width: "100%",
    height: 1,
    backgroundColor: colores.base_1_4,
    borderRadius: 1,
  },
  row1: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 5,
    width: "100%",
  },
  row2: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 5,
    width: "100%",
  },
  row3: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 5,
  },
  barrita: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: 5,
    height: "100%",
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5,
  },
  col: {
    flexDirection: "column",
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  nombre: {
    fontSize: 20,
    fontFamily: "Oswald_400Regular",
  },
  boton: {
    width: "30%",
    paddingVertical: 2,
    paddingHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 3
  },
});

export default Admin1;
