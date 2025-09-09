package com.example.backend.service;

import com.example.backend.dto.ProgressDTO;
import com.example.backend.modal.Progress;
import com.example.backend.repository.ProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProgressService {

    private final ProgressRepository progressRepository;

    @Autowired
    public ProgressService(ProgressRepository progressRepository) {
        this.progressRepository = progressRepository;
    }

    public List<ProgressDTO> getAllProgress() {
        return progressRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ProgressDTO getProgressById(Long id) {
        return progressRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new RuntimeException("Progress not found with id: " + id));
    }

    public ProgressDTO createProgress(ProgressDTO progressDTO) {
        Progress progress = convertToEntity(progressDTO);
        Progress savedProgress = progressRepository.save(progress);
        return convertToDTO(savedProgress);
    }

    public ProgressDTO updateProgress(Long id, ProgressDTO progressDTO) {
        Progress existingProgress = progressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Progress not found with id: " + id));

        existingProgress.setTitle(progressDTO.getTitle());
        existingProgress.setSkill(progressDTO.getSkill());
        existingProgress.setProgress(progressDTO.getProgress());
        existingProgress.setChallenges(progressDTO.getChallenges());
        existingProgress.setNextSteps(progressDTO.getNextSteps());

        Progress updatedProgress = progressRepository.save(existingProgress);
        return convertToDTO(updatedProgress);
    }

    public void deleteProgress(Long id) {
        if (!progressRepository.existsById(id)) {
            throw new RuntimeException("Progress not found with id: " + id);
        }
        progressRepository.deleteById(id);
    }

    private ProgressDTO convertToDTO(Progress progress) {
        ProgressDTO dto = new ProgressDTO();
        dto.setId(progress.getId());
        dto.setTitle(progress.getTitle());
        dto.setSkill(progress.getSkill());
        dto.setProgress(progress.getProgress());
        dto.setChallenges(progress.getChallenges());
        dto.setNextSteps(progress.getNextSteps());
        dto.setCreatedAt(progress.getCreatedAt());
        dto.setUpdatedAt(progress.getUpdatedAt());
        return dto;
    }

    private Progress convertToEntity(ProgressDTO dto) {
        Progress progress = new Progress();
        progress.setTitle(dto.getTitle());
        progress.setSkill(dto.getSkill());
        progress.setProgress(dto.getProgress());
        progress.setChallenges(dto.getChallenges());
        progress.setNextSteps(dto.getNextSteps());
        return progress;
    }
} 