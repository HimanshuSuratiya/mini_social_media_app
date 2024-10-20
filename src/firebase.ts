// import { initializeApp } from "firebase/app";
// import { getAuth, GoogleAuthProvider } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage";

// const firebaseConfig = {
//   // Your Firebase configuration
// };

// const app = initializeApp(firebaseConfig);

// export const auth = getAuth(app);
// export const googleProvider = new GoogleAuthProvider();
// export const db = getFirestore(app);
// export const storage = getStorage(app);

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCHgZHhsjQnEztHdiEEvVPiYb7AcUl__MA",
  authDomain: "mini-social-media-b4f3d.firebaseapp.com",
  projectId: "mini-social-media-b4f3d",
  storageBucket: "mini-social-media-b4f3d.appspot.com",
  messagingSenderId: "1087460696139",
  appId: "1:1087460696139:web:c53c69e4a3699303096dce",
  measurementId: "G-VCG0Y4EWRP",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
