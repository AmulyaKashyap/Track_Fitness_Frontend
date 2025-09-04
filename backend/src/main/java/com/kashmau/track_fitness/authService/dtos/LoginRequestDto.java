package com.kashmau.track_fitness.authService.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginRequestDto {
    private String email;
    private String password;
}
