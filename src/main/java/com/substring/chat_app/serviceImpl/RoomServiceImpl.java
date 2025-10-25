package com.substring.chat_app.serviceImpl;

import com.substring.chat_app.entities.Room;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.substring.chat_app.repositories.RoomRepository;
import com.substring.chat_app.roomService.RoomService;

@Service
public class RoomServiceImpl implements RoomService {


    @Autowired
    private RoomRepository roomRepository;

    public Room findroombyid(String roomId){
        Room roombyid = roomRepository.findByRoomId(roomId);
        return roombyid;
    }
}
