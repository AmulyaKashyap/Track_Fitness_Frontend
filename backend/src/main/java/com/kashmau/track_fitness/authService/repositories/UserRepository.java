package com.kashmau.track_fitness.authService.repositories;

import com.kashmau.track_fitness.authService.models.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, UUID> {

    UserEntity findByEmail(String userEmail);
}
