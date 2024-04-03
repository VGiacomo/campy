import {
  Button,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { NavigationProp } from "@react-navigation/native";
import { auth, dbFirestore } from "../../firebaseConfig";
import {
  getDocs,
  collection,
  addDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import SubmitButton from "../components/SubmitButton";
import PostCard from "../components/PostCard";
import { AddIcon, Fab, FabIcon, FabLabel } from "@gluestack-ui/themed";
import PageContainer from "../components/PageContainer";
import { Post } from "../utils/store/types";

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const FeedScreen = ({ navigation }: RouterProps) => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const todoRef = collection(dbFirestore, "posts");

    const subscriber = onSnapshot(todoRef, {
      next: (snapshot) => {
        const posts: Post[] = [];
        snapshot.docs.forEach((doc) => {
          posts.push({
            id: doc.id,
            title: doc.data().title,
            content: doc.data().text,
            createdAt: doc.data().createdAt,
            authorId: doc.data().authorId,
            likesIds: doc.data().likesIds,
            commentsIds: doc.data().commentsIds,
          });
        });
        posts.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
        setPosts(posts);
      },
    });

    // // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  const renderPosts = ({ item }: any) => {
    const ref = doc(dbFirestore, `posts/${item.id}`);
    console.log(item, "item");

    // const toggleDone = async () => {
    //   updateDoc(ref, { done: !item.done });
    // };

    // const deleteItem = async () => {
    //   deleteDoc(ref);
    // };

    return (
      <PostCard
        post={item}
        navigateToPostDetails={() => navigation.navigate("PostDetails", item)}
      />
    );
  };

  return (
    <PageContainer>
      <Fab
        size="md"
        placement="bottom right"
        isHovered={false}
        isDisabled={false}
        isPressed={false}
        onPress={() => navigation.navigate("CreatePost")}
      >
        <FabIcon as={AddIcon} mr="$1" />
        <FabLabel>New Post</FabLabel>
      </Fab>

      <ScrollView>
        <View style={styles.container}>
          {/* <SubmitButton
          title="Create Post"
          onPress={() => navigation.navigate("CreatePost")}
        /> */}
          {posts.length > 0 ? (
            <View>
              <FlatList
                data={posts}
                renderItem={renderPosts}
                keyExtractor={(todo) => todo.id}
              />
            </View>
          ) : (
            <Text>No posts yet</Text>
          )}
        </View>
      </ScrollView>
    </PageContainer>
  );
};

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
});

export default FeedScreen;
