
package com.vidyasetu.backend.controller;

import com.vidyasetu.backend.entity.Alert;
import com.vidyasetu.backend.entity.User;
import com.vidyasetu.backend.repository.UserRepository;
import com.vidyasetu.backend.service.AlertService;
import com.vidyasetu.backend.service.ParentStudentLinkService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/alerts")
public class AlertController {

    private final AlertService alertService;
    private final UserRepository userRepository;
    private final ParentStudentLinkService linkService;

    public AlertController(
            AlertService alertService,
            UserRepository userRepository,
            ParentStudentLinkService linkService) {

        this.alertService = alertService;
        this.userRepository = userRepository;
        this.linkService = linkService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public Alert addAlert(@RequestBody Alert alert) {
        return alertService.saveAlert(alert);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'NGO')")
    public List<Alert> getAllAlerts() {
        return alertService.getAllAlerts();
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'NGO', 'PARENT')")
    public ResponseEntity<?> getAlertsByStudentId(
            @PathVariable Long studentId,
            Principal principal) {

        String email = principal.getName();

        User user = userRepository.findByEmail(email)
                .orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("User not found");
        }

        if ("PARENT".equals(user.getRole())) {

            boolean linked = linkService.isParentLinkedToStudent(
                    user.getId(), studentId);

            if (!linked) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("You are not authorized to view these alerts");
            }
        }

        return ResponseEntity.ok(
                alertService.getAlertsByStudentId(studentId)
        );
    }
}
