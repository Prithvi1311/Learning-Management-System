package com.lms.dev.controller;

import com.lms.dev.entity.Lesson;
import com.lms.dev.enums.LessonType;
import com.lms.dev.service.LessonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/lessons")
@RequiredArgsConstructor
public class LessonController {

    private final LessonService lessonService;

    @GetMapping("/course/{courseId}")
    public List<Lesson> getLessonsByCourse(@PathVariable UUID courseId) {
        return lessonService.getLessonsByCourse(courseId);
    }

    @GetMapping("/{id}")
    public Lesson getLessonById(@PathVariable UUID id) {
        return lessonService.getLessonById(id);
    }

    @PostMapping("/course/{courseId}")
    public ResponseEntity<Lesson> createLesson(
            @PathVariable UUID courseId,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("type") LessonType type,
            @RequestParam(value = "content", required = false) String content,
            @RequestParam(value = "file", required = false) MultipartFile file) {

        try {
            Lesson lesson = Lesson.builder()
                    .title(title)
                    .description(description)
                    .type(type)
                    .content(content)
                    .build();

            Lesson created = lessonService.createLesson(courseId, lesson, file);
            return ResponseEntity.ok(created);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Lesson> updateLesson(
            @PathVariable UUID id,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("type") LessonType type,
            @RequestParam(value = "content", required = false) String content,
            @RequestParam(value = "file", required = false) MultipartFile file) {

        try {
            Lesson lesson = Lesson.builder()
                    .title(title)
                    .description(description)
                    .type(type)
                    .content(content)
                    .build();

            Lesson updated = lessonService.updateLesson(id, lesson, file);
            return ResponseEntity.ok(updated);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{id}")
    public void deleteLesson(@PathVariable UUID id) {
        lessonService.deleteLesson(id);
    }
}
