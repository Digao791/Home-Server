package com.project.home_system.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateDirectoryRequest(
    String path,
    @NotBlank String name
) {
    
}
