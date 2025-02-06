/***********************
 * Configuration
 ***********************/

// Replace with your Agora App ID and (optionally) token.
const AGORA_APP_ID = "YOUR_AGORA_APP_ID";
const CHANNEL_NAME = "voiceRoom";
const AGORA_TOKEN = null; // Replace with a token if your Agora project uses one.

// Replace with your Firebase configuration details.
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "yourproject.firebaseapp.com",
  databaseURL: "https://yourproject-default-rtdb.firebaseio.com",
  projectId: "yourproject",
  storageBucket: "yourproject.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_FIREBASE_APP_ID"
};

/***********************
 * Firebase Setup
 ***********************/

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const messagesRef = database.ref('messages');

/***********************
 * Agora Setup
 ***********************/
let client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
let localAudioTrack = null;

/**
 * Join the Agora channel and publish your audio.
 */
async function joinChannel() {
  try {
    await client.join(AGORA_APP_ID, CHANNEL_NAME, AGORA_TOKEN, null);
    localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    await client.publish([localAudioTrack]);
    alert("You have joined the voice chat!");
  } catch (error) {
    console.error("Failed to join the channel:", error);
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
 * UI Event Listeners
 ***********************/

// Join button event listener
document.getElementById("joinBtn").addEventListener("click", joinChannel);

// Chat send button event listener
document.getElementById("sendBtn").addEventListener("click", () => {
  const messageInput = document.getElementById("chatInput");
  const messageText = messageInput.value.trim();
  if (messageText !== "") {
    messagesRef.push({
      text: messageText,
      timestamp: Date.now()
    });
    messageInput.value = "";
  }
});

// Listen for new chat messages and display them.
messagesRef.on("child_added", (snapshot) => {
  const message = snapshot.val();
  const chatBox = document.getElementById("chatBox");
  const messageElement = document.createElement("p");
  messageElement.textContent = message.text;
  chatBox.appendChild(messageElement);
});
