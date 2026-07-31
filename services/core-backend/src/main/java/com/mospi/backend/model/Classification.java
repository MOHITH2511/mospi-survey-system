package com.mospi.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "classifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Classification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private String description;
}