import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";
import {
  auth,
  dbFirestore,
  getFirebaseApp,
  storage,
} from "../../firebaseConfig";
import uuid from "react-native-uuid";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { ImageType } from "./store/types";
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";

export const launchImagePicker = async () => {
  await checkMediaPermissions();

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });

  if (!result.canceled) {
    return result.assets[0].uri;
  }
};

export const openCamera = async () => {
  // check for camera permissions
  const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

  if (permissionResult.granted === false) {
    console.log("No permission to access the camera");
    return;
  }

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });

  if (!result.canceled) {
    return result.assets[0].uri;
  }
};

export const uploadImageAsync = async (uri: string, imageType: ImageType) => {
  const blob: any = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };

    xhr.onerror = function (e) {
      console.log(e);
      reject(new TypeError("Network request failed"));
    };

    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send();
  });

  let pathFolder: string;
  switch (imageType) {
    case ImageType.ChatImage:
      pathFolder = ImageType.ChatImage;
      break;
    case ImageType.PostImage:
      pathFolder = ImageType.PostImage;
      break;
    case ImageType.StatusImage:
      pathFolder = ImageType.StatusImage;
      break;
    case ImageType.ProfileImage:
      pathFolder = ImageType.ProfileImage;
      break;
    default:
      pathFolder = "";
  }
  if (!pathFolder) {
    throw new Error("Invalid image type specified");
  }

  // Handle profile image specific logic
  if (imageType === ImageType.ProfileImage) {
    // Fetch the current user profile document
    const userDocRef = doc(dbFirestore, "users", auth.currentUser!.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const currentProfileImageUrl = userData.profilePicture;

      if (currentProfileImageUrl) {
        // Extract the file path from the URL
        const filePath = currentProfileImageUrl.split("/o/")[1].split("?")[0];

        // Create a reference to the file to delete
        const oldProfileImageRef = ref(storage, decodeURIComponent(filePath));

        // Delete the old profile image
        await deleteObject(oldProfileImageRef);
      }
    }
  }

  // Upload the new image
  const storageRef = ref(storage, `${pathFolder}/${uuid.v4()}`);
  await uploadBytesResumable(storageRef, blob);

  const downloadURL = await getDownloadURL(storageRef);

  // If it's a profile image, update the user's profile document with the new image URL
  if (imageType === ImageType.ProfileImage) {
    await updateDoc(doc(dbFirestore, "users", auth.currentUser!.uid), {
      profilePicture: downloadURL,
    });
  }

  return downloadURL;
};

const checkMediaPermissions = async () => {
  if (Platform.OS !== "web") {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      return Promise.reject("We need permission to access your photos");
    }
  }

  return Promise.resolve();
};
