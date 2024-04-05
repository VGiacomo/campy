import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { NavigationProp } from "@react-navigation/native";
import PostCard from "../components/PostCard";
import { useAppSelector } from "../utils/store";
import { Post } from "../utils/store/types";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { dbFirestore } from "../../firebaseConfig";
import {
  FlatList,
  Input,
  InputField,
  InputIcon,
  InputSlot,
  ScrollView,
} from "@gluestack-ui/themed";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "@gluestack-ui/themed";
import CommentCard from "../components/CommentCard";
interface RouterProps {
  navigation: NavigationProp<any, any>;
}
const PostDetailsScreen = ({ navigation }: RouterProps) => {
  let selectedPost = useAppSelector((state) => state.post.postData);
  const [posts, setPosts] = useState<Post[]>([]);
  let upToDatePost = posts.find((post) => post.id === selectedPost!.id);
  const [newComment, setNewComment] = useState("");
  const loggedInUser = useAppSelector((state) => state.auth.userData);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const postsRef = collection(dbFirestore, "posts");
    const getComments = async (postId: string) => {
      const q = query(
        collection(dbFirestore, "comments"),
        where("postId", "==", postId)
      );

      const querySnapshot = await getDocs(q);
      const postComments: Comment[] = [];
      querySnapshot.forEach((doc) => {
        postComments.push(doc.data() as Comment);
      });
      setComments(postComments);
    };

    const subscriber = onSnapshot(postsRef, {
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
        console.log(selectedPost!.id, "upToDatePost");
        getComments(selectedPost!.id);
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
      text: newComment,
      createdAt: new Date().toISOString(),
      postId: upToDatePost!.id,
    });
    const postRef = doc(dbFirestore, "posts", upToDatePost!.id);
    await updateDoc(postRef, {
      commentsIds: arrayUnion(docRef.id),
    });
    console.log("Document written with ID: ", docRef.id, docRef);
  };
  const renderComments = ({ item }: any) => {
    // const ref = doc(dbFirestore, `posts/${item.id}`);
    // console.log(item, "item");

    // const toggleDone = async () => {
    //   updateDoc(ref, { done: !item.done });
    // };

    // const deleteItem = async () => {
    //   deleteDoc(ref);
    // };

    return (
      <CommentCard
        comment={item}
        navigateToPostDetails={() => {}}
        parentScreen={"PostDetails"}
      />
    );
  };
  return (
    <View style={styles.container}>
      {upToDatePost ? (
        <PostCard
          post={upToDatePost}
          navigateToPostDetails={() => {}}
          parentScreen={"PostDetails"}
        />
      ) : (
        <Text>No post found</Text>
      )}
      <ScrollView>
        <View style={styles.container}>
          {/* <SubmitButton
          title="Create Post"
          onPress={() => navigation.navigate("CreatePost")}
        /> */}
          {posts.length > 0 ? (
            <SafeAreaView style={{ flex: 1 }}>
              <FlatList
                data={comments}
                renderItem={renderComments}
                // keyExtractor={(item) => item.id}
              />
            </SafeAreaView>
          ) : (
            <Text>No comments yet</Text>
          )}
        </View>
      </ScrollView>
      <Input style={{ width: 200, alignSelf: "center" }}>
        <InputField
          type="text"
          placeholder="Write a comment"
          onChangeText={setNewComment}
          value={newComment}
        />
        <InputSlot pr="$3">
          {/* EyeIcon, EyeOffIcon are both imported from 'lucide-react-native' */}
          {/* <InputIcon
            as={comment !== "" && <MaterialIcons name="send" size={24} />}
          /> */}
          {newComment !== "" ? (
            <MaterialIcons
              name="send"
              size={24}
              onPress={handleCreateComment}
            />
          ) : null}
        </InputSlot>
      </Input>
    </View>
  );
};

export default PostDetailsScreen;

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
