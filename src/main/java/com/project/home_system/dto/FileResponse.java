package com.project.home_system.dto;

import java.time.Instant;

import com.project.home_system.model.FileType;

public record FileResponse(
    String name,
    String path,
    FileType type,
    Long size,
    Instant lastModified
) {
    
}
