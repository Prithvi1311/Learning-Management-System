package com.lms.dev.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lms.dev.entity.Course;
import com.lms.dev.entity.User;
import com.lms.dev.repository.CourseRepository;
import com.lms.dev.repository.UserRepository;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final com.lms.dev.repository.EnrollmentRepository enrollmentRepository;

    public List<Course> getAllCourses() {
        List<Course> courses = courseRepository.findAll();
        for (Course course : courses) {
            course.setStudents(enrollmentRepository.countByCourse(course));
        }
        return courses;
    }

    public Course getCourseById(UUID id) {
        return courseRepository.findById(id).orElse(null);
    }

    public Course createCourse(Course course, UUID instructorId) {
        // Fetch instructor if ID is provided, else handle logic (e.g. from context)
        // For now assuming ID is passed.
        User instructor = userRepository.findById(instructorId)
                .orElseThrow(() -> new RuntimeException("Instructor not found"));
        course.setInstructor(instructor);
        return courseRepository.save(course);
    }

    public Course createCourse(Course course) {
        // Fallback or deprecated
        return courseRepository.save(course);
    }

    public Course updateCourse(UUID id, Course updatedCourse, UUID instructorId) {
        Course existingCourse = courseRepository.findById(id).orElse(null);
        if (existingCourse != null) {
            existingCourse.setCourseName(updatedCourse.getCourseName());
            existingCourse.setDescription(updatedCourse.getDescription());
            existingCourse.setPrice(updatedCourse.getPrice());

            if (instructorId != null) {
                User instructor = userRepository.findById(instructorId).orElse(null);
                if (instructor != null) {
                    existingCourse.setInstructor(instructor);
                }
            }

            existingCourse.setThumbnail(updatedCourse.getThumbnail());
            existingCourse.setVideoLink(updatedCourse.getVideoLink());
            return courseRepository.save(existingCourse);
        }
        return null;
    }

    public void deleteCourse(UUID id) {
        courseRepository.deleteById(id);
    }
}
