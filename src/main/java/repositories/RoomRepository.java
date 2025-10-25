package repositories;

import entities.Room;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RoomRepository extends MongoRepository<Room, Long> {

    //get room using roomId
    Room findByRoomId(String roomId);

}
