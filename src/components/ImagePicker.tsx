import { useState } from "react";
import { Button, Image, View, StyleSheet } from "react-native";
import * as ImagePickerModule from "expo-image-picker";

interface Props {
  setPostImageUrl: React.Dispatch<React.SetStateAction<string>>;
}

const ImagePicker: React.FC<Props> = ({ setPostImageUrl }) => {
  //   const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePickerModule.launchImageLibraryAsync({
      mediaTypes: ImagePickerModule.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setPostImageUrl(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
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
