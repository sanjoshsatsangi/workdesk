package com.workdesk.repository;

import com.workdesk.entity.Ticket;
import com.workdesk.entity.TicketStatus;
import com.workdesk.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    List<Ticket> findByUser(User user);

    List<Ticket> findByStatus(TicketStatus status);
}