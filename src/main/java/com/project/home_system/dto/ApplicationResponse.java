package com.project.home_system.dto;

import java.time.Instant;

public record ApplicationResponse(
    Long id,
    String name, 
    String description,
    String url,
    String healthCheckUrl,
    String icon,
    boolean enabled,
    Instant createdAt,
    Instant updatedAt
) {
    
}
