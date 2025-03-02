import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";

const ClassificationTable = () => {
  const teams = [
    { position: 1, name: "Chivas", logo: require("../../assets/chivas.png") },
    { position: 3, name: "Pumas", logo: require("../../assets/pumas.png") },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Destacados de la liguilla</Text>
      <View style={styles.highlightContainer}>
        <View style={styles.highlightCard}>
          <Text style={styles.highlightTitle}>Goleador</Text>
          <Image source={require("../../assets/player.png")} style={styles.icon} />
          <Text style={styles.highlightText}>Jugador #1</Text>
          <Text style={styles.highlightStat}>Goles anotados: 78</Text>
        </View>
        <View style={styles.highlightCard}>
          <Text style={styles.highlightTitle}>Mejor ofensiva</Text>
          <Image source={require("../../assets/chivas.png")} style={styles.icon} />
          <Text style={styles.highlightStat}>GF: 12</Text>
        </View>
        <View style={styles.highlightCard}>
          <Text style={styles.highlightTitle}>Mejor defensiva</Text>
          <Image source={require("../../assets/cruzAzul.png")} style={styles.icon} />
          <Text style={styles.highlightStat}>GC: 2</Text>
        </View>
        <View style={styles.highlightCard}>
          <Text style={styles.highlightTitle}>Juego limpio</Text>
          <Image source={require("../../assets/pumas.png")} style={styles.icon} />
          <Text style={styles.highlightStat}>Tarjetas rojas: 1</Text>
          <Text style={styles.highlightStat}>Tarjetas amarillas: 1</Text>
        </View>
      </View>
      <Text style={styles.title}>Goleadores</Text>
      <View style={styles.table}>
        <View style={styles.headerRow}>
          <Text style={styles.headerCell}>Pos</Text>
          <Text style={styles.headerCell}>Equipo</Text>
          <Text style={styles.headerCell}>Jugador</Text>
          <Text style={styles.headerCell}>Partidos</Text>
          <Text style={styles.headerCell}>Goles</Text>
        </View>
        {teams.map((team, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.cell}>{index + 1}</Text>
            <View style={styles.teamCell}>
              <Image source={team.logo} style={styles.teamLogo} />
              <Text style={styles.teamName}>{team.name}</Text>
            </View>
            <Text style={styles.cell}>Jugador #{index + 1}</Text>
            <Text style={styles.cell}>{Math.floor(Math.random() * 10)}</Text>
            <Text style={styles.cell}>{Math.floor(Math.random() * 20)}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#fff",
    paddingBottom: 20,
  },
  banner: {
    width: "100%",
    height: 100,
    resizeMode: "cover",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  highlightContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginVertical: 10,
  },
  highlightCard: {
    width: "45%",
    backgroundColor: "#f5f5f5",
    padding: 10,
    margin: 5,
    borderRadius: 10,
    alignItems: "center",
  },
  highlightTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  highlightStat: {
    fontSize: 14,
    fontWeight: "bold",
  },
  icon: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    marginBottom: 5,
  },
  table: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginTop: 10,
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#c00",
    padding: 10,
  },
  headerCell: {
    flex: 1,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  cell: {
    flex: 1,
    textAlign: "center",
  },
  teamCell: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  teamLogo: {
    width: 30,
    height: 30,
    resizeMode: "contain",
    marginRight: 10,
  },
  teamName: {
    fontSize: 14,
  },
});

export default ClassificationTable;
