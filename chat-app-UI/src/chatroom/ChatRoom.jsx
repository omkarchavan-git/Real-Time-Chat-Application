import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SockJS from "sockjs-client";
import { over } from "stompjs";

let stompClient = null;

const ChatRoom = () => {
  const { roomId } = useParams();
  const [connected, setConnected] = useState(false);
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const connect = () => {
    const socket = new SockJS("http://localhost:8081/chat");
    stompClient = over(socket);
    stompClient.connect({}, () => {
      setConnected(true);
      console.log("Connected to WebSocket");

      stompClient.subscribe(`/topic/room/${roomId}`, (msg) => {
        const receivedMessage = JSON.parse(msg.body);
        setMessages((prev) => [...prev, receivedMessage]);
      });
    });
  };

  const sendMessage = () => {
    if (stompClient && message.trim() !== "") {
      const msgObj = {
        sender: username || "Anonymous",
        content: message,
        roomId: roomId,
      };
      stompClient.send(`/app/sendMessage/${roomId}`, {}, JSON.stringify(msgObj));
      setMessage("");
    }
  };

  return (
    <div>
      <h2>Room: {roomId}</h2>

      {!connected ? (
        <div>
          <input
            type="text"
            placeholder="Enter your name"
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={connect}>Join Room</button>
        </div>
      ) : (
        <div>
          <div
            style={{
              border: "1px solid gray",
              height: "300px",
              width: "400px",
              margin: "20px auto",
              overflowY: "scroll",
              padding: "10px",
              background: "#f9f9f9",
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
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  );
};

export default ChatRoom;
