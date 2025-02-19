// AppNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/Login';
import RecuperarContra from '../screens/RecuperarContra';
import RegistroDueño from '../screens/RegistroDueño'

const Stack = createStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // Oculta la cabecera por defecto
      }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="RecuperarContra" component={RecuperarContra} />
      <Stack.Screen name='RegistroDueño'component={RegistroDueño}/>
    </Stack.Navigator>
  );
}