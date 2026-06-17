package com.mospi.parser.entity;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "survey_version")
public class SurveyVersion {
    @Id
    private UUID id;
    
    @Column(name = "survey_id")
    private UUID surveyId;
    
    private Integer version;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private JsonNode schemaJson;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
