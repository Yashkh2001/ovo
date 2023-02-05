// Import the functions you need from the SDKs you need
import firebase from 'firebase';
import 'firebase/auth'
import  "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDEuxb0xFRsc781qa4K3mx7vSJmn3bOs20",
    authDomain: "ovogame-2ae08.firebaseapp.com",
    projectId: "ovogame-2ae08",
    storageBucket: "ovogame-2ae08.appspot.com",
    messagingSenderId: "488704943511",
    appId: "1:488704943511:web:69ca8e0efd1972ff3550d2"
};

// const firebaseConfig = {
//   apiKey: "AIzaSyBazLIjF1aYUau7qThODXciMu_vh0iXHTU",
//   authDomain: "testingproject-c1a61.firebaseapp.com",
//   projectId: "testingproject-c1a61",
//   storageBucket: "testingproject-c1a61.appspot.com",
//   messagingSenderId: "630186460719",
//   appId: "1:630186460719:web:467de11ab14e25846568da",
//   measurementId: "G-L4Y6LE2Q8N"
// };

const app=firebase.initializeApp(firebaseConfig);
// var auth = firebase.auth();
export default firebase;
export const auth = firebase.auth()

export const db = firebase.firestore();
  


// export const createUserDocument = async (user, additionalData) => {
//   if (!user) return;

//   const userRef = db.doc(`users/${user.uid}`);

//   const snapshot = await userRef.get();

//   if (!snapshot.exists) {
//     const { email } = user;
//     const { displayName } = additionalData;

//     try {
//       await userRef.set({
//         displayName,
//         email,
//         createdAt: new Date(),
//       });
//     } catch (error) {
//       console.log('Error in creating user', error);
//     }
//   }
// };

