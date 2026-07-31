package com.mospi.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "survey_versions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SurveyVersion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String surveyId;

    private Integer version;

    @Column(columnDefinition = "jsonb")
    private String schemaJson;

    private LocalDateTime createdAt;
}