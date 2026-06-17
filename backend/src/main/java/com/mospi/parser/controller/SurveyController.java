package com.mospi.parser.controller;

import com.mospi.parser.dto.SurveyDto;
import com.mospi.parser.entity.Survey;
import com.mospi.parser.entity.SurveyVersion;
import com.mospi.parser.service.SurveyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/surveys")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class SurveyController {

    private final SurveyService surveyService;

    @PostMapping
    public ResponseEntity<Survey> createSurvey(@RequestBody SurveyDto dto) {
        return ResponseEntity.ok(surveyService.createSurvey(dto));
    }

    @GetMapping
    public ResponseEntity<List<Survey>> getAllSurveys() {
        return ResponseEntity.ok(surveyService.getAllSurveys());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Survey> getSurvey(@PathVariable UUID id) {
        return ResponseEntity.ok(surveyService.getSurvey(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Survey> updateSurvey(@PathVariable UUID id, @RequestBody SurveyDto dto) {
        return ResponseEntity.ok(surveyService.updateSurvey(id, dto));
    }

    @GetMapping("/{id}/versions")
    public ResponseEntity<List<SurveyVersion>> getSurveyVersions(@PathVariable UUID id) {
        return ResponseEntity.ok(surveyService.getSurveyVersions(id));
    }

    @GetMapping("/{id}/versions/{version}")
    public ResponseEntity<SurveyVersion> getSurveyVersion(@PathVariable UUID id, @PathVariable Integer version) {
        return ResponseEntity.ok(surveyService.getSurveyVersion(id, version));
    }
}
