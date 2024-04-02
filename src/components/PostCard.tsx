import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  //   Text,
  TextInput,
  View,
  TextInputProps,
  Pressable,
} from "react-native";
import {
  FontAwesome,
  Foundation,
  MaterialCommunityIcons,
  MaterialIcons,
  Ionicons,
  Feather,
} from "@expo/vector-icons";

import { colors } from "../constants/colors";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Card,
  HStack,
  Heading,
  Text,
  Icon,
  Image,
  Link,
  LinkText,
  MenuItem,
  StarIcon,
  VStack,
} from "@gluestack-ui/themed";
import { doc, updateDoc } from "firebase/firestore";
import { auth, dbFirestore } from "../../firebaseConfig";
import { Post } from "../utils/store/types";
import { getUserData } from "../utils/actions/authActions";

// type Icon = typeof FontAwesome | typeof MaterialCommunityIcons | typeof MaterialIcons | typeof Ionicons | typeof Feather;

const PostCard = (props: Post) => {
  const [authorData, setAuthorData] = useState<any>();
  useEffect(() => {
    const userData = async () => {
      const data = await getUserData(props.authorId);
      data && setAuthorData(data);
    };
    userData();
  }, []);

  const iLikeIt = () => {
    const uid = auth.currentUser?.uid;
    return props.likesIds.includes(uid!);
  };

  const onLikePost = async () => {
    const postRef = doc(dbFirestore, "posts", props.id);
    console.log(props.likesIds, "likesIds");
    console.log(props.id, "id");
    console.log(auth.currentUser, "currentUser");
    const uid = auth.currentUser?.uid;
    let newLikesIds = [];

    if (iLikeIt()) {
      // uid already exists in likesIds, remove it
      newLikesIds = props.likesIds.filter((id) => id !== uid);
    } else {
      // uid not found, just add it
      newLikesIds = [...props.likesIds, uid];
    }
    await updateDoc(postRef, {
      likesIds: newLikesIds,
    });
  };

  return (
    <Card
      // p="$5"
      borderRadius={3}
      maxWidth={460}
      //   m="$3"
    >
      <HStack space="md" marginBottom={3}>
        <Avatar>
          <AvatarFallbackText>{authorData?.firstLast}</AvatarFallbackText>
          <AvatarImage
            alt="image"
            source={{
              uri: authorData?.profilePicture,
            }}
          />
        </Avatar>
        <VStack>
          <Heading size="sm">{authorData?.firstLast}</Heading>
          <Text size="sm">
            {new Intl.DateTimeFormat("en-GB", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            }).format(new Date(props.createdAt))}
          </Text>
        </VStack>
      </HStack>
      <Image
        alt="image"
        mb="$1"
        h={240}
        width={300}
        borderRadius={5}
        source={{
          uri: "https://images.unsplash.com/photo-1529693662653-9d480530a697?q=80&w=2831&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        }}
      />
      <HStack space="md" alignItems="center">
        <Heading
          //   size="md"
          fontFamily="$heading"
          //    mb="$4"
        >
          {props.title}
        </Heading>
      </HStack>
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
          {props.likesIds.length}
        </Pressable>
        <Pressable
          onPress={() => {
            console.log("hello");
          }}
        >
          <Foundation name="comments" size={24} />
        </Pressable>
      </HStack>
    </Card>
  );
};

export default PostCard;
