package com.mospi.backend.repository;

import com.mospi.backend.model.Survey;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface SurveyRepository extends JpaRepository<Survey, UUID> {
}