package com.college.placement.service.email;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private static final Logger logger =
            LoggerFactory.getLogger(EmailServiceImpl.class);

    private final JavaMailSender mailSender;

    @Override
    public void sendPasswordResetEmail(String toEmail, String resetCode) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);
        message.setSubject("College Placement System - Password Reset Code");

        message.setText(
                "Hello,\n\n" +
                        "Your password reset code is:\n\n" +
                        resetCode +
                        "\n\nThis code is valid for 15 minutes.\n\n" +
                        "If you did not request this password reset, please ignore this email."
        );

        mailSender.send(message);

        logger.info("Password reset email sent to {}", toEmail);
    }
}