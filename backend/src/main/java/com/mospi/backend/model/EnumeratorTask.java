package com.mospi.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "enumerator_tasks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnumeratorTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String enumeratorId;

    private String surveyId;

    private Long regionId;

    private String status;

    private LocalDateTime assignedAt;
}