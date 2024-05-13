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
  Image,
  VStack,
} from "@gluestack-ui/themed";
import { doc, updateDoc } from "firebase/firestore";
import { auth, dbFirestore } from "../../firebaseConfig";
import { Post } from "../utils/store/types";
import { getUserData } from "../utils/actions/authActions";
import { useAppDispatch } from "../utils/store";
import { setStatePost } from "../utils/store/postSlice";
import MenuButton from "./MenuButton";
// type Icon = typeof FontAwesome | typeof MaterialCommunityIcons | typeof MaterialIcons | typeof Ionicons | typeof Feather;

interface PostCardProps {
  post: Post;
  navigateToPostDetails: () => void;
  parentScreen: string;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  navigateToPostDetails,
  parentScreen,
}) => {
  const [authorData, setAuthorData] = useState<any>(null);
  const currentUserId = auth.currentUser!.uid;
  const dispatch = useAppDispatch();

  useEffect(() => {
    const userData = async () => {
      const data = await getUserData(post.authorId);
      data && setAuthorData(data);
    };
    userData();
  }, []);

  const iLikeIt = () => {
    return post.likesIds.includes(currentUserId);
  };

  const onLikePost = async () => {
    const postRef = doc(dbFirestore, "posts", post.id);
    let newLikesIds: string[] = [];

    if (iLikeIt()) {
      // uid already exists in likesIds, remove it
      newLikesIds = post.likesIds.filter((id) => id !== currentUserId);
    } else {
      // uid not found, just add it
      newLikesIds = [...post.likesIds, currentUserId];
    }
    await updateDoc(postRef, {
      likesIds: newLikesIds,
    });
  };

  const navigateToComments = () => {
    dispatch(setStatePost(post));
    navigateToPostDetails();
  };

  if (!authorData) return null;
  return (
    <Card
      // p="$5"
      borderRadius={5}
      shadowOffset={{ width: 0, height: 1 }}
      shadowColor="$grey300"
      marginVertical={5}
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
            {new Date(post.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </Text>
        </VStack>
        {parentScreen === "Feed" && auth.currentUser?.uid === post.authorId && (
          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <MenuButton item={post} loggedInUserId={currentUserId} />
          </View>
        )}
      </HStack>
      {post.imageUrl && (
        <Image
          alt="post image"
          size="lg"
          width="100%"
          borderRadius={5}
          source={{
            uri: post.imageUrl,
          }}
        />
      )}
      <Heading
        //   size="md"
        fontFamily="$heading"
        //    mb="$4"
      >
        {post.title}
      </Heading>
      <Text>{post.content}</Text>
      <HStack space="md">
        <Pressable
          onPress={() => {
            onLikePost();
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
              {post.likesIds.length}
            </Text>
          </HStack>
        </Pressable>
        <Pressable
          onPress={() => {
            parentScreen === "Feed" ? navigateToComments() : {};
          }}
        >
          <Foundation name="comments" size={24} />
        </Pressable>
      </HStack>
    </Card>
  );
};

export default PostCard;
