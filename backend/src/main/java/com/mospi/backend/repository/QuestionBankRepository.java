package com.mospi.backend.repository;

import com.mospi.backend.model.QuestionBank;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface QuestionBankRepository extends JpaRepository<QuestionBank, UUID> {
}