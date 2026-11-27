package com.project.home_system.service;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.project.home_system.config.StorageProperties;
import com.project.home_system.dto.CreateDirectoryRequest;
import com.project.home_system.dto.FileResponse;
import com.project.home_system.dto.MoveFileRequest;
import com.project.home_system.dto.RenameFileRequest;
import com.project.home_system.model.FileType;
import com.project.home_system.services.StorageService;

public class StorageServiceTest {
    
    @TempDir 
    Path tempDir;
    
    private StorageService storageService;

    @BeforeEach 
    void setUp() throws IOException {
        StorageProperties properties = new StorageProperties();
        properties.setRoot(tempDir.toString());
        storageService = new StorageService(properties);
    }

    @Test 
    void shouldReturnEmptyListWhenDirectoryIsEmpty(){
        List<FileResponse> result = storageService.listFiles("");
        assertTrue(result.isEmpty());
    }

    @Test 
    void shouldListFilesAndDirectories() throws IOException {
        Files.createDirectory(tempDir.resolve("Documents"));
        Files.writeString(
            tempDir.resolve("test.txt"), "Hello Home-Lab");
        List<FileResponse> result = storageService.listFiles("");
        assertEquals(2, result.size());
        assertEquals("Documents", result.get(0).name());
        assertEquals(FileType.DIRECTORY, result.get(0).type());
        assertEquals("test.txt", result.get(1).name());
        assertEquals(FileType.FILE, result.get(1).type());
    }

    @Test 
    void shouldCreateDirectory(){
        CreateDirectoryRequest request = new CreateDirectoryRequest(
            "", "Documents");

        FileResponse result = storageService.createDirectory(request);
        assertEquals("Documents", result.name());
        assertEquals("Documents", result.path());
        assertEquals(FileType.DIRECTORY, result.type());

        assertTrue(
          Files.isDirectory(tempDir.resolve("Documents"))  
        );
    }

    @Test 
    void shouldRejectDuplicateDirectory() throws IOException {
        Files.createDirectory(tempDir.resolve("Documents"));
        CreateDirectoryRequest request = 
             new CreateDirectoryRequest("", "Documents");

        ResponseStatusException exception = assertThrows(
            ResponseStatusException.class, 
            () -> storageService.createDirectory(request));
            
        assertEquals(HttpStatus.CONFLICT, exception.getStatusCode());
    }

    @Test 
    void shouldUploadFile() throws IOException {
        byte[] content = "Hello Home-Lab"
                .getBytes(StandardCharsets.UTF_8);
        MockMultipartFile file = new MockMultipartFile(
            "file", 
            "test.txt",
            "text/plain",
            content);

        FileResponse result = storageService.uploadFile("", file);
        Path savedFile = tempDir.resolve("test.txt");
        assertTrue(Files.exists(savedFile));
        assertEquals(FileType.FILE,result.type());
        assertEquals((long) content.length, result.size().longValue());
        assertArrayEquals(content, 
            Files.readAllBytes(savedFile)
        );
    }

    @Test 
    void shouldRejectDuplicateFileUpload() throws IOException {
        Path existingFile = tempDir.resolve("test.txt");
        Files.writeString(existingFile, "Original content");
        MockMultipartFile file = new MockMultipartFile(
            "file", 
            "test.txt",
            "text/plain",
            "New content".getBytes(StandardCharsets.UTF_8));

        ResponseStatusException exception = assertThrows(
            ResponseStatusException.class, 
            () -> storageService.uploadFile("", file));

        assertEquals(HttpStatus.CONFLICT, exception.getStatusCode());
        assertEquals("Original content", Files.readString(existingFile));
    }

    @Test
    void shouldDownloadFile() throws IOException {

        String content = "Hello Home-Lab";

        Files.writeString(
            tempDir.resolve("test.txt"),
            content
        );

        Resource resource =
            storageService.downloadFile("test.txt");

        assertTrue(resource.exists());
        assertTrue(resource.isReadable());
        assertEquals("test.txt", resource.getFilename());

        try (InputStream input = resource.getInputStream()) {

            assertArrayEquals(
                content.getBytes(StandardCharsets.UTF_8),
                input.readAllBytes()
            );
        }
    }

    @Test
    void shouldRejectDownloadOfNonexistentFile() {

        ResponseStatusException exception = assertThrows(
            ResponseStatusException.class,
            () -> storageService.downloadFile("missing.txt")
        );

        assertEquals(
            HttpStatus.NOT_FOUND,
            exception.getStatusCode()
        );
    }

    @Test
    void shouldRenameFile() throws IOException {

        Files.writeString(
            tempDir.resolve("old.txt"),
            "Original content"
        );

        RenameFileRequest request =
            new RenameFileRequest("old.txt", "new.txt");

        FileResponse result = storageService.renameFile(request);

        assertFalse(
            Files.exists(tempDir.resolve("old.txt"))
        );

        assertTrue(
            Files.exists(tempDir.resolve("new.txt"))
        );

        assertEquals("new.txt", result.name());

        assertEquals(
            "Original content",
            Files.readString(tempDir.resolve("new.txt"))
        );
    }

