package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProgressDTO {
    private Long id;
    private String title;
    private String skill;
    private String progress;
    private String challenges;
    private String nextSteps;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}