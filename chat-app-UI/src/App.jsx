import React, { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { over } from "stompjs";

let stompClient = null;

const ChatApp = () => {
  const [connected, setConnected] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomId, setRoomId] = useState("");
  const [sender, setSender] = useState("");
  const [joined, setJoined] = useState(false);

  const connect = () => {
    const socket = new SockJS("http://localhost:8081/chat");
    stompClient = over(socket);

    stompClient.connect({}, () => {
      setTimeout(() => {
        setConnected(true);
        stompClient.subscribe(`/topic/room/${roomId}`, onMessageReceived);
      }, 500);
    }, onError);
  };

  const onError = (error) => {
    console.error("❌ Connection error:", error);
  };

  const onMessageReceived = (payload) => {
    const msg = JSON.parse(payload.body);
    setMessages((prev) => [...prev, msg]);
  };

  const sendMessage = () => {
    if (stompClient && connected && message.trim() !== "") {
      const chatMessage = {
        sender: sender,
        content: message,
        roomId: roomId,
      };

      stompClient.send(
        `/app/sendMessage/${roomId}`,
        {},
        JSON.stringify(chatMessage)
      );
      setMessage("");
    }
  };

  const joinRoom = () => {
    if (sender.trim() !== "" && roomId.trim() !== "") {
      connect();
      setJoined(true);

      // Fetch old messages from backend REST API
      fetch(`http://localhost:8081/api/rooms/${roomId}/messages`)
        .then((res) => res.json())
        .then((data) => setMessages(data))
        .catch((err) => console.error("Error fetching messages:", err));
    }
  };

  if (!joined) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>Join Chat Room</h2>
        <input
          type="text"
          placeholder="Enter your name"
          value={sender}
          onChange={(e) => setSender(e.target.value)}
          style={{ padding: "8px", margin: "5px" }}
        />
        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          style={{ padding: "8px", margin: "5px" }}
        />
        <button onClick={joinRoom} style={{ padding: "8px 15px" }}>
          Join
        </button>
      </div>
    );
  }

  return (
    <div style={{ margin: "30px auto", width: "500px" }}>
      <h2>Room: {roomId}</h2>
      <h3>User: {sender}</h3>
      <h4>Status: {connected ? "🟢 Connected" : "🔴 Disconnected"}</h4>

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
};

export default ChatApp;
