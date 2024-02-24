package com.websocket.chatapp.exceptions;

public class BusyCredentialsException extends RuntimeException{
    public BusyCredentialsException(String message){
        super(message);
    }
}
