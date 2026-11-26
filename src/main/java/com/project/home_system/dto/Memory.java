package com.project.home_system.dto;

public record Memory(
    long totalBytes,
    long usedBytes,
    long availableBytes,
    double usagePercentage
) {
    
}
