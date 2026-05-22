package com.mospi.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "flags")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Flag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String responseId;

    private String reason; // fast entry, inconsistent data

    private String severity; // low, medium, high

    private String status; // open, resolved

    private LocalDateTime createdAt;
}