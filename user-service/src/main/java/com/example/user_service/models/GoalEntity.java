package com.example.user_service.models;

import com.example.user_service.utils.GoalStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "goals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GoalEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long goalId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserProfileEntity user;

    private String goalName;
    private String activityLevel;
    private Double targetGoalValue;
    private LocalDate targetDate;

    @Enumerated(EnumType.STRING)
    private GoalStatus status; // ACTIVE, ACHIEVED, FAILED
}

