// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  //As using "Vite" instead of "create-react-app", so instead of "process.env.VITE_FIREBASE_API_KEY", we need to use "import.meta.env.VITE_FIREBASE_API_KEY"
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-project-86c75.firebaseapp.com",
  projectId: "mern-blog-project-86c75",
  storageBucket: "mern-blog-project-86c75.appspot.com",
  messagingSenderId: "70494376322",
  appId: "1:70494376322:web:5ffdf46b219daffdeb3f9b",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
