# Voice Chat App

This is a simple voice chat application featuring 8 seats for audio communication and a text chat powered by Firebase Realtime Database. It uses the Agora Web SDK for low-latency voice streaming.

## Features

- **8-Seat Voice Chat:** Join a shared channel and speak with others.
- **Text Chat:** Send and receive messages in real time.
- **Basic UI:** Seats are displayed as placeholders.

## Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (if you plan to run a local server)
- An [Agora](https://www.agora.io/) account (to get your App ID)
- A [Firebase](https://firebase.google.com/) project (to get your Firebase config)

### Configuration

1. **Agora:**  
   Replace `YOUR_AGORA_APP_ID` in `public/script.js` with your Agora App ID.  
   If using a token for security, replace `AGORA_TOKEN` accordingly.

2. **Firebase:**  
   Replace the placeholder values in the `firebaseConfig` object (inside `public/script.js`) with your Firebase project configuration.

### Running the Application

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/voice-chat-app.git
   cd voice-chat-app
