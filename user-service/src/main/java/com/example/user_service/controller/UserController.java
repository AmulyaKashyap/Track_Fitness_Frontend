package com.example.user_service.controller;

import com.example.user_service.dtos.CreateUserProfileDto;
import com.example.user_service.dtos.UpdateUserProfileRequestDto;
import com.example.user_service.dtos.UserResponseDto;
import com.example.user_service.models.UserProfileEntity;
import com.example.user_service.repositories.UserRepository;
import com.example.user_service.services.UserProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    private final UserProfileService userProfileService;

    @GetMapping("/getUserProfile")
    public ResponseEntity<?> getUserProfil(  @RequestHeader("X-User-Id") UUID userId){
        return userRepository.findByUserId(userId)
                .map(user -> ResponseEntity.ok(toDto(user)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/userProfile")
    public ResponseEntity<UserResponseDto> updateUserProfile(
            @RequestHeader("X-User-Id") UUID userId,
            @RequestBody UpdateUserProfileRequestDto request
    ) {
        UserResponseDto updatedUser = userProfileService.updateUserProfile(userId, request);
        return ResponseEntity.ok(updatedUser);
    }

    @PostMapping("/userProfile")
    public ResponseEntity<UserResponseDto> createUserProfile(
            @RequestHeader("X-User-Id") UUID userId,
            @RequestBody CreateUserProfileDto request
            )
    {
        UserResponseDto createdUser = userProfileService.createUserProfile(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    private UserResponseDto toDto(UserProfileEntity user) {
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
