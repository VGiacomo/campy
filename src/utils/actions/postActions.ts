import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
// import {
//   child,
//   getDatabase,
//   ref,
//   set,
//   get,
//   update,
//   push,
// } from "firebase/database";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
// import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { dbFirestore, getFirebaseApp } from "../../../firebaseConfig";
import { authenticate, logout } from "../store/authSlice";
import { ApplicationDispatch } from "../store";
import { Post, UserData } from "../store/types";
import { getDatabase, ref } from "firebase/database";

let timer: NodeJS.Timeout;

export const createPost = async (loggedInUserId: string, postData: any) => {
  try {
    const docRef = await addDoc(collection(dbFirestore, "posts"), {
      title: postData.title,
      content: postData.content,
      createdAt: new Date().toISOString(),
      authorId: loggedInUserId,
      likesIds: [],
      imageUrl: postData.imageUrl,
      commentsIds: [],
    });
    console.log("Document written with ID: ", docRef.id, docRef);

    return docRef.id;
  } catch (err) {
    throw new Error(
      "Something went wrong while creating a new post. Please try again later."
    );
  }
};

export const updatePost = async (postData: Post) => {
  try {
    const docRef = await updateDoc(doc(dbFirestore, "posts", postData.id), {
      title: postData.title,
      content: postData.content,
      imageUrl: postData.imageUrl,
    });
    return docRef;
  } catch (err) {
    throw new Error(
      "Something went wrong while updating a post. Please try again later."
    );
  }
};

export const deletePost = async (postId: string, postCommentsIds: string[]) => {
  try {
    if (postCommentsIds.length > 0) {
      const q = query(
        collection(dbFirestore, "comments"),
        where("postId", "==", postId)
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
    }
    await deleteDoc(doc(dbFirestore, "posts", postId));
  } catch (err) {
    throw new Error(
      "Something went wrong while deleting a post. Please try again later."
    );
  }
};
