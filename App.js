import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "./context/AuthContext";
import MainNavigator from "./navigation/AppNavigator"; // Asegúrate de que MainNavigator no esté envolviendo NavigationContainer

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <AuthProvider>
      <MainNavigator />
    </AuthProvider>
  </GestureHandlerRootView>
  );
}