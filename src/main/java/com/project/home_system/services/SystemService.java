package com.project.home_system.services;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.stereotype.Service;

import com.project.home_system.dto.Cpu;
import com.project.home_system.dto.Memory;
import com.project.home_system.dto.Storage;
import com.project.home_system.dto.SystemInfoDTO;

import oshi.SystemInfo;
import oshi.hardware.CentralProcessor;
import oshi.hardware.GlobalMemory;
import oshi.hardware.HardwareAbstractionLayer;
import oshi.software.os.OSFileStore;
import oshi.software.os.OperatingSystem;

@Service 
public class SystemService {
    
    // Spring returns the Bean created during Configuration Service
    @SuppressWarnings("Bean created in Configuration Service") 
    private final SystemInfo systemInfo;
    private final HardwareAbstractionLayer hardware;
    private final OperatingSystem  operatingSystem;

    public SystemService(SystemInfo systemInfo){
        this.systemInfo = systemInfo;
        this.hardware = systemInfo.getHardware();
        this.operatingSystem = systemInfo.getOperatingSystem();
    }

    public SystemInfoDTO getSystemInfo(){
        return new SystemInfoDTO(
            operatingSystem.getNetworkParams().getHostName(),
            operatingSystem.toString(),
            System.getProperty("os.arch"),
            operatingSystem.getSystemUptime(),
            getCpuInfo(),
            getMemoryInfo(),
            getStorageInfo(),
            Instant.now().truncatedTo(ChronoUnit.MILLIS)
        );
    }

    public Cpu getCpuInfo(){

        CentralProcessor processor = hardware.getProcessor();
        double usage = processor.getSystemCpuLoad(500) * 100;
        double temperature = hardware.getSensors().getCpuTemperature();

        return new Cpu(
            processor.getProcessorIdentifier().getName(),
            processor.getPhysicalProcessorCount(),
            processor.getLogicalProcessorCount(),
            usage,
            temperature > 0 ? temperature : null
        );
    }

    public Memory getMemoryInfo(){

        GlobalMemory memory = hardware.getMemory();
        long total = memory.getTotal();
        long available = memory.getAvailable();
        long used = total - available;

        double usage = 
            total > 0 ? (double) used / total * 100
                      : 0;

        return new Memory(
            total,
            used,
            available,
            usage
        );
    }

    public List<Storage> getStorageInfo(){
        return operatingSystem.getFileSystem()
                .getFileStores(true)
                .stream()
                .filter(store -> store.getTotalSpace() > 0)
                .map(this::mapStorage)
                .toList();
    }

    private Storage mapStorage(OSFileStore store){
        long total = store.getTotalSpace();
        long free = store.getFreeSpace();
        long available = store.getUsableSpace();
        long used = total - free;

        double usage = (double) used / total * 100;

        return new Storage(
            store.getName(),
            store.getMount(),
            store.getType(),
            total,
            used,
            available,
            usage
        );
    }
}
