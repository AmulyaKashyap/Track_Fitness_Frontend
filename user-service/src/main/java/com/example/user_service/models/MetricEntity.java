package com.example.user_service.models;


import com.example.user_service.utils.MetricType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "metrics")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MetricEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long metricId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserProfileEntity user;

    @Enumerated(EnumType.STRING)
    private MetricType type;  // BODY, BP, SUGAR, VITAL

    // Body
    private Double height;
    private Double weight;
    private Double bodyFat;

    // BP
    private Integer systolicBP;
    private Integer diastolicBP;

    // Sugar
    private Double bloodSugar;

    private LocalDateTime recordedAt;
}

