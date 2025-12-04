package com.example.user_service.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@Builder
@Data
public class UserResponseDto {

    private UUID userId;  // Same as from Auth Service
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private String gender; // M/F/Other
    private String dietPreference;
    private List<String> allergies;
    private Boolean notificationsEnabled;
    private String timezone;
    private Double latestWeight;
    private Integer latestSystolicBP;
    private Integer latestDiastolicBP;
    private Double latestSugar;
    private Integer latestFitnessScore;
}
