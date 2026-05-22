package com.mospi.backend.repository;

import com.mospi.backend.model.Respondent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface RespondentRepository extends JpaRepository<Respondent, UUID> {
}