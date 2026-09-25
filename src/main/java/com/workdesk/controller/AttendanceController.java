package com.workdesk.controller;

import com.workdesk.entity.Attendance;
import com.workdesk.service.AttendanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "http://localhost:5173")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @PostMapping("/check-in")
    public ResponseEntity<Attendance> checkIn(
            Authentication authentication) {

        return ResponseEntity.ok(
                attendanceService.checkIn(authentication.getName())
        );
    }

    @PostMapping("/check-out")
    public ResponseEntity<Attendance> checkOut(
            Authentication authentication) {

        return ResponseEntity.ok(
                attendanceService.checkOut(authentication.getName())
        );
    }

    @GetMapping("/today")
    public ResponseEntity<Attendance> getTodayAttendance(
            Authentication authentication) {

        Attendance attendance = attendanceService.getTodayAttendance(
                authentication.getName()
        );

        return ResponseEntity.ok(attendance);
    }

    @GetMapping("/my")
    public ResponseEntity<List<Attendance>> getMyAttendance(
            Authentication authentication) {

        return ResponseEntity.ok(
                attendanceService.getMyAttendance(
                        authentication.getName()
                )
        );
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Attendance>> getAllAttendance() {

        return ResponseEntity.ok(
                attendanceService.getAllAttendance()
        );
    }
}