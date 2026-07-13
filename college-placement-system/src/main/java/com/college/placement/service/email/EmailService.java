package com.college.placement.service.email;

public interface EmailService {

    void sendPasswordResetEmail(String toEmail, String resetCode);

}