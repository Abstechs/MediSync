document.addEventListener("DOMContentLoaded", function () {
    // Toggle Sidebar for Mobile
    const menuToggle = document.getElementById("menu-toggle");
    const mobileMenu = document.getElementById("mobile-menu");

    menuToggle.addEventListener("click", function () {
        mobileMenu.classList.toggle("sidebar-hidden");
    });

    // Hide menu when a link is clicked
    const menuLinks = mobileMenu.querySelectorAll("a");
    menuLinks.forEach(link => {
        link.addEventListener("click", () => {
            mobileMenu.classList.add("sidebar-hidden");
        });
    });

    // Section Switching
    function showSection(sectionId) {
        document.querySelectorAll(".section").forEach(section => {
            section.classList.add("hidden");
        });
        document.getElementById(sectionId).classList.remove("hidden");
    }

    // Assign click event to navigation links
    document.querySelectorAll("nav a").forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const sectionId = this.getAttribute("href").substring(1);
            showSection(sectionId);
        });
    });

    // Display user profile tooltip instead of rendering email
    const profileDisplay = document.getElementById("profile-display");
    profileDisplay.setAttribute("data-tooltip", "user@example.com"); // Replace with dynamic email
    profileDisplay.classList.add("relative", "cursor-pointer");

    profileDisplay.addEventListener("mouseenter", function () {
        let tooltip = document.createElement("div");
        tooltip.innerText = profileDisplay.getAttribute("data-tooltip");
        tooltip.className = "absolute top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow";
        tooltip.id = "tooltip";
        profileDisplay.appendChild(tooltip);
    });

    profileDisplay.addEventListener("mouseleave", function () {
        const tooltip = document.getElementById("tooltip");
        if (tooltip) tooltip.remove();
    });

    // Chat Functionality - Better Chat Display
    const chatMessages = document.getElementById("chatMessages");
    const chatInput = document.getElementById("chatInput");

    function sendMessage() {
        const message = chatInput.value.trim();
        if (message === "") return;

        const chatBubble = document.createElement("div");
        chatBubble.className = "flex justify-end mb-2";

        chatBubble.innerHTML = `
            <div class="bg-blue-500 text-white p-2 rounded-lg max-w-xs">
                ${message}
            </div>
        `;

        chatMessages.appendChild(chatBubble);
        chatInput.value = "";

        // Auto-scroll to the latest message
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    document.querySelector("button[onclick='sendMessage()']").addEventListener("click", sendMessage);
    chatInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") sendMessage();
    });

    // Show Greeting
    const greeting = document.getElementById("greeting");
    const hours = new Date().getHours();
    greeting.innerText = hours < 12 ? "Good morning" : hours < 18 ? "Good afternoon" : "Good evening";
});


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

// Helper function to truncate long email addresses
function truncateEmail(email) {
  if (email.length <= 15) return email;
  return email.substring(0, 5) + '...' + email.substring(email.length - 5);
}


// Authentication check & UI update
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "index.html";
  } else {
    let profileDisplay = document.getElementById("profile-display");
    let username = user.email.split("@")[0]; // Extract username from email
    profileDisplay.setAttribute("data-tooltip", username); // Set tooltip text
    
    profileDisplay.classList.add("relative", "cursor-pointer");
    
    const truncated = truncateEmail(user.email);
    //document.getElementById("greeting").innerText = username?.substring(0,10) + "..." ?? truncated;
    document.getElementById("greeting").innerText = username.length > 10 ? username.substring(0,10) + "..." : username;
    //document.getElementById("profile-name").innerText = truncated;
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


// Toggle mobile menu
function toggleMenu() {
    let menu = document.getElementById("mobile-menu");
    menu.classList.toggle("sidebar-hidden");

    // Close sidebar if clicking outside of it
    document.addEventListener("click", function (event) {
        if (!menu.contains(event.target) && !event.target.matches("#menu-toggle")) {
            menu.classList.add("sidebar-hidden");
        }
    }, { once: true }); // Ensures this listener only runs once
}


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
      // Append a clickable link for the uploaded file
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

// Chat functionality – send message
window.sendMessage = function () {
  const messageInput = document.getElementById("chatInput");
  const message = messageInput.value.trim();
  if (message === "") return;
  
  addDoc(collection(db, "chatMessages"), {
    message: message,
    user: auth.currentUser.email,
    timestamp: new Date() // In production, consider serverTimestamp()
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
    chatMessagesDiv.innerHTML = ""; // Clear previous messages

    let lastMessage; // Store last message reference

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const messageContainer = document.createElement("div");
      messageContainer.classList.add("mb-2", "p-2", "border", "rounded");

      // Header: avatar and truncated email
      const header = document.createElement("div");
      header.classList.add("flex", "items-center", "mb-1");

      const avatar = document.createElement("i");
      avatar.classList.add("fa-solid", "fa-user-circle", "text-gray-700", "mr-2");
      header.appendChild(avatar);

      const userName = document.createElement("span");
      userName.classList.add("font-semibold", "text-gray-700", "text-sm");
      userName.innerText = truncateEmail(data.user);
      header.appendChild(userName);

      // Message body
      const messageBody = document.createElement("div");
      messageBody.classList.add("text-gray-800", "text-base", "mt-1");
      messageBody.innerText = data.message;

      messageContainer.appendChild(header);
      messageContainer.appendChild(messageBody);
      chatMessagesDiv.appendChild(messageContainer);

      lastMessage = messageContainer; // Update last message reference
    });

    // **Auto-scroll logic**
    if (lastMessage) {
      // If scroll is already near the bottom, auto-scroll
      const isNearBottom =
        chatMessagesDiv.scrollHeight - chatMessagesDiv.scrollTop <= chatMessagesDiv.clientHeight + 5;

      if (isNearBottom) {
        lastMessage.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }
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

