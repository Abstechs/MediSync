// app.js
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "./firebase.js";

// Function to sign up users
function signup() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
            iziToast.success({ title: "Success", message: "Account created successfully!" });
            window.location.href = "dashboard.html"; // Redirect to dashboard
        })
        .catch(error => {
            iziToast.error({ title: "Error", message: error.message });
        });
}

// Function to log in users
function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            iziToast.success({ title: "Success", message: "Logged in successfully!" });
            window.location.href = "dashboard.html"; // Redirect to dashboard
        })
        .catch(error => {
            iziToast.error({ title: "Error", message: error.message });
        });
}

// Function to log out users
function logout() {
    signOut(auth)
        .then(() => {
            iziToast.info({ title: "Logged out", message: "You have been signed out." });
            window.location.href = "index.html"; // Redirect to login page
        })
        .catch(error => {
            iziToast.error({ title: "Error", message: error.message });
        });
}

// Protect dashboard.html (Redirect if not logged in)
function checkAuth() {
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            window.location.href = "index.html";
        }
    });
}

// Redirect already logged-in users from index.html to dashboard.html
function checkIfLoggedIn() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            window.location.href = "dashboard.html";
        }
    });
}

// Run protection scripts based on the page
if (window.location.pathname.includes("dashboard.html")) {
    checkAuth();
} else if (window.location.pathname.includes("index.html")) {
    checkIfLoggedIn();
}

// Expose functions globally
window.signup = signup;
window.login = login;
window.logout = logout;