
package com.vidyasetu.backend.controller;

import com.vidyasetu.backend.entity.Ngo;
import com.vidyasetu.backend.entity.User;
import com.vidyasetu.backend.service.NgoService;
import com.vidyasetu.backend.service.UserService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ngo/accounts")
public class NGOAccountController {

    private final UserService userService;
    private final NgoService ngoService;

    public NGOAccountController(
            UserService userService,
            NgoService ngoService) {
        this.userService = userService;
        this.ngoService = ngoService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createNgoAccount(
            @RequestBody NgoAccountRequest request) {

        if (request.getName() == null || request.getName().isBlank()
                || request.getEmail() == null || request.getEmail().isBlank()
                || request.getPassword() == null
                || request.getPassword().length() < 8
                || request.getAreaOfWork() == null
                || request.getAreaOfWork().isBlank()
                || request.getContact() == null
                || request.getContact().isBlank()) {

            return ResponseEntity.badRequest()
                    .body("All fields are required. Password must contain at least 8 characters.");
        }

        String email = request.getEmail().trim().toLowerCase();

        if (userService.emailExists(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Email already registered");
        }

        User ngoUser = new User();
        ngoUser.setName(request.getName().trim());
        ngoUser.setEmail(email);
        ngoUser.setPassword(request.getPassword());
        ngoUser.setRole("NGO");

        User savedUser = userService.registerUser(ngoUser);

        Ngo ngo = new Ngo();
        ngo.setName(request.getName().trim());
        ngo.setAreaOfWork(request.getAreaOfWork().trim());
        ngo.setContact(request.getContact().trim());

        Ngo savedNgo = ngoService.saveNgo(ngo);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of(
                        "message", "NGO account created successfully",
                        "userId", savedUser.getId(),
                        "ngoId", savedNgo.getId(),
                        "name", savedUser.getName(),
                        "email", savedUser.getEmail(),
                        "role", savedUser.getRole()
                ));
    }

    public static class NgoAccountRequest {

        private String name;
        private String email;
        private String password;
        private String areaOfWork;
        private String contact;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public String getAreaOfWork() {
            return areaOfWork;
        }

        public void setAreaOfWork(String areaOfWork) {
            this.areaOfWork = areaOfWork;
        }

        public String getContact() {
            return contact;
        }

        public void setContact(String contact) {
            this.contact = contact;
        }
    }
}
