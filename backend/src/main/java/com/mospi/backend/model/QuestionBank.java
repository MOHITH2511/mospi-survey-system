package com.mospi.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "question_bank")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionBank {

    @Id
    private UUID id;

    @Column(nullable = false)
    private String text;

    @Column(nullable = false)
    private String type;

    private String category;

    @Column(columnDefinition = "jsonb")
    private String validationRules;

    private UUID createdBy;

    private LocalDateTime createdAt;

    private Boolean isActive;
}