
package com.vidyasetu.backend.controller;

import com.vidyasetu.backend.entity.ParentStudentLink;
import com.vidyasetu.backend.entity.Student;
import com.vidyasetu.backend.entity.User;
import com.vidyasetu.backend.repository.StudentRepository;
import com.vidyasetu.backend.repository.UserRepository;
import com.vidyasetu.backend.service.ParentStudentLinkService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/parent-links")
public class ParentStudentLinkController {

    private final ParentStudentLinkService linkService;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;

    public ParentStudentLinkController(
            ParentStudentLinkService linkService,
            UserRepository userRepository,
            StudentRepository studentRepository) {

        this.linkService = linkService;
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<?> createLink(
            @RequestBody Map<String, Long> request) {

        Long parentUserId = request.get("parentUserId");
        Long studentId = request.get("studentId");

        if (parentUserId == null || studentId == null) {
            return ResponseEntity.badRequest()
                    .body("Parent user ID and student ID are required");
        }

        User parent = userRepository.findById(parentUserId)
                .orElse(null);

        if (parent == null || !"PARENT".equals(parent.getRole())) {
            return ResponseEntity.badRequest()
                    .body("Valid parent account not found");
        }

        Student student = studentRepository.findById(studentId)
                .orElse(null);

        if (student == null) {
            return ResponseEntity.badRequest()
                    .body("Student not found");
        }

        try {
            ParentStudentLink link =
                    linkService.linkStudentToParent(
                            parentUserId, studentId);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(link);

        } catch (RuntimeException exception) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(exception.getMessage());
        }
    }

    @GetMapping("/children/{parentUserId}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<ParentStudentLink> getParentLinks(
            @PathVariable Long parentUserId) {

        return linkService.getChildren(parentUserId);
    }
}

