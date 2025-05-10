package com.shopclothes.service.upload;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class ImageServiceImp implements IImageService{
    @Value("${upload.dir}")
    private String uploaddir;

    @Override
    public String saveImage(MultipartFile file) throws IOException {
        String fileName = UUID.randomUUID() + "-" + file.getOriginalFilename();
        String filePath = Paths.get(uploaddir, fileName).toString();

        File dest = new File(filePath);
        file.transferTo(dest);
        return "http://localhost:8080/uploads/" + fileName;
    }

    @Override
    public void deleteImage(String file) throws IOException {
        if (file != null && !file.isEmpty()) {
            String oldFileName = file.replace("http://localhost:8080/uploads/", "");
            Path oldFilePath = Paths.get(uploaddir, oldFileName);
            if (Files.exists(oldFilePath)) {
                Files.delete(oldFilePath);
            }
        }
    }
}
