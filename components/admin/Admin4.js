import React from "react";
import { Text, Button, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import MapView from 'react-native-maps';

const Admin4 = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text>Pantalla de Inicio</Text>
        <Button title="Ir a Detalles" onPress={() => navigation.navigate("Details")} />
        <MapView
      provider={MapView.PROVIDER_DEFAULT}  // Usar OpenStreetMap por defecto
      style={{ flex: 1, width: 200, height: 100 }}
      initialRegion={{
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: "center", alignItems: "center", },
});

export default Admin4;