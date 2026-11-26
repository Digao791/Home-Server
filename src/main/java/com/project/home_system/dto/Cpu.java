package com.project.home_system.dto;

public record Cpu(
    String model,
    int physicalCores,
    int logicalCores,
    double usagePercentage,
    Double temperature
) {
}
