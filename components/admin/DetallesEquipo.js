import React from "react";
import {
  Text,
  Button,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image
} from "react-native";

const EqiposScreen = ({ navigation, route }) => {
  const { team } = route.params;
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image
          source={{ uri: team.image, alt: team.nombre }}
          style={{ width: 125, height: 125, resizeMode: "contain" }}
        />
        <Text>Detalles del equipo {team.nombre}:</Text>
        <Text>id: {team.id}</Text>
        <Text>DT: {team.dueno}</Text>
        <Text>jugadores: {team.jugadores.length}</Text>
        <Button
          title="Volver"
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
