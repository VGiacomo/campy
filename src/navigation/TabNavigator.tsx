import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import HomeStackNavigator from "./HomeStackNavigator";
import ChatStackNavigator from "./ChatStackNavigator";
import SettingsStackNavigator from "./SettingsStackNavigator";
import { MaterialIcons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={24} color="black" />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatStackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="chat" size={24} color="black" />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="settings" size={24} color="black" />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
