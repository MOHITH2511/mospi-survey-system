package com.mospi.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "respondents")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Respondent {

    @Id
    private UUID id;

    private String phone;

    private Long regionId;

    private LocalDateTime createdAt;
}