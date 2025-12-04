package com.example.user_service.dtos;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class UpdateUserProfileRequestDto {
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private String gender;
    private String dietPreference;
    private List<String> allergies;  // ✅ better than raw string
    private Boolean notificationsEnabled;
    private String timezone;
}
