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




    @Override
    public void sendSelectionEmail(
            String toEmail,
            String studentName,
            String companyName,
            String roleOffered
    ) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);

        message.setSubject(
                "College Placement System - Selection Notification"
        );

        message.setText(
                "Dear " + studentName + ",\n\n" +

                        "Congratulations!\n\n" +

                        "We are pleased to inform you that you have been " +
                        "SELECTED for the following placement opportunity:\n\n" +

                        "Company: " + companyName + "\n" +
                        "Role: " + roleOffered + "\n\n" +

                        "Your application status has been updated to SELECTED " +
                        "in the College Placement System.\n\n" +

                        "Please log in to the placement portal for further details " +
                        "and instructions.\n\n" +

                        "Regards,\n" +
                        "College Placement Cell"
        );

        mailSender.send(message);

        logger.info(
                "Selection email sent to {} for company {}",
                toEmail,
                companyName
        );
    }


    @Override
    public void sendRejectionEmail(
            String toEmail,
            String studentName,
            String companyName,
            String roleOffered
    ) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);

        message.setSubject(
                "College Placement System - Application Status Update"
        );

        message.setText(
                "Dear " + studentName + ",\n\n" +

                        "Thank you for participating in the placement process.\n\n" +

                        "We regret to inform you that you have not been " +
                        "selected for the following placement opportunity:\n\n" +

                        "Company: " + companyName + "\n" +
                        "Role: " + roleOffered + "\n\n" +

                        "Your application status has been updated to REJECTED " +
                        "in the College Placement System.\n\n" +

                        "We encourage you to continue participating in upcoming " +
                        "placement opportunities.\n\n" +

                        "Regards,\n" +
                        "College Placement Cell"
        );

        mailSender.send(message);

        logger.info(
                "Rejection email sent to {} for company {}",
                toEmail,
                companyName
        );
    }





}


