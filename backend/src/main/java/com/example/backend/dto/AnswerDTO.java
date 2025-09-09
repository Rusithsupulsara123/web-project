package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnswerDTO {
    private Long id;
    private String content;
    private String userEmail;
    private String userName;
    private Long questionId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 