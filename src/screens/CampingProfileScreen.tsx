import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";
import { NavigationProp } from "@react-navigation/native";
import { auth } from "../../firebaseConfig";

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const CampingProfileScreen = ({ navigation }: RouterProps) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Camping Profile Screen</Text>
      {/* <Button
        onPress={() => navigation.navigate("PostDetails")}
        title="Open Post"
      />
      <Button onPress={() => auth.signOut()} title="Logout" /> */}
    </View>
  );
};

export default CampingProfileScreen;

const styles = StyleSheet.create({});
