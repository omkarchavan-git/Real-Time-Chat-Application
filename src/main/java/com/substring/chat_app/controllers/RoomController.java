package com.substring.chat_app.controllers;

import com.substring.chat_app.entities.Room;
import com.substring.chat_app.repositories.RoomRepository;
import com.substring.chat_app.roomService.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

public class RoomController {

    @Autowired
    private RoomService roomService;

    @Autowired
    private RoomRepository roomRepository;

    //create room
    @PostMapping
    public ResponseEntity<?> createRoom(@RequestBody String roomId){

        if(roomService.findByRoomId(roomId) != null){
            // the room is already Exists
            return ResponseEntity.badRequest().body("the room is already exists !");

        }
        //create new room
        Room room = new Room();
        room.setRoomId(roomId);
        Room savedRoom = roomRepository.save(room);

    }
}
