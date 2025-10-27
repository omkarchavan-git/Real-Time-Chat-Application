package com.substring.chat_app.repositories;

import com.substring.chat_app.entities.Room;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RoomRepository extends MongoRepository<Room, Long> {

    Room findByRoomId(String roomId);



}
