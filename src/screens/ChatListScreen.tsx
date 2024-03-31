import { Button, FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { NavigationProp } from "@react-navigation/native";
import { auth, dbFirestore } from "../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

type User = {
  id: string;
  firstName: string;
  lastName: string;
};

const ChatListScreen = ({ navigation }: RouterProps) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    console.log("fetching users...");
  }, [users]);

  const fetchData = async () => {
    const querySnapshot = await getDocs(collection(dbFirestore, "users"));
    const DATA: any[] = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      DATA.push({
        id: doc.id,
        firstName: doc.data().firstName,
        lastName: doc.data().lastName,
      });
    });
    console.log(DATA, "DATA");
    setUsers(DATA);
  };

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
      <FlatList
        data={users}
        renderItem={({ item }) => <Text>{item.firstName}</Text>}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default ChatListScreen;

const styles = StyleSheet.create({});
