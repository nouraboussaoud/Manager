package com.na.manager.manager.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.util.HashMap;
import java.util.Map;

import static java.nio.charset.StandardCharsets.UTF_8;
import static org.springframework.mail.javamail.MimeMessageHelper.MULTIPART_MODE_MIXED;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;

    @Async
    public void sendEmail(
            String to,
            String username,
            EmailTemplateName emailTemplate,
            String confirmationUrl,
            String activationCode,
            String subject
    ) throws MessagingException {
        String templateName;
        if (emailTemplate == null) {
            templateName = "confirm-email";
        } else {
            templateName = emailTemplate.name();
        }
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(
                mimeMessage,
                MULTIPART_MODE_MIXED,
                UTF_8.name()
        );
        Map<String, Object> properties = new HashMap<>();
        properties.put("username", username);
        properties.put("confirmationUrl", confirmationUrl);
        properties.put("activation_code", activationCode);

        Context context = new Context();
        context.setVariables(properties);

        helper.setFrom("nour.aboussaoud@esprit.tn");
        helper.setTo(to);
        helper.setSubject(subject);

        String template = templateEngine.process(templateName, context);

        helper.setText(template, true);

        mailSender.send(mimeMessage);
    }

    @Async
    public void sendExternalUserWelcomeEmail(
            String to,
            String firstName,
            String resetPasswordUrl
    ) throws MessagingException {
        log.info("Preparing to send external user welcome email with reset link to: {}", to);
        
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(
                mimeMessage,
                MULTIPART_MODE_MIXED,
                UTF_8.name()
        );
        
        Map<String, Object> properties = new HashMap<>();
        properties.put("firstName", firstName);
        properties.put("email", to);
        properties.put("resetPasswordUrl", resetPasswordUrl);

        Context context = new Context();
        context.setVariables(properties);

        helper.setFrom("nour.aboussaoud@esprit.tn");
        helper.setTo(to);
        helper.setSubject("Welcome to Manager System - Set Your Password");

        String template = templateEngine.process("external_user_welcome", context);
        helper.setText(template, true);

        mailSender.send(mimeMessage);
        log.info("External user welcome email with reset link sent successfully to: {}", to);
    }

    @Async
    public void sendPasswordResetEmail(
            String to,
            String firstName,
            String resetPasswordUrl
    ) throws MessagingException {
        log.info("Preparing to send password reset email to: {}", to);
        
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(
                mimeMessage,
                MULTIPART_MODE_MIXED,
                UTF_8.name()
        );
        
        Map<String, Object> properties = new HashMap<>();
        properties.put("firstName", firstName);
        properties.put("email", to);
        properties.put("resetPasswordUrl", resetPasswordUrl);

        Context context = new Context();
        context.setVariables(properties);

        helper.setFrom("nour.aboussaoud@esprit.tn");
        helper.setTo(to);
        helper.setSubject("Password Reset Request - Manager System");

        String template = templateEngine.process("password_reset", context);
        helper.setText(template, true);

        mailSender.send(mimeMessage);
        log.info("Password reset email sent successfully to: {}", to);
    }
}
