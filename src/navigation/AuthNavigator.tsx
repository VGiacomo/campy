// AuthScreen.tsx
import { useState } from "react";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Pressable,
} from "react-native";

import PageContainer from "../components/PageContainer";
import { colors } from "../constants/colors";

const AuthNavigator = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  return (
    <PageContainer>
      <ScrollView>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === "ios" ? "height" : undefined}
          keyboardVerticalOffset={100}
        >
          <View style={styles.imageContainer}>
            <Image
              alt="app's logo"
              style={styles.image}
              source={require("../../assets/images/logo.png")}
              resizeMode="contain"
            />
          </View>

          {isSignUp ? <SignupScreen /> : <LoginScreen />}

          <Pressable
            onPress={() => setIsSignUp((prevState) => !prevState)}
            style={styles.linkContainer}
          >
            <Text style={styles.link}>{`Switch to ${
              isSignUp ? "sign in" : "sign up"
            }`}</Text>
          </Pressable>
        </KeyboardAvoidingView>
      </ScrollView>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  linkContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 15,
  },
  link: {
    color: colors.blue,
    fontFamily: "medium",
    letterSpacing: 0.3,
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "50%",
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: "center",
    // backgroundColor: "red",
    minHeight: Dimensions.get("window").height - 100,
  },
});

export default AuthNavigator;
