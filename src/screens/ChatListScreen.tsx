import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";
import { NavigationProp } from "@react-navigation/native";
import { auth } from "../../firebaseConfig";

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const ChatListScreen = ({ navigation }: RouterProps) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button
        onPress={() => navigation.navigate("PrivateChatScreen")}
        title="New Chat"
      />
      <Button
        onPress={() => navigation.navigate("GroupChatScreen")}
        title="New Group"
      />
      <Button onPress={() => auth.signOut()} title="Logout" />
    </View>
  );
};

export default ChatListScreen;

const styles = StyleSheet.create({});
