package com.example.backend.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.UserDto;
import com.example.backend.dtoMapper.UserDtoMapper;
import com.example.backend.modal.User;
import com.example.backend.service.UserService;
import com.example.backend.utill.UserUtill;

@RestController
@RequestMapping("api/users")
public class UserController {
    
    @Autowired
    private UserService userService;


    @GetMapping("/profile")
    public ResponseEntity<UserDto> getUserProfile (@RequestHeader("Authorization")String jwt)
        throws UserException{
            
            User user = userService.findUserProfileByJwt(jwt);
            UserDto userDto = UserDtoMapper.toUserDto(user);
            userDto.setReq_user(true);

            return new ResponseEntity<UserDto>(userDto,HttpStatus.ACCEPTED);
            
        }
    
    @GetMapping("/{userId}")
    public ResponseEntity<UserDto> getUserProfile (@PathVariable Long userId,
    @RequestHeader("Authorization")String jwt)
        throws UserException{
                
            User reqUser = userService.findUserProfileByJwt(jwt);

            User user = userService.findUserById(userId);
            UserDto userDto = UserDtoMapper.toUserDto(user);
            userDto.setReq_user(UserUtill.isReqUser(reqUser, user));
             userDto.setFollowed(UserUtill.isFollowedbyReqUser(reqUser, user));
            return new ResponseEntity<UserDto>(userDto,HttpStatus.ACCEPTED);
                
        }

    @GetMapping("/search")
    public ResponseEntity<List<UserDto>> searchUser (@RequestParam String query,
    @RequestHeader("Authorization")String jwt)
        throws UserException{
                    
            User reqUser = userService.findUserProfileByJwt(jwt);
    
            List<User> users = userService.searchUser(query);
            List<UserDto> userDtos = UserDtoMapper.toUserDtos(users);
                    
            return new ResponseEntity<>(userDtos,HttpStatus.ACCEPTED);
        }

    @PutMapping("/update")
    public ResponseEntity<UserDto> updateUser (@RequestBody User req,
    @RequestHeader("Authorization")String jwt)
        throws UserException{
                        
            User reqUser = userService.findUserProfileByJwt(jwt);
        
            User user = userService.updateUser(reqUser.getId(),req);
            UserDto userDto = UserDtoMapper.toUserDto(user);
                        
            return new ResponseEntity<>(userDto,HttpStatus.ACCEPTED);
        }

    @PutMapping("/{userId}/follow")
    public ResponseEntity<UserDto> followUser (@PathVariable Long userId,
    @RequestHeader("Authorization")String jwt)
        throws UserException{
                            
            User reqUser = userService.findUserProfileByJwt(jwt);
            
            User user = userService.followUser(userId, reqUser);
            UserDto userDto = UserDtoMapper.toUserDto(user);
            userDto.setFollowed(UserUtill.isFollowedbyReqUser(reqUser, user));
                            
            return new ResponseEntity<>(userDto,HttpStatus.ACCEPTED);
        }

    @GetMapping("/allprofiles")
    public ResponseEntity<List<UserDto>> getAllUserProfiles() throws UserException {

    List<User> users = userService.findAllUsers(); 
    List<UserDto> userDtos = users.stream()
                                  .map(UserDtoMapper::toUserDto)
                                  .collect(Collectors.toList());

    return new ResponseEntity<>(userDtos, HttpStatus.OK);
    }

}
