package com.workdesk.controller;

import com.workdesk.entity.Announcement;
import com.workdesk.service.AnnouncementService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/announcements")
@CrossOrigin(origins = "http://localhost:5173")
public class AnnouncementController {

    private final AnnouncementService announcementService;

    public AnnouncementController(
            AnnouncementService announcementService) {
        this.announcementService = announcementService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Announcement> createAnnouncement(
            @RequestBody Map<String, String> request,
            Authentication authentication) {

        return ResponseEntity.ok(
                announcementService.createAnnouncement(
                        authentication.getName(),
                        request.get("title"),
                        request.get("message")
                )
        );
    }

    @GetMapping
    public ResponseEntity<List<Announcement>> getAllAnnouncements() {

        return ResponseEntity.ok(
                announcementService.getAllAnnouncements()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Announcement> getAnnouncement(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                announcementService.getAnnouncementById(id)
        );
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Announcement> updateAnnouncement(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {

        return ResponseEntity.ok(
                announcementService.updateAnnouncement(
                        id,
                        request.get("title"),
                        request.get("message")
                )
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteAnnouncement(
            @PathVariable Long id) {

        announcementService.deleteAnnouncement(id);

        return ResponseEntity.ok(
                Map.of("message", "Announcement deleted successfully")
        );
    }
}