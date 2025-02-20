import React from "react";
import { Text, Button, StyleSheet, SafeAreaView, ScrollView } from "react-native";

const Admin5 = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text>Pantalla de Inicio</Text>
        <Button title="Ir a Detalles" onPress={() => navigation.navigate("Details")} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: "center", alignItems: "center", },
});

export default Admin5;