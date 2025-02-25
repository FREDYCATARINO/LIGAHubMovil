import { SafeAreaView, View, Text, Image, TextInput, TouchableOpacity, ScrollView } from "react-native";
import FONTS from "../../style/fonts";
import colores from "../../style/colors";
import { Checkbox } from "react-native-paper";
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { StyleSheet } from "react-native";

const Arbitro2 = ({ navigation, route }) => {
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const [tarjeta, setTarjeta] = useState("");
  const [temName, setTeamName] = useState("");
  const { partido } = route.params;
  const [player, setPlayer] = useState({});

  const jugadoresPrueba = [
    {
      id: 1,
      nombre: "Jugador #001",
      goles: 9,
      partidos: 5,
      fallas: 0,
      img: "https://lindamood.net/wp-content/uploads/2019/09/Blank-profile-image.jpg",
      activo: true,
    },
    {
      id: 2,
      nombre: "Jugador #002",
      goles: 3,
      partidos: 8,
      fallas: 0,
      img: "https://lindamood.net/wp-content/uploads/2019/09/Blank-profile-image.jpg",
      activo: true,
    },
    {
      id: 3,
      nombre: "Jugador #003",
      goles: 6,
      partidos: 1,
      fallas: 0,
      img: "https://lindamood.net/wp-content/uploads/2019/09/Blank-profile-image.jpg",
      activo: true,
    },
    {
      id: 4,
      nombre: "Jugador #004",
      goles: 10,
      partidos: 3,
      fallas: 0,
      img: "https://lindamood.net/wp-content/uploads/2019/09/Blank-profile-image.jpg",
      activo: false,
    },
    {
      id: 5,
      nombre: "Jugador #005",
      goles: 9,
      partidos: 2,
      fallas: 0,
      img: "https://lindamood.net/wp-content/uploads/2019/09/Blank-profile-image.jpg",
      activo: false,
    },
    {
      id: 6,
      nombre: "Jugador #006",
      goles: 2,
      partidos: 1,
      fallas: 1,
      img: "https://lindamood.net/wp-content/uploads/2019/09/Blank-profile-image.jpg",
      activo: true,
    },
    {
      id: 7,
      nombre: "Jugador #007",
      goles: 0,
      partidos: 50,
      fallas: 50,
      img: "https://lindamood.net/wp-content/uploads/2019/09/Blank-profile-image.jpg",
      activo: true,
    },
  ];

  return (
    <SafeAreaView>
      <ScrollView>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
            gap: 10,
            backgroundColor: colores.blanco,
            padding: 10,
            borderRadius: 5,
            marginVertical: 10
          }}
        >
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Image
              source={{ uri: partido.equipo1.img }}
              style={{
                resizeMode: "contain",
                width: 80,
                height: 80,
                alignSelf: "center",
              }}
            />
            <Text style={[FONTS.oswaldNegrita, { fontSize: 15 }]}>
              {partido.equipo1.nombre}
            </Text>
            <Checkbox
              status={checked1}
              onPress={() => {
                setChecked1(!checked1);
                setChecked2(false);
                console.log(checked1);
                setTeamName(partido.equipo1.nombre);
              }}
              color={colores.acento_1_1}
            />
          </View>
          <TextInput
            style={[stylesArbitro2.input, FONTS.oswald]}
            placeholder="Equipo 1"
            keyboardType="decimal-pad"
          />
          <View style={{alignItems:'center'}}>
            <Text style={[FONTS.oswaldNegrita, { fontSize: 18 }]}>
              Marcador
            </Text>{" "}
            <Text style={[FONTS.oswaldNegrita, { fontSize: 28 }]}>-</Text>
          </View>
          <TextInput
            style={[stylesArbitro2.input, FONTS.oswald]}
            placeholder="Equipo 2"
            keyboardType="decimal-pad"
          />
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Image
              source={{ uri: partido.equipo2.img }}
              style={{
                resizeMode: "contain",
                width: 80,
                height: 80,
                alignSelf: "center",
              }}
            />
            <Text style={[FONTS.oswaldNegrita, { fontSize: 15 }]}>
              {partido.equipo2.nombre}
            </Text>
            <Checkbox
              status={checked2}
              onPress={() => {
                setChecked2(!checked2);
                setChecked1(false);
                console.log(checked1);
                setTeamName(partido.equipo2.nombre);
              }}
              color={colores.acento_1_1}
            />
          </View>
        </View>
        {checked1 || checked2 ? (
          <View style={{ marginVertical: 20 }}>
            <Text style={[FONTS.oswald, { fontSize: 20, alignSelf: "center" }]}>
              Jugadores de: {temName}
            </Text>
            <Picker
              selectedValue={"Jugadores"}
              onValueChange={(itemValue) => setPlayer(itemValue)}
              style={[stylesArbitro2.picker]}
              itemStyle={FONTS.nunito}
            >
              {jugadoresPrueba.map((jug) => {
                return (
                  <Picker.Item
                    label={jug.nombre}
                    value={jug}
                    style={FONTS.nunito}
                  />
                );
              })}
            </Picker>
          </View>
        ) : null}
        <View style={stylesArbitro2.form}>
          <Text
            style={[FONTS.oswaldNegrita, { fontSize: 20, alignSelf: "center" }]}
          >
            Detalles de jugador
          </Text>
          <Image
            source={{ uri: player.img }}
            style={{
              resizeMode: "contain",
              width: 100,
              height: 100,
              alignSelf: "center",
            }}
          />
          <View style={{alignItems: 'center', padding: 5, marginBottom: 10}}>
            <Text style={FONTS.oswald}>Nombre completo: {player.nombre}</Text>
            <Text style={FONTS.oswald}>Equipo: {temName}</Text>
            <Text style={FONTS.oswald}>Partidos: {player.partidos}</Text>
          </View>
          <Text
            style={[FONTS.oswaldNegrita, { fontSize: 20, alignSelf: "center", justifyContent: 'center' }]}
          >
            Rendimiento
          </Text>
          <View style={{ flexDirection: "row", justifyContent:'center', gap: 5, alignItems: 'center' }}>
            <Text style={[FONTS.oswald, stylesArbitro2.text18]}>
              Goles anotados:
            </Text>
            <TextInput
              style={[stylesArbitro2.input2, FONTS.oswald]}
              placeholder="Ingresa la cantidad de goles"
              keyboardType="decimal-pad"
            />
          </View>
          <Text style={[FONTS.oswald, stylesArbitro2.text18,  {alignSelf: 'center'}]}>
              Amonestaciones:
            </Text>
          <View
            style={{ flexDirection: "row", justifyContent: "center", padding: 3, alignItems: 'center' }}
          >
            <View style={{ flexDirection: "row", alignItems: 'center' }}>
              <Text style={stylesArbitro2.text15}>Tarjeta amarilla:</Text>
              <Checkbox
                status={checked2}
                onPress={() => {
                  setTarjeta("Amarilla");
                }}
                color={colores.acento_3_1}
              />
              <Text style={stylesArbitro2.text15}>Tarjeta roja:</Text>
              <Checkbox
                status={checked2}
                onPress={() => {
                  setTarjeta("Roja");
                }}
                color={colores.acento_3_1}
              />
            </View>
          </View>
          <Text style={[FONTS.oswald, stylesArbitro2.text18]}>
            En caso de tarjeta roja, comenta el motivo:
          </Text>
          <TextInput
            placeholder="Argumenta tu elección"
            placeholderTextColor={colores.domin_2_2}
            multiline
            numberOfLines={4}
            style={[stylesArbitro2.input2, { height: 120 }, FONTS.oswald]}
          />
          <TouchableOpacity style={stylesArbitro2.botTorneo}>
            <Text style={[FONTS.oswald, stylesArbitro2.botonTorneoText]}>
              Crear Torneo
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const stylesArbitro2 = StyleSheet.create({
  picker: {
    height: 50,
    width: "95%",
    marginBottom: 10,
    backgroundColor: colores.base_1_3,
    borderRadius: 5,
    borderWidth: 1,
    margin: 10,
  },
  input: {
    borderColor: colores.domin_2_2,
    borderWidth: 3,
    borderRadius: 5,
    color: colores.negro,
    backgroundColor: colores.base_2_5,
    width: 30,
    height: 30,
  },
  input2: {
    borderColor: colores.domin_2_2,
    borderWidth: 3,
    borderRadius: 5,
    color: colores.negro,
    backgroundColor: colores.base_2_5,
  },
  form: {
    padding: 10,
    paddingVertical: 15,
    gap: 5,
    backgroundColor: colores.blanco,
    marginVertical: 5,
  },
  text18: {
    fontSize: 18,
  },
  text15: {
    fontSize: 15,
  },
  botTorneo: {
    width: "50%",
    backgroundColor: colores.domin_2_2,
    paddingVertical: 5,
    gap: 5,
    borderRadius: 5,
    alignItems: "center",
  },
  botonTorneoText: {
    fontSize: 18,
    color: colores.blanco,
  },
});

export default Arbitro2;
