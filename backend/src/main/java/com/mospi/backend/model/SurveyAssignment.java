package com.mospi.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "survey_assignments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SurveyAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String surveyId;

    private Long regionId;

    private String assignedBy;

    private LocalDateTime assignedAt;
}