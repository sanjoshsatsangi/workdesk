package com.workdesk.repository;

import com.workdesk.entity.LeaveRequest;
import com.workdesk.entity.LeaveStatus;
import com.workdesk.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LeaveRequestRepository
        extends JpaRepository<LeaveRequest, Long> {

    List<LeaveRequest> findByUser(User user);

    List<LeaveRequest> findByStatus(LeaveStatus status);
}