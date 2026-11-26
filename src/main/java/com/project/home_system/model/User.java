package com.project.home_system.model;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity 
@Table (name = "users")
@Data 
@NoArgsConstructor 
public class User {
    
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column (nullable = false, unique = true, length = 100)
    private String username;

    @Column (nullable = false, length = 255)
    private String password;

    @Column (nullable = false)
    private boolean enabled = true;

    @Column (nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist 
    public void prePersist(){
        this.createdAt = Instant.now();
    }

}
