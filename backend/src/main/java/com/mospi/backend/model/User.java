package com.mospi.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    private String phone;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String status;

    @ManyToOne
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    private Integer regionId;

    private LocalDateTime createdAt;
}