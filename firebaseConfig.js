import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";
// Optionally import the services that you want to use
// import {...} from "firebase/functions";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAhHUmcSXemUwUVyHtrFcxyu4p--E7KrCo",
  authDomain: "rn-expo-ts-campy.firebaseapp.com",
  projectId: "rn-expo-ts-campy",
  storageBucket: "rn-expo-ts-campy.appspot.com",
  messagingSenderId: "130664875197",
  appId: "1:130664875197:web:652618ebfd07fb533463d4",
  databaseURL:
    "https://rn-expo-ts-campy-default-rtdb.europe-west1.firebasedatabase.app/",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// const analytics = getAnalytics(app);

export const getFirebaseApp = () => {
  return app;
};
// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

// Initialize Cloud Firestore and get a reference to the service
export const dbFirestore = getFirestore(app);

export const auth = getAuth(app);
