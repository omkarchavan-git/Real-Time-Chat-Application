import React, { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { over } from "stompjs";
import { useNavigate } from "react-router-dom";
import "../styles/ChatRoom.css"; 

let stompClient = null;

function ChatRoom() {
  const [connected, setConnected] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomId, setRoomId] = useState("room1");
  const [sender, setSender] = useState("Omkar");
  const navigate = useNavigate();

  // Connect WebSocket
  useEffect(() => {
    const socket = new SockJS("http://localhost:8081/chat");
    stompClient = over(socket);
    stompClient.connect({}, onConnected, onError);
  }, []);

  const onConnected = () => {
    setConnected(true);
    stompClient.subscribe(`/topic/room/${roomId}`, onMessageReceived);
    console.log("Connected to room:", roomId);
  };

  const onError = (error) => {
    console.error("Connection error:", error);
  };

  const onMessageReceived = (payload) => {
    const message = JSON.parse(payload.body);
    setMessages((prev) => [...prev, message]);
  };

  const sendMessage = () => {
    if (stompClient && message.trim() !== "") {
      const chatMessage = {
        sender: sender,
        content: message,
        roomId: roomId,
      };
      stompClient.send(`/app/sendMessage/${roomId}`, {}, JSON.stringify(chatMessage));
      setMessage("");
    }
  };

  return (
    <div className="chat-container">
      <button className="dashboard-btn" onClick={() => navigate("/")}>
        ⬅ Back to Dashboard
      </button>

      <h2>Room ID: {roomId}</h2>
      <h3>Status: {connected ? "🟢 Connected" : "🔴 Disconnected"}</h3>

      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sender}:</strong> {msg.content}
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Type message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatRoom;
