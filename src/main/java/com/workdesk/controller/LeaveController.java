package com.workdesk.controller;

import com.workdesk.entity.*;
import com.workdesk.service.LeaveService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leaves")
@CrossOrigin(origins = "http://localhost:5173")
public class LeaveController {

    private final LeaveService leaveService;

    public LeaveController(LeaveService leaveService) {
        this.leaveService = leaveService;
    }

    @PostMapping
    public ResponseEntity<LeaveRequest> applyLeave(
            @RequestBody Map<String, String> request,
            Authentication authentication) {

        LeaveRequest leaveRequest = leaveService.applyLeave(
                authentication.getName(),
                LeaveType.valueOf(request.get("leaveType")),
                LocalDate.parse(request.get("startDate")),
                LocalDate.parse(request.get("endDate")),
                request.get("reason")
        );

        return ResponseEntity.ok(leaveRequest);
    }

    @GetMapping("/my")
    public ResponseEntity<List<LeaveRequest>> getMyLeaves(
            Authentication authentication) {

        return ResponseEntity.ok(
                leaveService.getMyLeaves(authentication.getName())
        );
    }

    @GetMapping("/balance")
    public ResponseEntity<LeaveBalance> getBalance(
            Authentication authentication) {

        return ResponseEntity.ok(
                leaveService.getBalance(authentication.getName())
        );
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<LeaveRequest>> getAllLeaves() {

        return ResponseEntity.ok(
                leaveService.getAllLeaves()
        );
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LeaveRequest> updateStatus(
            @PathVariable Long id,
            @RequestParam LeaveStatus status) {

        return ResponseEntity.ok(
                leaveService.updateStatus(id, status)
        );
    }
}