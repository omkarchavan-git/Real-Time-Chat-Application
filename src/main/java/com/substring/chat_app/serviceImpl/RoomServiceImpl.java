package com.substring.chat_app.serviceImpl;

import com.substring.chat_app.entities.Room;
import com.substring.chat_app.repositories.RoomRepository;
import com.substring.chat_app.roomService.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
public class RoomServiceImpl implements RoomService {


    @Autowired
    private RoomRepository roomRepository;



    @Override
    public Room findByRoomId(String roomId) {
       return roomRepository.findByRoomId(roomId);
    }
}
