package com.substring.chat_app.controllers;

import com.substring.chat_app.entities.Message;
import com.substring.chat_app.entities.Room;
import com.substring.chat_app.payload.MessageRequest;
import com.substring.chat_app.repositories.RoomRepository;
import com.substring.chat_app.roomService.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;
import java.time.LocalDateTime;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class ChatController {

    @Autowired
    private RoomService roomService;

    @Autowired
    private RoomRepository roomRepository;

    @MessageMapping("/sendMessage/{roomId}")
    @SendTo("/topic/room/{roomId}")
    public Message sendMessage(@DestinationVariable String roomId, @Payload MessageRequest request) {

        Room room = roomService.findByRoomId(request.getRoomId());
        if (room == null) {
            throw new RuntimeException("Room not found!");
        }

        Message message = new Message();
        message.setContent(request.getContent());
        message.setSender(request.getSender());
        message.setTimeStamp(LocalDateTime.now());

        room.getMessages().add(message);
        roomRepository.save(room);

        return message;
    }
}
