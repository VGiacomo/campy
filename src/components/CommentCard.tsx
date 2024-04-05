import React, { useEffect, useState } from "react";
import { View, Pressable } from "react-native";
import { Foundation } from "@expo/vector-icons";

import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Card,
  HStack,
  Heading,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import { doc, updateDoc } from "firebase/firestore";
import { auth, dbFirestore } from "../../firebaseConfig";
import { Comment, Post } from "../utils/store/types";
import { getUserData } from "../utils/actions/authActions";
import { useAppDispatch } from "../utils/store";
import { setStatePost } from "../utils/store/postSlice";
// type Icon = typeof FontAwesome | typeof MaterialCommunityIcons | typeof MaterialIcons | typeof Ionicons | typeof Feather;

interface CommentCardProps {
  comment: Comment;
  navigateToPostDetails: () => void;
  parentScreen: string;
}

const CommentCard: React.FC<CommentCardProps> = ({
  comment: comment,
  navigateToPostDetails,
  parentScreen,
}) => {
  const [authorData, setAuthorData] = useState<any>(null);
  const currentUserId = auth.currentUser!.uid;
  const dispatch = useAppDispatch();

  useEffect(() => {
    const userData = async () => {
      const data = await getUserData(comment.authorId);
      data && setAuthorData(data);
    };
    userData();
  }, []);

  const iLikeIt = () => {
    return comment.likesIds.includes(currentUserId!);
  };

  const onLikePost = async () => {
    const commentRef = doc(dbFirestore, "comments", comment.id);
    let newLikesIds: string[] = [];

    if (iLikeIt()) {
      // uid already exists in likesIds, remove it
      newLikesIds = comment.likesIds.filter((id) => id !== currentUserId);
    } else {
      // uid not found, just add it
      newLikesIds = [...comment.likesIds, currentUserId];
    }
    await updateDoc(commentRef, {
      likesIds: newLikesIds,
    });
  };

  if (!authorData) return null;
  return (
    <Card
      // p="$5"
      borderRadius={3}
      maxWidth={460}
      //   m="$3"
    >
      <HStack space="md" marginBottom={3}>
        <Avatar size="sm" bg="$backgroundLight600">
          <AvatarFallbackText>{authorData?.firstLast}</AvatarFallbackText>
          <AvatarImage
            alt="avatar"
            source={{
              uri:
                authorData?.profilePicture ||
                "https://randomuser.me/api/portraits/lego/1.jpg",
            }}
          />
        </Avatar>
        <VStack>
          <Heading size="sm">{authorData?.firstLast}</Heading>
          <Text size="sm">
            {new Date(comment.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </Text>
        </VStack>
      </HStack>
      <Heading
        //   size="md"
        fontFamily="$heading"
        //    mb="$4"
      >
        {comment.text}
      </Heading>
      <HStack space="md">
        <Pressable
          onPress={() => {
            onLikePost();
          }}
        >
          <Foundation
            name="like"
            size={24}
            color={iLikeIt() ? "blue" : "black"}
          />
          <View>
            <Text>{comment.likesIds.length}</Text>
          </View>
        </Pressable>
      </HStack>
    </Card>
  );
};

export default CommentCard;
