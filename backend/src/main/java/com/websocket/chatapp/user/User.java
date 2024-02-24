package com.websocket.chatapp.user;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@Document
public class User {
    @Id
    private String nickName;
    private String fullName;
    private Status status;
    private String email;
    private String password;

}
