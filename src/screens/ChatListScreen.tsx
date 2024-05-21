import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { NavigationProp } from "@react-navigation/native";
import { auth, dbFirestore } from "../../firebaseConfig";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  serverTimestamp,
  query,
  where,
  getDoc,
} from "firebase/firestore";
import SubmitButton from "../components/SubmitButton";
import { SafeAreaView } from "@gluestack-ui/themed";
import UserCard from "../components/UserCard";
import { UserData } from "../utils/store/types";
import { colors } from "../constants";

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const ChatListScreen = ({ navigation }: RouterProps) => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [chats, setChats] = useState<any[]>([]);
  const currentUser = auth.currentUser;

  useEffect(() => {
    fetchUsers();
    fetchChats();
  }, []);

  const fetchUsers = async () => {
    const querySnapshot = await getDocs(collection(dbFirestore, "users"));
    const usersData: UserData[] = [];
    querySnapshot.forEach((doc) => {
      if (doc.id === currentUser?.uid) return;
      usersData.push({ ...doc.data(), userId: doc.id } as UserData);
    });
    setUsers(usersData);
  };

  const fetchChats = async () => {
    if (!currentUser) return;

    const chatsQuery = query(
      collection(dbFirestore, "chats"),
      where("users", "array-contains", currentUser.uid)
    );
    const querySnapshot = await getDocs(chatsQuery);
    const chatsData: any[] = [];
    const userDocs: any = {};

    for (const doc of querySnapshot.docs) {
      const chat = { ...doc.data(), chatId: doc.id };
      for (const userId of chat.users) {
        if (userId !== currentUser.uid && !userDocs[userId]) {
          const userDoc = await getDoc(doc(dbFirestore, "users", userId));
          userDocs[userId] = userDoc.data();
        }
      }
      chatsData.push(chat);
    }

    setChats(
      chatsData.map((chat) => ({
        ...chat,
        displayName:
          chat.chatName !== ""
            ? chat.chatName
            : userDocs[
                chat.users.find((userId: string) => userId !== currentUser.uid)
              ]?.firstLast,
      }))
    );
  };

  const createChat = async (user: UserData) => {
    if (!currentUser) return;

    // Check if a chat already exists
    const chatsQuery = query(
      collection(dbFirestore, "chats"),
      where("users", "array-contains", currentUser.uid)
    );
    const querySnapshot = await getDocs(chatsQuery);
    let existingChat = null;

    querySnapshot.forEach((doc) => {
      const chat = doc.data();
      if (chat.users.includes(user.userId)) {
        existingChat = { ...chat, chatId: doc.id };
      }
    });

    if (existingChat) {
      navigation.navigate("Chat", {
        chatId: existingChat.chatId,
        chatName: existingChat.displayName,
      });
    } else {
      // Create a new chat
      const newChatRef = doc(collection(dbFirestore, "chats"));
      await setDoc(newChatRef, {
        users: [currentUser.uid, user.userId],
        createdAt: serverTimestamp(),
        createdBy: currentUser.uid,
        isGroupChat: false,
        latestMessageText: "",
        updatedAt: serverTimestamp(),
        updatedBy: currentUser.uid,
      });

      navigation.navigate("Chat", { chatId: newChatRef.id });
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <SubmitButton
        style={{ marginVertical: 10 }}
        onPress={() => navigation.navigate("PrivateChatScreen")}
        title="New Chat"
      />
      <SubmitButton
        onPress={() => auth.signOut()}
        title="Logout"
        color={colors.red}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          data={users}
          renderItem={({ item }) => (
            <UserCard user={item} onPress={() => createChat(item)} />
          )}
          keyExtractor={(item) => item.userId}
        />
        <Text style={styles.header}>Chats</Text>
        <FlatList
          data={chats}
          renderItem={({ item }) => (
            <Text
              onPress={() =>
                navigation.navigate("Chat", {
                  chatId: item.chatId,
                  chatName: item.displayName,
                })
              }
            >
              {item.displayName}
            </Text>
          )}
          keyExtractor={(item) => item.chatId}
        />
      </SafeAreaView>
    </View>
  );
};

export default ChatListScreen;

const styles = StyleSheet.create({
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
});
