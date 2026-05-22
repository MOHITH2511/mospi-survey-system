package com.mospi.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "classification_codes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClassificationCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "classification_id", nullable = false)
    private Classification classification;

    @Column(nullable = false)
    private String code;

    @Column(nullable = false)
    private String label;

    private String parentCode;

    private Integer level;
}