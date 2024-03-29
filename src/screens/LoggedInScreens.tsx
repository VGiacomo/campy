import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./LoginScreen";
import SignupScreen from "./SignupScreen";
import ListScreen from "./ListScreen";
import DetailsScreen from "./DetailsScreen";

const LoggedInStack = createNativeStackNavigator();

const AuthScreen = () => {
  return (
    <LoggedInStack.Navigator>
      <LoggedInStack.Screen name="List" component={ListScreen} />
      <LoggedInStack.Screen name="Details" component={DetailsScreen} />
    </LoggedInStack.Navigator>
  );
};

export default AuthScreen;
