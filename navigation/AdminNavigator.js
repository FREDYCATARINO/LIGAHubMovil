import React, { useState, useEffect } from "react";
import {
  createDrawerNavigator,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Admin1 from "../components/admin/Admin1";
import Admin2 from "../components/admin/Admin2";
import Admin3 from "../components/admin/Admin3";
import Admin4 from "../components/admin/Admin4";
import Admin5 from "../components/admin/Admin5";
import Admin6 from "../components/admin/Admin6";
import Admin7 from "../components/admin/Admin7";
import PerfilScreen from "../screens/Perfil";
import EquiposScreen from "../components/admin/DetallesEquipo";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Image, View, Text, TouchableOpacity } from "react-native";
import AdminAppBar from "../components/admin/AdminNavBar";
import { Ionicons } from "@expo/vector-icons";
import myStyles from "../style/style";
import { WebView } from "react-native-webview";
import { DrawerActions } from "@react-navigation/native";
import colores from "../style/colors";
import FONTS from "../style/fonts";
import { useFonts } from "@expo-google-fonts/oswald";

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

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={({ navigation, route }) => ({
        header: () => (
          <AdminAppBar
            navigation={navigation}
            title={route.name}
            isRoot={route.name === "Home"}
          />
        ),
      })}
    >
      <Stack.Screen name="Home" component={Admin1} />
      <Stack.Screen name="Equipos" component={Admin2} />
      <Stack.Screen name="Torneos" component={Admin3} />
      <Stack.Screen name="Campos" component={Admin4} />
      <Stack.Screen name="Arbitros" component={Admin5} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={({ navigation, route }) => ({
        header: () => (
          <AdminAppBar
            navigation={navigation}
            title={route.name}
            isRoot={route.name !== "Perfil"}
          />
        ),
      })}
    >
      <Stack.Screen name="Perfil" component={PerfilScreen} />
    </Stack.Navigator>
  );
}

function EquiposStack() {
  return (
    <Stack.Navigator
      screenOptions={({ navigation, route }) => ({
        header: () => (
          <AdminAppBar
            navigation={navigation}
            title={route.name}
            isRoot={route.name === "Menú de equipos"}
          />
        ),
        //headerShown: false
      })}
    >
      <Stack.Screen name="Menú de equipos" component={Admin2} />
      <Stack.Screen
        name="Ver equipo"
        options={{ title: "Detalles de equipo" }}
        component={EquiposScreen}
      />
    </Stack.Navigator>
  );
}

const LordiconExample = () => {
  return (
    <View style={styles.containerL}>
      <WebView
        originWhitelist={["*"]}
        source={{
          html: `<script src="https://cdn.lordicon.com/lordicon.js"></script>
          <lord-icon
              src="https://cdn.lordicon.com/lewtedlh.json"
              trigger="loop"
              stroke="bold"
              state="loop-roll"
              colors="primary:#242424,secondary:#c71f16"
              style="width:250px;height:250px">
          </lord-icon>`,
        }}
        style={styles.webview}
      />
      <Text>El torneo finalza en:</Text>
    </View>
  );
};

const CustomDrawerContent = (props) => {
  const navigation = useNavigation();
  return (
    <View style={{ flex: 1, backgroundColor: colores.base_1_1 }}>
      <View style={styles.header}>
        <View style={styles.leave}>
          <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.closeDrawer())}
          >
            <Ionicons name="close" size={30} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.imgTitle}>
          <Image
            source={require("../components/logo.png")}
            style={styles.image}
          />
          <Text style={[myStyles.Titles, styles.title, FONTS.nunitoNegrita]}>
            Menú
          </Text>
        </View>
      </View>
      <DrawerItemList {...props} />
      {/*<LordiconExample/>
      <DrawerItem
          label="Salir"
          icon={({ color, size }) => <Ionicons name="log-out" size={size} color={color} />}
          onPress={() => {
            navigation.reset({
              index: 0,
              routes: [{ name: "LoginScreen" }],
            });
          }}
        />*/}
    </View>
  );
};

function AdminDrawerNavigator() {
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
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true, // Controla la visibilidad del header dinámicamente
        drawerActiveTintColor: colores.acento_1_5,
        drawerItemStyle: { marginVertical: 5, marginHorizontal: 5 },
        drawerContentStyle: { backgroundColor: colores.base_3_5 },
        drawerActiveBackgroundColor: colores.domin_1_4,
        header: ({ navigation, route }) => {
          return (
            <AdminAppBar
              navigation={navigation}
              title={route.name}
              isRoot={route.name !== "Equipos" && route.name !== "Perfil"}
            />
          );
        },
      }}
    >
      <Drawer.Screen
        name="Home"
        component={Admin1}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          drawerLabelStyle: { fontFamily: "Oswald_400Regular" },
        }}
      />
      <Drawer.Screen
        name="Equipos"
        component={EquiposStack}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="shield" size={size} color={color} />
          ),
          drawerLabelStyle: { fontFamily: "Oswald_400Regular" },
        }}
      />
      <Drawer.Screen
        name="Torneos"
        component={Admin3}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="trophy" size={size} color={color} />
          ),
          drawerLabelStyle: { fontFamily: "Oswald_400Regular" },
        }}
      />
      <Drawer.Screen
        name="Campos"
        component={Admin4}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="football" size={size} color={color} />
          ),
          drawerLabelStyle: { fontFamily: "Oswald_400Regular" },
        }}
      />
      <Drawer.Screen
        name="Arbitros"
        component={Admin5}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="id-card" size={size} color={color} />
          ),
          drawerLabelStyle: { fontFamily: "Oswald_400Regular" },
        }}
      />
      <Drawer.Screen
        name="Pagos"
        component={Admin6}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="wallet" size={size} color={color} />
          ),
          drawerLabelStyle: { fontFamily: "Oswald_400Regular" },
        }}
      />
      <Drawer.Screen
        name="Convocatorias"
        component={Admin7}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="newspaper" size={size} color={color} />
          ),
          drawerLabelStyle: { fontFamily: "Oswald_400Regular" },
        }}
      />
      <Drawer.Screen
        name="Perfil"
        component={PerfilScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
    </Drawer.Navigator>
  );
}

export default function AdminNavigator() {
  return (
    <NavigationContainer>
      <AdminDrawerNavigator />
    </NavigationContainer>
  );
}

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
});
