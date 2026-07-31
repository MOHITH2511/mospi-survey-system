package com.mospi.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "responses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Response {

    @Id
    private UUID id;

    private String surveyId;

    private UUID respondentId;

    private String submittedBy;

    private String mode;

    private String status;

    private LocalDateTime startedAt;

    private LocalDateTime submittedAt;
}