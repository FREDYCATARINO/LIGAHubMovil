import React from "react";
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
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

const Admin1 = ({ navigation }) => {
  return (
    <SafeAreaView style={[styless.scrollContent]}>
      <ScrollView contentContainerStyle={styless.myScrollContent}>
        <Text style={[styles.TextField, styless.title]}>Inicio</Text>
        <View style={styless.grid}>
          <View style={styless.card}>
            <Text>Proximo partido</Text>
            <Ionicons name="calendar" size={24} color="#BDBDBD" />
            <Text>Domingo, 23 de febrero</Text>
          </View>
          <View style={styless.card}>
            <Text>Pagos pendientes</Text>
            <Ionicons name="cash" size={24} color="#BDBDBD" />
            <Text>3</Text>
          </View>
          <View style={styless.card}>
            <Text>Solicitudes pendientes</Text>
            <Ionicons name="mail" size={24} color="#BDBDBD" />
            <Text>2</Text>
          </View>
          <View style={styless.card}>
            <Text>Progreso del torneo</Text>
            <Ionicons name="trophy" size={24} color="#BDBDBD" />
            <Text>25%</Text>
            <ActivityIndicator color="red" />
          </View>
        </View>
        <View style={styless.card2}>
          <Text style={[styles.TextField, styless.title2]}>
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
                  backgroundColor: "#e9e9e9",
                  borderRadius: 100,
                  resizeMode: "stretch",
                  alignSelf: "center",
                }}
              />
              <Text>Francisco Pulido</Text>
              </View>
              <View style={styless.row2}>
              <TouchableOpacity>
                <Button title="Aceptar"></Button>
              </TouchableOpacity>
              <TouchableOpacity>
                <Button title="Rechazar"></Button>
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
                  backgroundColor: "#e9e9e9",
                  borderRadius: 100,
                  resizeMode: "stretch",
                  alignSelf: "center",
                }}
              />
              <Text>Francisco Pulido</Text>
              </View>
              <View style={styless.row2}>
              <TouchableOpacity>
                <Button title="Aceptar"></Button>
              </TouchableOpacity>
              <TouchableOpacity>
                <Button title="Rechazar"></Button>
              </TouchableOpacity>
              </View>
            </View>
            <View style={styless.myBorder}></View>
            <View style={styless.solid}>
              <Image
                source={{
                  uri: "https://th.bing.com/th/id/OIP.SVo8-p3WhGOnngP6K6tBsAHaKc?w=115&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7",
                }}
                style={{
                  width: 25,
                  height: 25,
                  backgroundColor: "#e9e9e9",
                  borderRadius: 100,
                  resizeMode: "stretch",
                  alignSelf: "center",
                }}
              />
              <Text>Progreso del torneo</Text>
              <TouchableOpacity>
                <Button title="Aceptar"></Button>
              </TouchableOpacity>
              <TouchableOpacity>
                <Button title="Rechazar"></Button>
              </TouchableOpacity>
            </View>
            <View style={styless.myBorder}></View>
            <View style={styless.solid}>
              <Image
                source={{
                  uri: "https://th.bing.com/th/id/OIP.SVo8-p3WhGOnngP6K6tBsAHaKc?w=115&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7",
                }}
                style={{
                  width: 25,
                  height: 25,
                  backgroundColor: "#e9e9e9",
                  borderRadius: 100,
                  resizeMode: "stretch",
                  alignSelf: "center",
                }}
              />
              <Text>Progreso del torneo</Text>
              <TouchableOpacity>
                <Button title="Aceptar"></Button>
              </TouchableOpacity>
              <TouchableOpacity>
                <Button title="Rechazar"></Button>
              </TouchableOpacity>
            </View>
            <View style={styless.myBorder}></View>
            <View style={styless.solid}>
              <Image
                source={{
                  uri: "https://th.bing.com/th/id/OIP.SVo8-p3WhGOnngP6K6tBsAHaKc?w=115&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7",
                }}
                style={{
                  width: 25,
                  height: 25,
                  backgroundColor: "#e9e9e9",
                  borderRadius: 100,
                  resizeMode: "stretch",
                  alignSelf: "center",
                }}
              />
              <Text>Progreso del torneo</Text>
              <TouchableOpacity>
                <Button title="Aceptar"></Button>
              </TouchableOpacity>
              <TouchableOpacity>
                <Button title="Rechazar"></Button>
              </TouchableOpacity>
            </View>
            <View style={styless.myBorder}></View>
            <View style={styless.solid}>
              <Image
                source={{
                  uri: "https://th.bing.com/th/id/OIP.SVo8-p3WhGOnngP6K6tBsAHaKc?w=115&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7",
                }}
                style={{
                  width: 25,
                  height: 25,
                  backgroundColor: "#e9e9e9",
                  borderRadius: 100,
                  resizeMode: "stretch",
                  alignSelf: "center",
                }}
              />
              <Text>Progreso del torneo</Text>
              <TouchableOpacity>
                <Button title="Aceptar"></Button>
              </TouchableOpacity>
              <TouchableOpacity>
                <Button title="Rechazar"></Button>
              </TouchableOpacity>
            </View>
            <View style={styless.myBorder}></View>
            <View style={styless.solid}>
              <Image
                source={{
                  uri: "https://th.bing.com/th/id/OIP.SVo8-p3WhGOnngP6K6tBsAHaKc?w=115&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7",
                }}
                style={{
                  width: 25,
                  height: 25,
                  backgroundColor: "#e9e9e9",
                  borderRadius: 100,
                  resizeMode: "stretch",
                  alignSelf: "center",
                }}
              />
              <Text>Progreso del torneo</Text>
              <TouchableOpacity>
                <Button title="Aceptar"></Button>
              </TouchableOpacity>
              <TouchableOpacity>
                <Button title="Rechazar"></Button>
              </TouchableOpacity>
            </View>
            <View style={styless.myBorder}></View>
            <View style={styless.solid}>
              <Image
                source={{
                  uri: "https://th.bing.com/th/id/OIP.SVo8-p3WhGOnngP6K6tBsAHaKc?w=115&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7",
                }}
                style={{
                  width: 25,
                  height: 25,
                  backgroundColor: "#e9e9e9",
                  borderRadius: 100,
                  resizeMode: "stretch",
                  alignSelf: "center",
                }}
              />
              <Text>Progreso del torneo</Text>
              <TouchableOpacity>
                <Button title="Aceptar"></Button>
              </TouchableOpacity>
              <TouchableOpacity>
                <Button title="Rechazar"></Button>
              </TouchableOpacity>
            </View>
            <View style={styless.myBorder}></View>
            <View style={styless.solid}>
              <Image
                source={{
                  uri: "https://th.bing.com/th/id/OIP.SVo8-p3WhGOnngP6K6tBsAHaKc?w=115&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7",
                }}
                style={{
                  width: 25,
                  height: 25,
                  backgroundColor: "#e9e9e9",
                  borderRadius: 100,
                  resizeMode: "stretch",
                  alignSelf: "center",
                }}
              />
              <Text>Progreso del torneo</Text>
              <TouchableOpacity>
                <Button title="Aceptar"></Button>
              </TouchableOpacity>
              <TouchableOpacity>
                <Button title="Rechazar"></Button>
              </TouchableOpacity>
            </View>
            <View style={styless.myBorder}></View>
            <View style={styless.solid}>
              <Image
                source={{
                  uri: "https://th.bing.com/th/id/OIP.SVo8-p3WhGOnngP6K6tBsAHaKc?w=115&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7",
                }}
                style={{
                  width: 25,
                  height: 25,
                  backgroundColor: "#e9e9e9",
                  borderRadius: 100,
                  resizeMode: "stretch",
                  alignSelf: "center",
                }}
              />
              <Text>Progreso del torneo</Text>
              <TouchableOpacity>
                <Button title="Aceptar"></Button>
              </TouchableOpacity>
              <TouchableOpacity>
                <Button title="Rechazar"></Button>
              </TouchableOpacity>
            </View>
            <Text>Progreso del torneo</Text>
            <Text>Progreso del torneos</Text>
          </ScrollView>
        </View>
        <View style={styless.card2}>
          <Text style={[styles.TextField, styless.title2]}>
            Gestión de pagos
          </Text>
        </View>
        <View style={styless.card3}>
          <Text style={[styles.TextField, styless.title3]}>
            Calendario de partidos
          </Text>
          <Calendar
            style={styless.Calendar}
            // Configuración básica
            onDayPress={(day) => {
              console.log("Selected day", day);
              alert("Hola " + day.day);
            }}
            monthFormat={"yyyy MM"}
            markedDates={{
              "2025-02-19": { selected: true, selectedColor: "blue" },
              "2025-02-25": { selected: true, selectedColor: "blue" },
              "2025-03-01": { selected: true, selectedColor: "blue" },
            }}
            theme={{
              todayTextColor: "red", // Cambia el color del texto de hoy
              todayBackgroundColor: "pink",
              selectedDayBackgroundColor: "blue", // Color del fondo del día seleccionado
              selectedDayTextColor: "white", // Color del texto del día seleccionado
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
  },
  title2: {
    fontSize: 25,
    fontWeight: "bold",
    justifyContent: "center",
    alignItems: "center",
    width: "95%",
    marginBlock: 5,
    backgroundColor: "#D6DBE1",
    opacity: 0.75,
    borderRadius: 5,
  },
  title3: {
    fontSize: 25,
    fontWeight: "bold",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    width: "96%",
    marginBlock: 5,
    backgroundColor: "#D6DBE1",
    opacity: 0.75,
    borderRadius: 5,
    marginRight: 5,
    marginLeft: 5,
    marginTop: 5,
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
    backgroundColor: "#ffffff",
    marginVertical: 5,
    marginHorizontal: 1,
    width: "48%",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  card2: {
    backgroundColor: "#ffffff",
    marginVertical: 5,
    marginHorizontal: 1,
    width: "100%",
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  card3: {
    backgroundColor: "#ffffff",
    width: "100%",
    maxHeight: 400,
  },
  myScrollContent: {
    paddingBottom: 50,
  },
  list: {
    maxHeight: 225,
    overflow: "scroll",
    width: "95%",
  },
  calendar: {
    width: "100%", // Ocupa el 100% del ancho
    maxHeight: 250, // Altura máxima de 300
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 10,
    padding: 10,
  },
  solid: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginVertical: 10,
    marginHorizontal: 5,
    borderTopColor: "#333333",
    borderBottomColor: "#333333",
    borderRadius: 10,
  },
  myBorder: {
    width: "100%",
    height: 1,
    backgroundColor: "#d9d9d9",
    borderRadius: 1,
  },
  row1 :{
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 5,
    width: '100%'
  },
  row2 :{
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 5,
    width: '100%'
  }
});

export default Admin1;
