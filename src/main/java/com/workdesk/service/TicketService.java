package com.workdesk.service;

import com.workdesk.entity.*;
import com.workdesk.repository.TicketRepository;
import com.workdesk.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

    public TicketService(
            TicketRepository ticketRepository,
            UserRepository userRepository) {
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
    }

    public Ticket createTicket(
            String email,
            String title,
            String description,
            TicketCategory category,
            TicketPriority priority) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Ticket ticket = Ticket.builder()
                .title(title)
                .description(description)
                .category(category)
                .priority(priority)
                .status(TicketStatus.OPEN)
                .createdAt(LocalDateTime.now())
                .user(user)
                .build();

        return ticketRepository.save(ticket);
    }

    public List<Ticket> getMyTickets(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ticketRepository.findByUser(user);
    }

    public Ticket getTicketById(Long id) {

        return ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public Ticket updateStatus(Long id, TicketStatus status) {

        Ticket ticket = getTicketById(id);

        ticket.setStatus(status);

        return ticketRepository.save(ticket);
    }

    public void deleteTicket(Long id) {

        Ticket ticket = getTicketById(id);

        ticketRepository.delete(ticket);
    }
}