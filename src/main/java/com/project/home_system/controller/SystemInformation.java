package com.project.home_system.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController 
@RequestMapping ("/api/system")
public class SystemInformation {
    
    @GetMapping 
    public String getSystemInformation(){
        return "Somethings";
    }
}
