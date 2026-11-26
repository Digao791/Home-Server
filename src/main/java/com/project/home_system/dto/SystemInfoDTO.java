package com.project.home_system.dto;

import java.time.Instant;
import java.util.List;

public record SystemInfoDTO(
    String hostName,
    String operatingSystem,
    String architecture,
    long uptimeSeconds,
    Cpu cpu,
    Memory memory,
    List<Storage> storage,
    Instant instant
) {
}
