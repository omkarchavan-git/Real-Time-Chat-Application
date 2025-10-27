package com.substring.chat_app.roomService;

import com.substring.chat_app.entities.Room;

public interface RoomService {

    //get room using roomId
    Room findByRoomId(String roomId);

}
