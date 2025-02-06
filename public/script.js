/***********************
 * Configuration
 ***********************/

// Replace with your Agora App ID and (optionally) token.
const AGORA_APP_ID = "95042c63fd8f456c9b8ac1a607950b58";
const CHANNEL_NAME = "voiceRoom";
const AGORA_TOKEN = null; // Replace with a token if your Agora project uses one.

// Replace with your Firebase configuration details.
const firebaseConfig = {
  apiKey: "AIzaSyDgMOk6QEJ7x-ObkHTfoOm7NtEnn39ct5c",
  authDomain: "voice-a72de.firebaseapp.com",
  databaseURL: "https://voice-a72de-default-rtdb.firebaseio.com",
  projectId: "voice-a72de",
  storageBucket: "voice-a72de.firebasestorage.app",
  messagingSenderId: "650150618469",
  appId: "1:650150618469:web:caec0c92bb7e5315bd2d8c",
  measurementId: "G-XYDFFSTQ8L"
};

/***********************
 * Configuration
 ***********************/
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const messagesRef = database.ref('messages');
const seatsRef = database.ref('seats'); // For seat occupancy

/***********************
 * Firebase Authentication Setup
 ***********************/
const auth = firebase.auth();
const loginForm = document.getElementById("loginForm");
const userInfo = document.getElementById("userInfo");
const userEmailSpan = document.getElementById("userEmail");

auth.onAuthStateChanged(user => {
  if (user) {
    userInfo.style.display = "block";
    loginForm.style.display = "none";
    userEmailSpan.textContent = user.email;
    // Show controls when user is logged in
    document.getElementById("controls").style.display = "block";
  } else {
    userInfo.style.display = "none";
    loginForm.style.display = "block";
    document.getElementById("controls").style.display = "none";
  }
});

document.getElementById("loginBtn").addEventListener("click", () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  auth.signInWithEmailAndPassword(email, password)
    .catch(error => alert(error.message));
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  auth.signOut().catch(error => console.error(error));
});

/***********************
 * Agora Setup
 ***********************/
let client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
let localAudioTrack = null;
let isMuted = false;
let joined = false;

/**
 * Join the Agora channel and publish your audio.
 */
async function joinChannel() {
  try {
    if (joined) {
      alert("Already in channel");
      return;
    }
    await client.join(AGORA_APP_ID, CHANNEL_NAME, AGORA_TOKEN, null);
    localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    await client.publish([localAudioTrack]);
    joined = true;
    alert("You have joined the voice chat!");
  } catch (error) {
    console.error("Failed to join the channel:", error);
  }
}

/**
 * Leave the Agora channel.
 */
async function leaveChannel() {
  try {
    if (!joined) return;
    await client.leave();
    if (localAudioTrack) {
      localAudioTrack.close();
      localAudioTrack = null;
    }
    joined = false;
    alert("You have left the channel.");
  } catch (error) {
    console.error("Failed to leave the channel:", error);
  }
}

// When a remote user publishes their track, subscribe and play it.
client.on("user-published", async (user, mediaType) => {
  await client.subscribe(user, mediaType);
  if (mediaType === "audio") {
    user.audioTrack.play();
  }
});

/***********************
 * Seat Management
 ***********************/

// Listen for seat occupancy changes and update UI.
seatsRef.on("value", snapshot => {
  const seats = snapshot.val() || {};
  for (let i = 1; i <= 8; i++) {
    const seatElem = document.getElementById(`seat-${i}`);
    if (seats[i]) {
      seatElem.classList.add("occupied");
      seatElem.textContent = seats[i].user || `Seat ${i}`;
    } else {
      seatElem.classList.remove("occupied");
      seatElem.textContent = `Seat ${i}`;
    }
  }
});

// Handle seat click for occupying a seat.
const seatElements = document.querySelectorAll(".seat");
seatElements.forEach(seat => {
  seat.addEventListener("click", () => {
    if (!auth.currentUser) {
      alert("Please log in to occupy a seat.");
      return;
    }
    const seatNumber = seat.getAttribute("data-seat");
    // Check if seat is already occupied in Firebase.
    seatsRef.child(seatNumber).once("value").then(snapshot => {
      if (snapshot.exists()) {
        alert("Seat is already occupied!");
      } else {
        // Occupy the seat with current user’s email (or name).
        seatsRef.child(seatNumber).set({
          user: auth.currentUser.email,
          timestamp: Date.now()
        });
      }
    });
  });
});

/***********************
 * UI Controls
 ***********************/
document.getElementById("joinBtn").addEventListener("click", joinChannel);
document.getElementById("leaveBtn").addEventListener("click", leaveChannel);

// Toggle mute/unmute.
document.getElementById("muteBtn").addEventListener("click", () => {
  if (!localAudioTrack) return;
  if (isMuted) {
    localAudioTrack.setEnabled(true);
    document.getElementById("muteBtn").textContent = "Mute";
    isMuted = false;
  } else {
    localAudioTrack.setEnabled(false);
    document.getElementById("muteBtn").textContent = "Unmute";
    isMuted = true;
  }
});

// Raise hand feature.
document.getElementById("raiseHandBtn").addEventListener("click", () => {
  if (!auth.currentUser) {
    alert("Please log in to raise your hand.");
    return;
  }
  // For simplicity, we just send a message to the chat indicating a raise hand.
  messagesRef.push({
    text: `${auth.currentUser.email} raised their hand!`,
    timestamp: Date.now()
  });
});

/***********************
 * Chat Setup
 ***********************/
document.getElementById("sendBtn").addEventListener("click", () => {
  const messageInput = document.getElementById("chatInput");
  const messageText = messageInput.value.trim();
  if (messageText !== "") {
    // If the user is logged in, send the message with their email; otherwise, send as "Guest".
    const user = auth.currentUser;
    messagesRef.push({
      text: user ? `${user.email}: ${messageText}` : `Guest: ${messageText}`,
      timestamp: Date.now()
    });
    messageInput.value = "";
  }
});

// Listen for new chat messages and display them.
messagesRef.on("child_added", snapshot => {
  const message = snapshot.val();
  const chatBox = document.getElementById("chatBox");
  const messageElement = document.createElement("p");
  messageElement.textContent = message.text;
  chatBox.appendChild(messageElement);
  // Auto-scroll chat box.
  chatBox.scrollTop = chatBox.scrollHeight;
});
