import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ChatRoom from "./components/ChatRoom";

function App() {
  return (
    <Router>
      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <h1>💬 Real-Time Group Chat</h1>

        <nav style={{ marginBottom: "20px" }}>
          <Link to="/room/room1" style={linkStyle}>Room 1</Link>
          <Link to="/room/room2" style={linkStyle}>Room 2</Link>
          <Link to="/room/room3" style={linkStyle}>Room 3</Link>
        </nav>

        <Routes>
          <Route path="/room/:roomId" element={<ChatRoom />} />
          <Route path="*" element={<div>Select a room to start chatting.</div>} />
        </Routes>
      </div>
    </Router>
  );
}

const linkStyle = {
  margin: "0 15px",
  textDecoration: "none",
  color: "blue",
  fontWeight: "bold",
};

export default App;
