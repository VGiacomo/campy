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
import { Input, InputField } from "@gluestack-ui/themed";

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const CreatePostScreen = ({ navigation }: RouterProps) => {
  const [postTitle, setPostTitle] = useState("");
  const [postMessage, setPostMessage] = useState("");

  const handleCreatePost = async () => {
    const docRef = await addDoc(collection(dbFirestore, "posts"), {
      title: postTitle,
      text: postMessage,
      createdAt: new Date().toISOString(),
      authorId: auth.currentUser!.uid,
      likesIds: [],
    });
    console.log("Document written with ID: ", docRef.id, docRef);

    navigation.goBack();
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Input
          variant="outline"
          size="md"
          isDisabled={false}
          isInvalid={false}
          isReadOnly={false}
        >
          <InputField
            placeholder="Post Title"
            onChangeText={setPostTitle}
            value={postTitle}
          />
        </Input>
        <Input style={{ height: 200, marginVertical: 10 }}>
          <InputField
            style={{ marginVertical: 10 }}
            multiline
            maxLength={300}
            placeholder="What's on your mind?"
            onChangeText={setPostMessage}
            value={postMessage}
          />
        </Input>
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
