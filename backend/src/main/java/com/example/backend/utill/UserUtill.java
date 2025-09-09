package com.example.backend.utill;

import com.example.backend.modal.User;

public class UserUtill {
    
    public static final boolean isReqUser(User reqUser,User user2){

        return reqUser.getId().equals(user2.getId());
    }

    public static final boolean isFollowedbyReqUser(User reqUser, User user2){
        
        return reqUser.getFollowings().contains(user2);
    }
}
