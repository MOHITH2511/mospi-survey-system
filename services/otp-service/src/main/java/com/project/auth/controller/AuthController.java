package com.project.auth.controller;

import com.project.auth.dto.ApiResponse;
import com.project.auth.dto.AuthResponse;
import com.project.auth.dto.CurrentUserResponse;
import com.project.auth.dto.SendOtpRequest;
import com.project.auth.dto.VerifyOtpRequest;
import com.project.auth.service.TwilioService;
import com.project.auth.util.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentication", description = "OTP Authentication APIs")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final TwilioService twilioService;
    private final JwtUtil jwtUtil;

    public AuthController(TwilioService twilioService, JwtUtil jwtUtil) {
        this.twilioService = twilioService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/send-otp")
    @Operation(summary = "Send OTP to phone number")
    public ResponseEntity<ApiResponse<Void>> sendOtp(@Valid @RequestBody SendOtpRequest request) {
        logger.info("Received request to send OTP to: {}", request.getPhone());
        twilioService.sendOtp(request.getPhone());
        return ResponseEntity.ok(ApiResponse.success("OTP sent successfully", null));
    }

    @PostMapping("/verify-otp")
    @Operation(summary = "Verify OTP and generate JWT")
    public ResponseEntity<ApiResponse<AuthResponse>> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        logger.info("Received request to verify OTP for: {}", request.getPhone());
        
        boolean isValid = twilioService.verifyOtp(request.getPhone(), request.getOtp());
        
        if (isValid) {
            String token = jwtUtil.generateToken(request.getPhone());
            return ResponseEntity.ok(ApiResponse.success("Operation successful", new AuthResponse(true, token)));
        } else {
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid or expired OTP"));
        }
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user")
    public ResponseEntity<CurrentUserResponse> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String phone = authentication.getName();
        return ResponseEntity.ok(new CurrentUserResponse(true, phone));
    }
}
