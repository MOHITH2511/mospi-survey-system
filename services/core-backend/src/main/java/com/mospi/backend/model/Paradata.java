package com.mospi.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "paradata")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Paradata {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String responseId;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private Integer duration;

    private Double gpsLat;

    private Double gpsLng;

    private String deviceType;
}