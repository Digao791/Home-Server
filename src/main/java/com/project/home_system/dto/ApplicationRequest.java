package com.project.home_system.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ApplicationRequest (
    
    @NotBlank 
    @Size (max = 100)
    String name,

    @Size (max = 500)
    String description,

    @NotBlank 
    @Size (max = 500)
    String url,

    @Size(max = 500)
    String healthCheckUrl,

    @Size (max = 100)
    String icon,

    @NotNull 
    Boolean enabled
){ }
