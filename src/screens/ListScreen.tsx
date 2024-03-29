import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";
import { NavigationProp } from "@react-navigation/native";
import { auth } from "../../firebaseConfig";

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const ListScreen = ({ navigation }: RouterProps) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button
        onPress={() => navigation.navigate("Details")}
        title="Open Details"
      />
      <Button onPress={() => auth.signOut()} title="Logout" />
    </View>
  );
};

export default ListScreen;

const styles = StyleSheet.create({});
