package com.workdesk.service;

import com.workdesk.entity.*;
import com.workdesk.repository.LeaveBalanceRepository;
import com.workdesk.repository.LeaveRequestRepository;
import com.workdesk.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class LeaveService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final LeaveBalanceRepository leaveBalanceRepository;
    private final UserRepository userRepository;

    public LeaveService(
            LeaveRequestRepository leaveRequestRepository,
            LeaveBalanceRepository leaveBalanceRepository,
            UserRepository userRepository) {

        this.leaveRequestRepository = leaveRequestRepository;
        this.leaveBalanceRepository = leaveBalanceRepository;
        this.userRepository = userRepository;
    }

    public LeaveRequest applyLeave(
            String email,
            LeaveType leaveType,
            LocalDate startDate,
            LocalDate endDate,
            String reason) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        if (endDate.isBefore(startDate)) {
            throw new RuntimeException(
                    "End date cannot be before start date");
        }

        LeaveRequest request = LeaveRequest.builder()
                .leaveType(leaveType)
                .startDate(startDate)
                .endDate(endDate)
                .reason(reason)
                .status(LeaveStatus.PENDING)
                .user(user)
                .build();

        return leaveRequestRepository.save(request);
    }

    public List<LeaveRequest> getMyLeaves(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return leaveRequestRepository.findByUser(user);
    }

    public List<LeaveRequest> getAllLeaves() {
        return leaveRequestRepository.findAll();
    }

    @Transactional
    public LeaveRequest updateStatus(
            Long id,
            LeaveStatus status) {

        LeaveRequest request = leaveRequestRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Leave request not found"));

        LeaveStatus currentStatus = request.getStatus();

        if (currentStatus == LeaveStatus.APPROVED
                && status != LeaveStatus.APPROVED) {

            throw new RuntimeException(
                    "An approved leave cannot be changed");
        }

        if (currentStatus == LeaveStatus.REJECTED
                && status != LeaveStatus.REJECTED) {

            throw new RuntimeException(
                    "A rejected leave cannot be changed");
        }

        if (currentStatus == LeaveStatus.PENDING
                && status == LeaveStatus.APPROVED) {

            deductLeaveBalance(request);
        }

        request.setStatus(status);

        return leaveRequestRepository.save(request);
    }

    private void deductLeaveBalance(
            LeaveRequest request) {

        LeaveBalance balance = leaveBalanceRepository
                .findByUser(request.getUser())
                .orElseGet(() -> {

                    LeaveBalance newBalance =
                            LeaveBalance.builder()
                                    .casualLeave(12)
                                    .sickLeave(10)
                                    .earnedLeave(15)
                                    .user(request.getUser())
                                    .build();

                    return leaveBalanceRepository.save(
                            newBalance
                    );
                });

        int leaveDays = (int) ChronoUnit.DAYS.between(
                request.getStartDate(),
                request.getEndDate()
        ) + 1;

        if (leaveDays <= 0) {
            throw new RuntimeException(
                    "Invalid leave duration");
        }

        switch (request.getLeaveType()) {

            case CASUAL:
                if (balance.getCasualLeave() < leaveDays) {
                    throw new RuntimeException(
                            "Insufficient casual leave balance");
                }

                balance.setCasualLeave(
                        balance.getCasualLeave() - leaveDays
                );
                break;

            case SICK:
                if (balance.getSickLeave() < leaveDays) {
                    throw new RuntimeException(
                            "Insufficient sick leave balance");
                }

                balance.setSickLeave(
                        balance.getSickLeave() - leaveDays
                );
                break;

            case EARNED:
                if (balance.getEarnedLeave() < leaveDays) {
                    throw new RuntimeException(
                            "Insufficient earned leave balance");
                }

                balance.setEarnedLeave(
                        balance.getEarnedLeave() - leaveDays
                );
                break;

            default:
                throw new RuntimeException(
                        "Unsupported leave type");
        }

        leaveBalanceRepository.save(balance);
    }

    public LeaveBalance getBalance(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return leaveBalanceRepository.findByUser(user)
                .orElseGet(() -> {

                    LeaveBalance balance = LeaveBalance.builder()
                            .casualLeave(12)
                            .sickLeave(10)
                            .earnedLeave(15)
                            .user(user)
                            .build();

                    return leaveBalanceRepository.save(balance);
                });
    }
}