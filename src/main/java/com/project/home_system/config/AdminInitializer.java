package com.project.home_system.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.project.home_system.model.User;
import com.project.home_system.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Component 
@RequiredArgsConstructor
public class AdminInitializer implements CommandLineRunner{

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    
    @Value ("${app.admin.username}")
    private String username;

    @Value ("${app.admin.password:}")
    private String password;


    @Override
    public void run(String... args) throws Exception {
        if(repository.existsByUsername(username)) return;
        if(password.isBlank()){ 
            throw new IllegalStateException(
                "Initial admin password is not configured"
        );}

        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setEnabled(true);
        repository.save(user);
    }
    

}
