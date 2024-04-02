import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Button, StyleSheet, Text, View } from "react-native";
import AuthNavigator from "./src/navigation/AuthNavigator";
import { store } from "./src/utils/store";
import { Provider } from "react-redux";
import { useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";
import TabNavigator from "./src/navigation/TabNavigator";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";

const Stack = createNativeStackNavigator();

export default function App() {
  // TODO setup a splash screen while getting the user
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      console.log("user", user);
      setUser(user);
    });
  }, []);

  return (
    <GluestackUIProvider config={config}>
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator>
            {user ? (
              <Stack.Screen
                name="Private"
                component={TabNavigator}
                options={{ headerShown: false }}
              />
            ) : (
              <Stack.Screen
                name="Auth"
                component={AuthNavigator}
                options={{ headerShown: false }}
              />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </GluestackUIProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
