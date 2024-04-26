import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";
import { getFirebaseApp } from "../../firebaseConfig";
import uuid from "react-native-uuid";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { ImageType } from "./store/types";

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
  const app = getFirebaseApp();

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
    default:
      pathFolder = ImageType.ProfileImage; // Default to profileImages if not specified
  }
  const storageRef = ref(getStorage(app), `${pathFolder}/${uuid.v4()}`);

  await uploadBytesResumable(storageRef, blob);

  // blob.close();

  return await getDownloadURL(storageRef);
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
