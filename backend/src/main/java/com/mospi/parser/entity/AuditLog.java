package com.mospi.parser.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "audit_log")
public class AuditLog {
    @Id
    private UUID id;
    
    @Column(name = "survey_id")
    private UUID surveyId;
    
    private String action;
    
    private LocalDateTime timestamp;
}
