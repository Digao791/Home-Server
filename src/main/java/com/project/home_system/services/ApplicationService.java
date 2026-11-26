package com.project.home_system.services;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.project.home_system.dto.ApplicationRequest;
import com.project.home_system.dto.ApplicationResponse;
import com.project.home_system.model.Application;
import com.project.home_system.repositories.ApplicationRepository;

import lombok.RequiredArgsConstructor;



@Service 
@RequiredArgsConstructor 
@Transactional (readOnly = true)
public class ApplicationService {
    
    private final ApplicationRepository applicationRepository;

    public List<ApplicationResponse> findAll(){
        return applicationRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public ApplicationResponse findById(Long id){
        return toResponse(findEntityById(id));
    }

    @Transactional 
    public ApplicationResponse create(ApplicationRequest request){
        if(applicationRepository.existsByName(request.name())){
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Application already exists"
            );
        }

        Application application = new Application();
        applyRequest(application, request);

        return toResponse(applicationRepository.saveAndFlush(application));
    }

    @Transactional 
    public ApplicationResponse update(
        Long id,
        ApplicationRequest request
    ){
        Application application = findEntityById(id);
        if(applicationRepository.existsByNameAndIdNot(request.name(), id)){
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Application name already exists"
            );
        }

        applyRequest(application, request);
        return toResponse(applicationRepository.saveAndFlush(application));
    }
    
    @Transactional 
    public void delete(Long id){
        Application application = findEntityById(id);
        applicationRepository.delete(application);
    }
    
    private void applyRequest
            (Application application, ApplicationRequest request){
        application.setName(request.name());
        application.setDescription(request.description());
        application.setUrl(request.url());
        application.setHealthCheckUrl(request.healthCheckUrl());
        application.setIcon(request.icon());
        application.setEnabled(request.enabled());
    }
    private Application findEntityById(Long id){
        return applicationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Applicatiuon not found"
                ));
    }

    private ApplicationResponse toResponse(Application application){
        return new ApplicationResponse(
            application.getId(),
            application.getName(),
            application.getDescription(),
            application.getUrl(),
            application.getHealthCheckUrl(),
            application.getIcon(),
            application.isEnabled(),
            application.getCreatedAt(),
            application.getUpdatedAt()
        );
    }
}
