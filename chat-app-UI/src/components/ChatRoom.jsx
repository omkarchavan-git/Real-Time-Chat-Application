import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import SockJS from "sockjs-client";
import { over } from "stompjs";
import "../styles/ChatRoom.css";

let stompClient = null;

const ChatRoom = () => {


  const location = useLocation();
  const navigate = useNavigate();
  const { roomId: roomIdParam } = useParams();

  const storedUsername = localStorage.getItem("username");
  const storedRoom = localStorage.getItem("roomId");

  const username = location.state?.username || storedUsername;
  const roomId = location.state?.roomId || storedRoom;

  
  const rawRoom = roomId || roomIdParam || "";

// Remove unwanted parts like 'roomId', braces, quotes, or slashes
const activeRoom = String(
  typeof rawRoom === "object" ? rawRoom.roomId : rawRoom
)
  .replace(/roomId|[\/\[\]\{\}"':]/g, "")
  .replace(/^room/, "room") // keep correct prefix
  .trim();


  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    console.log("Joined room:", activeRoom, "as:", username);

    if (!activeRoom || !username) {
      console.warn("Missing room or username, redirecting to dashboard...");
      navigate("/");
      return;
    }

    const socket = new SockJS("http://localhost:8081/chat");
    stompClient = over(socket);

    stompClient.connect({}, () => {
      console.log(`✅ Connected to WebSocket for room: ${activeRoom}`);

      // Correct subscription topic
      stompClient.subscribe(`/topic/room/${activeRoom}`, (payload) => {
        const receivedMsg = JSON.parse(payload.body);
        console.log("📩 Message received:", receivedMsg);
        setMessages((prev) => [...prev, receivedMsg]);
      });
    });

    return () => {
      if (stompClient && stompClient.connected) {
        stompClient.disconnect(() => {
          console.log("Disconnected from WebSocket");
        });
      }
    };
  }, [activeRoom, username, navigate]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const msg = {
      sender: username,
      content: message,
      roomId: activeRoom,
    };

    console.log("🚀 Sending message to:", `/app/sendMessage/${activeRoom}`, msg);
    stompClient.send(`/app/sendMessage/${activeRoom}`, {}, JSON.stringify(msg));
    setMessage("");
    console.log("🧩 Cleaned room ID:", activeRoom);

  };
console.log("🧩 Cleaned room ID:", activeRoom);

  return (
    <div className="chatroom-container">
      <div className="chatroom-header">
        <h3>Room: {activeRoom}</h3>
        <button className="back-btn" onClick={() => navigate("/")}>
          Back to Dashboard
        </button>
      </div>

      <div className="chat-box">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${
              msg.sender === username ? "self" : "other"
            }`}
          >
            <b>{msg.sender}:</b> {msg.content}
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatRoom;
