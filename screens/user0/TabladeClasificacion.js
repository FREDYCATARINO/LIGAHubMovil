import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";

const ClassificationTable = () => {
  const teams = [
    { position: 1, name: "Chivas", logo: require("../../assets/chivas.png") },
    { position: 3, name: "Pumas", logo: require("../../assets/pumas.png") },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require("../../assets/banner.png")} style={styles.banner} />
      <Text style={styles.title}>Tabla de clasificación</Text>
      <View style={styles.table}>
        <View style={styles.headerRow}>
          <Text style={styles.headerCell}>Pos</Text>
          <Text style={styles.headerCell}>Equipo</Text>
          <Text style={styles.headerCell}>JJ</Text>
          <Text style={styles.headerCell}>JG</Text>
          <Text style={styles.headerCell}>JE</Text>
          <Text style={styles.headerCell}>JP</Text>
          <Text style={styles.headerCell}>GF</Text>
          <Text style={styles.headerCell}>GC</Text>
          <Text style={styles.headerCell}>DIF</Text>
        </View>
        {teams.map((team, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.cell}>{team.position}</Text>
            <View style={styles.teamCell}>
              <Image source={team.logo} style={styles.teamLogo} />
              <Text style={styles.teamName}>{team.name}</Text>
            </View>
            <Text style={styles.cell}>--</Text>
            <Text style={styles.cell}>--</Text>
            <Text style={styles.cell}>--</Text>
            <Text style={styles.cell}>--</Text>
            <Text style={styles.cell}>--</Text>
            <Text style={styles.cell}>--</Text>
            <Text style={styles.cell}>--</Text>
          </View>
        ))}
      </View>
      <Text style={styles.footer}>JJ: Juegos Jugados | JG: Juegos Ganados | JE: Juegos Empatados | JP: Juegos Perdidos | GF: Goles a Favor | GC: Goles en Contra | DIF: Diferencia de Goles | PTS: Puntos</Text>
      <Image source={require("../../assets/banner.png")} style={styles.banner} />
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
  logo: {
    width: 120,
    height: 40,
    resizeMode: "contain",
    marginBottom: 10,
  },
  table: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
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
  footer: {
    fontSize: 12,
    color: "#555",
    textAlign: "center",
    marginTop: 10,
    width: "90%",
  },
});

export default ClassificationTable;
