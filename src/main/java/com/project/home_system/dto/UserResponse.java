package com.project.home_system.dto;

import java.time.Instant;

public record UserResponse(
    Long id,
    String username,
    boolean enabled,
    Instant createdAt
) {
    
}
