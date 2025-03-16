import React from "react";
import {
  Text,
  Button,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  FlatList,
  TouchableOpacity,
  Animated,
  TextInput,
  Image,
} from "react-native";
import { Title } from "react-native-paper";
import FONTS from "../style/fonts";
import colores from "../style/colors";

const ErrorComponent = ({ reintentar }) => {
  return (
    <View>
      <Text>Algo salió mal, inténtalo nuevamente</Text>
      <TouchableOpacity onPress={() => setSwitcht(!switcht)}>
        <Text>Reintentar</Text>
      </TouchableOpacity>
    </View>
  );
};

const errorStyles = StyleSheet.create({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5
    },
    Title: {
        fontFamily: FONTS.oswaldNegrita,
        fontSize: 20,
        color: 'black'
    }
})

export default ErrorComponent;
