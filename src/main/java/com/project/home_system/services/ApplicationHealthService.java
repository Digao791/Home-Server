package com.project.home_system.services;

import java.net.URI;
import java.time.Instant;
import java.util.concurrent.TimeUnit;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import com.project.home_system.dto.ApplicationHealthResponse;
import com.project.home_system.dto.ApplicationResponse;
import com.project.home_system.dto.ApplicationStatus;

import lombok.RequiredArgsConstructor;

@Service 
@RequiredArgsConstructor 
public class ApplicationHealthService {
    
    private final ApplicationService applicationService;
    private final RestClient restClient;

    public ApplicationHealthResponse checkHealth(Long id){
        ApplicationResponse application = applicationService.findById(id);
        if(!application.enabled()){
            return new ApplicationHealthResponse(
                id,
                ApplicationStatus.DISABLED,
                null,
                null,
                Instant.now()
            );
        }

        String url = application.healthCheckUrl();
        if(url == null || url.isBlank()){
            return new ApplicationHealthResponse(
                id,
                ApplicationStatus.UNKNOWN,
                null,
                null,
                Instant.now()
            );
        }

        URI uri;

        try{
            uri = URI.create(url);
            if(!isValidUri(uri)){
                throw new IllegalArgumentException("Invalid URL");
            }
        } catch (IllegalArgumentException exception){
            return new ApplicationHealthResponse(
                id,
                ApplicationStatus.UNKNOWN,
                null,
                null,
                Instant.now()
            );
        }

        long startTime = System.nanoTime();
        try{

            return restClient.get() 
                   .uri(uri)
                   .exchange((request, response) -> {
                        int statusCode = response.getStatusCode().value();
                        ApplicationStatus status = 
                            response.getStatusCode().is2xxSuccessful()
                                ? ApplicationStatus.ONLINE
                                : ApplicationStatus.OFFLINE;
                        return new ApplicationHealthResponse(
                            id,
                            status,
                            statusCode,
                            elapsedTime(startTime),
                            Instant.now()
                        );
                   });
        } catch (RestClientException exception){
            return new ApplicationHealthResponse(
                id,
                ApplicationStatus.OFFLINE,
                null,
                elapsedTime(startTime),
                Instant.now()
            );
        }
    }

    private long elapsedTime(long startTime){
        return TimeUnit.NANOSECONDS.toMillis(
            System.nanoTime() - startTime
        );
    }

    private boolean isValidUri(URI uri){
        return uri.getHost() != null  
                && uri.getUserInfo() == null
                && (
                    "http".equalsIgnoreCase(uri.getScheme())
                    || "https".equalsIgnoreCase(uri.getScheme())
                );
    }
}
