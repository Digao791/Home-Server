package com.project.home_system.services;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.DirectoryNotEmptyException;
import java.nio.file.DirectoryStream;
import java.nio.file.FileAlreadyExistsException;
import java.nio.file.Files;
import java.nio.file.InvalidPathException;
import java.nio.file.LinkOption;
import java.nio.file.NoSuchFileException;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import com.project.home_system.config.StorageProperties;
import com.project.home_system.dto.CreateDirectoryRequest;
import com.project.home_system.dto.FileResponse;
import com.project.home_system.dto.MoveFileRequest;
import com.project.home_system.dto.RenameFileRequest;
import com.project.home_system.model.FileType;

@Service 
public class StorageService {
    
    private final Path root;
    public StorageService(StorageProperties properties) throws IOException{
        Path configuredRoot = Path.of(properties.getRoot())
            .toAbsolutePath();

        Files.createDirectories(configuredRoot);
        this.root = configuredRoot.toRealPath();
    }

    public List<FileResponse> listFiles(String path){
        Path directory = resolvePath(path);
        validateDirectory(directory);

        List<FileResponse> result = new ArrayList<>();

        try(DirectoryStream<Path> stream = Files.newDirectoryStream(directory)){
            for(Path entry : stream){
                if(Files.isSymbolicLink(entry)) continue;

                String name = entry.getFileName().toString();

                if(name.startsWith(".upload-") && name.endsWith(".tmp") ){
                    continue;
                }

                result.add(toResponse(entry));
            }
        }catch (IOException exception){
            throw new ResponseStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Could not list directory",
                exception
            );
        }

        result.sort(
            Comparator.comparing(
                (FileResponse file) -> 
                    file.type() != FileType.DIRECTORY
                ).thenComparing(
                    FileResponse::name,
                    String.CASE_INSENSITIVE_ORDER
                )
        );

