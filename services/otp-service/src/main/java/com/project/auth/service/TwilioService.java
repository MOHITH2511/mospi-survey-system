package com.project.auth.service;

import com.twilio.rest.verify.v2.service.Verification;
import com.twilio.rest.verify.v2.service.VerificationCheck;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class TwilioService {

    private static final Logger logger = LoggerFactory.getLogger(TwilioService.class);

    @Value("${TWILIO_VERIFY_SERVICE_SID}")
    private String serviceSid;

    public void sendOtp(String phone) {
        logger.info("Sending OTP to phone: {}", phone);
        Verification verification = Verification.creator(
                serviceSid,
                phone,
                "sms"
        ).create();
        logger.info("Twilio Verification status: {}", verification.getStatus());
    }

    public boolean verifyOtp(String phone, String otp) {
        logger.info("Verifying OTP for phone: {}", phone);
        VerificationCheck verificationCheck = VerificationCheck.creator(
                serviceSid
        )
        .setTo(phone)
        .setCode(otp)
        .create();
        
        logger.info("Twilio Verification Check status: {}", verificationCheck.getStatus());
        return "approved".equalsIgnoreCase(verificationCheck.getStatus());
    }
}
