package com.workdesk.service;

import com.workdesk.entity.Announcement;
import com.workdesk.entity.User;
import com.workdesk.repository.AnnouncementRepository;
import com.workdesk.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final UserRepository userRepository;

    public AnnouncementService(
            AnnouncementRepository announcementRepository,
            UserRepository userRepository) {

        this.announcementRepository = announcementRepository;
        this.userRepository = userRepository;
    }

    public Announcement createAnnouncement(
            String email,
            String title,
            String message) {

        User admin = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Announcement announcement = Announcement.builder()
                .title(title)
                .message(message)
                .createdAt(LocalDateTime.now())
                .createdBy(admin)
                .build();

        return announcementRepository.save(announcement);
    }

    public List<Announcement> getAllAnnouncements() {
        return announcementRepository.findAllByOrderByCreatedAtDesc();
    }

    public Announcement getAnnouncementById(Long id) {
        return announcementRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Announcement not found"));
    }

    public Announcement updateAnnouncement(
            Long id,
            String title,
            String message) {

        Announcement announcement = getAnnouncementById(id);

        announcement.setTitle(title);
        announcement.setMessage(message);

        return announcementRepository.save(announcement);
    }

    public void deleteAnnouncement(Long id) {

        Announcement announcement = getAnnouncementById(id);

        announcementRepository.delete(announcement);
    }
}