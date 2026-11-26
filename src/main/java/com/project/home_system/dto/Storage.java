package com.project.home_system.dto;

public record Storage(
    String name,
    String mountPoint,
    String fileSystem,
    long totalBytes,
    long usedBytes,
    long availableBytes,
    double usagePercentage
) {
    
}
