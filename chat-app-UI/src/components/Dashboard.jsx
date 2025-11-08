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

  // ✅ Fetch recent rooms
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch(`${API}/api/rooms/all`);
        if (res.ok) {
          const data = await res.json();
          const sorted = [...data].reverse().slice(0, 5);
          setRooms(sorted);
        }
      } catch (err) {
        console.error("Error fetching rooms:", err);
      }
    };
    fetchRooms();
  }, []);

  // ✅ Create room
  const createRoom = async () => {
    const newRoomId =
      roomIdInput.trim() || `room-${Date.now().toString(36).slice(-6)}`;
    try {
      const res = await fetch(`${API}/api/rooms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId: newRoomId }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert("❌ " + (data.error || "Room creation failed"));
        return;
      }

      alert(`✅ Room created: ${data.roomId}`);
      setRooms((prev) => [{ roomId: data.roomId }, ...prev].slice(0, 10));
      setRoomIdInput("");
    } catch (err) {
      console.error(err);
      alert("Error creating room");
    }
  };

  // ✅ Join room
  const joinRoom = (id) => {
    if (!name.trim()) {
      alert("Please enter your name before joining a room!");
      return;
    }

    const room = typeof id === "object" ? id.roomId : id;
    const cleanRoom = String(room).replace(/roomId/g, "").replace(/[{}"]/g, "").trim();

    console.log("Joining clean room:", cleanRoom);

    localStorage.setItem("username", name);
    localStorage.setItem("roomId", cleanRoom);
    navigate(`/chat/${cleanRoom}`, { state: { username: name, roomId: cleanRoom } });
  };

  // ✅ Extract room name safely
  const getRoomName = (r) => {
    if (!r) return "Unknown";
    if (typeof r === "string") return r;
    if (typeof r === "object" && r.roomId) return r.roomId;
    return JSON.stringify(r);
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
          rooms.map((r, index) => {
            const roomName = getRoomName(r).replace("roomId", "").replace(/[{}"]/g, "").trim();
            return (
              <div key={index} className="room-card">
                <span className="room-name">Room: {roomName}</span>
                <button onClick={() => joinRoom(roomName)} className="btn join-small">
                  Join
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
