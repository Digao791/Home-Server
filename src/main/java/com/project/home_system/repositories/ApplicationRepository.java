package com.project.home_system.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.home_system.model.Application;

public interface ApplicationRepository extends JpaRepository<Application, Long>{
    
    boolean existsByName(String name);
    boolean existsByNameAndIdNot(String name, Long id);
}
