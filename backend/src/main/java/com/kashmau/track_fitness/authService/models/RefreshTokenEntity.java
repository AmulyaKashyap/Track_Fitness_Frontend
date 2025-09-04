package com.kashmau.track_fitness.authService.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Table(name = "refresh_tokens")
public class RefreshTokenEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String token;

    @ManyToOne(fetch = FetchType.LAZY)  // ✅ Link directly to UserEntity
    @JoinColumn(name = "user_id", nullable = false)  // FK in DB
    private UserEntity user;

    @Column(nullable = false)
    private Instant expiryDate;
}
