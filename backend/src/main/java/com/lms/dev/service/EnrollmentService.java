package com.lms.dev.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.lms.dev.dto.EnrollRequest;
import com.lms.dev.entity.Course;
import com.lms.dev.entity.Enrollment;
import com.lms.dev.entity.Progress;
import com.lms.dev.entity.User;
import com.lms.dev.repository.CourseRepository;
import com.lms.dev.repository.EnrollmentRepository;
import com.lms.dev.repository.ProgressRepository;
import com.lms.dev.repository.UserRepository;
import com.lms.dev.repository.AssessmentRepository;
import java.util.*;

@RequiredArgsConstructor
@Service
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;

    private final UserRepository userRepository;

    private final CourseRepository courseRepository;

    private final ProgressRepository progressRepository;

    private final AssessmentRepository assessmentRepository;

    public List<Course> getEnrolledCourses(UUID userId) {
        Optional<User> optionalUser = userRepository.findById(userId);

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            List<Course> enrolledCourses = new ArrayList<>();

            for (Enrollment enrollment : user.getEnrollments()) {
                Course course = enrollment.getCourse();
                boolean completed = assessmentRepository.existsByUserAndCourseAndMarksGreaterThanEqual(user, course,
                        60);
                course.setCompleted(completed);
                enrolledCourses.add(course);
            }

            return enrolledCourses;
        }

        return null;
    }

    public List<Enrollment> getEnrollments() {
        return enrollmentRepository.findAll();
    }

    public String enrollCourse(EnrollRequest enrollRequest) {
        User user = userRepository.findById(enrollRequest.getUserId()).orElse(null);
        Course course = courseRepository.findById(enrollRequest.getCourseId()).orElse(null);

        if (user != null && course != null) {
            Enrollment existingEnrollment = enrollmentRepository.findByUserAndCourse(user, course);
            if (existingEnrollment != null) {
                return "Course already enrolled";
            }

            Progress progress = new Progress();
            progress.setUser(user);
            progress.setCourse(course);
            progressRepository.save(progress);

            Enrollment enrollment = new Enrollment();
            enrollment.setUser(user);
            enrollment.setCourse(course);
            enrollmentRepository.save(enrollment);

            return "Enrolled successfully";
        }

        return "Failed to enroll";
    }

    public void unenrollCourse(UUID id) {
        enrollmentRepository.deleteById(id);
    }
}
