import React, { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View, Text, Image, StyleSheet } from "react-native";

const MatchCard = ({ match }) => {
  return (
    <View style={[styles.card, match.statusStyle]}>
      <Text style={styles.date}>{match.date} - {match.time}</Text>
      <View style={styles.teamsContainer}>
        <Image source={match.team1Logo} style={styles.teamLogo} />
        <Text style={styles.score}>{match.score}</Text>
        <Image source={match.team2Logo} style={styles.teamLogo} />
      </View>
      <Text style={styles.field}>{match.field}</Text>
      <Text style={[styles.status, match.statusColor]}>{match.statusText}</Text>
    </View>
  );
};

const ResultadoDePartidos = () => {
  const matches = [
    {
      date: "03/02/2025", time: "16:30hrs",
      team1Logo: require("../../assets/EquiposLogos/pumas.png"),
      team2Logo: require("../../assets/EquiposLogos/chivas.png"),
      score: "0 - 4", field: "Campo deportivo 'Galaxy', cancha 3",
      statusText: "¡Finalizado!", statusColor: styles.finalizado
    },
    {
      date: "03/02/2025", time: "16:30hrs",
      team1Logo: require("../../assets/EquiposLogos/pumas.png"),
      team2Logo: require("../../assets/EquiposLogos/chivas.png"),
      score: "--", field: "Club 'El campito', cancha 2",
      statusText: "¡En disputa!", statusColor: styles.enDisputa
    },
    {
      date: "03/02/2025", time: "16:30hrs",
      team1Logo: require("../../assets/EquiposLogos/pumas.png"),
      team2Logo: require("../../assets/EquiposLogos/chivas.png"),
      score: "0 - 4", field: "Campo deportivo 'Galaxy', cancha 4",
      statusText: "¡Segundo tiempo!", statusColor: styles.segundoTiempo
    }
  ];

  return (
    <View style={styles.container}>
      {matches.map((match, index) => (
        <MatchCard key={index} match={match} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
  },
  date: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  teamsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "80%",
    marginVertical: 10,
  },
  teamLogo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  score: {
    fontSize: 18,
    fontWeight: "bold",
  },
  field: {
    fontSize: 12,
    color: "#555",
    textAlign: "center",
  },
  status: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "bold",
  },
  finalizado: {
    color: "green",
  },
  enDisputa: {
    color: "orange",
  },
  segundoTiempo: {
    color: "red",
  },
});

export default ResultadoDePartidos;
