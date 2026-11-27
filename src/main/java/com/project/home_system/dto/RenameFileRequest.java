package com.project.home_system.dto;

import jakarta.validation.constraints.NotBlank;

public record RenameFileRequest(
    @NotBlank String path,
    @NotBlank String newName
) {
    
}