    @Test
    void shouldRejectRenameToExistingFile() throws IOException {

        Files.writeString(tempDir.resolve("old.txt"), "First");

        Files.writeString(tempDir.resolve("new.txt"), "Second");

        RenameFileRequest request =
            new RenameFileRequest("old.txt", "new.txt");

        ResponseStatusException exception = assertThrows(
            ResponseStatusException.class,
            () -> storageService.renameFile(request)
        );

        assertEquals(
            HttpStatus.CONFLICT,
            exception.getStatusCode()
        );

        assertEquals(
            "First",
            Files.readString(tempDir.resolve("old.txt"))
        );

        assertEquals(
            "Second",
            Files.readString(tempDir.resolve("new.txt"))
        );
    }

    @Test
    void shouldMoveFileToAnotherDirectory() throws IOException {

        Files.createDirectory(tempDir.resolve("Documents"));

        Files.createDirectory(tempDir.resolve("Backup"));

        Files.writeString(
            tempDir.resolve("Documents/test.txt"),
            "Original content"
        );

        MoveFileRequest request = new MoveFileRequest(
            "Documents/test.txt",
            "Backup"
        );

        FileResponse result = storageService.moveFile(request);

        assertFalse(
            Files.exists(tempDir.resolve("Documents/test.txt"))
        );

        assertTrue(
            Files.exists(tempDir.resolve("Backup/test.txt"))
        );

        assertEquals("Backup/test.txt", result.path());

        assertEquals(
            "Original content",
            Files.readString(tempDir.resolve("Backup/test.txt"))
        );
    }

    @Test
void shouldRejectMovingDirectoryIntoItself()
            throws IOException {

        Files.createDirectories(
            tempDir.resolve("Documents/Subfolder")
        );

        MoveFileRequest request = new MoveFileRequest(
            "Documents",
            "Documents/Subfolder"
        );

        ResponseStatusException exception = assertThrows(
            ResponseStatusException.class,
            () -> storageService.moveFile(request)
        );

        assertEquals(
            HttpStatus.BAD_REQUEST,
            exception.getStatusCode()
        );
    }

    @Test
    void shouldDeleteFile() throws IOException {

        Path file = tempDir.resolve("test.txt");

        Files.writeString(file, "Content");

        storageService.deleteFile("test.txt");

        assertFalse(Files.exists(file));
    }

    @Test
    void shouldDeleteEmptyDirectory() throws IOException {

        Path directory = tempDir.resolve("Documents");

        Files.createDirectory(directory);

        storageService.deleteFile("Documents");

        assertFalse(Files.exists(directory));
    }

    @Test
    void shouldRejectDeletionOfNonEmptyDirectory()
            throws IOException {

        Files.createDirectory(tempDir.resolve("Documents"));

        Files.writeString(
            tempDir.resolve("Documents/test.txt"),
            "Content"
        );

        ResponseStatusException exception = assertThrows(
            ResponseStatusException.class,
            () -> storageService.deleteFile("Documents")
        );

        assertEquals(
            HttpStatus.CONFLICT,
            exception.getStatusCode()
        );

        assertTrue(
            Files.exists(tempDir.resolve("Documents/test.txt"))
        );
    }

    @Test
    void shouldRejectDeletionOfStorageRoot() {

        ResponseStatusException exception = assertThrows(
            ResponseStatusException.class,
            () -> storageService.deleteFile("")
        );

        assertEquals(
            HttpStatus.FORBIDDEN,
            exception.getStatusCode()
        );

        assertTrue(Files.exists(tempDir));
    }

    @Test
    void shouldRejectPathTraversal() {

        ResponseStatusException exception = assertThrows(
            ResponseStatusException.class,
            () -> storageService.listFiles("../..")
        );

        assertEquals(
            HttpStatus.FORBIDDEN,
            exception.getStatusCode()
        );
    }

    @Test
    void shouldRejectInvalidDirectoryName() {

        CreateDirectoryRequest request =
            new CreateDirectoryRequest("", "../outside");

        ResponseStatusException exception = assertThrows(
            ResponseStatusException.class,
            () -> storageService.createDirectory(request)
        );

        assertEquals(
            HttpStatus.BAD_REQUEST,
            exception.getStatusCode()
        );
    }

    @Test
    void shouldRejectAbsolutePaths() {

        ResponseStatusException exception = assertThrows(
            ResponseStatusException.class,
            () -> storageService.listFiles(
                tempDir.toAbsolutePath().toString()
            )
        );

        assertEquals(
            HttpStatus.BAD_REQUEST,
            exception.getStatusCode()
        );
    }
}
