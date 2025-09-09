package com.example.backend.service;

import com.example.backend.modal.Post;
import com.example.backend.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;

    public Post createPost(Post post) {
        return postRepository.save(post);
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }

    public Post updatePost(Long id, Post updatedPost) {
        Post existingPost = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        existingPost.setContent(updatedPost.getContent());
        existingPost.setMediaUrl(updatedPost.getMediaUrl());
        existingPost.setMediaType(updatedPost.getMediaType());

        return postRepository.save(existingPost);
    }
}
