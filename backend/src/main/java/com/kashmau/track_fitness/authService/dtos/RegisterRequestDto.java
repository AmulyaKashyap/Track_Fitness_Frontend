package com.kashmau.track_fitness.authService.dtos;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RegisterRequestDto {
    private String name;
    private String email;
    private String password;
    private String role;
}
