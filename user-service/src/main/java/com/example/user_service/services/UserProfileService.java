package com.example.user_service.services;

import com.example.user_service.dtos.CreateUserProfileDto;
import com.example.user_service.dtos.UpdateUserProfileRequestDto;
import com.example.user_service.dtos.UserResponseDto;
import com.example.user_service.models.UserProfileEntity;
import com.example.user_service.repositories.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserProfileService {

    private final UserRepository userRepository;
    private final ObjectMapper objectMapper; // for JSONB conversion

    public UserResponseDto updateUserProfile(UUID userId, UpdateUserProfileRequestDto request) {
        UserProfileEntity user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getFirstName() != null) user.setFirstName(request.getFirstName());
        if (request.getLastName() != null) user.setLastName(request.getLastName());
        if (request.getDateOfBirth() != null) user.setDateOfBirth(request.getDateOfBirth());
        if (request.getGender() != null) user.setGender(request.getGender());
        if (request.getDietPreference() != null) user.setDietPreference(request.getDietPreference());
        if (request.getAllergies() != null) user.setAllergies(request.getAllergies());
        if (request.getNotificationsEnabled() != null) user.setNotificationsEnabled(request.getNotificationsEnabled());
        if (request.getTimezone() != null) user.setTimezone(request.getTimezone());

        userRepository.save(user);

        // convert entity → response DTO
        return UserResponseDto.builder()
                .userId(user.getUserId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .dateOfBirth(user.getDateOfBirth())
                .gender(user.getGender())
                .dietPreference(user.getDietPreference())
                .allergies(user.getAllergies())
                .notificationsEnabled(user.getNotificationsEnabled())
                .timezone(user.getTimezone())
                .latestWeight(user.getLatestWeight())
                .latestSystolicBP(user.getLatestSystolicBP())
                .latestDiastolicBP(user.getLatestDiastolicBP())
                .latestSugar(user.getLatestSugar())
                .latestFitnessScore(user.getLatestFitnessScore())
                .build();
    }

    public UserResponseDto createUserProfile(UUID userId, CreateUserProfileDto request) {
        UserProfileEntity user = new UserProfileEntity();
        user.setUserId(userId);
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
//        user.setDateOfBirth(request.getDateOfBirth());
        user.setGender(request.getGender());

        userRepository.save(user);
        return UserResponseDto.builder()
                .userId(user.getUserId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .dateOfBirth(user.getDateOfBirth())
                .gender(user.getGender())
                .dietPreference(user.getDietPreference())
                .allergies(user.getAllergies())
                .notificationsEnabled(user.getNotificationsEnabled())
                .timezone(user.getTimezone())
                .latestWeight(user.getLatestWeight())
                .latestSystolicBP(user.getLatestSystolicBP())
                .latestDiastolicBP(user.getLatestDiastolicBP())
                .latestSugar(user.getLatestSugar())
                .latestFitnessScore(user.getLatestFitnessScore())
                .build();
    }
}
