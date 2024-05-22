import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  StyleSheet,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { dbFirestore, auth } from "../../firebaseConfig";

const ChatScreen = ({ navigation }) => {
  const route = useRoute();
  const { chatId, chatName } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [title, setTitle] = useState(chatName || "Chat");

  useEffect(() => {
    if (!chatName) {
      fetchChatTitle();
    }

    const messagesQuery = query(
      collection(dbFirestore, "messages", chatId, "messages"),
      orderBy("sentAt", "asc")
    );
    const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
      const messagesList = [];
      querySnapshot.forEach((doc) => {
        messagesList.push({ ...doc.data(), id: doc.id });
      });
      setMessages(messagesList);
    });

    return () => unsubscribe();
  }, [chatId]);

  const fetchChatTitle = async () => {
    const chatDoc = await getDoc(doc(dbFirestore, "chats", chatId));
    const chatData = chatDoc.data();
    if (chatData) {
      const otherUserId = chatData.users.find(
        (id) => id !== auth.currentUser.uid
      );
      const otherUserDoc = await getDoc(doc(dbFirestore, "users", otherUserId));
      const otherUserData = otherUserDoc.data();
      if (otherUserData) {
        const otherUserName = otherUserData.firstLast;
        setTitle(otherUserName);
        navigation.setOptions({ title: otherUserName });
      }
    }
  };

  const sendMessage = async () => {
    if (newMessage.trim() === "") return;

    await addDoc(collection(dbFirestore, "messages", chatId, "messages"), {
      text: newMessage,
      sentAt: serverTimestamp(),
      sentBy: auth.currentUser?.uid,
    });

    setNewMessage("");

    // Update the latest message in the chat document
    await setDoc(
      doc(dbFirestore, "chats", chatId),
      {
        latestMessageText: newMessage,
        updatedAt: serverTimestamp(),
        updatedBy: auth.currentUser?.uid,
      },
      { merge: true }
    );
  };

  const formatTimestampToTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(
      timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
    );
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const renderItem = ({ item }) => {
    const isCurrentUser = item.sentBy === auth.currentUser.uid;
    return (
      <View
        style={[
          styles.messageContainer,
          isCurrentUser
            ? styles.messageContainerRight
            : styles.messageContainerLeft,
        ]}
      >
        <View
          style={[
            styles.message,
            isCurrentUser ? styles.messageRight : styles.messageLeft,
          ]}
        >
          <Text>{item.text}</Text>
          <Text style={styles.timestamp}>
            {formatTimestampToTime(item.sentAt)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message"
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  messageContainer: {
    flexDirection: "row",
    marginVertical: 5,
  },
  messageContainerRight: {
    justifyContent: "flex-end",
  },
  messageContainerLeft: {
    justifyContent: "flex-start",
  },
  message: {
    maxWidth: "70%",
    padding: 10,
    borderRadius: 10,
  },
  messageRight: {
    backgroundColor: "#DCF8C6",
    alignSelf: "flex-end",
  },
  messageLeft: {
    backgroundColor: "#ECECEC",
    alignSelf: "flex-start",
  },
  timestamp: {
    fontSize: 10,
    color: "#888",
    marginTop: 5,
    textAlign: "right",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 10,
  },
});
