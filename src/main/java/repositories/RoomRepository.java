package repositories;

import entities.Room;
import org.springframework.data.mongodb.repository.MongoRepository;

public class RoomRepository extends MongoRepository<Room, long> {
}
