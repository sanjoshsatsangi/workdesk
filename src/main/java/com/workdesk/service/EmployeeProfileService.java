package com.workdesk.service;

import com.workdesk.entity.EmployeeProfile;
import com.workdesk.entity.User;
import com.workdesk.repository.EmployeeProfileRepository;
import com.workdesk.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EmployeeProfileService {

    private final EmployeeProfileRepository profileRepository;
    private final UserRepository userRepository;

    public EmployeeProfileService(
            EmployeeProfileRepository profileRepository,
            UserRepository userRepository) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
    }

    public EmployeeProfile getMyProfile(String email) {
        User user = getUser(email);

        return profileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
    }

    @Transactional
    public EmployeeProfile createProfile(
            String email,
            EmployeeProfile profile) {

        User user = getUser(email);

        if (profileRepository.findByUser(user).isPresent()) {
            throw new RuntimeException("Profile already exists");
        }

        validateRequiredFields(profile);

        profile.setId(null);
        profile.setUser(user);

        return profileRepository.save(profile);
    }

    @Transactional
    public EmployeeProfile updateProfile(
            String email,
            EmployeeProfile updatedProfile) {

        User user = getUser(email);

        EmployeeProfile profile = profileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        validateRequiredFields(updatedProfile);

        profile.setPhone(updatedProfile.getPhone());
        profile.setDepartment(updatedProfile.getDepartment());
        profile.setDesignation(updatedProfile.getDesignation());
        profile.setJoiningDate(updatedProfile.getJoiningDate());
        profile.setManager(updatedProfile.getManager());

        return profileRepository.save(profile);
    }

    public List<EmployeeProfile> getAllProfiles() {
        return profileRepository.findAll();
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private void validateRequiredFields(EmployeeProfile profile) {
        if (profile.getPhone() == null || profile.getPhone().isBlank()) {
            throw new IllegalArgumentException("Phone is required");
        }

        if (profile.getDepartment() == null || profile.getDepartment().isBlank()) {
            throw new IllegalArgumentException("Department is required");
        }

        if (profile.getDesignation() == null || profile.getDesignation().isBlank()) {
            throw new IllegalArgumentException("Designation is required");
        }

        if (profile.getJoiningDate() == null) {
            throw new IllegalArgumentException("Joining date is required");
        }
    }
}