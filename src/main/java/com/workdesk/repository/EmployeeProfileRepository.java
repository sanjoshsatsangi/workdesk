package com.workdesk.repository;

import com.workdesk.entity.EmployeeProfile;
import com.workdesk.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmployeeProfileRepository
        extends JpaRepository<EmployeeProfile, Long> {

    Optional<EmployeeProfile> findByUser(User user);
}