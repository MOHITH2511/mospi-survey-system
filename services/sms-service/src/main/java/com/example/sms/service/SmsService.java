package com.example.sms.service;

import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class SmsService {

    @Value("${twilio.phone.number}")
    private String fromNumber;

    @Value("${twilio.whatsapp.number:whatsapp:+14155238886}")
    private String whatsappNumber;

    public void sendSurveySms(
            String phoneNumber,
            String surveyName,
            String surveyLink,
            String respondentName) {

        String messageBody = String.format(
            """
            MOSPI Survey

            Dear %s,

            You have been selected to participate in:

            %s

            Survey Link:
            %s

            Thank you.
            """,
            respondentName,
            surveyName,
            surveyLink
        );

        try {
            Message.creator(
                    new PhoneNumber(phoneNumber),
                    new PhoneNumber(fromNumber),
                    messageBody
            ).create();
            System.out.println("SMS sent successfully to " + phoneNumber);
        } catch (Exception e) {
            System.err.println("Failed to send SMS to " + phoneNumber + ": " + e.getMessage());
        }
    }

    public void sendSurveyWhatsapp(
            String phoneNumber,
            String surveyName,
            String surveyLink,
            String respondentName) {

        String messageBody = String.format(
            """
            *MOSPI Survey*

            Dear %s,

            You have been selected to participate in:

            *%s*

            Survey Link:
            %s

            Thank you.
            """,
            respondentName,
            surveyName,
            surveyLink
        );

        String toWhatsappNumber = phoneNumber.startsWith("whatsapp:") ? phoneNumber : "whatsapp:" + phoneNumber;

        try {
            Message.creator(
                    new PhoneNumber(toWhatsappNumber),
                    new PhoneNumber(whatsappNumber),
                    messageBody
            ).create();
            System.out.println("WhatsApp sent successfully to " + phoneNumber);
        } catch (Exception e) {
            System.err.println("Failed to send WhatsApp to " + phoneNumber + ": " + e.getMessage());
        }
    }
}
