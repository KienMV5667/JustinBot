import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDacdeOF4DZAqCGO08S2hu3LQmd8y4XvtA",
  authDomain: "justinbot-ca96f.firebaseapp.com",
  projectId: "justinbot-ca96f",
  storageBucket: "justinbot-ca96f.appspot.com",
  messagingSenderId: "383906193302",
  appId: "1:383906193302:web:a53eaba481fdb7352407b7"
};

console.log("🔥 Firebase Loaded!");

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);