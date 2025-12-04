package com.example.user_service.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Represents the core user profile in the system.
 * - userId comes from Auth Service (UUID, consistent across microservices).
 * - Stores stable profile details + latest cached health snapshots for quick access.
 * - Relationships exist with goals, health history, metrics, and fitness scores.
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileEntity {

    @Id
    @Column(nullable = false, updatable = false)
    private UUID userId;  // Same as from Auth Service

    @Column(length = 50)
    private String firstName;

    @Column(length = 50)
    private String lastName;


    private LocalDate dateOfBirth;

    @Column(length = 10)
    private String gender; // M/F/Other

    @Column(length = 50)
    private String dietPreference;

    /**
     * Allergies stored as JSONB for flexibility.
     * Example: ["nuts", "gluten"]
     */
    @JdbcTypeCode(SqlTypes.JSON) /*To parse JSON correctly otherwise hibernate treats it as array and fail while parsing response*/
    @Column(columnDefinition = "jsonb")
    private List<String> allergies;

    @Column(nullable = false)
    private Boolean notificationsEnabled = true;

    @Column(length = 50)
    private String timezone;

    // Cached snapshot values for quick reads (denormalization)
    private Double latestWeight;
    private Integer latestSystolicBP;
    private Integer latestDiastolicBP;
    private Double latestSugar;
    private Integer latestFitnessScore;

    // --- Relationships ---

    @Builder.Default
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<GoalEntity> goals = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<HealthHistoryEntity> healthHistory = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<MetricEntity> metrics = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<FitnessScoreEntity> fitnessScores = new ArrayList<>();
}
