package com.mospi.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "question_options")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionOption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private UUID questionId;

    @Column(nullable = false)
    private String label;

    @Column(nullable = false)
    private Integer code;

    private String value;

    private Integer orderIndex;
}