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
  const activeRoom = String(
    typeof rawRoom === "object" ? rawRoom.roomId : rawRoom
  )
    .replace(/roomId|[\/\[\]\{\}"':]/g, "")
    .replace(/^room/, "room")
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

    //  Fetch old messages
    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `http://localhost:8081/api/rooms/${activeRoom}/messages`
        );
        if (res.ok) {
          const oldMessages = await res.json();
          console.log("📜 Loaded old messages:", oldMessages);
          setMessages(oldMessages);
        } else {
          console.error("Failed to load previous messages");
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();

    //  Connect to WebSocket
    const socket = new SockJS("http://localhost:8081/chat");
    stompClient = over(socket);

    stompClient.connect({}, () => {
      console.log(`✅ Connected to WebSocket for room: ${activeRoom}`);

      stompClient.subscribe(`/topic/room/${activeRoom}`, (payload) => {
        const receivedMsg = JSON.parse(payload.body);
        console.log("📩 New message received:", receivedMsg);
        setMessages((prev) => [...prev, receivedMsg]);
      });
    });


    return () => {
      if (stompClient && stompClient.connected) {
        stompClient.disconnect(() => {
          console.log("🔌 Disconnected from WebSocket");
        });
      }
    };
  }, [activeRoom, username, navigate]);

  //  Send a new message
  const sendMessage = () => {
    if (!message.trim()) return;

    const msg = {
      sender: username,
      content: message,
      roomId: activeRoom,
    };

    console.log("🚀 Sending message:", msg);
    stompClient.send(`/app/sendMessage/${activeRoom}`, {}, JSON.stringify(msg));
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
        {messages.length === 0 ? (
          <p className="no-messages">No messages yet...</p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`chat-message ${
                msg.sender === username ? "self" : "other"
              }`}
            >
              <b>{msg.sender}:</b> {msg.content}
            </div>
          ))
        )}
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
