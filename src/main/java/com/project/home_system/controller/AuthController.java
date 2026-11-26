package com.project.home_system.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.home_system.dto.UserResponse;
import com.project.home_system.services.UserService;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController 
@RequestMapping ("/api/auth")
@RequiredArgsConstructor 
public class AuthController {
    
    private final UserService userService;

    @GetMapping("/me")
    public UserResponse getCurrentUser(Authentication authentication) {
        return userService.getUser(
            authentication.getName()
        );
    }
    
    @GetMapping("/csrf")
    public CsrfToken getCsrfToken(CsrfToken csrfToken) {
        return csrfToken;
    }
    
}
