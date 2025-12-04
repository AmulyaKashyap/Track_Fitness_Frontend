package com.example.user_service.dtos;

import lombok.Data;

import java.util.UUID;

@Data
public class CreateUserProfileDto {
    private String firstName;
    private String lastName;
    private String gender;
}

