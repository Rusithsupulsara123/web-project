package com.example.backend.modal;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import lombok.Data;

@Entity
@Data
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
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
    //private boolean 

    @JsonIgnore
    @ManyToMany
    private List<User>followers = new ArrayList<>();

    @JsonIgnore
    @ManyToMany
    private List<User>followings = new ArrayList<>();

    
}
