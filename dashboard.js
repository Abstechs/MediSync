// dashboard.js
import { 
  auth, 
  onAuthStateChanged, 
  signOut, 
  storage, 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  db, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot 
} from "./firebase.js";

// Ensure user is authenticated; if not, redirect to login page
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "index.html";
  } else {
    // Display user email in the Home section
    document.getElementById("userEmail").innerText = user.email;
    // Load real-time chat messages once authenticated
    loadChatMessages();
  }
});

// Section switching logic
window.showSection = function (sectionId) {
  document.querySelectorAll(".section").forEach((sec) => {
    sec.classList.add("hidden");
  });
  document.getElementById(sectionId).classList.remove("hidden");
};

// File upload functionality
window.uploadFile = function () {
  const fileInput = document.getElementById("fileUpload");
  const file = fileInput.files[0];
  if (!file) {
    iziToast.error({ title: "Error", message: "Please select a file!" });
    return;
  }
  const fileRef = ref(storage, 'uploads/' + file.name);
  uploadBytes(fileRef, file)
    .then(() => getDownloadURL(fileRef))
    .then((downloadURL) => {
      iziToast.success({ title: "Success", message: "File uploaded successfully!" });
      // Append a link to the uploaded file
      const fileList = document.getElementById("uploadedFiles");
      const fileLink = document.createElement("a");
      fileLink.href = downloadURL;
      fileLink.target = "_blank";
      fileLink.innerText = file.name;
      fileLink.classList.add("block", "text-blue-500", "underline", "mt-2");
      fileList.appendChild(fileLink);
    })
    .catch((error) => {
      iziToast.error({ title: "Error", message: error.message });
    });
};

// Chat functionality – send a new message
window.sendMessage = function () {
  const messageInput = document.getElementById("chatInput");
  const message = messageInput.value.trim();
  if (message === "") return;
  
  // Add the new message to the "chatMessages" collection
  addDoc(collection(db, "chatMessages"), {
    message: message,
    user: auth.currentUser.email,
    timestamp: new Date() // For production, consider using serverTimestamp()
  })
  .then(() => {
    messageInput.value = "";
  })
  .catch((error) => {
    iziToast.error({ title: "Error", message: error.message });
  });
};

// Load and display chat messages in real time
function loadChatMessages() {
  const q = query(collection(db, "chatMessages"), orderBy("timestamp", "asc"));
  onSnapshot(q, (querySnapshot) => {
    const chatMessagesDiv = document.getElementById("chatMessages");
    chatMessagesDiv.innerHTML = ""; // Clear current messages
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const messageDiv = document.createElement("div");
      messageDiv.classList.add("mb-2", "p-2", "border", "rounded");
      messageDiv.innerHTML = `<strong>${data.user}:</strong> ${data.message}`;
      chatMessagesDiv.appendChild(messageDiv);
    });
    // Auto-scroll to the bottom
    chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
  });
}

// Logout functionality
window.logout = function () {
  signOut(auth)
    .then(() => {
      iziToast.info({ title: "Logged out", message: "You have been signed out." });
      window.location.href = "index.html";
    })
    .catch((error) => {
      iziToast.error({ title: "Error", message: error.message });
    });
};