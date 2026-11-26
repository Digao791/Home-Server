package com.project.home_system.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import oshi.SystemInfo;

@Configuration 
public class SystemConfig {
    
    @Bean 
    public SystemInfo systemInfo(){
        return new SystemInfo();
    }
}
