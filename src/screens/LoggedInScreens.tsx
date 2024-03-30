import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./LoginScreen";
import SignupScreen from "./SignupScreen";
import FeedScreen from "./FeedScreen";
import PostDetailsScreen from "./PostDetailsScreen";

const LoggedInStack = createNativeStackNavigator();

const AuthScreen = () => {
  return (
    <LoggedInStack.Navigator>
      <LoggedInStack.Screen name="List" component={FeedScreen} />
      <LoggedInStack.Screen name="Details" component={PostDetailsScreen} />
    </LoggedInStack.Navigator>
  );
};

export default AuthScreen;
