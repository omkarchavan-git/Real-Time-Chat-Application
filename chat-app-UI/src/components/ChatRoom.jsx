import React, { useEffect, useState, useRef } from "react";
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
  const activeRoom = roomId || roomIdParam;

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!activeRoom || !username) {

      console.warn("Missing room or username, redirecting to dashboard...");
      navigate("/");
      return;
    }

    const socket = new SockJS("http://localhost:8081/chat");
    stompClient = over(socket);

    stompClient.connect({}, () => {
      console.log("Connected to WebSocket in room:", activeRoom);

      // Subscribe to specific room topic
      stompClient.subscribe(`/topic/room/${activeRoom}`, (payload) => {
        const receivedMsg = JSON.parse(payload.body);
        setMessages((prev) => [...prev, receivedMsg]);
      });
    });

    return () => {
      if (stompClient && stompClient.connected) {
        stompClient.disconnect(() => {
          console.log("Disconnected");
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
    stompClient.send("/app/message", {}, JSON.stringify(msg));
    setMessage("");
  };

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
            className={`chat-message ${msg.sender === username ? "self" : "other"
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
