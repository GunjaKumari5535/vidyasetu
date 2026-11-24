
package com.vidyasetu.backend.controller;

import com.vidyasetu.backend.dto.ParentCreateRequest;
import com.vidyasetu.backend.entity.User;
import com.vidyasetu.backend.service.UserService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/parent/accounts")
public class ParentAccountController {

    private final UserService userService;

    public ParentAccountController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<?> createParentAccount(
            @RequestBody ParentCreateRequest request) {

        if (request.getName() == null || request.getName().isBlank()
                || request.getEmail() == null || request.getEmail().isBlank()
                || request.getPassword() == null
                || request.getPassword().length() < 8) {

            return ResponseEntity.badRequest()
                    .body("Name, email and a password of at least 8 characters are required");
        }

        if (userService.emailExists(request.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Email already registered");
        }

        User parent = new User();
        parent.setName(request.getName().trim());
        parent.setEmail(request.getEmail().trim().toLowerCase());
        parent.setPassword(request.getPassword());
        parent.setRole("PARENT");

        User savedParent = userService.registerUser(parent);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of(
                        "message", "Parent account created successfully",
                        "parentUserId", savedParent.getId(),
                        "name", savedParent.getName(),
                        "email", savedParent.getEmail(),
                        "role", savedParent.getRole()
                ));
    }
}
