package com.websocket.chatapp.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@Document
@AllArgsConstructor@NoArgsConstructor
public class User {
    @Id
    private String nickName;
    private String fullName;
    private Status status;

}
