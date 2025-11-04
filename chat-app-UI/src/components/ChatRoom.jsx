import React, { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { over } from "stompjs";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "../styles/chatroom.css";

let stompClient = null;

function ChatRoom() {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const location = useLocation();
  const passedUsername = location.state?.username || "Anonymous";

  const [connected, setConnected] = useState(false);
  const [sender] = useState(passedUsername);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Fetch history first
    fetch(`http://localhost:8081/api/rooms/${encodeURIComponent(roomId)}/messages`)
      .then((res) => {
        if (!res.ok) return [];
        return res.json();
      })
      .then((data) => setMessages(data))
      .catch(() => {});

    // Connect to websocket
    const socket = new SockJS("http://localhost:8081/chat");
    stompClient = over(socket);
    stompClient.connect({}, () => {
      setTimeout(() => {
        setConnected(true);
        stompClient.subscribe(`/topic/room/${roomId}`, onMessageReceived);
      }, 300);
    }, (err) => console.error(err));

    return () => {
      try {
        if (stompClient && stompClient.disconnect) stompClient.disconnect();
      } catch (e) {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  const onMessageReceived = (payload) => {
    const msg = JSON.parse(payload.body);
    setMessages((prev) => [...prev, msg]);
  };

  const sendMessage = () => {
    if (stompClient && connected && message.trim() !== "") {
      const chatMessage = { sender, content: message, roomId };
      stompClient.send(`/app/sendMessage/${roomId}`, {}, JSON.stringify(chatMessage));
      setMessage("");
    }
  };

  return (
    <div className="chat-container">
      <button className="dashboard-btn" onClick={() => navigate("/")}>
        ⬅ Back to Dashboard
      </button>

      <h2>Room: {roomId}</h2>
      <h4>User: {sender}</h4>
      <h5>Status: {connected ? "🟢 Connected" : "🔴 Disconnected"}</h5>

      <div className="chat-box">
        {messages.length === 0 ? <p>No messages yet.</p> : messages.map((m, idx) => (
          <div key={idx} className="chat-message">
            <strong>{m.sender}:</strong> {m.content}
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatRoom;
