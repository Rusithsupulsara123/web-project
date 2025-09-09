package com.example.backend.dto;

import java.util.ArrayList;
import java.util.List;

import lombok.Data;

@Data
public class UserDto {
    
    private Long Id;
    private String fullName;
    private String location;
    private String birthday;
    private String bio;
    private String email;
    private String password;
    private String backgroundImage;
    private String profilepic;
    private boolean req_user;
    private boolean login_with_google;

    private List<UserDto>followers = new ArrayList<>();
    private List<UserDto>followings = new ArrayList<>();

    private boolean followed;
}
