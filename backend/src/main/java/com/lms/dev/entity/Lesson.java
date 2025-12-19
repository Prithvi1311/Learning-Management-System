package com.lms.dev.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.lms.dev.enums.LessonType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Lesson {
    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "lesson_id", updatable = false, nullable = false, columnDefinition = "BINARY(16)")
    private UUID lessonId;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    private LessonType type; // VIDEO, PDF, TEXT

    private String url; // S3 URL for video/pdf

    @Column(columnDefinition = "TEXT")
    private String content; // For text-based lessons

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id")
    @JsonIgnore
    private Course course;
}
