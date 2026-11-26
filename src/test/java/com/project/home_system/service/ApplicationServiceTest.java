package com.project.home_system.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.Mock;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.project.home_system.dto.ApplicationRequest;
import com.project.home_system.dto.ApplicationResponse;
import com.project.home_system.model.Application;
import com.project.home_system.repositories.ApplicationRepository;
import com.project.home_system.services.ApplicationService;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ApplicationServiceTest {

    @Mock
    private ApplicationRepository repository;

    @InjectMocks
    private ApplicationService service;

    private Application application;
    private ApplicationRequest request;

    @BeforeEach
    void setUp() {

        application = new Application();
        application.setId(1L);
        application.setName("Finance System");
        application.setUrl("http://localhost:3000");
        application.setEnabled(true);

        request = new ApplicationRequest(
            "Finance System",
            "Personal finance management",
            "http://localhost:3000",
            "http://localhost:8081/actuator/health",
            "wallet",
            true
        );
    }

    @Test
    void shouldReturnEmptyApplicationList() {

        when(repository.findAll()).thenReturn(List.of());

        assertTrue(service.findAll().isEmpty());

        verify(repository).findAll();
    }

    @Test
    void shouldReturnAllApplications() {

        when(repository.findAll())
            .thenReturn(List.of(application));

        List<ApplicationResponse> result = service.findAll();

        assertEquals(1, result.size());
        assertEquals("Finance System", result.getFirst().name());
    }

    @Test
    void shouldFindApplicationById() {

        when(repository.findById(1L))
            .thenReturn(Optional.of(application));

        ApplicationResponse result = service.findById(1L);

        assertEquals(1L, result.id());
        assertEquals("Finance System", result.name());
        assertTrue(result.enabled());
    }

    @Test
    void shouldThrowExceptionWhenApplicationNotFound() {

        when(repository.findById(99L))
            .thenReturn(Optional.empty());

        ResponseStatusException exception = assertThrows(
            ResponseStatusException.class,
            () -> service.findById(99L)
        );

        assertEquals(
            HttpStatus.NOT_FOUND,
            exception.getStatusCode()
        );
    }

    @Test
    void shouldCreateApplication() {

        when(repository.existsByName(request.name()))
            .thenReturn(false);

        when(repository.saveAndFlush(any(Application.class)))
            .thenAnswer(invocation -> {
                Application saved = invocation.getArgument(0);
                saved.setId(1L);
                return saved;
            });

        ApplicationResponse result = service.create(request);

        assertEquals(1L, result.id());
        assertEquals(request.name(), result.name());
        assertEquals(request.url(), result.url());
        assertEquals(request.description(), result.description());

        verify(repository).saveAndFlush(any(Application.class));
    }

    @Test
    void shouldRejectDuplicateApplicationName() {

        when(repository.existsByName(request.name()))
            .thenReturn(true);

        ResponseStatusException exception = assertThrows(
            ResponseStatusException.class,
            () -> service.create(request)
        );

        assertEquals(
            HttpStatus.CONFLICT,
            exception.getStatusCode()
        );

        verify(repository, never())
            .saveAndFlush(any(Application.class));
    }

    @Test
    void shouldUpdateApplication() {

        when(repository.findById(1L))
            .thenReturn(Optional.of(application));

        when(repository.existsByNameAndIdNot(request.name(), 1L))
            .thenReturn(false);

        when(repository.saveAndFlush(any(Application.class)))
            .thenAnswer(invocation -> invocation.getArgument(0));

        ApplicationResponse result = service.update(1L, request);

        assertEquals(request.description(), result.description());
        assertEquals(request.healthCheckUrl(), result.healthCheckUrl());
        assertEquals(request.icon(), result.icon());

        verify(repository).saveAndFlush(application);
    }

    @Test
    void shouldDeleteApplication() {

        when(repository.findById(1L))
            .thenReturn(Optional.of(application));

        service.delete(1L);

        verify(repository).delete(application);
    }

    @Test
    void shouldNotDeleteNonexistentApplication() {

        when(repository.findById(99L))
            .thenReturn(Optional.empty());

        assertThrows(
            ResponseStatusException.class,
            () -> service.delete(99L)
        );

        verify(repository, never())
            .delete(any(Application.class));
    }
}