package com.project.home_system.model;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity 
@Table(name = "applications")
@Data 
@NoArgsConstructor 
public class Application {
    
    @Id 
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(nullable = false, length = 500)
    private String url;

    @Column (name = "health_check_url", length = 500)
    private String healthCheckUrl;

    @Column (length = 100)
    private String icon;

    @Column(nullable = false)
    private boolean enabled;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist 
    protected void onCreate(){
        createdAt = Instant.now();
        updatedAt = createdAt;
    }

    @PreUpdate 
    protected void onUpdate(){
        updatedAt = Instant.now();
    }
}
