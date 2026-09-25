package com.workdesk.controller;

import com.workdesk.entity.EmployeeProfile;
import com.workdesk.service.EmployeeProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:5173")
public class EmployeeProfileController {

    private final EmployeeProfileService profileService;

    public EmployeeProfileController(
            EmployeeProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/me")
    public ResponseEntity<EmployeeProfile> getMyProfile(
            Authentication authentication) {

        try {
            EmployeeProfile profile =
                    profileService.getMyProfile(authentication.getName());

            return ResponseEntity.ok(profile);
        } catch (RuntimeException exception) {
            if ("Profile not found".equals(exception.getMessage())) {
                return ResponseEntity.notFound().build();
            }

            throw exception;
        }
    }

    @PostMapping
    public ResponseEntity<EmployeeProfile> createProfile(
            @RequestBody EmployeeProfile profile,
            Authentication authentication) {

        return ResponseEntity.ok(
                profileService.createProfile(
                        authentication.getName(),
                        profile
                )
        );
    }

    @PutMapping
    public ResponseEntity<EmployeeProfile> updateProfile(
            @RequestBody EmployeeProfile profile,
            Authentication authentication) {

        return ResponseEntity.ok(
                profileService.updateProfile(
                        authentication.getName(),
                        profile
                )
        );
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<EmployeeProfile>> getAllProfiles() {

        return ResponseEntity.ok(
                profileService.getAllProfiles()
        );
    }
}