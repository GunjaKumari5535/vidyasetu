
package com.vidyasetu.backend.controller;

import com.vidyasetu.backend.dto.ParentChildResponse;
import com.vidyasetu.backend.entity.ParentStudentLink;

import com.vidyasetu.backend.entity.User;
import com.vidyasetu.backend.repository.StudentRepository;
import com.vidyasetu.backend.repository.UserRepository;
import com.vidyasetu.backend.service.MarksService;
import com.vidyasetu.backend.service.ParentStudentLinkService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/parent")
@PreAuthorize("hasRole('PARENT')")
public class ParentProgressController {

    private final MarksService marksService;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final ParentStudentLinkService linkService;

    public ParentProgressController(
            MarksService marksService,
            UserRepository userRepository,
            StudentRepository studentRepository,
            ParentStudentLinkService linkService) {

        this.marksService = marksService;
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.linkService = linkService;
    }

    private User getLoggedInParent(Principal principal) {
        return userRepository.findByEmail(principal.getName())
                .orElse(null);
    }

    @GetMapping("/children")
    public ResponseEntity<?> getChildren(Principal principal) {

        User parent = getLoggedInParent(principal);

        if (parent == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Parent account not found");
        }

        List<ParentChildResponse> children =
                linkService.getChildren(parent.getId())
                        .stream()
                        .map(ParentStudentLink::getStudentId)
                        .map(studentRepository::findById)
                        .filter(java.util.Optional::isPresent)
                        .map(java.util.Optional::get)
                        .map(student -> new ParentChildResponse(
                                student.getId(),
                                student.getName(),
                                student.getClassName(),
                                student.getVillage()
                        ))
                        .toList();

        return ResponseEntity.ok(children);
    }

    @GetMapping("/children/{id}/progress")
    public ResponseEntity<?> getChildProgress(
            @PathVariable Long id,
            Principal principal) {

        User parent = getLoggedInParent(principal);

        if (parent == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Parent account not found");
        }

        boolean linked = linkService.isParentLinkedToStudent(
                parent.getId(), id);

        if (!linked) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("You are not authorized to view this student's progress");
        }

        return ResponseEntity.ok(
                marksService.getMarksByStudentId(id)
        );
    }
}
