package com.mospi.parser.repository;

import com.mospi.parser.entity.SurveyVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SurveyVersionRepository extends JpaRepository<SurveyVersion, UUID> {
    List<SurveyVersion> findBySurveyIdOrderByVersionDesc(UUID surveyId);
    Optional<SurveyVersion> findBySurveyIdAndVersion(UUID surveyId, Integer version);
}
