export interface CpuInfo {
    model: string;
    physicalCores: number;
    logicalCores: number;
    usagePercentage: number;
    temperature: number | null;
}

export interface MemoryInfo {
    totalBytes: number;
    usedBytes: number;
    availableBytes: number;
    usagePercentage: number;
}

export interface StorageInfo {
    name: string;
    mountPoint: string;
    fileSystem: string;
    totalBytes: number;
    usedBytes: number;
    availableBytes: number;
    usagePercentage: number;
}

export interface SystemInfo {
    hostName: string;
    operatingSystem: string;
    architecture: string;
    uptimeSeconds: number;
    cpu: CpuInfo;
    memory: MemoryInfo;
    storage: StorageInfo[];
    instant: string;
}