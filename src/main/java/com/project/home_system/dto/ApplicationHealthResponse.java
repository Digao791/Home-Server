package com.project.home_system.dto;

import java.time.Instant;

public record ApplicationHealthResponse(
    Long applicationId,
    ApplicationStatus status,
    Integer httpStatus,
    Long responseTimeMs,
    Instant checkedAt
) {
    
}
