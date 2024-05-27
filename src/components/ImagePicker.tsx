import { useState } from "react";
import { Button, Image, View, StyleSheet } from "react-native";
import * as ImagePickerModule from "expo-image-picker";
import {
  launchImagePicker,
  uploadImageAsync,
} from "../utils/imagePickerHelper";
import { updateSignedInUserData } from "../utils/actions/authActions";
import { updateLoggedInUserData } from "../utils/store/authSlice";
import { useAppDispatch } from "../utils/store";
import { ImageType } from "../utils/store/types";
import SubmitButton from "./SubmitButton";
import { colors } from "../constants";

interface Props {
  setPostImageUrl: React.Dispatch<React.SetStateAction<string>>;
  setUploading: React.Dispatch<React.SetStateAction<boolean>>;
  postImageUrl: string;
  userId: string;
}

const ImagePicker: React.FC<Props> = ({
  setPostImageUrl,
  postImageUrl,
  setUploading,
  userId,
}) => {
  const dispatch = useAppDispatch();

  const pickImage = async () => {
    try {
      const tempUri = await launchImagePicker();

      if (!tempUri) return;

      // Upload the image
      setUploading(true);
      const uploadUrl = await uploadImageAsync(tempUri, ImageType.PostImage);
      setUploading(false);

      if (!uploadUrl) {
        throw new Error("Could not upload image");
      }

      // const newData = { profilePicture: uploadUrl };

      // await updateSignedInUserData(userId, newData);
      // dispatch(updateLoggedInUserData({ newData }));
      // }

      setPostImageUrl(uploadUrl);
    } catch (error) {
      console.log(error);
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <SubmitButton
        title="Pick an image from camera roll"
        onPress={pickImage}
        color={colors.blue}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 200,
    height: 200,
  },
});
export default ImagePicker;
