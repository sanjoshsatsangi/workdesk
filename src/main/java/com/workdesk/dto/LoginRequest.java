package com.workdesk.dto;

public record LoginRequest(
        String email,
        String password,
        com.workdesk.entity.Role role
) {}