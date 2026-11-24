
package com.vidyasetu.backend.controller;

import com.vidyasetu.backend.dto.RegisterRequest;
import com.vidyasetu.backend.dto.LoginRequest;
import com.vidyasetu.backend.dto.AuthResponse;
import com.vidyasetu.backend.entity.User;
import com.vidyasetu.backend.service.UserService;
import com.vidyasetu.backend.service.JwtService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;

    public AuthController(UserService userService,
                          JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody RegisterRequest request) {

        if (userService.emailExists(request.getEmail())) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Email already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setRole("STUDENT");

        User savedUser = userService.registerUser(user);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body("Student registered successfully. ID: "
                        + savedUser.getId());
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request) {

        User user = userService.findByEmail(request.getEmail())
                .orElse(null);

        if (user == null ||
                !userService.checkPassword(
                        request.getPassword(),
                        user.getPassword())) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password");
        }

        String token = jwtService.generateToken(user);

        AuthResponse response = new AuthResponse(
                token,
                user.getName(),
                user.getEmail(),
                user.getRole()
        );

        return ResponseEntity.ok(response);
    }
}
