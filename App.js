import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "./context/AuthContext";
import MainNavigator from "./navigation/AppNavigator"; // Asegúrate de que MainNavigator no esté envolviendo NavigationContainer
import { TokenProvider } from "./context/TokenContext";
import colores from "./style/colors";
import { StatusBar } from "react-native";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <TokenProvider>
          <StatusBar translucent={true} backgroundColor={colores.base_3_1} barStyle="light-content" />
          <MainNavigator />
        </TokenProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
