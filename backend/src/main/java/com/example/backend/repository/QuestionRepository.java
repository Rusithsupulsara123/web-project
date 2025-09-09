package com.example.backend.repository;

import com.example.backend.modal.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByTopic(String topic);
    List<Question> findByUserId(Long userId);
    List<Question> findByTitleContainingIgnoreCase(String title);
} 