package com.project.home_system.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.home_system.model.User;

public interface UserRepository extends JpaRepository<User, Long>{
    
    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);
}
