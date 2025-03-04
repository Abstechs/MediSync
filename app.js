// ✅ Import Firebase Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } 
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// ✅ Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAvwfXwPAJsZiWC9o_emZsI-eqHa7P47_E",
  authDomain: "telemedisync.firebaseapp.com",
  projectId: "telemedisync",
  storageBucket: "telemedisync.firebasestorage.app",
  messagingSenderId: "637321270227",
  appId: "1:637321270227:web:a2c40724de239477f65526"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ✅ Signup Function
window.signup = function () {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
            document.getElementById("status").innerText = "Signup successful!";
        })
        .catch(error => {
            document.getElementById("status").innerText = error.message;
        });
}

// ✅ Login Function
window.login = function () {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            document.getElementById("status").innerText = "Login successful!";
        })
        .catch(error => {
            document.getElementById("status").innerText = error.message;
        });
}

// ✅ Logout Function
window.logout = function () {
    signOut(auth)
        .then(() => {
            document.getElementById("status").innerText = "Logged out!";
        })
        .catch(error => {
            document.getElementById("status").innerText = error.message;
        });
}