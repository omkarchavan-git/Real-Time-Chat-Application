import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

const API = "http://localhost:8081";

function Dashboard() {
  const [rooms, setRooms] = useState([]);
  const [roomIdInput, setRoomIdInput] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

 useEffect(() => {
  
  const fetchRooms = async () => {
    try {
      const res = await fetch(`${API}/api/rooms/all`);
      if (res.ok) {
        const data = await res.json();
        setRooms(data);
      }
    } catch (err) {
      console.error("Error fetching rooms:", err);
    }
  };

  fetchRooms();
  fetch("http://localhost:8081/api/rooms")
    .then(res => res.json())
    .then(data => setRooms(data))
    .catch(err => console.error(err));
}, []);

const createRoom = async () => {
  const newRoomId =
    roomIdInput.trim() || `room-${Date.now().toString(36).slice(-6)}`;

  try {
    const res = await fetch(`${API}/api/rooms`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId: newRoomId }), // ✅ send as JSON object
    });

    if (!res.ok) {
      const text = await res.text();
      alert("Create room failed: " + text);
      return;
    }

    const created = await res.json();
    alert(`Room created: ${created.roomId}`);

    //  Update the room list locally
    setRooms((prev) => [...prev, created]);

     
    localStorage.setItem(
      "rooms",
      JSON.stringify([...rooms, created])
    );

    setRoomIdInput("");
  } catch (err) {
    console.error(err);
    alert("Error creating room");
  }
};



  const joinRoom = async (targetRoomId) => {
    const idToCheck = targetRoomId || roomIdInput.trim();
    if (!username.trim()) return alert("Enter your name first");
    if (!idToCheck) return alert("Enter or select a Room ID to join");

    try {
      const res = await fetch(`${API}/api/rooms/${encodeURIComponent(idToCheck)}`);
      if (!res.ok) {
        const text = await res.text();
        alert("Room not found: " + text);
        return;
      }
      const room = await res.json();
      // Navigate to chat and pass username via state
      navigate(`/chat/${idToCheck}`, { state: { username } });
    } catch (err) {
      console.error(err);
      alert("Error joining room");
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Substring Chat — Dashboard</h2>

      <div className="username-row">
        <input
          type="text"
          placeholder="Your name (required)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div className="create-row">
        <input
          type="text"
          placeholder="Enter room id (or leave blank to auto-generate)"
          value={roomIdInput}
          onChange={(e) => setRoomIdInput(e.target.value)}
        />
        <button onClick={createRoom}>Create Room</button>
      </div>

      <div className="join-row">
        <input
          type="text"
          placeholder="Enter room id to join"
          value={roomIdInput}
          onChange={(e) => setRoomIdInput(e.target.value)}
        />
        <button onClick={() => joinRoom()}>Join Room</button>
      </div>

      <div className="room-list">
        <h3>Available Rooms</h3>
        {rooms.length === 0 ? (
          <p>No rooms available yet.</p>
        ) : (
          rooms.map((room, idx) => (
            <div className="room-item" key={idx}>
              <span>{room.roomId}</span>
              <div>
                <button
                  onClick={() => {
                    // fill input for convenience and join
                    setRoomIdInput(room.roomId);
                    // call join after small timeout to allow username check
                    setTimeout(() => joinRoom(room.roomId), 50);
                  }}
                >
                  Join
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;
