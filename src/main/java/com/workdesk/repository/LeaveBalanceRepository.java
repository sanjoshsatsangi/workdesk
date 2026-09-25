package com.workdesk.repository;

import com.workdesk.entity.LeaveBalance;
import com.workdesk.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LeaveBalanceRepository
        extends JpaRepository<LeaveBalance, Long> {

    Optional<LeaveBalance> findByUser(User user);
}