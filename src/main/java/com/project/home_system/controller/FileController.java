package com.project.home_system.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.home_system.dto.CreateDirectoryRequest;
import com.project.home_system.dto.FileResponse;
import com.project.home_system.services.StorageService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController 
@RequestMapping ("/api/files")
@RequiredArgsConstructor 
public class FileController {
    
    private final StorageService storageService;

    @GetMapping 
    public List<FileResponse> listFiles(
        @RequestParam(defaultValue = "") String path
    ){
        return storageService.listFiles(path);
    }

    @PostMapping("/directory")
    public FileResponse createDirectory(
        @Valid @RequestBody CreateDirectoryRequest request) {
        return storageService.createDirectory(request);
    }
    
}
