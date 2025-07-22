package com.na.manager.manager.user;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@Builder
public class UserResponse {
    private Integer id;
    private String firstname;
    private String lastname;
    private String email;
    private LocalDate birthdate;
    private boolean accountLocked;
    private boolean enabled;
    private List<String> roles;
    private LocalDate createdDate;
    private LocalDate lastModifiedDate;
}