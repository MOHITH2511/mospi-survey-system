package com.mospi.parser.controller;

import com.mospi.parser.dto.SurveyDto;
import com.mospi.parser.service.PdfSurveyParserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/parser")
@CrossOrigin(origins = "http://localhost:5173")
public class SurveyParserController {

    private final PdfSurveyParserService parserService;

    public SurveyParserController(PdfSurveyParserService parserService) {
        this.parserService = parserService;
    }

    @PostMapping("/upload")
    public ResponseEntity<SurveyDto> uploadPdf(@RequestParam("file") MultipartFile file) {
        try {
            SurveyDto response = parserService.parsePdf(file.getBytes(), file.getOriginalFilename());
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
