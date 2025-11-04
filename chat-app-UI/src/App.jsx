import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import ChatRoom from "./components/ChatRoom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/chat/:roomId" element={<ChatRoom />} />
    </Routes>
  );
}

export default App;
