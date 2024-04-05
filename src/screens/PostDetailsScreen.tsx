import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { NavigationProp } from "@react-navigation/native";
import PostCard from "../components/PostCard";
import { useAppSelector } from "../utils/store";
import { Post } from "../utils/store/types";
import { collection, onSnapshot } from "firebase/firestore";
import { dbFirestore } from "../../firebaseConfig";
interface RouterProps {
  navigation: NavigationProp<any, any>;
}
const PostDetailsScreen = ({ navigation }: RouterProps) => {
  let selectedPost = useAppSelector((state) => state.post.postData);
  const [posts, setPosts] = useState<Post[]>([]);
  let newCurrentPost = posts.find((post) => post.id === selectedPost!.id);

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

  return (
    <View>
      {newCurrentPost && (
        <PostCard
          post={newCurrentPost}
          navigateToPostDetails={() => {}}
          parentScreen={"PostDetails"}
        />
      )}
    </View>
  );
};

export default PostDetailsScreen;

const styles = StyleSheet.create({});
