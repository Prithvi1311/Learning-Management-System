package com.lms.dev.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lms.dev.entity.Course;
import com.lms.dev.entity.Enrollment;
import com.lms.dev.entity.User;

import java.util.UUID;

public interface EnrollmentRepository extends JpaRepository<Enrollment, UUID> {

	Enrollment findByUserAndCourse(User user, Course course);

	long countByCourse(Course course);
}