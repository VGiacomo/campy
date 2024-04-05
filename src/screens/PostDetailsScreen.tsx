import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { NavigationProp } from "@react-navigation/native";
import PostCard from "../components/PostCard";
import { useAppSelector } from "../utils/store";
import { Post } from "../utils/store/types";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { dbFirestore } from "../../firebaseConfig";
import { Input, InputField, InputIcon, InputSlot } from "@gluestack-ui/themed";
import { MaterialIcons } from "@expo/vector-icons";
interface RouterProps {
  navigation: NavigationProp<any, any>;
}
const PostDetailsScreen = ({ navigation }: RouterProps) => {
  let selectedPost = useAppSelector((state) => state.post.postData);
  const [posts, setPosts] = useState<Post[]>([]);
  let upToDatePost = posts.find((post) => post.id === selectedPost!.id);
  const [comment, setComment] = useState("");
  const loggedInUser = useAppSelector((state) => state.auth.userData);

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

  const handleCreateComment = async () => {
    console.log(loggedInUser, "loggedInUser");
    const docRef = await addDoc(collection(dbFirestore, "comments"), {
      authorId: loggedInUser?.userId,
      authorImageUrl: loggedInUser?.profilePicture,
      authorName: loggedInUser?.firstLast,
      likesIds: [],
      repliesIds: [],
      text: comment,
      createdAt: new Date().toISOString(),
      postId: upToDatePost!.id,
    });
    console.log("Document written with ID: ", docRef.id, docRef);
  };

  return (
    <View style={{ flex: 1 }}>
      {upToDatePost && (
        <PostCard
          post={upToDatePost}
          navigateToPostDetails={() => {}}
          parentScreen={"PostDetails"}
        />
      )}
      <Input style={{ width: 200, alignSelf: "center" }}>
        <InputField
          type="text"
          placeholder="Write a comment"
          onChangeText={setComment}
          value={comment}
        />
        <InputSlot pr="$3">
          {/* EyeIcon, EyeOffIcon are both imported from 'lucide-react-native' */}
          {/* <InputIcon
            as={comment !== "" && <MaterialIcons name="send" size={24} />}
          /> */}
          {comment !== "" && (
            <MaterialIcons
              name="send"
              size={24}
              onPress={handleCreateComment}
            />
          )}
        </InputSlot>
      </Input>
    </View>
  );
};

export default PostDetailsScreen;

const styles = StyleSheet.create({});
