package serviceImpl;

import entities.Room;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import repositories.RoomRepository;
import roomService.RoomService;

import java.util.List;

@Service
public class RoomServiceImpl implements RoomService {


    @Autowired
    private RoomRepository roomRepository;

    public Room findroombyid(String roomId){
        Room roombyid = roomRepository.findByRoomId(roomId);
        return roombyid;
    }
}
