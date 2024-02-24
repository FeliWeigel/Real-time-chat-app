package com.websocket.chatapp.chatroom;


import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document
@Builder
public class ChatRoom {
    @Id
    private Long id;
    private String chatId;
    private String senderId;
    private String recipientId;
}
