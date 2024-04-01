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

const CreatePostScreen = ({ navigation }: RouterProps) => {
  const [postTitle, setPostTitle] = useState("");
  const [postMessage, setPostMessage] = useState("");

  const handleCreatePost = async () => {
    const docRef = await addDoc(collection(dbFirestore, "posts"), {
      title: postTitle,
      text: postMessage,
      createdAt: new Date().toISOString(),
      authorId: auth.currentUser?.uid,
    });
    console.log("Document written with ID: ", docRef.id);

    navigation.goBack();
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <TextInput
          placeholder="Post Title"
          style={styles.input}
          value={postTitle}
          onChangeText={setPostTitle}
          multiline
        />
        <TextInput
          placeholder="What's on your mind?"
          style={styles.input}
          value={postMessage}
          onChangeText={setPostMessage}
          multiline
        />
        <SubmitButton
          title="Publish Post"
          onPress={handleCreatePost}
          disabled={postTitle == "" || postMessage == ""}
        />
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

export default CreatePostScreen;
