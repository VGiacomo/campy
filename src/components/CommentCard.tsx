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
  InputField,
  InputSlot,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import { doc, updateDoc } from "firebase/firestore";
import { auth, dbFirestore } from "../../firebaseConfig";
import { Comment } from "../utils/store/types";
import { getUserData } from "../utils/actions/authActions";
import { useAppDispatch } from "../utils/store";
import MenuButton from "./MenuButton";
import { FontAwesome } from "@expo/vector-icons";
import { Input } from "@gluestack-ui/themed";
import { deleteComment, updateComment } from "../utils/actions/commentActions";

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
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [commentText, setCommentText] = useState<string>(comment.text);
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
    return comment.likesIds.includes(currentUserId);
  };

  const onEditComment = () => {
    const upToDateComment = {
      ...comment,
      text: commentText,
    };
    updateComment(comment.id, upToDateComment);
    setIsEditable(false);
  };

  const onLikeComment = async () => {
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
              uri: authorData?.profilePicture,
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
        {currentUserId === comment.authorId && (
          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <MenuButton item={comment} loggedInUserId={currentUserId} />
          </View>
        )}
      </HStack>
      <Heading>
        <HStack space="md" marginBottom={3} display="flex">
          {isEditable ? (
            <Input
              variant="outline"
              size="md"
              style={{ flex: 1 }} // Ensure it takes the correct space
            >
              <InputField
                type="text"
                placeholder="Your comment"
                onChangeText={(text) => setCommentText(text)}
                value={commentText}
                autoFocus // Focus when editable
              />
              <InputSlot pr="$3">
                <FontAwesome
                  name="save"
                  size={24}
                  color="black"
                  onPress={onEditComment}
                />
              </InputSlot>
            </Input>
          ) : (
            <Text style={{ flex: 1 }}>{commentText}</Text> // Display comment text when not editable
          )}
          {!isEditable && (
            <FontAwesome
              name="edit"
              size={24}
              color="black"
              onPress={() => setIsEditable(true)}
            />
          )}
        </HStack>
      </Heading>
      <HStack space="md">
        <Pressable
          onPress={() => {
            onLikeComment();
          }}
          style={{ alignSelf: "center" }}
        >
          <HStack space="md">
            <Foundation
              name="like"
              size={24}
              color={iLikeIt() ? "blue" : "black"}
            />
            <Text
              style={{
                color: iLikeIt() ? "blue" : "black",
                alignSelf: "center",
              }}
            >
              {comment.likesIds.length}
            </Text>
          </HStack>
        </Pressable>
      </HStack>
    </Card>
  );
};

export default CommentCard;
