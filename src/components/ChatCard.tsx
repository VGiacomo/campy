import {
  VStack,
  HStack,
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Heading,
  Pressable,
} from "@gluestack-ui/themed";
import React from "react";
import { ChatData } from "../utils/store/types";
import { View, Text, StyleSheet } from "react-native";
import { getTimeAgoOrTime } from "../utils/helperFns";

// add a prop type here
interface ChatCardProps {
  chat: {
    id: string;
    firstLast: string;
    displayName: string;
    chatImage: string;
    latestMessageText: string;
    updatedAt: string;
  };
  onPress: () => void;
}

const ChatCard = ({ chat, onPress }: ChatCardProps) => {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <VStack style={styles.container} space="2xl">
        <HStack space="md">
          <Avatar>
            <AvatarFallbackText>{chat.displayName}</AvatarFallbackText>
            <AvatarImage
              alt="Avatar image"
              source={{
                uri: chat.chatImage,
              }}
            />
          </Avatar>
          <VStack>
            <Heading size="md">{chat.displayName}</Heading>
            <Text>{chat.latestMessageText}</Text>
          </VStack>
          <Text>{getTimeAgoOrTime(chat.updatedAt.toString())}</Text>
        </HStack>
      </VStack>
    </Pressable>
  );
};

export default ChatCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  card: {
    padding: 10,
    margin: 5,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
  },
  chatname: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
