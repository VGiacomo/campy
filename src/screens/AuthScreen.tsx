// AuthScreen.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./LoginScreen";
import SignupScreen from "./SignupScreen";

const AuthStack = createNativeStackNavigator();

const AuthScreen = () => {
  return (
    <AuthStack.Navigator initialRouteName="Login">
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
    </AuthStack.Navigator>
  );
};

export default AuthScreen;
