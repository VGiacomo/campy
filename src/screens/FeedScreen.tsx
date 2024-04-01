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

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

export interface Post {
  id: string;
  title: string;
  text: string;
  imageUrl?: string;
  createdAt: string;
  // updatedAt: string;
  authorId: string;
}

const FeedScreen = ({ navigation }: RouterProps) => {
  const [post, setPost] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);

  // useEffect(() => {
  //   fetchData();
  // }, []);

  useEffect(() => {
    const todoRef = collection(dbFirestore, "posts");

    const subscriber = onSnapshot(todoRef, {
      next: (snapshot) => {
        const posts: Post[] = [];
        snapshot.docs.forEach((doc) => {
          posts.push({
            id: doc.id,
            title: doc.data().title,
            text: "",
            createdAt: doc.data().createdAt,
            authorId: doc.data().authorId,
          });
        });

        setPosts(posts);
      },
    });

    // // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  const renderPosts = ({ item }: any) => {
    const ref = doc(dbFirestore, `posts/${item.id}`);

    // const toggleDone = async () => {
    //   updateDoc(ref, { done: !item.done });
    // };

    // const deleteItem = async () => {
    //   deleteDoc(ref);
    // };

    return (
      <View>
        <Text>{item.title}</Text>
      </View>
    );
  };
  // const handleCreatePost = async () => {
  //   const docRef = await addDoc(collection(dbFirestore, "posts"), {
  //     title: post,
  //     text: post,
  //     createdAt: new Date().toISOString(),
  //     authorId: auth.currentUser?.uid,
  //   });
  //   console.log("Document written with ID: ", docRef.id);
  // };

  return (
    <ScrollView>
      <View style={styles.container}>
        <SubmitButton
          title="Create Post"
          onPress={() => navigation.navigate("CreatePost")}
        />
        {posts.length > 0 && (
          <View>
            <FlatList
              data={posts}
              renderItem={renderPosts}
              keyExtractor={(todo) => todo.id}
            />
          </View>
        )}
      </View>
    </ScrollView>
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
