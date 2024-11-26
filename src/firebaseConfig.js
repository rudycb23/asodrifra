import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCY4dSE7S7EXzrjtuDYo1fNS8WWSmzDPs8",
  authDomain: "asodisfra-83e90.firebaseapp.com",
  projectId: "asodisfra-83e90",
  storageBucket: "asodisfra-83e90.appspot.com",
  messagingSenderId: "619165109512",
  appId: "1:619165109512:web:9766af1def87358d6830bd",
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };
