import React, { useEffect, useState } from "react";
import { Audio } from "expo-av";
import { Pressable, View } from "@gluestack-ui/themed";
import { Alert, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { colors } from "../constants";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { auth, dbFirestore, storage } from "../../firebaseConfig";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import uuid from "react-native-uuid";
import * as FileSystem from "expo-file-system";

function AudioRecording({ chatId }: any) {
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingStatus, setRecordingStatus] = useState("idle");
  const [audioPermission, setAudioPermission] = useState(null);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const currentUser = auth.currentUser;

  useEffect(() => {
    const getPermissions = async () => {
      const response = await Audio.requestPermissionsAsync();
      setAudioPermission(response.granted);
    };
    getPermissions();
  }, []);

  async function startRecording() {
    setIsRecording(true);
    setRecording(null);
    setRecordedAudio(null);

    // Check if a recording is already in progress
    if (isRecording) {
      console.warn("A recording is already in progress");
      return;
    }

    // Check for permissions before starting the recording
    if (!audioPermission) {
      console.warn("Audio permission is not granted");
      return;
    }
    try {
      // needed for IOS, If you develop mainly on IOS device or emulator,
      // there will be error if you don't include this.
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const newRecording = new Audio.Recording();
      console.log("Starting Recording");
      await newRecording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await newRecording.startAsync();
      setRecording(newRecording);
      setRecordingStatus("recording");
    } catch (error) {
      console.error("Failed to start recording", error);
    }
  }

  async function stopRecording() {
    setIsRecording(false);
    try {
      if (recordingStatus === "recording" && recording) {
        console.log("Stopping Recording");
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();

        setRecordedAudio({
          uri,
          name: `recording-${Date.now()}.m4a`, // Change the file extension to .m4a
          type: "audio/m4a", // Update the type to M4A
        });

        // resert our states to record again
        setRecording(null);
        setRecordingStatus("stopped");
        const newRecording = {
          uri,
          name: `recording-${Date.now()}.m4a`, // Change the file extension to .m4a
          type: "audio/m4a", // Update the type to M4A}
          duration: recording._finalDurationMillis,
        };
        console.log(newRecording, "newRecording");
        return newRecording;
      }
    } catch (error) {
      console.error("Failed to stop recording", error);
    }
  }

  const saveRecordedAudio = async (newRecordedAudio: any) => {
    if (!newRecordedAudio) return;

    try {
      const fileUri = newRecordedAudio.uri;
      const response = await fetch(fileUri);
      const blob = await response.blob();

      const storageRef = ref(storage, `audioRecordings/${uuid.v4()}.m4a`);
      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Handle upload progress if needed
        },
        (error) => {
          // Handle upload error
          console.error("Failed to upload audio file", error);
          Alert.alert("Error", "Failed to upload audio file.");
        },
        async () => {
          // Handle successful upload
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log(
            `Audio file uploaded successfully. Download URL: ${downloadURL}`
          );

          // Save the download URL in Firestore
          await addDoc(
            collection(dbFirestore, "messages", chatId, "messages"),
            {
              text: newRecordedAudio.name,
              sentAt: new Date().toISOString(),
              sentBy: currentUser?.uid,
              downloadURL: downloadURL,
              duration: newRecordedAudio.duration,
            }
          );

          await setDoc(
            doc(dbFirestore, "chats", chatId),
            {
              latestMessageText: newRecordedAudio.name,
              updatedAt: new Date().toISOString(),
              updatedBy: currentUser?.uid,
            },
            { merge: true }
          );

          // Update the state with the download URL
          setRecordedAudio({ ...newRecordedAudio, downloadURL });
        }
      );
    } catch (error) {
      console.error("Failed to save recorded audio", error);
    }
  };

  async function handleRecordButtonPress() {
    setRecordedAudio(null);
    setRecording(null);
    if (recording) {
      const newRecordedAudio = await stopRecording();
      if (newRecordedAudio) {
        saveRecordedAudio(newRecordedAudio);
        console.log(newRecordedAudio, "newRecordedAudio");
      }
    } else {
      await startRecording();
    }
  }

  return (
    <Pressable style={styles.voiceButton} onPress={handleRecordButtonPress}>
      {!recording ? (
        <FontAwesome name="microphone" size={24} color="black" />
      ) : (
        <MaterialCommunityIcons
          name="send"
          aria-label="Send"
          size={24}
          color="black"
        />
      )}
    </Pressable>
  );
}
const styles = StyleSheet.create({
  voiceButton: {
    alignItems: "center",
    width: 42,
    padding: 10,
    backgroundColor: colors.primary,
    borderRadius: 10,
  },
});
export default AudioRecording;
