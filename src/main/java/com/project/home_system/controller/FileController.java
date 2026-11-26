package com.project.home_system.controller;

import java.nio.charset.StandardCharsets;
import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

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
    
    @PostMapping(value = "/upload",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    @ResponseStatus (HttpStatus.CREATED)
    public FileResponse uploadFile(@RequestParam(defaultValue = "") String path,
        @RequestParam ("file") MultipartFile file){
            return storageService.uploadFile(path, file);
    }

    @GetMapping ("/download")
    public ResponseEntity<Resource> downloadFile(
        @RequestParam String path
    ){
        Resource resource = storageService.downloadFile(path);
        String dispotion = ContentDisposition
            .attachment()
            .filename(
                resource.getFilename(),
                StandardCharsets.UTF_8
            )
            .build()
            .toString();

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(dispotion, 
                    HttpHeaders.CONTENT_DISPOSITION,
                    dispotion)
                .body(resource);
    }
}
