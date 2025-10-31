// src/App.jsx
import React from "react";
import ChatRoom from "./chatroom/ChatRoom";

function App() {
  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Realtime Chat App</h1>
      <ChatRoom />
    </div>
  );
}

export default App;
