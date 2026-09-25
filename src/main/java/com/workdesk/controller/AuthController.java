package com.workdesk.controller;

import com.workdesk.dto.LoginRequest;
import com.workdesk.dto.RegisterRequest;
import com.workdesk.service.AuthService;
import com.workdesk.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    public AuthController(
            AuthService authService,
            UserService userService) {

        this.authService = authService;
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody RegisterRequest request) {

        String message = authService.register(
                request.name(),
                request.email(),
                request.password(),
                com.workdesk.entity.Role.EMPLOYEE
        );

        return ResponseEntity.ok(
                Map.of("message", message)
        );
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request) {
    
        String token = authService.login(
                request.email(),
                request.password(),
                request.role()
        );
    
        return ResponseEntity.ok(
                Map.of("token", token)
        );
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(
            Authentication authentication) {

        return ResponseEntity.ok(
                userService.getUserByEmail(
                        authentication.getName()
                )
        );
    }
}