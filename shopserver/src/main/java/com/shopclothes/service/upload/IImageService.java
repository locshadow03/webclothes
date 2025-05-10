package com.shopclothes.service.upload;


import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface IImageService {
    String saveImage(MultipartFile file) throws IOException;

    void deleteImage(String file) throws IOException;
}
