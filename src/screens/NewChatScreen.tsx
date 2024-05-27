import React, { useEffect, useState } from "react";
import { View, TextInput, FlatList } from "react-native";
import { UserData } from "../utils/store/types";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { auth, dbFirestore } from "../../firebaseConfig";
import UserCard from "../components/UserCard";
import { NavigationProp } from "@react-navigation/native";
import { Input, InputField } from "@gluestack-ui/themed";
import PageContainer from "../components/PageContainer";
import { createChat, getUserChats } from "../utils/actions/chatActions";
import { useAppSelector } from "../utils/store";

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const NewChatScreen = ({ navigation }: RouterProps) => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchText, setSearchText] = useState("");
  const userData = useAppSelector((state) => state.auth.userData)!;

  const filteredUsers = users.filter((user) =>
    user.firstLast.toLowerCase().includes(searchText.toLowerCase())
  );
  const currentUser = auth.currentUser;
  useEffect(() => {
    fetchUsers();
    // chatWithUserExists(currentUser!.uid);
  }, []);

  //   const chatWithUserExists = (userId: string) => {
  //     getUserChats(userId).then((chats) => {});
  //   };

  // const fetchFilteredUsers = async () => {
  //   if (!currentUser) return [];

  //   const currentUserId = currentUser.uid;

  //   // Step 1: Fetch current user's chat IDs
  //   const userChatsSnapshot = await getDoc(
  //     doc(dbFirestore, "userChats", currentUserId)
  //   );
  //   const currentUserChats = userChatsSnapshot.data() || {};
  //   const currentUserChatIds = new Set(Object.values(currentUserChats));
  //   console.log(currentUserChatIds);

  //   // Step 2: Fetch all users and their chat IDs
  //   const allUsersSnapshot = await getDocs(
  //     collection(dbFirestore, "userChats")
  //   );
  //   const allUsers: { userId: string; userChatIds: Set<string> }[] = [];
  //   allUsersSnapshot.forEach((doc) => {
  //     const userId = doc.id;
  //     const userChats = doc.data() || {};
  //     const userChatIds = new Set(Object.values(userChats));
  //     allUsers.push({ userId, userChatIds });
  //   });

  //   // Step 3: Filter out users who share any chat ID with the current user
  //   const filteredUsers = allUsers.filter((user) => {
  //     if (user.userId === currentUserId) return false; // Exclude the current user
  //     const hasCommonChat = [...user.userChatIds].some((chatId) =>
  //       currentUserChatIds.has(chatId)
  //     );
  //     return !hasCommonChat;
  //   });

  //   return filteredUsers.map((user) => user.userId);
  // };

  const fetchUsers = async () => {
    const querySnapshot = await getDocs(collection(dbFirestore, "users"));
    const usersData: UserData[] = [];
    querySnapshot.forEach((doc) => {
      if (doc.id === currentUser?.uid) return;
      usersData.push({ ...doc.data(), userId: doc.id } as UserData);
    });
    // filter the users that are not already in a chat with the currentUser
    // const filteredUsers = await fetchFilteredUsers();
    // fetchFilteredUsers().then((filteredUsers) => {
    //   console.log("Filtered Users:", filteredUsers);
    // });
    // setUsers(
    //   usersData.map(
    //     (userId) => usersData.find((user) => user.userId === userId)!
    //   )
    // );
    setUsers(usersData);
  };

  const createNewChat = async (user: UserData) => {
    if (!currentUser) return;
    console.log(userData, "userData");

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
    console.log(existingChat, "existingChat");

    if (existingChat) {
      navigation.navigate("PrivateChat", {
        chatId: existingChat.chatId,
        chatName: existingChat.displayName,
      });
    } else {
      console.log("Creating new chat");
      const newChatId = await createChat(currentUser.uid, {
        users: [currentUser.uid, user.userId],
        userNames: [userData.firstLast, user.firstLast],
        //   createdAt: serverTimestamp(),
        //   createdBy: currentUser.uid,
        isGroupChat: false,
        //   latestMessageText: "",
        //   updatedAt: serverTimestamp(),
        //   updatedBy: currentUser.uid,
      });

      // // Create a new chat
      // const newChatRef = doc(collection(dbFirestore, "chats"));
      // await setDoc(newChatRef, {
      //   users: [currentUser.uid, user.userId],
      //   usersNames: [currentUser.firstLast, user.firstLast],
      //   createdAt: serverTimestamp(),
      //   createdBy: currentUser.uid,
      //   isGroupChat: false,
      //   latestMessageText: "",
      //   updatedAt: serverTimestamp(),
      //   updatedBy: currentUser.uid,
      // });

      // // navigation.navigate("Chat", { chatId: newChatRef.id });
      navigation.navigate("PrivateChat", { chatId: newChatId });
    }
  };
  return (
    <PageContainer>
      <Input
        style={{ width: "100%", alignSelf: "center", margin: 10 }}
        alignContent="center"
        // textAlign="center"
      >
        <InputField
          placeholder="Search"
          onChangeText={(text) => setSearchText(text)}
          value={searchText}
        />
      </Input>
      <FlatList
        data={filteredUsers}
        renderItem={({ item }) => (
          <UserCard user={item} onPress={() => createNewChat(item)} />
        )}
        keyExtractor={(item) => item.userId}
      />
    </PageContainer>
  );
};

export default NewChatScreen;
