import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext } from "react";
import { AuthContext, AuthProvider } from "../context/AuthContext";
import DueñoNavigator from "./DueñoDrawerNavigator";
import UserNavigator from "./UserDrawerNavigator";
import AdminNavigator from "./AdminNavigator";
import ArbitroNavigator from "./ArbitroNavigator";
import Login from "./AuthStackNavigator";

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
  const { user } = useContext(AuthContext);
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          {
            dueno: <Stack.Screen name="DueñoStack" component={DueñoNavigator} />,
            admin: <Stack.Screen name="AdminStack" component={AdminNavigator} />,
            arbitro: <Stack.Screen name="ArbitroStack" component={ArbitroNavigator} />,
          }[user.role] || <Stack.Screen name="UserStack" component={UserNavigator} />
        ) : (
          <Stack.Screen name="UserStack" component={UserNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainNavigator />
    </AuthProvider>
  );
}