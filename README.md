# Enhanced Voice Chat App

This enhanced voice chat application features:
- **8-Seat Voice Chat:** Click on a seat to join, with real-time seat occupancy managed via Firebase.
- **Text Chat:** Real-time messaging using Firebase Realtime Database.
- **Mute/Unmute and Leave:** Control your microphone and leave the channel when needed.
- **User Authentication:** Sign in with email/password using Firebase Authentication (optional).
- **Raise Hand:** Signal your wish to speak.

## Setup

### Prerequisites
- [Node.js](https://nodejs.org/)
- An [Agora](https://www.agora.io/) account (for your App ID)
- A [Firebase](https://firebase.google.com/) project (for Auth, Realtime Database, and configuration)

### Configuration
1. **Agora:** Replace `YOUR_AGORA_APP_ID` and set `AGORA_TOKEN` in `public/script.js` as needed.
2. **Firebase:** Replace the Firebase configuration placeholders in `public/script.js` with your project’s details.

### Running the Application
1. Clone the repository and navigate into it:
   ```bash
   git clone https://github.com/yourusername/voice-chat-app.git
   cd voice-chat-app
