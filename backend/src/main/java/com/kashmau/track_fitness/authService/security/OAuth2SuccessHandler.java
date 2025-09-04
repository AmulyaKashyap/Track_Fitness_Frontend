package com.kashmau.track_fitness.authService.security;

import com.kashmau.track_fitness.authService.models.RefreshTokenEntity;
import com.kashmau.track_fitness.authService.models.UserEntity;
import com.kashmau.track_fitness.authService.repositories.UserRepository;
import com.kashmau.track_fitness.authService.services.RefreshTokenService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final UserRepository repo;
    private final RefreshTokenService refreshTokenService;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(10);

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        UserEntity user = repo.findByEmail(email);
        if (user != null) log.info("User present, logging in: {} ", email);
        else {
            user = new UserEntity();
            user.setEmail(email);
            user.setPassword(encoder.encode(""));
            user.setRole("USER");
            repo.save(user);
        }
        // Generate JWT for the user

        String jwt = jwtService.generateToken(user);
        RefreshTokenEntity refreshToken = refreshTokenService.createRefreshToken(user);
        Cookie cookie = new Cookie("refreshToken", refreshToken.getToken());
        cookie.setHttpOnly(true);
        cookie.setSecure(false);   // ✅ Set TRUE in production (HTTPS)
        cookie.setPath("/");
        cookie.setMaxAge(7 * 24 * 60 * 60); // 7 days
        response.addCookie(cookie);
        log.info("Google login success, REDIRECTING...");
        response.sendRedirect("http://localhost:5173/login/success?token=" + jwt);
    }
}

