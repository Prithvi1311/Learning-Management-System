package com.lms.dev.controller;

import com.itextpdf.text.DocumentException;
import com.lms.dev.entity.Course;
import com.lms.dev.entity.User;
import com.lms.dev.service.CertificateService;
import com.lms.dev.service.CourseService;
import com.lms.dev.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/certificates")
public class CertificateController {

    @Autowired
    private CertificateService certificateService;

    @Autowired
    private UserService userService;

    @Autowired
    private CourseService courseService;

    @GetMapping("/download/{userId}/{courseId}")
    public ResponseEntity<byte[]> downloadCertificate(@PathVariable UUID userId, @PathVariable UUID courseId) {
        try {
            User user = userService.getUserById(userId); // You'll need to ensure this method exists or use getById
            Course course = courseService.getCourseById(courseId);

            if (user == null || course == null) {
                return ResponseEntity.notFound().build();
            }

            // Generate a random certificate number
            String certificateNumber = "CERT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

            byte[] pdfBytes = certificateService.generateCertificate(user.getUsername(), course.getCourseName(),
                    certificateNumber);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=certificate.pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfBytes);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
