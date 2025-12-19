package com.lms.dev.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.lms.dev.entity.Course;
import com.lms.dev.service.CourseService;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @GetMapping
    public List<Course> getAllCourses() {
        return courseService.getAllCourses();
    }

    @GetMapping("/{id}")
    public Course getCourseById(@PathVariable UUID id) {
        return courseService.getCourseById(id);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'INSTRUCTOR')")
    @PostMapping
    public Course createCourse(@RequestBody com.lms.dev.dto.CourseDTO courseDTO) {
        Course course = new Course();
        course.setCourseName(courseDTO.getCourseName());
        course.setPrice(courseDTO.getPrice());
        course.setDescription(courseDTO.getDescription());
        course.setThumbnail(courseDTO.getThumbnail());
        course.setVideoLink(courseDTO.getVideoLink());

        // This logic should ideally be in service, but placing here for quick fix or
        // delegate to service.
        // Actually best to update service to take DTO or map here.
        // Let's delegate mapping to service or do it here if service takes Entity.
        // Service takes Entity. I'll map it here for now or update Service.
        // Update service is cleaner but let's see service signature.
        // Service signature: createCourse(Course course).
        // So I'll map DTO to Entity here. I need UserService to fetch User by ID.
        // But CourseDTO comes with instructorId? The frontend might not be sending it
        // yet.
        // The error said "Instructor1" string value.
        // I will assume the DTO handles the input, and I'll fetch the user.

        return courseService.createCourse(course, courseDTO.getInstructorId());
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'INSTRUCTOR')")
    @PutMapping("/{id}")
    public Course updateCourse(@PathVariable UUID id, @RequestBody com.lms.dev.dto.CourseDTO courseDTO) {
        Course course = new Course();
        course.setCourseName(courseDTO.getCourseName());
        course.setPrice(courseDTO.getPrice());
        course.setDescription(courseDTO.getDescription());
        course.setThumbnail(courseDTO.getThumbnail());
        course.setVideoLink(courseDTO.getVideoLink());

        return courseService.updateCourse(id, course, courseDTO.getInstructorId());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void deleteCourse(@PathVariable UUID id) {
        courseService.deleteCourse(id);
    }
}