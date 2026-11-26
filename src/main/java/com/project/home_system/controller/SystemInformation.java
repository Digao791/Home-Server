package com.project.home_system.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.home_system.dto.SystemInfoDTO;
import com.project.home_system.services.SystemService;

import lombok.RequiredArgsConstructor;

@RestController 
@RequiredArgsConstructor 
@RequestMapping ("/api/system")
public class SystemInformation {
    
    private final SystemService systemService;

    @GetMapping("/info")
    public ResponseEntity<SystemInfoDTO> getSystemInfo(){
        return ResponseEntity.ok(
            systemService.getSystemInfo()
        );
    }
}
