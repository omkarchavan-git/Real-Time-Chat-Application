package com.substring.chat_app.controllers;

import com.substring.chat_app.entities.Message;
import com.substring.chat_app.entities.Room;
import com.substring.chat_app.repositories.RoomRepository;
import com.substring.chat_app.roomService.RoomService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173") // Allow React frontend
@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    @Autowired
    private RoomService roomService;

    @Autowired
    private RoomRepository roomRepository;

    /** Get all rooms */
    @GetMapping("/all")
    public ResponseEntity<List<Room>> getAllRooms() {
        List<Room> rooms = roomRepository.findAll();
        return ResponseEntity.ok(rooms);
    }

    /** Create a new room (Fix for malformed roomId             */
    @PostMapping
    public ResponseEntity<?> createRoom(@RequestBody Map<String, Object> body) {
        // Extract the clean roomId value
        Object roomIdObj = body.get("roomId");
        if (roomIdObj == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing roomId"));
        }

        String roomId = roomIdObj.toString().trim();

        // Sanitize any malformed JSON-like value
        if (roomId.startsWith("{")) {
            try {
                JSONObject json = new JSONObject(roomId);
                roomId = json.getString("roomId");
            } catch (Exception e) {
                roomId = roomId.replaceAll("[^a-zA-Z0-9_-]", "");
            }
        }

        // Prevent duplicate rooms
        if (roomService.findByRoomId(roomId) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Room already exists!", "roomId", roomId));
        }

        // Create and save clean Room
        Room room = new Room();
        room.setRoomId(roomId);
        Room savedRoom = roomRepository.save(room);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Room created successfully");
        response.put("roomId", savedRoom.getRoomId());

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }


//      Join an existing room

    @GetMapping("/{roomId}")
    public ResponseEntity<?> joinRoom(@PathVariable String roomId) {
        Room room = roomRepository.findByRoomId(roomId);
        if (room == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Room not found", "roomId", roomId));
        }
        return ResponseEntity.ok(room);
    }

    /**
     Get all messages for a room
     */
    @GetMapping("/{roomId}/messages")
    public ResponseEntity<?> getMessages(@PathVariable String roomId) {
        Room room = roomRepository.findByRoomId(roomId);
        if (room == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Room not found", "roomId", roomId));
        }

        List<Message> messages = room.getMessages();
        return ResponseEntity.ok(messages);
    }
}
