package com.substring.chat_app.controllers;

import com.substring.chat_app.entities.Message;
import com.substring.chat_app.entities.Room;
import com.substring.chat_app.repositories.RoomRepository;
import com.substring.chat_app.roomService.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    @Autowired
    private RoomService roomService;

    @Autowired
    private RoomRepository roomRepository;

    //create room
    @PostMapping()
    public ResponseEntity<?> createRoom(@RequestBody String roomId){

        if(roomService.findByRoomId(roomId) != null){
            // the room is already Exists
            return ResponseEntity.badRequest().body("the room is already exists !");

        }
        //create new room
        Room room = new Room();
        room.setRoomId(roomId);
        Room savedRoom = roomRepository.save(room);
        return ResponseEntity.status(HttpStatus.CREATED).body(room);

    }

    // Join room
    @GetMapping("/{roomId}")
    public ResponseEntity<?> joinRoom(@PathVariable String roomId){
        Room room = roomRepository.findByRoomId(roomId);
        if (room == null)
        {
            return ResponseEntity.badRequest().body("Room Not Found");
        }
        return ResponseEntity.ok(room);
    }


    //get messages of the room

    @GetMapping("/{roomId}/messages")
    public ResponseEntity<List<Message>> getMessages (@PathVariable String roomId){

        Room room = roomRepository.findByRoomId(roomId);
        if (room == null)
        {
            return ResponseEntity.badRequest().build();
        }
        List<Message> messages = room.getMessages();
        return ResponseEntity.ok(messages);

    }

}
