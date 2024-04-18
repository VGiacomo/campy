import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { NavigationProp } from "@react-navigation/native";
import PostCard from "../components/PostCard";
import { useAppSelector } from "../utils/store";
import { Comment, Post } from "../utils/store/types";
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
import { createComment } from "../utils/actions/commentActions";
interface RouterProps {
  navigation: NavigationProp<any, any>;
}
const PostDetailsScreen = ({ navigation }: RouterProps) => {
  let selectedPost = useAppSelector((state) => state.post.postData);
  const [upToDatePost, setUpToDatePost] = useState(selectedPost);
  // let upToDatePost = posts.find((post) => post.id === selectedPost!.id);
  const [newComment, setNewComment] = useState("");
  const loggedInUser = useAppSelector((state) => state.auth.userData);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const postsRef = collection(dbFirestore, "posts");

    const subscriberPosts = onSnapshot(postsRef, {
      next: (snapshot) => {
        const posts: Post[] = [];
        snapshot.docs.forEach((doc) => {
          posts.push({
            id: doc.id,
            title: doc.data().title,
            content: doc.data().text,
            imageUrl: doc.data().imageUrl,
            createdAt: doc.data().createdAt,
            authorId: doc.data().authorId,
            likesIds: doc.data().likesIds,
            commentsIds: doc.data().commentsIds,
          });
        });
        const changedPost = posts.find((post) => post.id === selectedPost!.id);
        setUpToDatePost(changedPost!);
        // console.log(upToDatePost, "upToDatePost");
        // getComments(selectedPost!.id);
      },
    });

    // // Unsubscribe from events when no longer in use
    return () => {
      subscriberPosts();
    };
  }, []);

  useEffect(() => {
    const commentsRef = collection(dbFirestore, "comments");

    const subscriberComments = onSnapshot(commentsRef, {
      next: (snapshot) => {
        const comments: Comment[] = [];
        snapshot.docs.forEach((doc) => {
          comments.push({
            id: doc.id,
            text: doc.data().text,
            createdAt: doc.data().createdAt,
            authorId: doc.data().authorId,
            authorName: doc.data().authorName,
            authorImageUrl: doc.data().authorImageUrl,
            likesIds: doc.data().likesIds,
            repliesIds: doc.data().repliesIds,
            postId: doc.data().postId,
          });
        });
        const thisPostComments = comments.filter(
          (comment) => comment.postId === selectedPost!.id
        );
        setComments(thisPostComments);
      },
    });
    // // Unsubscribe from events when no longer in use
    return () => {
      subscriberComments();
    };
  }, []);

  useEffect(() => {}, [selectedPost]);

  const handleCreateComment = async () => {
    const commentData = {
      authorId: loggedInUser?.userId,
      authorImageUrl: loggedInUser?.profilePicture,
      authorName: loggedInUser?.firstLast,
      text: newComment,
      postId: upToDatePost!.id,
    };
    createComment(commentData);
    setNewComment("");
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
    <SafeAreaView style={styles.container}>
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
          {comments ? (
            <SafeAreaView style={{ flex: 1 }}>
              <FlatList
                data={comments}
                renderItem={renderComments}
                // keyExtractor={(comment) => comment.id}
              />
            </SafeAreaView>
          ) : (
            <Text>No comments yet</Text>
          )}
        </View>
      </ScrollView>
      <Input style={{ width: "100%", alignSelf: "center" }}>
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
    </SafeAreaView>
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
