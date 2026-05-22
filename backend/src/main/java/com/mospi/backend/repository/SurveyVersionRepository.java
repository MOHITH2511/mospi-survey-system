package com.mospi.backend.repository;

import com.mospi.backend.model.SurveyVersion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SurveyVersionRepository extends JpaRepository<SurveyVersion, Long> {
}