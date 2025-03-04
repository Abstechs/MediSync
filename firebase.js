// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyAvwfXwPAJsZiWC9o_emZsI-eqHa7P47_E",
  authDomain: "telemedisync.firebaseapp.com",
  projectId: "telemedisync",
  storageBucket: "telemedisync.firebasestorage.app",
  messagingSenderId: "637321270227",
  appId: "1:637321270227:web:a2c40724de239477f65526"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { 
  auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  db,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  storage,
  ref,
  uploadBytes,
  getDownloadURL
};


/*

// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } 
    from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAvwfXwPAJsZiWC9o_emZsI-eqHa7P47_E",
  authDomain: "telemedisync.firebaseapp.com",
  projectId: "telemedisync",
  storageBucket: "telemedisync.firebasestorage.app",
  messagingSenderId: "637321270227",
  appId: "1:637321270227:web:a2c40724de239477f65526"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Export authentication methods
export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged };
*/
