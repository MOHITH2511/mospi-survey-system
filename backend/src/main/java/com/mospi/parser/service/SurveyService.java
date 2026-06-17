package com.mospi.parser.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mospi.parser.dto.SurveyDto;
import com.mospi.parser.entity.AuditLog;
import com.mospi.parser.entity.Survey;
import com.mospi.parser.entity.SurveyVersion;
import com.mospi.parser.repository.AuditLogRepository;
import com.mospi.parser.repository.SurveyRepository;
import com.mospi.parser.repository.SurveyVersionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SurveyService {
    private final SurveyRepository surveyRepository;
    private final SurveyVersionRepository surveyVersionRepository;
    private final AuditLogRepository auditLogRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    public Survey createSurvey(SurveyDto dto) {
        UUID surveyId = UUID.randomUUID();
        
        Survey survey = new Survey();
        survey.setId(surveyId);
        survey.setTitle(dto.getTitle());
        survey.setDescription(dto.getTitle());
        survey.setVersion(1);
        survey.setStatus("DRAFT");
        survey.setSchemaJson(objectMapper.valueToTree(dto));
        survey.setCreatedAt(LocalDateTime.now());
        survey.setUpdatedAt(LocalDateTime.now());
        survey.setCreatedBy("system");
        
        surveyRepository.save(survey);
        
        createVersionSnapshot(survey);
        logAudit(surveyId, "CREATE_SURVEY");
        
        return survey;
    }

    @Transactional
    public Survey updateSurvey(UUID id, SurveyDto dto) {
        Survey survey = surveyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Survey not found"));
        
        survey.setVersion(survey.getVersion() + 1);
        survey.setTitle(dto.getTitle());
        survey.setSchemaJson(objectMapper.valueToTree(dto));
        survey.setUpdatedAt(LocalDateTime.now());
        
        surveyRepository.save(survey);
        
        createVersionSnapshot(survey);
        logAudit(id, "UPDATE_SURVEY");
        
        return survey;
    }

    public List<Survey> getAllSurveys() {
        return surveyRepository.findAll();
    }

    public Survey getSurvey(UUID id) {
        Survey survey = surveyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Survey not found"));
        logAudit(id, "VIEW_SURVEY");
        return survey;
    }

    public List<SurveyVersion> getSurveyVersions(UUID surveyId) {
        return surveyVersionRepository.findBySurveyIdOrderByVersionDesc(surveyId);
    }

    public SurveyVersion getSurveyVersion(UUID surveyId, Integer version) {
        return surveyVersionRepository.findBySurveyIdAndVersion(surveyId, version)
                .orElseThrow(() -> new RuntimeException("Version not found"));
    }

    private void createVersionSnapshot(Survey survey) {
        SurveyVersion version = new SurveyVersion();
        version.setId(UUID.randomUUID());
        version.setSurveyId(survey.getId());
        version.setVersion(survey.getVersion());
        version.setSchemaJson(survey.getSchemaJson());
        version.setCreatedAt(LocalDateTime.now());
        surveyVersionRepository.save(version);
    }

    private void logAudit(UUID surveyId, String action) {
        AuditLog log = new AuditLog();
        log.setId(UUID.randomUUID());
        log.setSurveyId(surveyId);
        log.setAction(action);
        log.setTimestamp(LocalDateTime.now());
        auditLogRepository.save(log);
    }
}
