package com.project.home_system.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.project.home_system.dto.Cpu;
import com.project.home_system.dto.Memory;
import com.project.home_system.services.SystemService;

import oshi.SystemInfo;
import oshi.hardware.HardwareAbstractionLayer;
import oshi.hardware.GlobalMemory;
import oshi.hardware.CentralProcessor;
import oshi.hardware.Sensors;
import oshi.software.os.OperatingSystem;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SystemServiceTest {

    @Mock
    private SystemInfo systemInfo;

    @Mock
    private HardwareAbstractionLayer hardware;

    @Mock
    private OperatingSystem operatingSystem;

    @Mock
    private GlobalMemory memory;

    @Mock
    private CentralProcessor processor;

    @Mock
    private CentralProcessor.ProcessorIdentifier processorIdentifier;

    @Mock
    private Sensors sensors;

    private SystemService service;

    @BeforeEach
    void setUp() {

        when(systemInfo.getHardware()).thenReturn(hardware);

        when(systemInfo.getOperatingSystem())
            .thenReturn(operatingSystem);

        service = new SystemService(systemInfo);
    }

    @Test
    void shouldCalculateMemoryUsage() {

        when(hardware.getMemory()).thenReturn(memory);

        when(memory.getTotal()).thenReturn(8000L);
        when(memory.getAvailable()).thenReturn(6000L);

        Memory result = service.getMemoryInfo();

        assertEquals(8000L, result.totalBytes());
        assertEquals(6000L, result.availableBytes());
        assertEquals(2000L, result.usedBytes());
        assertEquals(25.0, result.usagePercentage(), 0.001);
    }

    @Test
    void shouldHandleZeroTotalMemory() {

        when(hardware.getMemory()).thenReturn(memory);

        when(memory.getTotal()).thenReturn(0L);
        when(memory.getAvailable()).thenReturn(0L);

        Memory result = service.getMemoryInfo();

        assertEquals(0.0, result.usagePercentage());
    }

    @Test
    void shouldReturnCpuInformation() {

        mockCpu(52.5);

        Cpu result = service.getCpuInfo();

        assertEquals("ARM Cortex-A76", result.model());
        assertEquals(4, result.physicalCores());
        assertEquals(4, result.logicalCores());
        assertEquals(25.0, result.usagePercentage(), 0.001);
        assertEquals(52.5, result.temperature(), 0.001);
    }

    @Test
    void shouldReturnNullWhenTemperatureIsUnavailable() {

        mockCpu(0.0);

        Cpu result = service.getCpuInfo();

        assertNull(result.temperature());
    }

    private void mockCpu(double temperature) {

        when(hardware.getProcessor()).thenReturn(processor);
        when(hardware.getSensors()).thenReturn(sensors);

        when(processor.getProcessorIdentifier())
            .thenReturn(processorIdentifier);

        when(processorIdentifier.getName())
            .thenReturn("ARM Cortex-A76");

        when(processor.getPhysicalProcessorCount()).thenReturn(4);
        when(processor.getLogicalProcessorCount()).thenReturn(4);
        when(processor.getSystemCpuLoad(500)).thenReturn(0.25);

        when(sensors.getCpuTemperature()).thenReturn(temperature);
    }
}