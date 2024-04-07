import {
  addDoc,
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
export const createComment = async (
  loggedInUserId: string,
  commentData: any
) => {
  try {
    const docRef = await addDoc(collection(dbFirestore, "comments"), {
      title: commentData.title,
      text: commentData.text,
      createdAt: new Date().toISOString(),
      authorId: loggedInUserId,
      authorName: commentData.authorName,
      authorImageUrl: commentData.authorImageUrl,
      likesIds: [],
      repliesIds: [],
    });
    console.log("Document written with ID: ", docRef.id, docRef);

    return docRef.id;
  } catch (err) {
    throw new Error(
      "Something went wrong while creating a new comment. Please try again later."
    );
  }
};

export const updateComment = async (commentId: string, commentData: Post) => {
  try {
    const docRef = await updateDoc(doc(dbFirestore, "posts", commentId), {
      title: commentData.title,
      content: commentData.content,
      imageUrl: commentData.imageUrl,
    });
    return docRef;
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
