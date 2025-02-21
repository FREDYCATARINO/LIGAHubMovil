import React from "react";
import {
  Text,
  Button,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";

const EqiposScreen = ({ navigation, route }) => {
  const { equipoId, nombre } = route.params;
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text>Detalles del equipo {nombre}</Text>
        <Text>id: {equipoId}</Text>
        <Button
          title="Ir a Detalles de equipos"
          onPress={() => navigation.navigate("Menú de equipos")}
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

export default EqiposScreen;
