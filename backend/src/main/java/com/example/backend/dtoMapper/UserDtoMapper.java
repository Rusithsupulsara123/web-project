package com.example.backend.dtoMapper;

import java.util.ArrayList;
import java.util.List;

import com.example.backend.dto.UserDto;
import com.example.backend.modal.User;

public class UserDtoMapper {
    
    public static UserDto toUserDto(User user){

        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setEmail(user.getEmail());
        userDto.setFullName(user.getFullName());
        userDto.setLocation(user.getLocation());
        userDto.setBio(user.getBio());
        userDto.setBackgroundImage(user.getBackgroundImage());
        userDto.setProfilepic(user.getProfilepic());
        userDto.setBirthday(user.getBirthday());

        userDto.setFollowers(toUserDtos(user.getFollowers()));
        userDto.setFollowings(toUserDtos(user.getFollowings()));

        userDto.setLogin_with_google(user.isLogin_with_google());
        

        return userDto;
    }

    public static List<UserDto> toUserDtos (List<User> followers) {
        List<UserDto> userDtos = new ArrayList<>();

        for (User user :followers) {
            
            UserDto userDto = new UserDto();
            userDto.setId(user.getId());
            userDto.setEmail(user.getEmail());
            userDto.setFullName(user.getFullName());
            userDto.setProfilepic(user.getProfilepic());
            userDtos.add(userDto);
        }

        return userDtos;
    }
}
