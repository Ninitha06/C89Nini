import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyDgJPZbkNdIu6aIPST1Rp2GE_NlDak22E8",
  authDomain: "storytellingapp-8efcc.firebaseapp.com",
  databaseURL: "https://storytellingapp-8efcc-default-rtdb.firebaseio.com",
  projectId: "storytellingapp-8efcc",
  storageBucket: "storytellingapp-8efcc.appspot.com",
  messagingSenderId: "593654992946",
  appId: "1:593654992946:web:4c0b873789eab88f7c6c2b"
};

// Initialize Firebase
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
else firebase.app();

export default firebase.database();
