// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './navigation/AppNavigator';
import AdminNavigator from './navigation/AdminNavigator';
import ArbitroNavigator from './navigation/ArbitroNavigator'

export default function App() {
  return (
    <ArbitroNavigator/>
  );
};