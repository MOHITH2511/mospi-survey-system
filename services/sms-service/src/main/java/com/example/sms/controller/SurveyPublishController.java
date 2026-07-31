package com.example.sms.controller;

import com.example.sms.model.AadharRecord;
import com.example.sms.model.Survey;
import com.example.sms.repository.AadharRepository;
import com.example.sms.repository.SurveyRepository;
import com.example.sms.service.SmsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/surveys")
public class SurveyPublishController {

    @Autowired
    private SurveyRepository surveyRepository;

    @Autowired
    private AadharRepository aadharRepository;

    @Autowired
    private SmsService smsService;

    @PostMapping("/publish/{surveyId}")
    public ResponseEntity<?> publishSurvey(
            @PathVariable String surveyId,
            @RequestParam(defaultValue = "sms") String channel,
            @RequestParam(required = false) String title) {

        String finalTitle = title != null && !title.isEmpty() ? title : "National Sample Survey";
        String surveyLink = "http://localhost:5173/citizen/survey?id=" + surveyId;

        // Fetch numbers from the dummy Aadhar DB
        List<AadharRecord> aadharRecords = aadharRepository.findAll();

        for (AadharRecord record : aadharRecords) {
            // Publishing the survey to the fetched Aadhar record
            if (channel.equalsIgnoreCase("sms") || channel.equalsIgnoreCase("both")) {
                smsService.sendSurveySms(
                        record.getPhoneNumber(),
                        finalTitle,
                        surveyLink,
                        record.getName()
                );
            }
            if (channel.equalsIgnoreCase("whatsapp") || channel.equalsIgnoreCase("both")) {
                smsService.sendSurveyWhatsapp(
                        record.getPhoneNumber(),
                        finalTitle,
                        surveyLink,
                        record.getName()
                );
            }
        }

        return ResponseEntity.ok(String.format("Survey Published to %d recipients via %s", aadharRecords.size(), channel));
    }
}
