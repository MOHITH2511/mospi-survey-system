package com.mospi.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "surveys")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Survey {

    @Id
    private UUID id;

    @Column(nullable = false)
    private String title;

    private String description;

    private Integer version;

    @Column(nullable = false)
    private String status; // draft, published, closed

    @Column(columnDefinition = "jsonb")
    @org.hibernate.annotations.ColumnTransformer(write = "?::jsonb")
    private String schemaJson;

    private UUID createdBy;

    private LocalDateTime createdAt;
}