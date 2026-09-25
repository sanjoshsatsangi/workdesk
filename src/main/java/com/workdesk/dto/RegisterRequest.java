package com.workdesk.dto;

public record RegisterRequest(
        String name,
        String email,
        String password
) {}