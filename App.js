// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './navigation/AppNavigator';

export default function App() {
  return (
    <NavigationContainer>
      <AuthStack />
    </NavigationContainer>
  );
};