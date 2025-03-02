import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../screens/Login";
import RegistroDueño from "../screens/RegistroDueño";
import RecuperarContra from "../screens/RecuperarContra";

const Stack = createStackNavigator();

const AuthStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="RegistroDueño" component={RegistroDueño} />
      <Stack.Screen name="RecuperarContra" component={RecuperarContra} />
    </Stack.Navigator>
  );
};

export default AuthStackNavigator;
