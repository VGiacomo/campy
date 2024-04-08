import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { dbFirestore, getFirebaseApp } from "../../../firebaseConfig";
import { authenticate, logout } from "../store/authSlice";
import { ApplicationDispatch } from "../store";
import { Post, UserData } from "../store/types";
import { getDatabase, ref } from "firebase/database";

let timer: NodeJS.Timeout;
// TODO check these methods (WIP)
export const createComment = async (commentData: any) => {
  try {
    const commentRef = await addDoc(collection(dbFirestore, "comments"), {
      text: commentData.text,
      createdAt: new Date().toISOString(),
      authorId: commentData.authorId,
      postId: commentData.postId,
      authorName: commentData.authorName,
      authorImageUrl: commentData.authorImageUrl,
      likesIds: [],
      repliesIds: [],
    });
    console.log("Document written with ID: ", commentRef.id, commentRef);

    const postRef = doc(dbFirestore, "posts", commentData.postId);
    await updateDoc(postRef, {
      commentsIds: arrayUnion(commentRef.id),
    });
    return commentRef.id;
  } catch (err) {
    throw new Error(
      "Something went wrong while creating a new comment. Please try again later."
    );
  }
};

export const updateComment = async (commentId: string, commentData: Post) => {
  try {
    const commentRef = await updateDoc(doc(dbFirestore, "posts", commentId), {
      content: commentData.content,
      imageUrl: commentData.imageUrl,
    });
    return commentRef;
  } catch (err) {
    throw new Error(
      "Something went wrong while updating a comment. Please try again later."
    );
  }
};

export const deleteComment = async (
  commentId: string,
  repliesIds: string[]
) => {
  try {
    if (repliesIds.length > 0) {
      //   await Promise.all(
      //     postCommentsIds.map((commentId) =>
      //       deleteDoc(doc(dbFirestore, "comments", commentId))
      //     )
      //   );
      await deleteDoc(
        doc(dbFirestore, "repliesIds", "commentId", "==", commentId)
      );
    }
    await deleteDoc(doc(dbFirestore, "comments", commentId));
  } catch (err) {
    throw new Error(
      "Something went wrong while deleting a comment. Please try again later."
    );
  }
};
