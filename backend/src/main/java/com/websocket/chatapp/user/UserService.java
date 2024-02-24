package com.websocket.chatapp.user;

import com.websocket.chatapp.exceptions.BusyCredentialsException;
import com.websocket.chatapp.exceptions.NullFieldsException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository repository;

    public ResponseEntity<Object> registerUser(User user){
        if(user.getFullName().isBlank() || user.getNickName().isBlank() ||
                user.getEmail().isBlank() || user.getPassword().isBlank()
        ){
            return new ResponseEntity<>(new NullFieldsException("Warning! Fields cannot be null. Please, complete all credentials."), HttpStatus.BAD_REQUEST);
        }else if(repository.findById(user.getNickName()).isPresent()){
            return new ResponseEntity<>(new BusyCredentialsException("The nickname is associated with an existing account. Please try again."), HttpStatus.CONFLICT);
        }

        user.setStatus(Status.ONLINE);
        return new ResponseEntity<>(repository.save(user), HttpStatus.OK);
    }

    public void disconnect(User user){
        var savedUser = repository.findById(user.getNickName())
                .orElse(null);
        if(savedUser != null) {
            savedUser.setStatus(Status.OFFLINE);
            repository.save(savedUser);
        }
    }

    public List<User> findConnectedUsers(){
        return repository.findAllByStatus(Status.ONLINE);
    }
}
