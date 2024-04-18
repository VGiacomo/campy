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
import ImagePicker from "../components/ImagePicker";
import { Image } from "@gluestack-ui/themed";
import { createPost, updatePost } from "../utils/actions/postActions";
import { useAppSelector } from "../utils/store";
import { useDispatch } from "react-redux";
import { setStatePost } from "../utils/store/postSlice";

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const CreatePostScreen = ({ navigation }: RouterProps) => {
  const [postTitle, setPostTitle] = useState("");
  const [postMessage, setPostMessage] = useState("");
  const [postImageUrl, setPostImageUrl] = useState("");
  const selectedPost = useAppSelector((state) => state.post.postData);
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedPost) {
      setPostTitle(selectedPost?.title);
      setPostMessage(selectedPost.content);
      setPostImageUrl(selectedPost?.imageUrl || "");
    }
  }, []);

  const handleCreatePost = async () => {
    if (!selectedPost) {
      await createPost(auth.currentUser!.uid, {
        title: postTitle,
        content: postMessage,
        imageUrl: postImageUrl,
      });

      navigation.goBack();
    } else {
      await updatePost({
        ...selectedPost,
        title: postTitle,
        content: postMessage,
        imageUrl: postImageUrl,
      });

      navigation.goBack();
    }
    dispatch(setStatePost(null));
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
        <ImagePicker setPostImageUrl={setPostImageUrl} />
        {postImageUrl && (
          <Image
            alt="post image"
            source={{ uri: postImageUrl }}
            style={styles.image}
          />
        )}

        <SubmitButton
          title={!selectedPost ? "Publish Post" : "Update Post"}
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
  image: {
    width: 200,
    height: 200,
    marginVertical: 10,
    alignSelf: "center",
  },
});

export default CreatePostScreen;
