# Home-Lab System

## Overview

Home-Lab System is a self-hosted platform designed to centralize personal applications, system monitoring, and file management within a private home server environment.

The project aims to transform a Raspberry Pi into a lightweight personal server, providing a centralized web interface for accessing applications, monitoring hardware resources, and managing personal files, photos, and videos.

The system is designed to run in a containerized environment using Docker, allowing independent applications to coexist and communicate within the same infrastructure.

## Project Objectives

The main objectives of this project are:

- Build a centralized dashboard for personal applications and services.
- Monitor server hardware resources in real time.
- Provide a private and self-hosted file storage solution.
- Manage personal photos, videos, and documents.
- Monitor the availability and health of independent applications.
- Establish communication between containerized services.
- Implement secure authentication and access control.
- Maintain a lightweight architecture suitable for Raspberry Pi hardware.
- Apply software engineering, system design, networking, and DevOps best practices.
- Reduce dependency on external cloud storage services.

## Features

### System Monitoring

Monitor the hardware resources of the home server through a centralized dashboard.

- CPU information and utilization.
- CPU temperature, when supported by the hardware.
- RAM capacity and utilization.
- Storage capacity and utilization.
- Operating system information.
- System uptime.

### Application Management

Register and manage personal applications hosted within the home-lab environment.

- Application registration.
- Application description and access URL.
- Custom application icons.
- Application activation and deactivation.
- HTTP health checks.
- Response time monitoring.
- Application availability status.

Future improvements include automatic health checks, consolidated monitoring, and integration with other Docker containers.

### File Management (Planned)

Provide a centralized interface for storing and managing personal files.

- File upload and download.
- Directory creation and navigation.
- File organization and deletion.
- File metadata management.
- Storage utilization monitoring.
- External hard drive integration.

Files will be stored directly on the server's filesystem, while relevant metadata will be managed through PostgreSQL.

### Media Management (Planned)

Provide a dedicated interface for accessing personal media.

- Photo gallery.
- Image previews and thumbnails.
- Video playback.
- Media organization.
- Media metadata management.

### Authentication and Security (Planned)

Protect personal applications and stored information through secure authentication.

- User authentication.
- Password encryption using BCrypt.
- Session-based authentication.
- Protected API endpoints.
- Secure file access.
- CSRF protection.

## System Architecture

The project follows a modular architecture, separating application responsibilities while maintaining a lightweight infrastructure.

The Home-Lab System acts as the central access point for independently deployed applications and personal storage services.

```text
                    User
                      |
                Web Dashboard
                   (React)
                      |
                 REST API
               (Spring Boot)
                      |
        +-------------+-------------+
        |             |             |
     System       Application      File
    Monitoring    Management    Management
        |             |             |
     Hardware      External      External
     Resources    Applications   Hard Drive
                      |
                 Docker Network

              PostgreSQL Database
```

Independent applications, such as Finance System, will run in their own Docker containers and communicate with the Home-Lab System through HTTP when required.

## Technology Stack

| Technology | Purpose |
|---|---|
| Java 21 | Backend development |
| Spring Boot | Backend framework |
| Spring Web | REST API development |
| Spring Data JPA | Database persistence |
| Spring Security | Authentication and authorization |
| PostgreSQL | Relational database |
| Flyway | Database migrations |
| OSHI | Hardware and operating system monitoring |
| React | Frontend development |
| TypeScript | Frontend programming language |
| Docker | Application containerization |
| Docker Compose | Container orchestration |
| JUnit | Automated testing |
| Mockito | Unit testing and dependency mocking |
| GitHub Actions | Continuous integration |
| Raspberry Pi | Target deployment platform |

## Deployment Environment

The target deployment environment consists of a Raspberry Pi connected to an external hard drive.

The Raspberry Pi will be responsible for running the application containers, managing communication between services, and providing access to the home-lab dashboard.

The external hard drive will provide persistent storage for personal files, photos, videos, and documents.

Docker Compose will be used to manage the infrastructure and simplify application deployment, configuration, and maintenance.

The system is initially intended for private local network usage.

## Development Roadmap

### Phase 1 — Backend Foundation

- [x] Spring Boot project configuration.
- [x] PostgreSQL integration.
- [x] Database migration configuration.
- [x] System monitoring API.
- [x] Application management API.
- [x] Continuous integration pipeline.
- [ ] Automated test coverage improvements.
- [ ] Application health check implementation.

### Phase 2 — Security

- [ ] User management.
- [ ] Authentication and authorization.
- [ ] Session management.
- [ ] API endpoint protection.

### Phase 3 — Storage and Media

- [ ] File management API.
- [ ] External storage integration.
- [ ] Directory management.
- [ ] Photo gallery.
- [ ] Video streaming.
- [ ] Backup and recovery strategy.

### Phase 4 — Frontend

- [ ] React project configuration.
- [ ] System monitoring dashboard.
- [ ] Application dashboard.
- [ ] Authentication interface.
- [ ] File explorer.
- [ ] Media gallery.
- [ ] Responsive user interface.

### Phase 5 — Infrastructure and Deployment

- [ ] Backend Docker image.
- [ ] Frontend Docker image.
- [ ] ARM64-compatible builds.
- [ ] Docker Compose deployment configuration.
- [ ] Docker network integration.
- [ ] Integration with personal applications.
- [ ] Automatic application health monitoring.
- [ ] Reverse proxy configuration.
- [ ] Raspberry Pi deployment.

## Project Status

**Under active development.**

The project is being developed incrementally, prioritizing backend functionality, maintainability, security, and infrastructure reliability before introducing more advanced features.

The long-term goal is to establish a reliable, extensible, and independent personal infrastructure capable of hosting multiple applications and managing personal digital resources through a single platform.