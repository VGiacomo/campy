import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useAppSelector } from "../utils/store";
import TabNavigator from "./TabNavigator";
import AuthNavigator from "./AuthNavigator";
import StartUpScreen from "../screens/StartUpScreen";

const AppNavigator = () => {
  const isAuth = useAppSelector(
    (state) => state.auth.token !== null && state.auth.token !== ""
  );
  const didTryAutoLogin = useAppSelector((state) => state.auth.didTryAutoLogin);

  return (
    <NavigationContainer>
      {isAuth ? (
        <TabNavigator />
      ) : didTryAutoLogin ? (
        <AuthNavigator />
      ) : (
        <StartUpScreen />
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
