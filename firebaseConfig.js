import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
// Optionally import the services that you want to use
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

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

export const auth = getAuth(app);
