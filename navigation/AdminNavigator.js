import React from "react";
import {
  createDrawerNavigator,
  DrawerItemList,
  DrawerItem
} from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Admin1 from "../components/admin/Admin1";
import Admin2 from "../components/admin/Admin2";
import Admin3 from "../components/admin/Admin3";
import Admin4 from "../components/admin/Admin4";
import Admin5 from "../components/admin/Admin5";
import LoginScreen from "../screens/Login";
import { StyleSheet, Image, View, Text } from "react-native";
import AdminAppBar from "../components/admin/AdminNavBar";
import { Ionicons } from "@expo/vector-icons";
import myStyles from "../style/style";
import { WebView } from "react-native-webview";

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
            isRoot={route.name === "Profile"}
          />
        ),
      })}
    >
      <Stack.Screen name="Perfil" component={LoginScreen} />
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
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Image
          source={require("../components/logo.png")}
          style={styles.image}
        />
        <Text style={[myStyles.Titles, styles.title]}>Menú</Text>
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
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        drawerActiveTintColor: "#FFCA6B",
        drawerItemStyle: { marginVertical: 5, marginHorizontal: 5 },
        drawerContentStyle: { backgroundColor: "#D6D6D6" },
        drawerActiveBackgroundColor: "#FF1111",
        header: ({ navigation, route }) => (
          <AdminAppBar
            navigation={navigation}
            title={route.name}
            isRoot={route.name === "Home"}
          />
        ),
      }}
    >
      <Drawer.Screen
        name="Home"
        component={Admin1}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Equipos"
        component={Admin2}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="shield" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Torneos"
        component={Admin3}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="trophy" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Campos"
        component={Admin4}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="football" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Arbitros"
        component={Admin5}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="id-card" size={size} color={color} />
          ),
        }}
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
    backgroundColor: "#6D6D6D",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 30,
    marginBottom: 10,
    width: "auto",
    display: "flex",
    flexDirection: "row",
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
    width:60,
    backgroundColor: "transparent",
    margin: 20,
  },
    containerL: {
    flex: 1,
    justifyContent: 'center',
    alignItems: "center",
    height: 50
  },
});
