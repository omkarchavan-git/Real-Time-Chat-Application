package entities;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collation = "rooms")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class Room {

    @Id
    private long id;
    private int roomid;
    private List<Message> messages = new ArrayList<>();


}
