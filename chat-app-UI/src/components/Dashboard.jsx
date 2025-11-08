import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

const API = "http://localhost:8081";

export default function Dashboard() {
  const [name, setName] = useState("");
  const [roomIdInput, setRoomIdInput] = useState("");
  const [joinRoomInput, setJoinRoomInput] = useState("");
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch(`${API}/api/rooms/all`);
        if (res.ok) {
          const data = await res.json();
          // show newest first & limit to 10
          const sorted = [...data].reverse().slice(0, 5);
          setRooms(sorted);
        }
      } catch (err) {
        console.error("Error fetching rooms:", err);
      }
    };
    fetchRooms();
  }, []);

  const createRoom = async () => {
    const newRoomId =
      roomIdInput.trim() || `room-${Date.now().toString(36).slice(-6)}`;
    try {
      const res = await fetch(`${API}/api/rooms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId: newRoomId }),
      });

      if (!res.ok) {
        const text = await res.text();
        alert("Room creation failed: " + text);
        return;
      }

      const created = await res.json();
      alert(`Room created: ${created.roomId}`);

      setRooms((prev) => [{ roomId: created.roomId }, ...prev].slice(0, 10));
      setRoomIdInput("");
    } catch (err) {
      console.error(err);
      alert("Error creating room");
    }
  };

  const joinRoom = (id) => {
    if (!name.trim()) {
      alert("Please enter your name before joining a room!");
      return;
    }
    localStorage.setItem("username", name);
    localStorage.setItem("roomId", id);
    navigate(`/chat/${id}`, {state : {username : name, roomId : id }});
   // navigate(`/chat/${id}?user=${encodeURIComponent(name)}`);
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">💬 Substring Chat — Dashboard</h2>

      <div className="input-section">
        <input
          type="text"
          placeholder="Your name (required)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field"
        />

        <div className="room-actions">
          <input
            type="text"
            placeholder="Enter room id (or leave blank to auto-generate)"
            value={roomIdInput}
            onChange={(e) => setRoomIdInput(e.target.value)}
            className="input-field"
          />
          <button onClick={createRoom} className="btn create">
            + Create Room
          </button>
        </div>

        <div className="room-actions">
          <input
            type="text"
            placeholder="Enter room id to join"
            value={joinRoomInput}
            onChange={(e) => setJoinRoomInput(e.target.value)}
            className="input-field"
          />
          <button onClick={() => joinRoom(joinRoomInput)} className="btn join">
            🔗 Join Room
          </button>
        </div>
      </div>  

      <h3 className="room-list-title">🕒 Recent Rooms</h3>
      <div className="room-list">
        {rooms.length === 0 ? (
          <p className="no-room">No rooms available yet.</p>
        ) : (
          rooms.map((r, index) => (
            <div key={index} className="room-card">
              <span className="room-name">Room : {r.roomId.replace("roomId","").replace(/[":{}]/g, "").trim()}</span>
              <button
                onClick={() => joinRoom(r.roomId)}
                className="btn join-small"
              >
                Join
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


