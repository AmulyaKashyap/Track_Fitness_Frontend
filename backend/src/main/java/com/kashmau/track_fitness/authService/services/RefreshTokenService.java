package com.kashmau.track_fitness.authService.services;

import com.kashmau.track_fitness.authService.models.RefreshTokenEntity;
import com.kashmau.track_fitness.authService.models.UserEntity;
import com.kashmau.track_fitness.authService.repositories.RefreshTokenRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    @Transactional
    public RefreshTokenEntity createRefreshToken(UserEntity user) {
        refreshTokenRepository.deleteByUser(user);
        log.info("REFRESH TOKEN GENERATING ");

        RefreshTokenEntity refreshToken = RefreshTokenEntity.builder().token(UUID.randomUUID().toString()).user(user).expiryDate(Instant.now().plusMillis(604800000)) // 7 days
                .build();

        return refreshTokenRepository.save(refreshToken);
    }

    public RefreshTokenEntity validateRefreshToken(String token) {
        log.info("REFRESH TOKEN: {}", token);
        return refreshTokenRepository.findByToken(token).filter(rt -> rt.getExpiryDate().isAfter(Instant.now())).orElseThrow(() -> new RuntimeException("Invalid or expired refresh token"));
    }
}

