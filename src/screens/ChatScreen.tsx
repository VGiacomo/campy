import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from "react-native";
import { NavigationProp, useRoute } from "@react-navigation/native";
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
import { Fab, Pressable } from "@gluestack-ui/themed";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../constants";
import {
  convertMillisecondsToDuration,
  getTimeAgoOrTime,
} from "../utils/helperFns";
import AudioRecording from "../components/AudioRecording";
import { Audio } from "expo-av";
import { Fontisto } from "@expo/vector-icons";
interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const ChatScreen = ({ navigation }: RouterProps) => {
  const route = useRoute();
  const { chatId, chatName } = route.params as {
    chatId: string;
    chatName?: string;
  };
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [title, setTitle] = useState(chatName || "Chat");
  const currentUser = auth.currentUser;
  const scrollViewRef = useRef();
  const [isAtBottom, setIsAtBottom] = useState(true);

  useEffect(() => {
    if (!chatName && currentUser) {
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
    console.log(chatName, "fetchChatTitle");
    const chatDoc = await getDoc(doc(dbFirestore, "chats", chatId));
    const chatData = chatDoc.data();
    if (chatData) {
      const otherUserId = chatData.users.find(
        (id: string) => id !== currentUser!.uid
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
      sentAt: new Date().toISOString(),
      sentBy: currentUser?.uid,
    });

    setNewMessage("");

    // Update the latest message in the chat document
    await setDoc(
      doc(dbFirestore, "chats", chatId),
      {
        latestMessageText: newMessage,
        updatedAt: new Date().toISOString(),
        updatedBy: currentUser?.uid,
      },
      { merge: true }
    );
  };

  const playAudio = async (uri: string) => {
    try {
      console.log(`Playing audio from URI: ${uri}`);
      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true }
      );
      await sound.playAsync();
    } catch (error) {
      console.error("Failed to play audio", error);
      Alert.alert("Error", "Failed to play audio. Please try again later.");
    }
  };

  const renderItem = ({ item }) => {
    const isCurrentUser = item.sentBy === currentUser!.uid;
    console.log(item, "item *********");
    if (item.downloadURL) {
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
            <Pressable
              style={styles.sendButton}
              onPress={() => playAudio(item.downloadURL)}
            >
              <Text>{convertMillisecondsToDuration(item.duration)}</Text>
              <MaterialCommunityIcons name="play" size={24} color="black" />
            </Pressable>
            <Text style={styles.timestamp}>
              {getTimeAgoOrTime(item.sentAt.toString())}
            </Text>
          </View>
        </View>
      );
    } else {
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
              {getTimeAgoOrTime(item.sentAt.toString())}
            </Text>
          </View>
        </View>
      );
    }
  };

  const scrollToBottom = () => {
    scrollViewRef.current.scrollToEnd({ animated: true });
  };

  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
    setIsAtBottom(isBottom);
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onContentSizeChange={scrollToBottom}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      {!isAtBottom && (
        <Fab
          bgColor={colors.lightPrimary}
          opacity={0.8}
          marginBottom={50}
          size="md"
          placement="bottom right"
          isHovered={false}
          isDisabled={false}
          isPressed={false}
          onPress={scrollToBottom}
        >
          <Fontisto name="angle-dobule-down" size={16} color="black" />
        </Fab>
      )}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message"
        />
        {!newMessage ? (
          <AudioRecording chatId={chatId} />
        ) : (
          <Pressable style={styles.sendButton} onPress={sendMessage}>
            <MaterialCommunityIcons
              name="send"
              aria-label="Send"
              size={24}
              color="black"
            />
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  sendButton: {
    padding: 10,
    backgroundColor: colors.primary,
    borderRadius: 10,
  },
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
