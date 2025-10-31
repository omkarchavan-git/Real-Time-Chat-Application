import React, { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { over } from "stompjs";

let stompClient = null;

function ChatRoom() {
  const [connected, setConnected] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomId, setRoomId] = useState("room1");
  const [sender, setSender] = useState("Omkar");

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
    <div style={{ margin: "30px auto", width: "500px" }}>
      <h2>Room ID: {roomId}</h2>
      <h3>Status: {connected ? "🟢 Connected" : "🔴 Disconnected"}</h3>

      <div
        style={{
          border: "1px solid #ccc",
          height: "300px",
          overflowY: "auto",
          padding: "10px",
          marginBottom: "10px",
          borderRadius: "10px",
        }}
      >
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sender}:</strong> {msg.content}
          </div>
        ))}
      </div>

      <input
        type="text"
        placeholder="Type message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{
          width: "75%",
          padding: "8px",
          borderRadius: "5px",
          marginRight: "5px",
        }}
      />
      <button onClick={sendMessage} style={{ padding: "8px 15px" }}>
        Send
      </button>
    </div>
  );
}

export default ChatRoom;
