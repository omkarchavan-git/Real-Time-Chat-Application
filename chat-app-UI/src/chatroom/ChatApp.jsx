import React, { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { over } from "stompjs";

let stompClient = null;

const ChatApp = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // ✅ Connect to backend
    const socket = new SockJS("http://localhost:8081/chat");
    stompClient = over(socket);

    stompClient.connect({}, onConnected, onError);

    return () => {
      if (stompClient) stompClient.disconnect();
    };
  }, []);

  const onConnected = () => {
    setConnected(true);
    console.log("Connected to WebSocket ✅");

    // ✅ Subscribe to topic
    stompClient.subscribe("/topic/room/room1", (msg) => {
      const received = JSON.parse(msg.body);
      setMessages((prev) => [...prev, received]);
    });
  };

  const onError = (err) => {
    console.error("Connection error ❌", err);
  };

  const sendMessage = () => {
    if (stompClient && message.trim() !== "") {
      const chatMsg = {
        sender: "User1", // change dynamically later
        content: message,
      };

      // ✅ Send message to backend endpoint
      stompClient.send("/app/sendMessage", {}, JSON.stringify(chatMsg));

      // ✅ Add immediately to UI (optional: to feel responsive)
      setMessages((prev) => [...prev, chatMsg]);
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg w-96">
        <div className="p-4 bg-blue-600 text-white font-bold rounded-t-lg">
          Chat Room
        </div>

        <div className="p-4 h-64 overflow-y-auto border-b">
          {messages.length === 0 && <p>No messages yet...</p>}
          {messages.map((msg, index) => (
            <div key={index} className="mb-2">
              <b>{msg.sender}: </b>
              <span>{msg.content}</span>
            </div>
          ))}
        </div>

        <div className="p-4 flex gap-2">
          <input
            type="text"
            value={message}
            placeholder="Type message..."
            className="flex-1 border px-2 py-1 rounded"
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            disabled={!connected}
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
