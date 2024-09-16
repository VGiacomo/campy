import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
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
  onSnapshot,
} from "firebase/firestore";
import SubmitButton from "../components/SubmitButton";
import { SafeAreaView } from "@gluestack-ui/themed";
import ChatCard from "../components/ChatCard";
import { ChatData, UserData } from "../utils/store/types";
import { colors } from "../constants";
import UserCard from "../components/UserCard";
import PageContainer from "../components/PageContainer";

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const ChatListScreen = ({ navigation }: RouterProps) => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [chats, setChats] = useState<any[]>([]);
  const currentUser = auth.currentUser;
  // const [refreshing, setRefreshing] = useState(false);

  // const onRefresh = React.useCallback(() => {
  //   setRefreshing(true);
  //   // fetchChats();
  //   setTimeout(() => {
  //     setRefreshing(false);
  //   }, 2000);
  // }, []);

  useEffect(() => {
    fetchUsers();
    // fetchChats();

    if (!currentUser) return;

    const chatRef = query(
      collection(dbFirestore, "chats"),
      where("users", "array-contains", currentUser.uid)
    );

    const subscriber = onSnapshot(chatRef, {
      next: async (snapshot) => {
        const chats: ChatData[] = [];
        snapshot.docs.forEach((doc) => {
          chats.push({
            users: doc.data().users,
            usersImages: doc.data().usersImages,
            usersNames: doc.data().usersNames,
            createdAt: doc.data().createdAt,
            createdBy: doc.data().createdBy,
            chatId: doc.id,
            latestMessageText: doc.data().latestMessageText,
            updatedAt: doc.data().updatedAt,
            updatedBy: doc.data().updatedBy,
          });
        });
        chats.filter((chat) => chat.users.includes(currentUser!.uid));
        chats.sort((a, b) => (a.updatedAt > b.updatedAt ? -1 : 1));
        const otherUsersInChatsData: any = {};
        for (const chat of chats) {
          for (const userId of chat.users) {
            if (userId !== currentUser?.uid && !otherUsersInChatsData[userId]) {
              const userDoc = await getDoc(doc(dbFirestore, "users", userId));
              otherUsersInChatsData[userId] = userDoc.data();
            }
          }
        }
        console.log(chats, "chats");
        setChats(
          chats.map((chat) => ({
            ...chat,
            chatImage:
              currentUser &&
              otherUsersInChatsData[
                chat.users.find((userId: string) => userId !== currentUser.uid)!
              ]?.profilePicture,
            displayName:
              currentUser &&
              otherUsersInChatsData[
                chat.users.find((userId: string) => userId !== currentUser.uid)!
              ]?.firstLast,
          }))
        );
      },
    });

    // // Unsubscribe from events when no longer in use
    return () => subscriber();
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

  // const fetchChats = async () => {
  //   if (!currentUser) return;

  //   const chatsQuery = query(
  //     collection(dbFirestore, "chats"),
  //     where("users", "array-contains", currentUser.uid)
  //   );
  //   const querySnapshot = await getDocs(chatsQuery);
  //   const chatsData: any[] = [];
  //   const otherUsersInChatsData: any = {};
  //   for (const qsDoc of querySnapshot.docs) {
  //     const chat = { ...qsDoc.data(), chatId: qsDoc.id };
  //     for (const userId of chat.users) {
  //       if (userId !== currentUser.uid && !otherUsersInChatsData[userId]) {
  //         const userDoc = await getDoc(doc(dbFirestore, "users", userId));
  //         otherUsersInChatsData[userId] = userDoc.data();
  //       }
  //     }
  //     chatsData.push(chat);
  //   }

  //   setChats(
  //     chatsData.map((chat) => ({
  //       ...chat,
  //       chatImage: chat.chatImage
  //         ? chat.chatImage
  //         : otherUsersInChatsData[
  //             chat.users.find((userId: string) => userId !== currentUser.uid)
  //           ]?.profilePicture,
  //       displayName: chat.chatName
  //         ? chat.chatName
  //         : otherUsersInChatsData[
  //             chat.users.find((userId: string) => userId !== currentUser.uid)
  //           ]?.firstLast,
  //     }))
  //   );
  // };
  const createNewChat = async () => {
    if (!currentUser) return;
    navigation.navigate("NewChat");
  };

  return (
    <PageContainer>
      <View style={{ flexDirection: "row" }}>
        <SubmitButton
          style={{ margin: 10 }}
          onPress={() => createNewChat()}
          title="New Chat"
        />
        <SubmitButton
          style={{ margin: 10 }}
          onPress={() => auth.signOut()}
          title="Logout"
          color={colors.red}
        />
      </View>
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Chats</Text>
        <FlatList
          data={chats}
          renderItem={({ item }) => (
            <ChatCard
              chat={item}
              onPress={() =>
                navigation.navigate("PrivateChat", {
                  chatId: item.chatId,
                  chatName: item.displayName,
                })
              }
            />
          )}
          // refreshControl={
          //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          // }
          keyExtractor={(item) => item.chatId}
        />
      </SafeAreaView>
    </PageContainer>
  );
};

export default ChatListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollView: {
    flex: 1,
    // backgroundColor: "pink",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
});
