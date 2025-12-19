package com.lms.dev.service;

import com.lms.dev.entity.Course;
import com.lms.dev.entity.Lesson;
import com.lms.dev.repository.CourseRepository;
import com.lms.dev.repository.LessonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LessonService {

    private final LessonRepository lessonRepository;
    private final CourseRepository courseRepository;
    private final MediaService mediaService;

    public List<Lesson> getLessonsByCourse(UUID courseId) {
        return lessonRepository.findByCourseCourse_id(courseId);
    }

    public Lesson getLessonById(UUID lessonId) {
        return lessonRepository.findById(lessonId).orElse(null);
    }

    public Lesson createLesson(UUID courseId, Lesson lesson, MultipartFile file) throws IOException {
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new RuntimeException("Course not found"));
        lesson.setCourse(course);

        if (file != null && !file.isEmpty()) {
            String url = mediaService.uploadFile(file);
            lesson.setUrl(url);
        }

        return lessonRepository.save(lesson);
    }

    public Lesson updateLesson(UUID lessonId, Lesson updatedLesson, MultipartFile file) throws IOException {
        Lesson existingLesson = getLessonById(lessonId);
        if (existingLesson == null)
            return null;

        existingLesson.setTitle(updatedLesson.getTitle());
        existingLesson.setDescription(updatedLesson.getDescription());
        existingLesson.setType(updatedLesson.getType());
        existingLesson.setContent(updatedLesson.getContent());

        if (file != null && !file.isEmpty()) {
            String url = mediaService.uploadFile(file);
            existingLesson.setUrl(url);
        }

        return lessonRepository.save(existingLesson);
    }

    public void deleteLesson(UUID lessonId) {
        lessonRepository.deleteById(lessonId);
    }
}
