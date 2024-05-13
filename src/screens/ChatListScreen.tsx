import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { NavigationProp } from "@react-navigation/native";
import { auth, dbFirestore } from "../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import SubmitButton from "../components/SubmitButton";
import { Button, ButtonIcon, ButtonText } from "@gluestack-ui/themed";
import { SafeAreaView } from "@gluestack-ui/themed";
import UserCard from "../components/UserCard";
import { UserData } from "../utils/store/types";
import { colors } from "../constants";

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const ChatListScreen = ({ navigation }: RouterProps) => {
  const [users, setUsers] = useState<UserData[]>([]);

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
        ...doc.data(),
      });
    });
    console.log(DATA, "DATA");
    setUsers(DATA);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {/* <Button>
        <ButtonText>New Chat</ButtonText>
      </Button> */}
      <SubmitButton
        style={{ marginVertical: 10 }}
        onPress={() => navigation.navigate("PrivateChatScreen")}
        title="New Chat"
      />
      {/* <SubmitButton
        onPress={() => navigation.navigate("GroupChatScreen")}
        title="New Group"
      /> */}
      <SubmitButton
        onPress={() => auth.signOut()}
        title="Logout"
        color={colors.red}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          data={users}
          renderItem={({ item }) => <UserCard user={item} />}
          keyExtractor={(item) => item.userId}
        />
      </SafeAreaView>
    </View>
  );
};

export default ChatListScreen;

const styles = StyleSheet.create({});
