package com.project.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class VerifyOtpRequest {
    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^\\+[1-9]\\d{1,14}$", message = "Phone number must be in E.164 format")
    private String phone;

    @NotBlank(message = "OTP is required")
    @Size(min = 4, max = 8, message = "OTP must be between 4 and 8 digits")
    @Pattern(regexp = "^\\d+$", message = "OTP must contain only digits")
    private String otp;
}
