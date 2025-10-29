package com.substring.chat_app.controllers;

import com.substring.chat_app.entities.Message;
import com.substring.chat_app.entities.Room;
import com.substring.chat_app.payload.MessageRequest;
import com.substring.chat_app.repositories.RoomRepository;
import com.substring.chat_app.roomService.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/rooms")
public class ChatController {

    @Autowired
    private RoomService roomService;

    @Autowired
    private RoomRepository roomRepository;

    //to send and receive messages
    @MessageMapping("/sendMessage/{roomId}")
    @SendTo("/topic/room/{roomId}")
    public Message sendMessage( @DestinationVariable String roomId,
                                @RequestBody MessageRequest request) {

        Room room = roomService.findByRoomId(request.getRoomId());
        Message message = new Message();
        message.setContent(request.getContent());
        message.setSender(request.getSender());
        message.setTimeStamp(LocalDateTime.now());

        if (room != null)
        {
            room.getMessages().add(message);
            roomRepository.save(room);
        }
        else {
            throw new RuntimeException("Room not found !");
        }
        return message;
    }
}