        return result;
    }

    public FileResponse createDirectory(CreateDirectoryRequest request){
        validateName(request.name());
        Path parent = resolvePath(request.path());
        validateDirectory(parent);
        Path directory = parent.resolve(request.name());

        try{
            Files.createDirectory(directory);
            return toResponse(directory);
        }catch (FileAlreadyExistsException exception){
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Directory already exists"
            );
        }catch (IOException exception){
            throw new ResponseStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Could not create directory"
            );
        }
    }

    public FileResponse uploadFile(String path, MultipartFile file){
        if(file.isEmpty()){
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "File is empty"
            );
        }

        String filename = file.getOriginalFilename();
        validateName(filename);
        Path parent = resolvePath(path);
        validateDirectory(parent);

        Path destination = parent.resolve(filename);
        Path temporaryFile = null;

        try{
            temporaryFile = Files.createTempFile(
                parent, 
                ".upload-", 
                ".tmp"
            );

            try(InputStream input = file.getInputStream()){
                Files.copy(
                    input, 
                    temporaryFile,
                    StandardCopyOption.REPLACE_EXISTING
                );   
            }

            Files.move(temporaryFile, destination);
            return toResponse(destination);
        } catch (FileAlreadyExistsException exception){
            throw new ResponseStatusException(
                HttpStatus.CONFLICT, 
                "File already exists"
            );
        } catch (IOException exception){
            throw new ResponseStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Could not upload file",
                exception
            );
        } finally {
            if(temporaryFile != null){
                try{
                    Files.deleteIfExists(temporaryFile);
                } catch (IOException ignored){}
            }
        }
    }

    public Resource downloadFile(String path){
        Path file = resolvePath(path);

        if(!Files.exists(file, LinkOption.NOFOLLOW_LINKS)){
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "File not found"
            );
        }

        if(!Files.isRegularFile(file, LinkOption.NOFOLLOW_LINKS)){
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Path is not a file"
            );
        }

        try{
            Resource resource = new UrlResource(file.toUri());
            if(!resource.isReadable()){
                throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "File is no readable"
                );
            }

            return resource;
        } catch (IOException exception){
            throw new ResponseStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Could not download file",
                exception
            );
        }
    }
    
    private Path resolvePath(String path){
        try{
            Path relative = Path.of(path == null ? "" : path);
            if(relative.isAbsolute()){
                throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Absolute paths are not allowed"
                );
            }

            Path resolved = root.resolve(relative).normalize();

            if(!resolved.startsWith(root)){
                throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Access outside storage is forbidden"
                );
            }

            Path current = root;
            for(Path part : root.relativize(resolved)){
                current = current.resolve(part);
                if(Files.isSymbolicLink(current)){
                    throw new ResponseStatusException(
                        HttpStatus.FORBIDDEN, 
                        "Symbolic links are not allowed"
                    );
                }
            }

            return resolved;
        } catch (InvalidPathException exception){
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Invalid path"
            );
        }
    }

    private void validateName(String name){
        if(name == null || name.isBlank()
            || name.equals(".")
            || name.equals("..")
            || name.contains("/")
            || name.contains("\\")
            || name.contains(":")){
            
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Invalid directory name"
            );
        }

        if (name.startsWith(".upload-")
                && name.endsWith(".tmp")) {

            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Reserved file name"
            );
        }

        try{
            Path.of(name);
        } catch(InvalidPathException exception){
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Invalid directory name"
            );
        }
    }

    private void validateEntry(Path path){
        if(path.equals(root)){
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "Operation on storage root is forbidden"
            );
        }

        if(!Files.exists(path, LinkOption.NOFOLLOW_LINKS)){
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "File or directory not found"
            );
        }

        if(!Files.isRegularFile(path, LinkOption.NOFOLLOW_LINKS)
            && !Files.isDirectory(path, LinkOption.NOFOLLOW_LINKS)){
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Unsupported file type"
            );
        }
    }

    private FileResponse moveEntry(Path source, Path destination){
        if(source.equals(destination)){
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Source and destination are the same"
            );
        }

        if(Files.isDirectory(source, LinkOption.NOFOLLOW_LINKS)
            && destination.startsWith(source)){
        
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Cannot move a directory into itself"
            );    
        }

        try{
            Files.move(source, destination);
            return toResponse(destination);
        } catch( FileAlreadyExistsException exception){
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Destination already exists"
            );
        } catch(IOException exception){
            throw new ResponseStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Could not mode file or directory",
                exception
            );
        }
    }

    public void deleteFile(String path){

        Path target = resolvePath(path);
        validateEntry(target);

        try{
            Files.delete(target);
        } catch (DirectoryNotEmptyException exception){
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Directory is not empty"
            );
        } catch (NoSuchFileException exception){
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "File or directory not found"
            );
        } catch (IOException exception){
            throw new ResponseStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Could not delete file or directory",
                exception
            );
        }
    }

    public FileResponse renameFile(RenameFileRequest request){
        validateName(request.newName());
        Path source = resolvePath(request.path());
        validateEntry(source);
        Path destination = source.resolveSibling(
            request.newName()
        );
        return moveEntry(source, destination);
    }

    public FileResponse moveFile(MoveFileRequest request){
        Path source = resolvePath(request.path());
        validateEntry(source);
        Path destinationDirectory = resolvePath(
            request.destinationPath()
        );

        validateDirectory(destinationDirectory);

        Path destination = destinationDirectory.resolve(
            source.getFileName()
        );

        return moveEntry(source, destination);
    }

    private void validateDirectory(Path directory){
        if(!Files.exists(directory, LinkOption.NOFOLLOW_LINKS)){
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Directory not found"
            );
        }

        if(!Files.isDirectory(directory, LinkOption.NOFOLLOW_LINKS)){
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Path is not a directory"
            );
        }
    }

    private FileResponse toResponse(Path path) throws IOException {
        BasicFileAttributes attributes = Files.readAttributes(path,
             BasicFileAttributes.class, 
            LinkOption.NOFOLLOW_LINKS);
        
        boolean directory = attributes.isDirectory();

        return new FileResponse(
            path.getFileName().toString(),
            root.relativize(path)
                .toString().replace("\\", "/"),
            directory ? FileType.DIRECTORY : FileType.FILE,
            directory ? null : attributes.size(),
            attributes.lastModifiedTime().toInstant()
        );
    }
}
