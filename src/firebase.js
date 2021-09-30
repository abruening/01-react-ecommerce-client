import firebase from "firebase/app";
import "firebase/auth";

// firebase config
const config = {
  apiKey: "AIzaSyDVEDArueIxcwBIwQ_a9U2LiPTYFGge2DY",
  authDomain: "ecommerce-d1b8e.firebaseapp.com",
  projectId: "ecommerce-d1b8e",
  messagingSenderId: "763850889587",
  appId: "1:763850889587:web:7298037c8bd7dd6eb68d06",
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}
// export
//export default firebase;
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
