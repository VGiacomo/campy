import {
  VStack,
  HStack,
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Heading,
} from "@gluestack-ui/themed";
import React from "react";
import { UserData } from "../utils/store/types";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

// add a prop type here
interface UserCardProps {
  user: UserData;
  onPress: () => void;
}
const UserCard = ({ user, onPress }: UserCardProps) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <VStack style={styles.container} space="2xl">
        <HStack space="md">
          <Avatar>
            <AvatarFallbackText>{user.firstLast}</AvatarFallbackText>
            <AvatarImage
              source={{
                uri: user.profilePicture,
              }}
            />
          </Avatar>
          <VStack>
            <Heading size="sm">{user.firstLast}</Heading>
            {/* <Text size="sm">Nursing Assistant</Text> */}
          </VStack>
        </HStack>
      </VStack>
    </TouchableOpacity>
  );
};

export default UserCard;

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
  username: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
