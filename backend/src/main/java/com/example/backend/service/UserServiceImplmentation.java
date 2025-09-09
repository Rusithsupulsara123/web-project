package com.example.backend.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.config.JwtProvider;
import com.example.backend.controller.UserException;
import com.example.backend.modal.User;
import com.example.backend.repository.UserRepository;

@Service
public class UserServiceImplmentation implements UserService{

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtProvider jwtProvider;


    @Override
    public User findUserById(Long userId) throws UserException {
        
        User user = userRepository.findById(userId)
        .orElseThrow(()->new UserException("User not found"+userId));

        return user;
    }

    @Override
    public User findUserProfileByJwt(String jwt) throws UserException {
       
        String email = jwtProvider.getEmailFormToken(jwt);
        User user = userRepository.findByEmail(email);

        if(user == null){
            throw new UserException("User not found"+email);
        }

        return user;
    }

    @Override
    public User updateUser(Long userId, User req) throws UserException {
       
        User user = findUserById(userId);

        if(req.getFullName()!=null){
            user.setFullName(req.getFullName());
        }
        if(req.getBackgroundImage()!=null){
            user.setBackgroundImage(req.getBackgroundImage());
        }
        if(req.getLocation()!=null){
            user.setLocation(req.getLocation());
        }
        if(req.getProfilepic()!=null){
            user.setProfilepic(req.getProfilepic());
        }
        if(req.getBio()!=null){
            user.setBio(req.getBio());
        }
        if(req.getBirthday()!=null){
            user.setBirthday(req.getBirthday());
        }

        return userRepository.save(user);

    }

    @Override
    public User followUser(Long userId, User user) throws UserException {
        User followToUser = findUserById(userId);

        if(user.getFollowings().contains(followToUser) && followToUser.getFollowers().contains(user)){

            user.getFollowings().remove(followToUser);
            followToUser.getFollowers().remove(user);
        }
        else{
            user.getFollowings().add(followToUser);
            followToUser.getFollowers().add(user);
        }

        userRepository.save(followToUser);
        userRepository.save(user);
        return followToUser;
    }

    @Override
    public List<User> searchUser(String query) {
       
        
        return userRepository.searcUsers(query);
    }

    @Override
    public List<User> findAllUsers() throws UserException {
    List<User> users = userRepository.findAll();

    if (users.isEmpty()) {
        throw new UserException("No users found");
    }

    return users;
}

    
}
