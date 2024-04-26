import { ScrollView, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { NavigationProp } from "@react-navigation/native";
import { auth, dbFirestore, storage } from "../../firebaseConfig";
import { ref } from "firebase/storage";
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
  const [uploading, setUploading] = useState(false); // New state for upload status
  const selectedPost = useAppSelector((state) => state.post.postData);
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedPost) {
      setPostTitle(selectedPost?.title);
      setPostMessage(selectedPost.content);
      setPostImageUrl(selectedPost?.imageUrl || "");
    }
  }, [selectedPost]); // Added dependency to re-run if selectedPost changes

  const handleCreatePost = async () => {
    try {
      if (postImageUrl) {
        // If there's an image to upload, upload it and get the download URL
        // const downloadUrl = await handleImageUpload(postImageUrl);
        // setPostImageUrl(downloadUrl); // Set the download URL as the postImageUrl
      }

      if (!selectedPost) {
        // Creating a new post
        await createPost(auth.currentUser!.uid, {
          title: postTitle,
          content: postMessage,
          imageUrl: postImageUrl,
        });
      } else {
        // Updating an existing post
        await updatePost({
          ...selectedPost,
          title: postTitle,
          content: postMessage,
          imageUrl: postImageUrl,
        });
      }

      navigation.goBack(); // Go back to the previous screen
      dispatch(setStatePost(null)); // Reset the state
    } catch (error) {
      console.error("Error creating/updating post:", error);
    }
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
        <ImagePicker
          setPostImageUrl={setPostImageUrl}
          postImageUrl={postImageUrl}
          setUploading={setUploading}
          userId={auth.currentUser!.uid}
        />
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
          disabled={postTitle === "" || postMessage === "" || uploading}
        />
      </View>
    </ScrollView>
  );
};

export default CreatePostScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginVertical: 20,
  },
});
