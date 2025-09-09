package com.example.backend.service;

import com.example.backend.dto.AnswerDTO;
import com.example.backend.modal.Answer;
import com.example.backend.modal.Question;
import com.example.backend.modal.User;
import com.example.backend.repository.AnswerRepository;
import com.example.backend.repository.QuestionRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnswerService {

    @Autowired
    private AnswerRepository answerRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private UserRepository userRepository;

    public AnswerDTO createAnswer(AnswerDTO answerDTO) {
        User user = userRepository.findByEmail(answerDTO.getUserEmail());
        if (user == null) {
            throw new RuntimeException("User not found with email: " + answerDTO.getUserEmail());
        }

        Question question = questionRepository.findById(answerDTO.getQuestionId())
                .orElseThrow(() -> new RuntimeException("Question not found"));

        Answer answer = new Answer();
        answer.setContent(answerDTO.getContent());
        answer.setUser(user);
        answer.setQuestion(question);

        Answer savedAnswer = answerRepository.save(answer);
        return convertToDTO(savedAnswer);
    }

    public AnswerDTO getAnswerById(Long id) {
        Answer answer = answerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Answer not found"));
        return convertToDTO(answer);
    }

    public List<AnswerDTO> getAnswersByQuestionId(Long questionId) {
        return answerRepository.findByQuestionId(questionId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public AnswerDTO updateAnswer(Long id, AnswerDTO answerDTO) {
        Answer answer = answerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Answer not found"));

        answer.setContent(answerDTO.getContent());
        Answer updatedAnswer = answerRepository.save(answer);
        return convertToDTO(updatedAnswer);
    }

    public void deleteAnswer(Long id) {
        answerRepository.deleteById(id);
    }

    public List<AnswerDTO> getAnswersByUserEmail(String userEmail) {
        User user = userRepository.findByEmail(userEmail);
        if (user == null) {
            throw new RuntimeException("User not found with email: " + userEmail);
        }
        return answerRepository.findByUserId(user.getId()).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private AnswerDTO convertToDTO(Answer answer) {
        AnswerDTO dto = new AnswerDTO();
        dto.setId(answer.getId());
        dto.setContent(answer.getContent());
        dto.setUserEmail(answer.getUser().getEmail());
        dto.setUserName(answer.getUser().getFullName());
        dto.setQuestionId(answer.getQuestion().getId());
        dto.setCreatedAt(answer.getCreatedAt());
        dto.setUpdatedAt(answer.getUpdatedAt());
        return dto;
    }
} 