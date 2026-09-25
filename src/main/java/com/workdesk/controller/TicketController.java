package com.workdesk.controller;

import com.workdesk.entity.*;
import com.workdesk.service.TicketService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "http://localhost:5173")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping
    public ResponseEntity<Ticket> createTicket(
            @RequestBody Map<String, String> request,
            Authentication authentication) {

        Ticket ticket = ticketService.createTicket(
                authentication.getName(),
                request.get("title"),
                request.get("description"),
                TicketCategory.valueOf(request.get("category")),
                TicketPriority.valueOf(request.get("priority"))
        );

        return ResponseEntity.ok(ticket);
    }

    @GetMapping("/my")
    public ResponseEntity<List<Ticket>> getMyTickets(
            Authentication authentication) {

        return ResponseEntity.ok(
                ticketService.getMyTickets(authentication.getName())
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicket(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                ticketService.getTicketById(id)
        );
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Ticket>> getAllTickets() {

        return ResponseEntity.ok(
                ticketService.getAllTickets()
        );
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Ticket> updateStatus(
            @PathVariable Long id,
            @RequestParam TicketStatus status) {

        return ResponseEntity.ok(
                ticketService.updateStatus(id, status)
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteTicket(
            @PathVariable Long id) {

        ticketService.deleteTicket(id);

        return ResponseEntity.ok(
                Map.of("message", "Ticket deleted successfully")
        );
    }
}