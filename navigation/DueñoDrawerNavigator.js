// DueñoDrawerNavigator.js
import React, { useState, useEffect } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import DueñoDashboard from "../screens/dueño/DueñoDashboard";
import CustomDrawerContent from "./CustomDrawerContent"; // Importar el componente del menú
import { Ionicons } from "@expo/vector-icons";
import colores from "../style/colors"; // Asegúrate de importar colores
import { StyleSheet } from "react-native";
import DuenoBar from "./DuenoAppbar";
import PerfilScreen from "../screens/Perfil";
const Drawer = createDrawerNavigator();

const DueñoDrawerNavigator = () => {
  const [loadData, setLoadData] = useState(false);
  const [noData, setNoData] = useState(false);
  const [tokenData, setTokenData] = useState("");
  const [switcht, setSwitcht] = useState(false);

  const { getToken } = useContext(AuthContext);

  useEffect(() => {
    const fetchToken = async () => {
      setLoadData(true);
      const token = await getToken();
      setTokenData(token);
      setLoadData(false);
      setNoData(token === "" ? true : false);
    };

    fetchToken();
  }, [switcht]);

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

  if (loadData) {
    return <ActivityIndicator size="large" color="green" />;
  }

  if (noData) {
    return (
      <View>
        <Text>Algo salió mal, inténtalo nuevamente</Text>
        <TouchableOpacity onPress={() => setSwitcht(!switcht)}>
          <Text>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        drawerActiveTintColor: colores.acento_1_5,
        drawerItemStyle: { marginVertical: 5, marginHorizontal: 5 },
        drawerContentStyle: { backgroundColor: colores.base_3_5 },
        drawerActiveBackgroundColor: colores.domin_1_4,
        header: ({ navigation, route }) => (
          <DuenoBar navigation={navigation} title={route.name} />
        ),
      }}
    >
      <Drawer.Screen
        name="Dashboard del Dueño"
        component={DueñoDashboard}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="briefcase" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Perfil"
        component={PerfilScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="briefcase" size={size} color={color} />
          ),
          drawerItemStyle: { display: "none" },
        }}
      />
    </Drawer.Navigator> // Aquí cierra correctamente el JSX
  );
};

export default DueñoDrawerNavigator;

const styles = StyleSheet.create({
  header: {
    height: 150,
    backgroundColor: colores.domin_1_2,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
    marginBottom: 10,
    width: "auto",
    display: "flex",
    flexDirection: "col",
    gap: 5,
  },
  image: {
    width: 50,
    height: 80,
    borderRadius: 40,
  },
  title: {
    color: "white",
    fontSize: 25,
    marginTop: 10,
  },
  item: {
    margin: 40,
  },
  webview: {
    width: 60,
    backgroundColor: "transparent",
    margin: 20,
  },
  containerL: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 50,
  },
  icon: {
    alignItems: "flex-start",
  },
  leave: {
    alignItems: "flex-end",
    width: "95%",
  },
  imgTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  button: {
    position: "absolute",
    top: 30,
    right: 10,
    paddingVertical: 5,
    paddingHorizontal: 5,
    backgroundColor: "#FF5958",
    borderRadius: 5,
    fontSize: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  safeArea: { backgroundColor: colores.base_3_1 },
  appBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    marginTop: "5%",
  },
  encabezado: {
    flex: 1,
    textAlign: "left",
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
    paddingLeft: 20,
  },
});
