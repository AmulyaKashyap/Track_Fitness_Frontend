package com.kashmau.track_fitness.authService.repositories;

import com.kashmau.track_fitness.authService.models.RefreshTokenEntity;
import com.kashmau.track_fitness.authService.models.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface RefreshTokenRepository extends JpaRepository<RefreshTokenEntity, UUID> {
    Optional<RefreshTokenEntity> findByToken(String token);

    void deleteByUser(UserEntity user);
}
