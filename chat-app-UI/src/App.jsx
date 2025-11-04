import React from "react";
import { Routes, Route } from "react-router-dom";
import ChatRoom from "./components/ChatRoom";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/chat" element={<ChatRoom />} />
    </Routes>
  );
}

export default App;
