package entities;

import lombok.*;

import java.time.LocalDateTime;

@AllArgsConstructor
@Setter
@Getter
@NoArgsConstructor
public class Message {

    private String sender;
    private String content;
    private LocalDateTime timeStamp;

    public Message(String content, String sender) {
        this.content = content;
        this.sender = sender;
        this.timeStamp = LocalDateTime.now();

    }
}
