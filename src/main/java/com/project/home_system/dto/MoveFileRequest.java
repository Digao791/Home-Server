package com.project.home_system.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record MoveFileRequest(
    @NotBlank String path,
    @NotNull String destinationPath
) {
    
}
