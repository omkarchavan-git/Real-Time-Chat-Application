import React, { useEffect, useState } from "react";
import "../styles/dashboard.css";
import ChatRoom from "./ChatRoom";

function Dashboard() {
  const [rooms, setRooms] = useState([]);
  const [roomId, setRoomId] = useState("");
  const [joinedRoom, setJoinedRoom] = useState(null);
  const [username, setUsername] = useState("");

  // Fetch all rooms (optional — if you want to list them)
  useEffect(() => {
    fetch("http://localhost:8081/api/rooms")
      .then((res) => res.json())
      .then((data) => setRooms(data))
      .catch((err) => console.error("Error fetching rooms:", err));
  }, []);

  // Create new room
  const createRoom = async () => {
    if (!roomId.trim()) return alert("Enter a Room ID");

    try {
      const res = await fetch("http://localhost:8081/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(roomId),
      });

      if (res.ok) {
        alert("Room created successfully!");
        setRooms([...rooms, { roomId }]);
        setRoomId("");
      } else {
        const text = await res.text();
        alert(text);
      }
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  if (joinedRoom) {
    // when user joins, load ChatApp
    return <ChatApp sender={username} roomId={joinedRoom} />;
  }

  return (
    <div className="dashboard-container">
      <h2>Welcome to Substring Chat</h2>

      <div>
        <input
          type="text"
          placeholder="Enter your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div>
        <input
          type="text"
          placeholder="Create new Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <button onClick={createRoom}>Create Room</button>
      </div>

      <div className="room-list">
        <h3>Available Rooms</h3>
        {rooms.length === 0 ? (
          <p>No rooms created yet.</p>
        ) : (
          rooms.map((room, index) => (
            <div key={index} className="room-item">
              <span>{room.roomId}</span>
              <button onClick={() => setJoinedRoom(room.roomId)}>Join Room</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;
