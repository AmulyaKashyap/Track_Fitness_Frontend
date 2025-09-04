package com.kashmau.track_fitness.authService.controllers;

import com.kashmau.track_fitness.authService.dtos.AuthResponseDto;
import com.kashmau.track_fitness.authService.dtos.LoginRequestDto;
import com.kashmau.track_fitness.authService.dtos.RegisterRequestDto;
import com.kashmau.track_fitness.authService.models.RefreshTokenEntity;
import com.kashmau.track_fitness.authService.models.UserEntity;
import com.kashmau.track_fitness.authService.repositories.UserRepository;
import com.kashmau.track_fitness.authService.security.JwtService;
import com.kashmau.track_fitness.authService.services.RefreshTokenService;
import com.kashmau.track_fitness.authService.services.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;

@RestController
@Slf4j
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final UserRepository userRepository;

    @PostMapping("/register")
    public UserEntity register(@RequestBody RegisterRequestDto user) {
        return userService.registerUser(user);
    }

    @PostMapping("/loginUser")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto user, HttpServletResponse response) {
        log.info("LOGGING IN {}", user.getEmail());
        UserEntity verifiedUser = userService.verify(user);
        String newAccessToken = jwtService.generateToken(verifiedUser);
        RefreshTokenEntity refreshToken = refreshTokenService.createRefreshToken(verifiedUser);
        Cookie cookie = new Cookie("refreshToken", refreshToken.getToken());
        cookie.setHttpOnly(true);
        cookie.setSecure(false);   // ✅ Set TRUE in production (HTTPS)
        cookie.setPath("/");
        cookie.setMaxAge(7 * 24 * 60 * 60); // 7 days
        response.addCookie(cookie);
        return ResponseEntity.ok(new AuthResponseDto(newAccessToken));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshAccessToken(HttpServletRequest request) {
        log.info("GENERATING REFRESH TOKEN");
        if (request.getCookies() == null)
            return ResponseEntity.status(401).body("Missing refresh token");
        String refreshToken = Arrays.stream(request.getCookies())
                .filter(c -> c.getName().equals("refreshToken"))
                .findFirst()
                .map(Cookie::getValue)
                .orElse(null);

        if (refreshToken == null) {
            log.error("Refresh token is NULL");
            return ResponseEntity.status(401).body("Missing refresh token");
        }

        RefreshTokenEntity validToken = refreshTokenService.validateRefreshToken(refreshToken);
        UserEntity user = userRepository.findById(validToken.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        String newAccessToken = jwtService.generateToken(user);
        return ResponseEntity.ok(new AuthResponseDto(newAccessToken));
    }


    @GetMapping("/test")
    public String test() {
        return "HELLO";
    }


}
