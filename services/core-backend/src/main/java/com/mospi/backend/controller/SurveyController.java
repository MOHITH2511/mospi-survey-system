package com.mospi.backend.controller;

import com.mospi.backend.model.Survey;
import com.mospi.backend.repository.SurveyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/surveys")
@CrossOrigin(origins = "*")
public class SurveyController {

    @Autowired
    private SurveyRepository surveyRepository;

    @PostMapping
    public ResponseEntity<Survey> saveSurvey(@RequestBody Survey survey) {
        if (survey.getId() == null) {
            survey.setId(UUID.randomUUID());
        }
        if (survey.getCreatedAt() == null) {
            survey.setCreatedAt(LocalDateTime.now());
        }
        if (survey.getVersion() == null) {
            survey.setVersion(1);
        }
        Survey saved = surveyRepository.save(survey);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<List<Survey>> getAllSurveys() {
        List<Survey> surveys = surveyRepository.findAll();
        return ResponseEntity.ok(surveys);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Survey> getSurveyById(@PathVariable UUID id) {
        return surveyRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
