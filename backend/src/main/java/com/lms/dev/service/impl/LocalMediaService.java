package com.lms.dev.service.impl;

import com.lms.dev.service.MediaService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
public class LocalMediaService implements MediaService {
    @Override
    public String uploadFile(MultipartFile file) throws IOException {
        // TODO: Implement actual S3 or File upload.
        // For now returning a dummy URL to satisfy the flow.
        return "https://dummy-url.com/" + UUID.randomUUID() + "-" + file.getOriginalFilename();
    }
}
