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
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { dbFirestore, auth } from "../../firebaseConfig";
import { Message } from "../utils/store/types";

const ChatScreen = () => {
  const route = useRoute();
  const { chatId } = route.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const messagesQuery = query(
      collection(dbFirestore, `messages/${chatId}/messages`),
      orderBy("sentAt", "asc")
    );
    const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
      const messagesList = [] as Message[];
      querySnapshot.forEach((doc) => {
        messagesList.push({ ...doc.data(), id: doc.id });
      });
      setMessages(messagesList);
    });

    return () => unsubscribe();
  }, [chatId]);

  const sendMessage = async () => {
    if (newMessage.trim() === "") return;

    await addDoc(collection(dbFirestore, `messages/${chatId}/messages`), {
      text: newMessage,
      sentAt: serverTimestamp(),
      sentBy: auth.currentUser?.uid,
    });

    setNewMessage("");
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View style={styles.message}>
            <Text>{item.text}</Text>
          </View>
        )}
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
  message: {
    padding: 10,
    backgroundColor: "#f1f1f1",
    borderRadius: 5,
    marginVertical: 5,
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
