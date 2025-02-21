import React from "react";
import {
  Text,
  Button,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
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

const Admin2 = ({ navigation }) => {
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

  setTimeout(() => {
    if (!fontsLoaded) {
    console.log("Cargando...")
    return (
      <View style={{ alignItems: "center", justifyContent: "center", marginTop: '10%' }}>
        <ActivityIndicator color={colores.domin_1_1}/>
        <Text> Loading Fonts... </Text>
      </View>
    );
  }},1000);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text>Equipos</Text>
        <Button
          title="Ir a Detalles de Chivas"
          onPress={() =>
            navigation.navigate("Ver equipo", {
              equipoId: 123,
              nombre: "Chivas",
            })
          }
        />
        <Button
          title="Ir a Detalles de Cruz Azul"
          onPress={() =>
            navigation.navigate("Ver equipo", {
              equipoId: 456,
              nombre: "Cruz Azul",
            })
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Admin2;
