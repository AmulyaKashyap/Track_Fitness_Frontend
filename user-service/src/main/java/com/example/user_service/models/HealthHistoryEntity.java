package com.example.user_service.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "health_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HealthHistoryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long historyId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserProfileEntity user;

    private String healthIssueType;
    private String description;
    private LocalDateTime reportedAt;
    private LocalDateTime updatedAt;

    private String severity; // optional
    private String status;   // ongoing, resolved
}

