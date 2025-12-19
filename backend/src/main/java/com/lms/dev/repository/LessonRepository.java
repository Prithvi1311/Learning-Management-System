package com.lms.dev.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.lms.dev.entity.Lesson;
import java.util.UUID;
import java.util.List;

public interface LessonRepository extends JpaRepository<Lesson, UUID> {
    @org.springframework.data.jpa.repository.Query("SELECT l FROM Lesson l WHERE l.course.course_id = :courseId")
    List<Lesson> findByCourseCourse_id(@org.springframework.data.repository.query.Param("courseId") UUID courseId);
}
