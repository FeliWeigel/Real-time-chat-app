package com.websocket.chatapp.user;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
@RequiredArgsConstructor
@CrossOrigin("http://localhost:5173")
public class UserController {

    private final UserService userService;

    @MessageMapping("/user.addUser")
    @SendTo("/user/topic")
    public ResponseEntity<Object> registerUser(@Payload User user){
        return userService.registerUser(user);
    }

    @MessageMapping("/user.disconnectUser")
    @SendTo("/user/topic")
    public ResponseEntity<Object> disconnectUser(@Payload User user){
        userService.disconnect(user);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> findAllUsers(){
        return ResponseEntity.ok(userService.findAllUsers());
    }

    @GetMapping("/online_users")
    public ResponseEntity<List<User>> findOnlineUsers(){
        return ResponseEntity.ok(userService.findConnectedUsers());
    }

    @GetMapping("/offline_users")
    public ResponseEntity<List<User>> findOfflineUsers(){
        return ResponseEntity.ok(userService.findDisconnectedUsers());
    }
}
