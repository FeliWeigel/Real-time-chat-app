package com.websocket.chatapp.chat;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ChatNotification {

    private String messageId;
    private String senderId;
    private String recipientId;
    private String content;
}
