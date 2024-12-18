// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_APIKEY!,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH!,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID!,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET!,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDERID!,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APPID!,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
