package com.lms.dev.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.lms.dev.dto.EnrollRequest;
import com.lms.dev.entity.Course;
import com.lms.dev.entity.Enrollment;
import com.lms.dev.service.EnrollmentService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    @Autowired
    private EnrollmentService enrollmentService;

    @GetMapping("/{userId}")
    public List<Course> getEnrolledCourses(@PathVariable UUID userId) {
        return enrollmentService.getEnrolledCourses(userId);
    }

    @GetMapping
    public List<Enrollment> getEnrollments() {
        return enrollmentService.getEnrollments();
    }

    @PostMapping
    public String enrollCourse(@RequestBody EnrollRequest enrollRequest) {
        return enrollmentService.enrollCourse(enrollRequest);
    }

    @DeleteMapping("/{id}")
    public void unenrollCourse(@PathVariable UUID id) {
        enrollmentService.unenrollCourse(id);
    }
}
