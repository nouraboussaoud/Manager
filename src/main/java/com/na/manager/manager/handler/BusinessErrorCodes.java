package com.na.manager.manager.handler;

import lombok.Getter;
import org.springframework.http.HttpStatus;

import static org.springframework.http.HttpStatus.*;


public enum BusinessErrorCodes {

    No_CODE(0,NOT_IMPLEMENTED , "No code") ,
    INCORRECT_CURRENT_PASSWORD(300 , BAD_REQUEST , "Current password is incorrect") ,
    NEW_PASSWORD_DOES_NOT_MATCH(301 , BAD_REQUEST , "The new password does not match the confirmation password") ,
    ACCOUNT_LOCKED(302,FORBIDDEN, "User Account is locked") ,
    ACCOUNT_DISABLED(303,FORBIDDEN, "User Account is disabled") ,
    BAD_CREDENTIALS(304,FORBIDDEN, "Login and / or password is incorrect") ,


    ;
    @Getter
    private final int code ;
    @Getter
    private final  String description ;
    @Getter
    private final HttpStatus httpStatus ;

    BusinessErrorCodes(int code, HttpStatus httpStatus, String description) {
        this.code = code;
        this.description = description;
        this.httpStatus = httpStatus;
    }
}
