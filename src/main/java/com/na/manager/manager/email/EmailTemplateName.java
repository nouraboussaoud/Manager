package com.na.manager.manager.email;

import lombok.Getter;

@Getter
public enum EmailTemplateName {
    ACTIVATE_ACCOUNT("activate_account"),
    EXTERNAL_USER_WELCOME("external_user_welcome"),
    PASSWORD_RESET("password_reset")
    ;

    private final String name;
    EmailTemplateName(String name) {
        this.name = name;
    }
}                          