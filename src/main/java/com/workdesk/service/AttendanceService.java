package com.workdesk.service;

import com.workdesk.entity.Attendance;
import com.workdesk.entity.User;
import com.workdesk.repository.AttendanceRepository;
import com.workdesk.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final UserRepository userRepository;

    public AttendanceService(
            AttendanceRepository attendanceRepository,
            UserRepository userRepository) {

        this.attendanceRepository = attendanceRepository;
        this.userRepository = userRepository;
    }

    public Attendance checkIn(String email) {

        User user = getUser(email);
        LocalDate today = LocalDate.now();

        Attendance attendance = attendanceRepository
                .findByUserAndDate(user, today)
                .orElse(null);

        if (attendance != null && attendance.getCheckIn() != null) {
            throw new RuntimeException("Already checked in today");
        }

        if (attendance == null) {
            attendance = Attendance.builder()
                    .date(today)
                    .user(user)
                    .build();
        }

        attendance.setCheckIn(LocalDateTime.now());

        return attendanceRepository.save(attendance);
    }

    public Attendance checkOut(String email) {

        User user = getUser(email);
        LocalDate today = LocalDate.now();

        Attendance attendance = attendanceRepository
                .findByUserAndDate(user, today)
                .orElseThrow(() ->
                        new RuntimeException("Please check in first"));

        if (attendance.getCheckOut() != null) {
            throw new RuntimeException("Already checked out today");
        }

        if (attendance.getCheckIn() == null) {
            throw new RuntimeException("Please check in first");
        }

        LocalDateTime checkOut = LocalDateTime.now();

        long workingMinutes = Duration.between(
                attendance.getCheckIn(),
                checkOut
        ).toMinutes();

        attendance.setCheckOut(checkOut);
        attendance.setWorkingMinutes(workingMinutes);

        return attendanceRepository.save(attendance);
    }

    public Attendance getTodayAttendance(String email) {

        User user = getUser(email);

        return attendanceRepository
                .findByUserAndDate(user, LocalDate.now())
                .orElse(null);
    }

    public List<Attendance> getMyAttendance(String email) {

        User user = getUser(email);

        return attendanceRepository
                .findByUserOrderByDateDesc(user);
    }

    public List<Attendance> getAllAttendance() {

        return attendanceRepository.findAllByOrderByDateDesc();
    }

    private User getUser(String email) {

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }
}