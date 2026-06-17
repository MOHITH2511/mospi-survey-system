package com.mospi.parser.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import java.util.UUID;

@Data
@Entity
@Table(name = "question_bank")
public class QuestionBank {
    @Id
    private UUID id;
}
