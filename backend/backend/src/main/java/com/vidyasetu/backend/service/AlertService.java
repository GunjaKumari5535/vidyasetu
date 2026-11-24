package com.vidyasetu.backend.service;

import com.vidyasetu.backend.entity.Alert;
import com.vidyasetu.backend.entity.Student;
import com.vidyasetu.backend.repository.AlertRepository;
import com.vidyasetu.backend.repository.StudentRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AlertService {

    private final AlertRepository alertRepository;
    private final StudentRepository studentRepository;
    private final SmsService smsService;

    public AlertService(
            AlertRepository alertRepository,
            StudentRepository studentRepository,
            SmsService smsService) {

        this.alertRepository = alertRepository;
        this.studentRepository = studentRepository;
        this.smsService = smsService;
    }

    public Alert saveAlert(Alert alert) {

        Alert savedAlert = alertRepository.save(alert);

        Student student = studentRepository
                .findById(alert.getStudentId())
                .orElse(null);

        if (student != null &&
                student.getParentPhone() != null &&
                !student.getParentPhone().isBlank()) {

            String message = "Dear Parent, " +
                    "your child's performance needs attention. " +
                    alert.getMessage() +
                    " Please contact the teacher. - VidyaSetu";

            try {
                smsService.sendSms(
                        student.getParentPhone(),
                        message
                );
            } catch (Exception e) {
                System.err.println("SMS sending failed: " + e.getMessage());
            }
        }

        return savedAlert;
    }

    public List<Alert> getAllAlerts() {
        return alertRepository.findAll();
    }

    public List<Alert> getAlertsByStudentId(Long studentId) {
        return alertRepository.findByStudentId(studentId);
    }
}