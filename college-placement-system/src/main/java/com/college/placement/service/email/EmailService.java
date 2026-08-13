
package com.college.placement.service.email;

public interface EmailService {

    void sendPasswordResetEmail(
            String toEmail,
            String resetCode
    );

    void sendSelectionEmail(
            String toEmail,
            String studentName,
            String companyName,
            String roleOffered
    );

    void sendRejectionEmail(
            String toEmail,
            String studentName,
            String companyName,
            String roleOffered
    );
}

